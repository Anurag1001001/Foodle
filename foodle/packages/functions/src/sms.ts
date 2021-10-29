import {OrderDoc} from "@foodleab/types/lib/firestore";
import {TemplateType} from "./customemail";
import * as functions from "firebase-functions";
import {DeliveryType} from "@foodleab/types/lib/bigcommerce";

const AWS = require('aws-sdk');
AWS.config.update({
    accessKeyId: `${functions.config().aws.access_key_id}`,
    secretAccessKey: `${functions.config().aws.secret_access_key}`,
    region: `${functions.config().aws.sns_region}`
})

export async function sendSms(template:string, order: OrderDoc): Promise<boolean> {
    const params = {
        Message: getSMSText(template, order),
        PhoneNumber: order.meta.phoneNumber[0] === '0' ? order.meta.phoneNumber.replace('0', '+46') : order.meta.phoneNumber
    }

    return new AWS.SNS({ apiVersion: '2010-03-31' }).publish(params).promise().then((res) => {
        return true
    }).catch((err) => {
        functions.logger.error(`Error sending SMS for Order# ${order.orderId}`, {structuredData: true});
        functions.logger.error(err, {structuredData: true});
        return false
    })
}

function getSMSText (template: string, order: OrderDoc): string {
    let text = ''

    switch (template) {
        case TemplateType.ORDER_CONFIRMED:
            text = `Hej ${order.recipient.name.split(' ')[0]}! \n\nTack för din beställning! Vi har skickat kvitto på er order #${order.orderId} till den angivna e-mail adressen.\n\n Mvh,\n //Foodle`;
            break;
        case TemplateType.ORDER_IN_PROCESS:
            if (order.delivery === DeliveryType.HOME_DELIVERY) {
                text = `Hej ${order.recipient.name.split(' ')[0]}! \n\nDin mat har börjat tillagas. Vi kommer skicka ett SMS till dig när vi börjar närma oss den angivna adressen.\n\n Mvh,\n //Foodle`;
            } else {
                text = `Hej ${order.recipient.name.split(' ')[0]}! \n\nDin mat har börjat tillagas. Vi kommer skicka ett SMS/Email till dig när din order är redo för upphämtning.\n\n Mvh,\n //Foodle`;
            }
            break;
        case TemplateType.ORDER_CANCELLED:
            text = `DIN ORDER ÄR AVBRUTEN.! Se din e-mail för mer information. Ordernummer #${order.orderId}\n\n Du kan alltid gå in på Foodle.se och göra en ny beställning.\n\n Mvh,\n //Foodle`;
            break;
        case TemplateType.ORDER_PICKUP:
            text = `Din beställning (#${order.orderId}) är redo att hämtas. Upphämtningsadress är\n\nSankt Annegatan 2, (vändplatsen vid Domino)\n Nyköping län Nyköping 611 34.\n\n Mvh,\n //Foodle`;
            break;
        case TemplateType.ORDER_REFUND:
            text = `Hej! Din order #${order.orderId} är nu återbetald. Detaljer kring återbetalning har mailas till dig.\n\n Mvh,\n //Foodle`;
            break;
    }

    return text
}
