import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import {firestore} from "firebase-admin";
import {OrderDoc, Timeslot} from "@foodleab/types/lib/firestore";
import {
    disableCouponOnBigcommerce,
    fetchOrder,
    fetchOrderMetafields,
    fetchShippingAddresses,
    updateOrderStatusOnBigcommerce
} from "./bigcommerce";
import {AxiosError, AxiosResponse} from "axios";
import {
  BigCommerceOrderStatus,
  DeliveryMeta,
  Metafields,
  OrderMeta,
  ShippingAddress
} from "@foodleab/types/lib/bigcommerce";
import {bookTimeslot} from "./timeslots";
import {mapToOrderDoc} from "./mapper";
import {momentTz} from "./index";
import {sendEmail, sendNotification, TemplateType} from "./customemail";
import QueryDocumentSnapshot = firestore.QueryDocumentSnapshot;
import {PaymentInfo, PaymentMeta} from "./adyen";
import {sendSms} from "./sms";

export const orderDocConverter: firestore.FirestoreDataConverter<OrderDoc> = {
  toFirestore(order: OrderDoc): firestore.DocumentData {
    return order;
  },
  fromFirestore(
    snapshot: firestore.QueryDocumentSnapshot,
  ): OrderDoc {
    const data = snapshot.data();
    return new OrderDoc(
      new Date(data['createdAt']['_seconds'] * 1000),
      data['deliveryAddress'],
      new Date(data['estimatedDeliveryFrom']._seconds * 1000),
      new Date(data['estimatedDeliveryTo']._seconds * 1000),
      data['timeslotId'],
      data['kitchens'],
      data['recipient'],
      data['meta'],
      data['number'],
      data['orderId'],
      data['delivery'],
      data['status'],
      data['deliveryDate'],
      momentTz.unix(data['deliveredAt'] ? new Date(data['deliveredAt']._seconds) : 0),
  data.location ?? [0,0],
        data['refunded'] ?? false,
        data['coupon']
    );
  }
};

export async function persistOrder(order: OrderDoc): Promise<firestore.WriteResult> {
  const orderDocId = String(order.orderId)
  return await admin.firestore().collection("active_orders").doc(orderDocId).set(order);
}

export async function persistOrderToCancelledOrders(order: OrderDoc): Promise<firestore.WriteResult> {
  const orderDocId = String(order.orderId)
  return await admin.firestore().collection("cancelled_orders").doc(orderDocId).set(order);
}

export async function addOrderToSlot(order: OrderDoc): Promise<void> {
  const timeslotRef = await admin.firestore().collection("time_slots").doc(order.timeslotId)

  return await admin.firestore().runTransaction(async _ => {
    const timeslot = await timeslotRef.get();
    if (!timeslot.exists) {
      functions.logger.error(`Tried to add order ${order.orderId} to timeslots but could not find matching timeslot in database`);
      return
    }

    await admin.firestore().collection("active_orders").doc(String(order.orderId)).get().then((orderDoc) => {
      console.log("orderRef", orderDoc.data())
      const orders = timeslot.data().orders
      orders.push(orderDoc.ref)
      timeslotRef.update({ orders });
    })
  })
}

export async function checkAndCancelCoupon(order: OrderDoc): Promise<OrderDoc> {
    if (order.coupon.max_uses === 1 || order.coupon.max_uses_per_customer === 1) {
        disableCouponOnBigcommerce(order.coupon.id)
    }

    return new Promise((resolve, _) => resolve(order))
}

export async function updateOrder(orderId: number, change: Partial<OrderDoc>): Promise<firestore.WriteResult> {
  const orderDocId = String(orderId)
  return await admin.firestore().collection("active_orders").doc(orderDocId).update(change);
}

export async function archiveOrder(orderId: number | string): Promise<void> {
  const orderDocId = String(orderId)
  const orderRef = admin.firestore().collection("active_orders").doc(orderDocId);

  return await admin.firestore().runTransaction(async _ => {
    const order = await orderRef.get();
    if (!order.exists) {
      functions.logger.error(`Tried to archive order ${orderId} but could not find matching document in database`, {structuredData: true});
      return
    }

    await admin.firestore().collection("archived_orders").doc(orderDocId).set(order.data());
    await admin.firestore().collection("active_orders").doc(orderDocId).delete();
  });
}

export async function fetchKitchens(): Promise<Map<string, number>> {
  const kitchens = new Map<string, number>();
  await admin.firestore().collection("kitchens").get().then((querySpanshot) => {
    querySpanshot.forEach((kitchen) => {
      kitchens.set(kitchen.data().name, kitchen.data().id)
    })
  })
  return kitchens;
}

export async function createOrder(orderId: number): Promise<boolean> {
  const orderBigCommerce = await fetchOrder(orderId)
      .catch((e: AxiosError) => {
        functions.logger.error(e.response?.data);
        throw new Error("Error fetching order");
      });

  const metafield = await fetchOrderMetafields(orderId, "metadata")
      .then((resp: AxiosResponse<Metafields>) => {
        return resp.data.data.find(f => f.key === "metadata")
      })
      .catch((e: AxiosError) => {
        functions.logger.error(e.response?.data);
        throw new Error("Error fetching order metadata");
      });
  const orderMeta: OrderMeta = metafield != null ? JSON.parse(metafield.value) : {} // TODO
  functions.logger.debug(`Parsed order meta for order ID: ${orderBigCommerce.data.id}`, orderMeta);

  const deliveryMeta: DeliveryMeta = JSON.parse(orderMeta.delivery);
  const timeslot: Timeslot | boolean = await bookTimeslot(orderId, deliveryMeta)
      .then(resp => {
        return resp;
      });

  if (timeslot instanceof Timeslot) {
    // Only move ahead if slot is available
    await fetchShippingAddresses(orderId)
        .then((resp: AxiosResponse<ShippingAddress[]>) => {
          functions.logger.debug(`Fetched shipping addresses for order with ID: ${orderBigCommerce.data.id}`, resp.data);
          return resp.data;
        })
        .catch((e: AxiosError) => {
          functions.logger.error(e.response?.data);
          throw new Error("Error fetching shipping addresses");
        })
        .then((addresses) => {
          return mapToOrderDoc(orderBigCommerce.data, addresses[0], orderMeta, timeslot.id)
        })
        .catch(e => {
          functions.logger.error(e);
          throw new Error("Error mapping order to doc");
        })
        .then((orderDoc) => {
          return persistOrder(orderDoc).then(() => addOrderToSlot(orderDoc)).then(() => checkAndCancelCoupon(orderDoc))
        })
        .catch(e => {
          functions.logger.error(e);
          throw new Error("Error persisting order");
        })
        .then(async (order) => {
            await sendNotification(order,TemplateType.ORDER_CONFIRMED, orderBigCommerce)
            return order
        })
        .catch(e => {
            functions.logger.error(`Error sending Awaiting Pickup Notification for Order# ${orderId}`, {structuredData: true});
        })
  } else {
    await updateOrderStatusOnBigcommerce(orderId, BigCommerceOrderStatus.CANCELLED)
    // Add the order to cancelled Orders
    await fetchShippingAddresses(orderId)
        .then((resp: AxiosResponse<ShippingAddress[]>) => {
          functions.logger.debug(`Fetched shipping addresses for order with ID: ${orderBigCommerce.data.id}`, resp.data);
          return resp.data;
        })
        .catch((e: AxiosError) => {
          functions.logger.error(e.response?.data);
          throw new Error("Error fetching shipping addresses");
        })
        .then((addresses) => {
          return mapToOrderDoc(orderBigCommerce.data, addresses[0], orderMeta, '')
        })
        .catch(e => {
          functions.logger.error(e);
          throw new Error("Error mapping order to doc");
        })
        .then(async (orderDoc) => {
            /* get Paymentinfo to be passed to SendEmail function for Cancellled orders*/
            return persistOrderToCancelledOrders(orderDoc).then(() => {
                functions.logger.debug(`Slots are full for order ${orderId}. Cancel and refund order`)
                return orderDoc
            })
        })
        .catch(e => {
          functions.logger.error(e);
          throw new Error("Error persisting order");
        })
  }

  return true
}
export async function getPaymentInfo(orderId: number): Promise<PaymentInfo> {
    let paymentMeta: PaymentMeta
    await fetchOrderMetafields(orderId, "payment")
        .then((resp: AxiosResponse<Metafields>) => {
            return resp.data.data.find(f => f.key === "payment")
        })
        .catch((e: AxiosError) => {
            functions.logger.error(e.response?.data);
            throw new Error("Error fetching order payment info");
        }).then((paymentData) => {
             paymentMeta= JSON.parse(paymentData.value)

        }).catch((e: AxiosError) => {
            functions.logger.error(e.response?.data);
            throw new Error("Error refunding order ");
        });

    return new Promise((resolve, _) => resolve(paymentMeta.paymentInfo))
}

export async function cancelOrder(orderId: number): Promise<boolean> {
  // TODO: Delete order from Kitchen, if has not started yet!! - scope 2
  return true
}

export async function getFirebaseOrder(orderId: string): Promise<OrderDoc> {
    return await admin.firestore().collection("active_orders").doc(orderId)
        .get()
        .then(async (qs) => {
            return orderDocConverter.fromFirestore(qs as QueryDocumentSnapshot)
        })
        .catch(async () => {
            // No record found
            return await getCancelledFirebaseOrder(orderId)
        })
}

export async function getCancelledFirebaseOrder(orderId: string): Promise<OrderDoc> {
    return await admin.firestore().collection("cancelled_orders").doc(orderId)
        .get()
        .then(async (qs) => {
            return orderDocConverter.fromFirestore(qs as QueryDocumentSnapshot)
        })
        .catch(() => {
            // No record found
            return null
        })
}
