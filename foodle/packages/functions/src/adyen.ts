import axios, {AxiosError, AxiosResponse} from "axios";
import * as functions from "firebase-functions";
import {BigCommerceOrderStatus, Metafields, Order} from "@foodleab/types/lib/bigcommerce";
import {fetchOrder, fetchOrderMetafields, updateOrderStatusOnBigcommerce, updatePaymentInfo} from "./bigcommerce";

export enum AdyenTransactionStatus {
    AUTHORIZATION = 'AUTHORISATION',
    REFUND = "REFUND"
}

const adyen = axios.create({
    baseURL: `${functions.config().adyen.base_url}/checkout/v67/payments`,
    timeout: 15000,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-API-Key": functions.config().adyen.api_key,
    }
});

export async function adyenStatusAuthorization(notificationItem: NotificationItem,payload): Promise<boolean> {

    // New payment is done. Time to update the order in Bigcommerce
    if (notificationItem.merchantReference) {
        const order = fetchOrder(Number(notificationItem.merchantReference)).then(async (res) => {
            const orderInfo: Order = res.data
            if (orderInfo.status_id === BigCommerceOrderStatus.PENDING) {
                await updatePaymentInfo(orderInfo.id, new PaymentMeta(notificationItem.pspReference, notificationItem.amount.value, notificationItem.amount.currency, notificationItem.merchantAccountCode))
                .then(async () => {
                    await updateOrderStatusOnBigcommerce(orderInfo.id, BigCommerceOrderStatus.AWAITING_FULFILLMENT)
                }).catch((err) => {
                    functions.logger.error(`Error updating payment info`, err.response.data.errors, JSON.stringify(err.response.data.errors), JSON.stringify(err.response.data), {structuredData: false})
                })
            }
        })
    }
    else {
        functions.logger.info(`Webhook status from Adyen: Order# ${payload.notificationItems[0].NotificationRequestItem.merchantReference} payment did not go through`);
    }

    return new Promise((resolve, _) => resolve(true))
}

export async function adyenStatusRefund(notificationItem: NotificationItem,payload): Promise<boolean> {

    // New payment is done. Time to update the order in Bigcommerce
    if (notificationItem.merchantReference) {
        await fetchOrder(Number(notificationItem.merchantReference)).then(async (res) => {
            const orderInfo: Order = res.data
            await updateOrderStatusOnBigcommerce(orderInfo.id, BigCommerceOrderStatus.REFUNDED)
        })
    }
    else {
        functions.logger.info(`Webhook status from Adyen: Order# ${payload.notificationItems[0].NotificationRequestItem.merchantReference} payment did not go through`);
    }

    return new Promise((resolve, _) => resolve(true))
}

export async function refundOrder(orderId: number): Promise<boolean> {
    let refundInitiated = false;

    await fetchOrderMetafields(orderId, "payment")
        .then((resp: AxiosResponse<Metafields>) => {
            return resp.data.data.find(f => f.key === "payment")
        })
        .catch((e: AxiosError) => {
            functions.logger.error(e.response?.data);
            throw new Error("Error fetching order payment info");
        }).then(async (paymentData) => {
            const paymentMeta: PaymentMeta = JSON.parse(paymentData.value)
            return await refundPayment(paymentMeta.pspReferenceNumber, paymentMeta.paymentInfo)
        }).catch((e: AxiosError) => {
            functions.logger.error(e.response?.data);
            throw new Error("Error refunding order ");
        }).then((refundResponse) => {
            const refundInfo: RefundResponse = refundResponse.data
            if (refundInfo.status === "received") {
                refundInitiated = true;
            }
        });

    return new Promise((resolve, _) => resolve(refundInitiated))
}

export async function refundPayment(pspRefNumber: string, paymentInfo: PaymentInfo): Promise<AxiosResponse<any>> {
    console.log(pspRefNumber)
    console.log(paymentInfo)
    console.log(`${functions.config().adyen.base_url}/checkout/v67/payments/${pspRefNumber}/refunds`)
    return await adyen.post(`/${pspRefNumber}/refunds`, paymentInfo);
}

export interface AdyenNotificationPayload {
    live: string;
    notificationItems: NotificationItemWrapper[];
}

export interface NotificationItemWrapper {
    NotificationRequestItem: NotificationItem;
}

export interface NotificationItem {
    merchantReference: string;
    merchantAccountCode: string;
    pspReference: string;
    reason: string
    success: string
    amount: OrderData
    eventCode: string
    eventDate: string
    paymentMethod: string
}

export interface OrderData {
    currency: string;
    value: number;
}

export interface RefundResponse {

    merchantAccount: string;
    paymentPspReference: string;
    pspReference: string;
    status: string;
    amount: Amount;
    currency: string;
}

export class PaymentMeta {
    constructor(pspReferenceNumber: string, amount: number, currency: string, merchantAccount: string) {
        this.pspReferenceNumber = pspReferenceNumber;
        this.paymentInfo = new PaymentInfo(amount, currency, merchantAccount);
    }

    paymentInfo: PaymentInfo;
    pspReferenceNumber: string;
}

export class PaymentInfo {
    constructor(amount: number, currency: string, merchantAccount: string) {
        this.amount = new Amount(amount, currency);
        this.merchantAccount = merchantAccount;
    }

    amount: Amount;
    merchantAccount: string;
}

export class Amount {
    constructor(value: number, currency: string) {
        this.value = value;
        this.currency = currency;
    }

    value: number;
    currency: string;
}
