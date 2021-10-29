/* eslint-disable no-prototype-builtins */
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { parseAsync } from 'json2csv';
import {
    clearBigCommerceCache,
    fetchOrder,
    fetchProduct, getBigCommerceData,
    updateOrderStatusOnBigcommerce,
} from "./bigcommerce";
import {
    clearStoryblokCache,
    createDish,
    deleteDish,
    fetchStory,
    getAllStoryBlokData,
    StoryblokWebhook,
    updateDish
} from "./storyblok";
import {mapToDishStory, mapToTask} from "./mapper";
import {archiveOrder, createOrder, getFirebaseOrder, getPaymentInfo, orderDocConverter, updateOrder} from "./firestore";
import {createTask, OnfleetWebhook} from "./onfleet";
import {AxiosError} from "axios";
import {
    BigCommerceOrderStatus,
    BigCommerceWebhook, DeliveryType,
} from "@foodleab/types/lib/bigcommerce";
import {DishState, OrderDoc, OrderState} from "@foodleab/types/lib/firestore";
import {checkTimeslotAvailability, listTimeslots} from "./timeslots";
import {
    AdyenNotificationPayload, adyenStatusAuthorization, adyenStatusRefund,
    AdyenTransactionStatus, PaymentInfo,
    refundOrder,
} from "./adyen";
import {firestore} from "firebase-admin/lib/firestore";
import QueryDocumentSnapshot = firestore.QueryDocumentSnapshot;
import moment from "moment";
import {sendEmail, sendNotification, TemplateType} from "./customemail";

export const momentTz = require('moment-timezone');
global.Intl = require('intl');

const region = 'europe-west1'

admin.initializeApp();

const db = admin.firestore();
db.settings({ignoreUndefinedProperties: true})
momentTz.tz.setDefault("Europe/Stockholm");

/**
 * List timeslots
 */
exports.delivery_slots = functions.region(region).https.onRequest(async (req, res) => {
    const date: string = <string>req.query.date

    const timeslots: Record<string, unknown>[] = await listTimeslots(date)

    res.status(200).send(timeslots)
});

/**
 * Validate timeslot
 */
exports.validate_slot = functions.region(region).https.onRequest(async (req, res) => {
    const date: string = <string>req.query.date
    const slot: string = <string>req.query.slot

    const available: boolean = await checkTimeslotAvailability(date, slot)

    res.status(200).send(available)
});

/**
 * Handle Storyblok webhooks
 */
exports.storyblok = functions.region(region).https.onRequest(async (req, res) => {
    const payload: StoryblokWebhook = JSON.parse(req.body);
    functions.logger.info(`Webhook received. Text: ${payload.text}`, payload, {structuredData: true});

    await fetchStory(payload.story_id)
        .then(story => functions.logger.debug(`Fetched story data: ${story.data}`, story))
        .catch((e: AxiosError) => {
            functions.logger.error(e.response?.data);
            throw new Error("Error fetching story");
        });

    res.sendStatus(202);
});

/**
 * Handle BigCommerce OrderCreated webhook
 */
exports.order_created = functions.region(region).https.onRequest(async (req, res) => {
    const payload: BigCommerceWebhook = req.body
    functions.logger.info(`Webhook received. Scope: ${payload.scope}, ID: ${payload.data.id}`, payload, {structuredData: true});

    await createOrder(payload.data.id)

    res.sendStatus(200);
});

/**
 * Handle BigCommerce OrderUpdated webhook
 */
exports.order_updated = functions.region(region).https.onRequest(async (req, res) => {
    const payload: BigCommerceWebhook = req.body;
    functions.logger.info(`Webhook received. Scope: ${payload.scope}, ID: ${payload.data.id}`, payload, {structuredData: true});

    // Check if the this order is just paid
    if (payload.data && payload.data.id) {
        // payload has order info
        const newStatus = payload.data.status.new_status_id;
        const orderDoc: OrderDoc = await getFirebaseOrder(String(payload.data.id))

        switch (newStatus) {
            case BigCommerceOrderStatus.AWAITING_FULFILLMENT:
                if (orderDoc === null) {
                    await admin.firestore().collection("new_order_queue").doc(String(payload.data.id)).set({
                        order_id: payload.data.id
                    });
                }
                break
            case BigCommerceOrderStatus.AWAITING_PICKUP:
                if (orderDoc !== null) {
                    await sendNotification(orderDoc, TemplateType.ORDER_PICKUP, null).catch((err) => {
                        functions.logger.error(`Error sending Awaiting Pickup Notification for Order# ${orderDoc.orderId}`, {structuredData: true});
                    })
                }
                break
            case BigCommerceOrderStatus.COMPLETED:
                if (orderDoc !== null) {
                    await updateOrder(payload.data.id, {
                        status: OrderState.DELIVERED,
                        deliveredAt: momentTz().toDate()
                    })
                        .then(async (_) => {
                            functions.logger.debug(`Order delivered. ID: ${payload.data.id}`)
                        })
                        .catch(e => functions.logger.error(`Failed to complete order ${payload.data.id}`, e, {structuredData: true}));
                }
                break
            case BigCommerceOrderStatus.CANCELLED:
                if (orderDoc !== null) {
                    await refundOrder(payload.data.id).then(async () => {
                        await sendNotification(orderDoc, TemplateType.ORDER_CANCELLED, await fetchOrder(payload.data.id)).catch((err) => {
                            functions.logger.error(`Error sending Order Cancelled Notification for Order# ${orderDoc.orderId}`, {structuredData: true});
                        })
                    })
                }
                break
            case BigCommerceOrderStatus.REFUNDED:
                if (orderDoc !== null) {
                    await sendNotification(orderDoc, TemplateType.ORDER_REFUND, await fetchOrder(payload.data.id)).catch((err) => {
                        functions.logger.error(`Error sending Order Refund Notification for Order# ${orderDoc.orderId}`, {structuredData: true});
                    })
                }
                break
            default:
                // Do nothing
                break;
        }
    }

    res.sendStatus(200);
});

exports.testIntl = functions.https.onRequest(async (req, res) => {
    res.send(momentTz('2021-07-26T18:40:00.000Z').format('hh:mm'))
})

exports.sendMail = functions.https.onRequest(async (req, res) => {

    const orderId: string = req.query.orderId as string
    const template: string = req.query.template as string
    const orderDoc: OrderDoc = await getFirebaseOrder(orderId)
    const orderInfoFromBigCom = await fetchOrder(parseInt(orderId))
    const paymentInfo: PaymentInfo = await getPaymentInfo(Number(orderId))
    res.send(await sendNotification(orderDoc, template, orderInfoFromBigCom, paymentInfo.amount))
});

exports.order_refunded = functions.https.onRequest(async (req, res) => {
    res.send(await refundOrder(Number(req.query.id)))
});

/**
 * Handle changes to active_orders by kitchen-web
 */
exports.active_order_changed = functions.region(region).firestore.document("/active_orders/{orderId}")
    .onUpdate(async (snap, context) => {
            //const oldOrder: OrderDoc = orderDocConverter.fromFirestore(snap.before);
            const newOrder: OrderDoc = orderDocConverter.fromFirestore(snap.after);
            functions.logger.info(`OnUpdate event triggered. ID: ${newOrder.orderId}`, newOrder, {structuredData: true});

            // const oldDishStates: DishState[] = oldOrder.kitchens.flatMap(kitchen => kitchen.dishes).map(dish => dish.dishStatus)
            const newDishStates: DishState[] = newOrder.kitchens.flatMap(kitchen => kitchen.dishes).map(dish => dish.dishStatus)

            if (newOrder.status === OrderState.NEW && newDishStates.some(state => state !== DishState.NEW)) {
                functions.logger.info('A NEW order with any of its dishes PROCESSING results in the order state PROCESSING', {structuredData: true});
                await admin.firestore().collection("active_orders").doc(String(newOrder.orderId)).update({status: OrderState.PROCESSING}).then(async () => {
                    await sendNotification(newOrder, TemplateType.ORDER_IN_PROCESS, null).catch((err) => {
                        functions.logger.error(`Error sending Order-in-process for Order# ${newOrder.orderId}`, {structuredData: true});
                    })
                })
            }

            if (newOrder.status === OrderState.PROCESSING && newDishStates.every(state => state === DishState.READY)) {
                functions.logger.info('A PROCESSING order with all of its dishes READY results in the order state READY', {structuredData: true});
                await admin.firestore().collection("active_orders").doc(String(newOrder.orderId)).update({status: OrderState.READY})
            }

            if (newOrder.status === OrderState.READY) {
                // If the order is to be delivered, create task in OnFleet
                if (newOrder.delivery == DeliveryType.HOME_DELIVERY) {
                    functions.logger.info('A READY order creates a new task in OnFleet', {structuredData: true});
                    await mapToTask(newOrder)
                        .then(createTask)
                        .catch((e: AxiosError) => {
                            functions.logger.error(e.response?.data);
                            throw new Error("Error creating task");
                        })
                } else {
                    await updateOrderStatusOnBigcommerce(newOrder.orderId, BigCommerceOrderStatus.AWAITING_PICKUP).then(async () => {
                        functions.logger.info(`Order ${newOrder.orderId} is ready to pickup. Order status updated`, {structuredData: true});
                    })
                }
            }

            if (newOrder.status === OrderState.SHIPPED) {
                // If the order is picked up by Logistics, update Bigcommerce status
                if (newOrder.delivery == DeliveryType.HOME_DELIVERY) {
                    functions.logger.info(`Order# ${newOrder.orderId} is on its way to customer`, {structuredData: true});
                    await updateOrderStatusOnBigcommerce(newOrder.orderId, BigCommerceOrderStatus.SHIPPED)
                        .catch(e => functions.logger.error(`Failed to update bigcommerce for order Shipment ${newOrder.orderId}`, e, {structuredData: true}));
                } else {
                    functions.logger.info(`Order# ${newOrder.orderId} is picked up by customer. Marker order as complete`, {structuredData: true});
                    await updateOrderStatusOnBigcommerce(newOrder.orderId, BigCommerceOrderStatus.COMPLETED)
                        .catch(e => functions.logger.error(`Failed to update bigcommerce for order Shipment ${newOrder.orderId}`, e, {structuredData: true}));
                }
            }

            // TODO: We will not archive order. It should be a scheduled task. Will be taken later
            /*
                  if (newOrder.status === OrderState.DELIVERED) {
                    functions.logger.info('A DELIVERED order results in it being archived', {structuredData: true});
                    await archiveOrder(newOrder.orderId)
                      .then(_ => functions.logger.debug(`Successfully archived order ${newOrder.orderId}`, {structuredData: true}))
                      .catch(e => functions.logger.error(`Failed to archive order ${newOrder.orderId}`, e, {structuredData: true}));
                  }
            */
        }
    );

/**
 * Process the new order queue
 */
exports.new_order_queued = functions.region(region).firestore.document("/new_order_queue/{orderId}")
    .onCreate(async (snap, context) => {
        const orderId = snap.id
        functions.logger.info(`Processing New Order ID: ${orderId}`, {structuredData: true});

        await createOrder(Number(orderId)).then(async () => {
            await admin.firestore().collection("new_order_queue").doc(orderId).delete()
        })
    });

/**
 * Handle BigCommerce ProductCreated webhook
 */
exports.product_created = functions.region(region).https.onRequest(async (req, res) => {
    const payload: BigCommerceWebhook = req.body;
    const productId = payload.data.id;
    functions.logger.info(`Webhook received. Scope: ${payload.scope}, ID: ${payload.data.id}`, payload, {structuredData: true});

    await fetchProduct(productId)
        .then(mapToDishStory)
        .then(createDish)
        .then(apiRes => functions.logger.info(`Product created. ID: ${productId}`, apiRes.data, {structuredData: true}))
        .catch(e => functions.logger.error(`Failed to create product ${productId}`, e, {structuredData: true}));

    res.sendStatus(202);
});

/**
 * Handle BigCommerce ProductUpdated webhook
 */
exports.product_updated = functions.region(region).https.onRequest(async (req, res) => {
    const payload: BigCommerceWebhook = req.body;
    const productId = payload.data.id;
    functions.logger.info(`Webhook received. Scope: ${payload.scope}, ID: ${payload.data.id}`, payload, {structuredData: true});

    await fetchProduct(productId)
        .then(mapToDishStory)
        .then(dish => updateDish(productId, dish))
        .then(apiRes => functions.logger.info(`Product updated. ID: ${productId}`, apiRes, {structuredData: true}))
        .catch(e => functions.logger.error(`Failed to update product ${productId}`, e, {structuredData: true}));

  res.sendStatus(202);
});

/**
 * Handle BigCommerce ProductDeleted webhook
 */
exports.product_deleted = functions.region(region).https.onRequest(async (req, res) => {
    const payload: BigCommerceWebhook = req.body;
    const productId = payload.data.id;
    functions.logger.info(`Webhook received. Scope: ${payload.scope}, ID: ${payload.data.id}`, payload, {structuredData: true});

    await deleteDish(productId)
        .then(_ => functions.logger.info(`Product deleted. ID: ${productId}`, {structuredData: true}))
        .catch(e => functions.logger.error(`Failed to delete product ${productId}`, e, {structuredData: true}));

    res.sendStatus(202);
});

/**
 * Get all products data from Bigcommerce
 */
exports.getAllProductData = functions.region(region).https.onRequest(async (req, res) => {

    if (req.query.clear_cache) {
        await clearBigCommerceCache()
    }
    res.send(await getBigCommerceData());
});

/**
 * Get all CMS data
 */
exports.getAllStoryblokData = functions.region(region).https.onRequest(async (req, res) => {
    if (req.query.clear_cache) {
        await clearStoryblokCache()
    }
    res.send(await getAllStoryBlokData());
});

/**
 * Clear Storyblock cache
 */
exports.clearStoryBlockCache = functions.region(region).https.onRequest(async (req, res) => {
    await clearStoryblokCache()
    res.sendStatus(200);
});

/**
 * Clear Bigcommerce cache
 */
exports.clearBigCommerceCache = functions.region(region).https.onRequest(async (req, res) => {
    await clearBigCommerceCache()
    res.sendStatus(200);
});


/**
 * Handle Onfleet TaskCreated webhook
 */
exports.task_created = functions.region(region).https.onRequest(async (req, res) => {
    const payload: OnfleetWebhook = req.body;
    functions.logger.info(`Webhook received from OnFleet for Task created. Task ID: ${payload.taskId}`, payload, {structuredData: true});

    const task = payload.data.task;
    const orderObject = task.metadata.find(((v) => v.hasOwnProperty("name") && v.name === 'orderId' ? v : null));

    if (orderObject) {
        const orderId = orderObject.value
        functions.logger.info(`MetaData. OrderInfo ${JSON.stringify(orderId)}`, {structuredData: true});
        await updateOrderStatusOnBigcommerce(orderId, BigCommerceOrderStatus.AWAITING_SHIPMENT)
            .then(_ => functions.logger.debug(`Bigcommerce updated for order delivered. ID: ${orderId}`, task))
            .catch(e => functions.logger.error(`Failed to update bigcommerce for order complete ${orderId}`, e, {structuredData: true}));
    } else {
        functions.logger.error(`Order Info not found in task details`, {structuredData: true});
    }

    res.sendStatus(200);
});

/**
 * Handle Onfleet TaskCompleted webhook
 */
exports.task_completed = functions.region(region).https.onRequest(async (req, res) => {
    const payload: OnfleetWebhook = req.body;
    functions.logger.info(`Webhook received. Task ID: ${payload.taskId}`, payload, {structuredData: true});
    functions.logger.info(`Current time: ${momentTz().toDate()}`);
    const task = payload.data.task;
    const orderObject = task.metadata.find(((v) => v.hasOwnProperty("name") && v.name === 'orderId' ? v : null));

    if (orderObject) {
        const orderId = orderObject.value
        functions.logger.info(`MetaData. OrderInfo ${JSON.stringify(orderId)}`, {structuredData: true});
        // await updateOrder(orderId, {status: OrderState.DELIVERED, deliveredAt: momentTz().toDate()})
        //     .then(async (_) => {
        //         functions.logger.debug(`Order delivered. ID: ${orderId}`, task)
        //     })
        //     .catch(e => functions.logger.error(`Failed to complete order ${orderId}`, e, {structuredData: true}));
        await updateOrderStatusOnBigcommerce(orderId, BigCommerceOrderStatus.COMPLETED)
            .then(_ => functions.logger.debug(`Bigcommerce updated for order delivered. ID: ${orderId}`, task))
            .catch(e => functions.logger.error(`Failed to update bigcommerce for order complete ${orderId}`, e, {structuredData: true}));

    } else {
        functions.logger.error(`Order Info not found in task details`, {structuredData: true});
    }

    res.sendStatus(200);
});

/**
 * Handle Adyen Payment Received webhook
 */
exports.adyen_standard_notification = functions.region(region).https.onRequest(async (req, res) => {
    functions.logger.info(`Webhook received from Adyen:`, JSON.stringify(req.body), {structuredData: false});
    const payload: AdyenNotificationPayload = req.body;
    functions.logger.info(`Webhook received from Adyen: Order# ${payload.notificationItems[0].NotificationRequestItem.merchantReference}`, payload, {structuredData: false});

    if (payload.notificationItems) {
        await payload.notificationItems.forEach((item) => {
            // Go through each notification item and process it
            const notificationItem = item.NotificationRequestItem
            if (notificationItem.success === "true") {
                switch (notificationItem.eventCode) {
                    case AdyenTransactionStatus.AUTHORIZATION:
                        adyenStatusAuthorization(notificationItem, payload)
                        break;
                    case AdyenTransactionStatus.REFUND:
                        adyenStatusRefund(notificationItem, payload)
                        break;
                }
            }
        })
    }

    res.status(202).send("[accepted]");
});

exports.create_task = functions.region(region).https.onRequest(async (req, res) => {
    const order_id: string = <string>req.query.order_id

    await admin.firestore().collection("active_orders").doc(order_id).get().then(async (snap) => {
        const newOrder: OrderDoc = orderDocConverter.fromFirestore(snap as QueryDocumentSnapshot);
        const task = await mapToTask(newOrder).then((task) => createTask(task)).then(() => {
            functions.logger.debug('Task created successfully');
        }).catch((e: AxiosError) => {
            functions.logger.error(e.response);
            throw new Error("Error creating task");
        })
        console.log(task)
    })
    res.status(200).send("OK")
});

exports.archive_order = functions.region(region).https.onRequest(async (req, res) => {
    const order_id: string = <string>req.query.order_id

    await archiveOrder(order_id)
        .then(_ => functions.logger.debug(`Successfully archived order ${order_id}`, {structuredData: true}))
        .catch(e => functions.logger.error(`Failed to archive order ${order_id}`, e, {structuredData: true}));

});

// exports.archiveOldOrders = functions.pubsub.schedule('* * * * *').timeZone('Europe/Stockholm').onRun((context) => {
//     console.log('This will be run everyday!');
//
//     // Fetch all the orders that are 7 days old, and archive them
//     admin.firestore().collection('active_orders').where('deliveryDate', '<', momentTz.add(-7, 'days').format('YYYY-MM-DD')).get().then((snap) => {
//         snap.forEach((doc) => {
//             console.log(doc.data().id)
//             await archiveOrder(doc.data().orderId)
//         })
//     })
//
//     return null;
// });


// exports.task_created = functions.region(region).https.onRequest(async (req, res) => {
//     // const date: string = <string>req.query.date
//     //
//     // const timeslots: Record<string, unknown>[] = await listTimeslots(date)
//     //
//     console.log("Check", req.query.check)
//     res.status(200).send(req.query.check)
// });

exports.generateDailyReport = functions.region(region).https.onRequest(async (req, res) => {
    const date: string = <string>req.query.delivery_date

    const ordersSnapshot = await admin
        .firestore()
        .collection("active_orders")
        .where('deliveryDate', '==', date)
        .get();

    // const orders = ordersSnapshot.docs.map(doc => doc.data());

    // csv field headers
    const fields = [
        'id',
        'name',
        'phone',
        'slotStartTime',
        'slotEndTime',
        'deliveredAt',
        'deliveryType',
        'delayed'
    ];

    const orders = []
    ordersSnapshot.forEach((order) => {
        const orderDoc: OrderDoc = orderDocConverter.fromFirestore(order);

        orders.push({
            id: orderDoc.orderId,
            name: orderDoc.recipient.name,
            phone: orderDoc.recipient.phoneNumber,
            slotStartTime: momentTz(orderDoc.estimatedDeliveryFrom).format('YYYY-MM-DD HH:mm'),
            slotEndTime: momentTz(orderDoc.estimatedDeliveryTo).format('YYYY-MM-DD HH:mm'),
            deliveredAt: momentTz(orderDoc.deliveredAt).format('YYYY-MM-DD HH:mm'),
            deliveryType: orderDoc.delivery,
            delayed: moment.duration(momentTz(orderDoc.deliveredAt).diff(momentTz(orderDoc.estimatedDeliveryTo))).asMinutes() > 0 ? Math.ceil(moment.duration(momentTz(orderDoc.deliveredAt).diff(momentTz(orderDoc.estimatedDeliveryTo))).asMinutes()) : 0
        })
    })

    // get csv output
    const output = await parseAsync(orders, {fields});

    res.send(output)
});
