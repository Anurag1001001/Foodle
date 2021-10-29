import {firestore} from "firebase-admin";
import * as admin from "firebase-admin";
import {DeliveryMeta} from "@foodleab/types/lib/bigcommerce";
import {Timeslot} from "@foodleab/types/lib/firestore";
import moment from "moment"
import * as functions from "firebase-functions";
import {momentTz} from "./index";

export const timeslotConverter: firestore.FirestoreDataConverter<Timeslot> = {
    toFirestore(timeslot: Timeslot): firestore.DocumentData {
        return {
            capacity: timeslot.capacity,
            date: timeslot.date,
            slot: timeslot.slot,
            orders: timeslot.orders,
            orderCount: timeslot.orderCount
        };
    },
    fromFirestore(
        snapshot: firestore.QueryDocumentSnapshot,
    ): Timeslot {
        const data = snapshot.data();
        return new Timeslot(
            snapshot.id,
            data['capacity'],
            data['date'],
            data['slot'],
            data['orders'],
            data['orderCount']
        );
    }
};

export function formatDate(date: number): string {
    return momentTz.unix(date / 1000).format("YYYY-MM-DD")
}

// TODO: add transactions
export async function bookTimeslot(orderId: number, deliveryMeta: DeliveryMeta): Promise<Timeslot | boolean> {
    const deliveryDate = formatDate(deliveryMeta.date)
    const slotName = `${deliveryMeta.startTime}-${deliveryMeta.endTime}`
    const timeslot: Timeslot | boolean | undefined = await admin.firestore().collection("time_slots")
        .where("date", "==", deliveryDate)
        .where("slot", "==", slotName)
        .withConverter(timeslotConverter)
        .get()
        .then(async (qs) => {
            const kitchenDefaults = await getDefaultKitchenValues()
            let orderCapacity: number = kitchenDefaults.capacity as number;
            const timeslotRecord = await getTimeSlotDetails(deliveryDate, slotName)

            if(timeslotRecord) {
                orderCapacity = timeslotRecord.capacity as number
            }
            const firebaseSlot = qs.docs.pop()
            let timeslot = firebaseSlot?.data()

            if (!timeslot) {
                // Timeslot does not exists
                timeslot = new Timeslot(deliveryDate + " " + slotName, orderCapacity, deliveryDate, slotName, [], 0)
            }

            if (timeslot.orderCount < timeslot.capacity) {
                // Allow the order
                timeslot.orderCount++
            } else {
                // Cancel the order
                return false
            }

            return timeslot
        })

    if (timeslot instanceof Timeslot) {
        return await admin.firestore().collection("time_slots").doc(timeslot.id)
            .withConverter(timeslotConverter)
            .set(timeslot)
            .then(_ => timeslot)
    } else {
        return new Promise<boolean>((resolve, _) => resolve(false))
    }
}

export async function listTimeslots(date: string): Promise<Record<string, unknown>[]> {
    // Get default slots first, and create slots for the date
    return await admin.firestore().collection("defaults").doc("kitchen").get().then(async (docSnap) => {
        const defaults = docSnap.data()
        // Checkf if there are any overrides available
        await admin.firestore().collection("kitchen_hours").where('date', "==", date).get().then((overrideSnap) => {
            if (!overrideSnap.empty) {
                const override = overrideSnap.docs.pop()
                defaults.open_time = override.data().open_time
                defaults.close_time = override.data().close_time
            }
        })

        const fullSlots = []
        await admin.firestore().collection("time_slots").where('date', "==", date).get().then((overrideSnap) => {
            if (!overrideSnap.empty) {
                overrideSnap.docs.forEach((timeslot) => {
                    if (timeslot.data().orderCount >=  timeslot.data().capacity) {
                        fullSlots.push(timeslot.data().slot)
                    }
                })
            }
        })

        const timeslots: Record<string, unknown>[] = []
        const openTime = momentTz(date + ' ' + defaults.open_time)
        const closeTime = momentTz(date + ' ' + defaults.close_time)

        let startTime = openTime
        while (startTime < closeTime) {

            if(startTime < momentTz().add(defaults.slot_size, 'minutes')) {
                startTime = startTime.add(defaults.slot_size, 'm')
                continue
            }

            const startTimeString = startTime.format('HH:mm')
            startTime = startTime.add(defaults.slot_size, 'm')
            const endTimeString = startTime.format('HH:mm')

            const slotName = startTimeString + '-' + endTimeString
            const overriddenSlot = fullSlots.find((slot => slot === slotName));
            timeslots.push({
                id: date + " " + slotName,
                title:slotName,
                disabled: typeof overriddenSlot !== 'undefined',
                date})
        }

        return new Promise<Record<string, unknown>[]>((resolve, _) => resolve(timeslots))
    })
}

export async function checkTimeslotAvailability(date: string, slot: string) : Promise<boolean> {
    // add validations
    const kitchenDefaults = await getDefaultKitchenValues()

    if (momentTz(date + ' ' + slot.split('-')[0]).isBefore(momentTz().add(kitchenDefaults.slot_size, 'minutes'))) {
        return new Promise<boolean>((resolve, _) => resolve(false))
    }

    return await admin.firestore().collection("time_slots").doc(date + ' ' + slot)
        .withConverter(timeslotConverter)
        .get()
        .then(async (qs) => {
            return qs.data().orderCount < qs.data().capacity
        })
        .catch(() => {
            // No record found
            return true
        })
}

export async function getTimeSlotDetails(date: string, slot: string) : Promise<Timeslot | null> {
    const timeslot = await admin.firestore().collection("time_slots").doc(date + ' ' + slot)
        .withConverter(timeslotConverter)
        .get()
        .then(async (qs) => {
            return qs.data()
        })
        .catch(() => {
            // No record found
            return null
        })
    return new Promise<any>((resolve, _) => resolve(timeslot))
}

export async function getDefaultKitchenValues() : Promise<any> {
    const kitchenDefaults = await admin.firestore().collection("defaults").doc("kitchen").get().then(async (docSnap) => {
        return {
            capacity: docSnap.data().capacity,
            close_time: docSnap.data().close_time,
            open_time: docSnap.data().open_time,
            slot_size: docSnap.data().slot_size,
        }
    })

    return new Promise<any>((resolve, _) => resolve(kitchenDefaults))
}
