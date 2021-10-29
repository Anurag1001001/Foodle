import {DeliveryAddress, OrderDoc} from "@foodleab/types/lib/firestore";
import * as functions from "firebase-functions";
import {Amount} from "./adyen";
import {momentTz} from "./index";
import {Order} from "@foodleab/types/lib/bigcommerce";
import {AxiosResponse} from "axios";
import {sendSms} from "./sms";

const fs = require('fs');
const Handlebars = require("handlebars");
//aws config
const AWS = require('aws-sdk');

const SESConfig = {
    apiVersion: '2010-12-01',
    accessKeyId: `${functions.config().aws.access_key_id}`,
    secretAccessKey: `${functions.config().aws.secret_access_key}`,
    region: `${functions.config().aws.ses_region}`
}

export enum TemplateType {
    ORDER_CONFIRMED = "invoice",
    ORDER_IN_PROCESS = "orderInProcess",
    ORDER_CANCELLED = "orderCancelled",
    ORDER_REFUND = "refund",
    ORDER_PICKUP = "pickup",
}

export async function sendNotification(orderDoc: OrderDoc, template: string, orderInfoFromBigCom: AxiosResponse<Order>, amount?: Amount): Promise<boolean> {

    functions.logger.info(`Sending Notification for Order# ${orderDoc.orderId} for ${template}`, {structuredData: true});

    const success = await sendEmail(orderDoc, template, orderInfoFromBigCom, amount)
        .then(async () => {
            return await sendSms(template, orderDoc)
        }).catch((err) => {
            functions.logger.error(`Error sending In-Process email for Order# ${orderDoc.orderId}`, {structuredData: true});
            functions.logger.error(err, {structuredData: true});
            return false
        })

    return new Promise((resolve, reject) => resolve(success))
}

export async function sendEmail(orderDoc: OrderDoc, template: string, orderInfoFromBigCom: AxiosResponse<Order>, amount?: Amount): Promise<boolean> {

    registerPartials()

    registerHelpers()

    const params = {
        Source: "Foodle Support <do-not-reply@foodle.se>",
        Destination: {
            ToAddresses: [orderDoc.recipient.email.trim()],
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: getHtml(template, {
                        order: orderDoc,
                        orderInfoFromBigCom,
                        amount,
                        isPickup: template === TemplateType.ORDER_PICKUP,
                        isCancelled: template === TemplateType.ORDER_CANCELLED,
                        isInProcess: template === TemplateType.ORDER_IN_PROCESS,
                        isInvoice: template === TemplateType.ORDER_CONFIRMED,
                        isRefund: template === TemplateType.ORDER_REFUND
                    })
                }
            },
            Subject: {
                Charset: "UTF-8",
                Data: getSubject(template, orderDoc)
            }
        }
    }

    return new AWS.SES(SESConfig).sendEmail(params).promise().then((res) => {
        return true
    }).catch((err) => {
        functions.logger.error(`Error sending Email for Order# ${orderDoc.orderId}`, {structuredData: true});
        return false
    })
}

function registerPartials() {
    Handlebars.registerPartial('header', Handlebars.compile(fs.readFileSync('./views/partials/header.hbs', 'utf8').toString()))
    Handlebars.registerPartial('footer', Handlebars.compile(fs.readFileSync('./views/partials/footer.hbs', 'utf8').toString()))
    Handlebars.registerPartial('orderHeader', Handlebars.compile(fs.readFileSync('./views/partials/orderHeader.hbs', 'utf8').toString()))
    Handlebars.registerPartial('orderContact', Handlebars.compile(fs.readFileSync('./views/partials/orderContact.hbs', 'utf8').toString()))
    Handlebars.registerPartial('pickupHeader', Handlebars.compile(fs.readFileSync('./views/partials/pickupHeader.hbs', 'utf8').toString()))
    Handlebars.registerPartial('refundInfoText', Handlebars.compile(fs.readFileSync('./views/partials/refundInfoText.hbs', 'utf8').toString()))
    Handlebars.registerPartial('orderInProcessHeader', Handlebars.compile(fs.readFileSync('./views/partials/orderInProcessHeader.hbs', 'utf8').toString()))
    Handlebars.registerPartial('orderInvoiceHeader', Handlebars.compile(fs.readFileSync('./views/partials/orderInvoiceHeader.hbs', 'utf8').toString()))
    Handlebars.registerPartial('orderCancelledHeader', Handlebars.compile(fs.readFileSync('./views/partials/orderCancelledHeader.hbs', 'utf8').toString()))
    Handlebars.registerPartial('refundHeader', Handlebars.compile(fs.readFileSync('./views/partials/refundHeader.hbs', 'utf8').toString()))
    Handlebars.registerPartial('cancelOrderInfo', Handlebars.compile(fs.readFileSync('./views/partials/cancelOrderInfo.hbs', 'utf8').toString()))
    Handlebars.registerPartial('fileHeader', Handlebars.compile(fs.readFileSync('./views/partials/fileHeader.hbs', 'utf8').toString()))
    Handlebars.registerPartial('fileFooter', Handlebars.compile(fs.readFileSync('./views/partials/fileFooter.hbs', 'utf8').toString()))
    Handlebars.registerPartial('orderDetails', Handlebars.compile(fs.readFileSync('./views/partials/orderDetails.hbs', 'utf8').toString()))
    Handlebars.registerPartial('addOn', Handlebars.compile(fs.readFileSync('./views/partials/addOn.hbs', 'utf8').toString()))
    Handlebars.registerPartial('divider', Handlebars.compile(fs.readFileSync('./views/partials/divider.hbs', 'utf8').toString()))
}

function registerHelpers () {
    Handlebars.registerHelper("imageUrl", function (path) {
        return "https://foodle.se" + path;
    });

    Handlebars.registerHelper("firstName", function (name) {
        return name.split(' ')[0]
    });

    Handlebars.registerHelper('sum', function (discount_amount, coupon_discount, includingDecimals: boolean) {
        const amount = parseInt(discount_amount) + parseInt(coupon_discount)
        return new Intl.NumberFormat('sv-SE', {
            style: 'currency',
            currency: 'SEK',
            maximumFractionDigits: 2
        }).format(includingDecimals ? amount / 100 : amount);
    })

    Handlebars.registerHelper("isDeliverable", function (order) {
        return order.delivery === 'Hemleverans'
    });

    Handlebars.registerHelper("ifcond", function (conditional, options) {
        return parseInt(conditional) > 0 ? options.fn(this) : options.inverse(this);
    });

    Handlebars.registerHelper("formatAmount", function (amount: number, includingDecimals: boolean) {
        return new Intl.NumberFormat('sv-SE', {
            style: 'currency',
            currency: 'SEK',
            maximumFractionDigits: 2
        }).format(includingDecimals ? amount / 100 : amount);
    });

    Handlebars.registerHelper("formatAddress", function (deliveryAddress: DeliveryAddress) {
        const address = "<span>" + deliveryAddress.street_1 + ",<br/>" + deliveryAddress.street_2 + " " + deliveryAddress.zip + " " + deliveryAddress.city + "<br/> " + deliveryAddress.state + deliveryAddress.country + "</span>";
        return address;
    });

    Handlebars.registerHelper("formatDate", function (date: string) {
        return momentTz(date).locale('sv').format('MMMM DD, YYYY');
    });


    Handlebars.registerHelper("formatTime", function (date: string) {
        return momentTz(date).format('HH:mm')
    });

    Handlebars.registerHelper("each", function (context, options) {
        let ret = "";

        for (let i = 0, j = context.length; i < j; i++) {
            ret = ret + options.fn(context[i]);
        }

        return ret;
    });

}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function getHtml(filename: string, data: any): string {
    const template_name = './views/' + filename + '.hbs'
    const source = fs.readFileSync(template_name, 'utf8').toString();
    const template = Handlebars.compile(source);

    return template(data)
}

export function getSubject(template: string, order: OrderDoc): string {
    let subject = "";
    switch (template) {
        case TemplateType.ORDER_CONFIRMED:
            subject = `Order #${order.orderId} - Godkänd- Kommer tillagas och order bekräftelsen - Foodle`;
            break;
        case TemplateType.ORDER_IN_PROCESS:
            subject = `Order #${order.orderId} - Din mat har börjat tillagas - Foodle`;
            break;
        case TemplateType.ORDER_CANCELLED:
            subject = `Order #${order.orderId} - Avbruten och order bekräftelsen - Foodle`;
            break;
        case TemplateType.ORDER_PICKUP:
            subject = `Din order #${order.orderId} är redo för upphämtning - Foodle`;
            break;
        case TemplateType.ORDER_REFUND:
            subject = `Återbetalning på order #${order.orderId} - Foodle`;
            break;
    }
    return subject;
}
