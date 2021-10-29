import {AxiosResponse} from "axios";
import {CreateStoryRequest, Dish as DishStory} from "./storyblok";
import {CreateTaskProps} from "@onfleet/node-onfleet/Resources/Tasks";
import {
  CouponInfo,
  DeliveryMeta,
  Order,
  OrderMeta,
  Product,
  ProductMeta,
  ShippingAddress
} from "@foodleab/types/lib/bigcommerce";
import {Dish, DishState, DocRef, Kitchen, OrderDoc, OrderState, Timeslot} from "@foodleab/types/lib/firestore";
import {fetchKitchens} from "./firestore";
import * as functions from "firebase-functions";
import {momentTz} from "./index";

export function mapToDish(product: ProductMeta): Dish {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const drinks = product.addOns.drinks
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const sides = product.addOns.sides
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const extras = product.addOns.extras
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const accessories = product.addOns.accessories
  return {
    id: product.id,
    name: product.name,
    sku: product.sku,
    dishStatus: DishState.NEW,
    drink: Array.isArray(drinks) ? drinks : [drinks],
    side: Array.isArray(sides) ? sides : [sides],
    extra: Array.isArray(extras) ? extras : [extras],
    accessory: Array.isArray(accessories) ? accessories : [accessories],
    variant: product.variant && product.variant.options && product.variant.options.length ? product.variant.options[0].label : "",
    removeIngredients: product.removeIngredients,
    quantity: product.quantity ? product.quantity : 1,
    price: product.price
  }
}

export async function mapToKitchens(productsMeta: ProductMeta[]): Promise<Kitchen[]> {
  const kitchensMap = await fetchKitchens()
  const kitchens = new Map<string, Kitchen>();

  productsMeta.forEach(product => {
    const key = product.kitchen as string;

    const firebaseKitchenId = kitchensMap.get(key)

    const kitchen: Kitchen = kitchens.get(key) ?? {
      kitchenId: firebaseKitchenId,
      kitchenName: key,
      dishes: [],
    }

    const dish: Dish = mapToDish(product)
    kitchen?.dishes.push(dish)

    kitchens.set(key, kitchen)
  })

  return new Promise<Kitchen[]>((resolve, _) => resolve(Array.from(kitchens.values())))
}

export async function mapToOrderDoc(order: Order, address: ShippingAddress, orderMeta: OrderMeta, timeslotId: string): Promise<OrderDoc> {
  const deliveryMeta: DeliveryMeta = JSON.parse(orderMeta.delivery);
  const couponInfo: CouponInfo = orderMeta.couponInfo.length > 0 ? JSON.parse(orderMeta.couponInfo) : {};
  const orderDoc: OrderDoc = {
    createdAt: new Date(order.date_created),
    deliveryAddress: {
      street_1: address.street_1,
      street_2: address.street_2,
      zip: address.zip,
      city: address.city,
      state: address.state,
      country: address.country,
      doorCode: orderMeta.port_code,
    },
    estimatedDeliveryFrom: new Date(deliveryMeta.date + (getSeconds(deliveryMeta.startTime) * 1000)),
    estimatedDeliveryTo: new Date(deliveryMeta.date + (getSeconds(deliveryMeta.endTime) * 1000)),
    timeslotId,
    kitchens: await mapToKitchens(orderMeta.productsMeta ?? []),
    recipient: {
      name: `${address.first_name} ${address.last_name}`,
      phoneNumber: address.phone,
      email: order.billing_address.email
    },
    meta: {
      message: order.customer_message,
      doorCode: orderMeta.port_code,
      phoneNumber: address.phone,
      notes: order.staff_notes,
    },
    number: order.id,
    orderId: order.id,
    delivery: deliveryMeta.type,
    status: OrderState.NEW,
    deliveryDate: momentTz.unix(deliveryMeta.date / 1000).format('YYYY-MM-DD'),
    deliveredAt: momentTz.unix(0).toDate(),
    location: orderMeta.location ?? [0,0],
    refunded: false,
    coupon: {
      id: couponInfo.id ?? 0,
      name:       couponInfo.name ?? '',
      type:       couponInfo.type ?? '',
      amount:     couponInfo.amount ?? '',
      min_purchase:     couponInfo.min_purchase ?? '',
      expires:     couponInfo.expires ?? "",
      enabled:     couponInfo.enabled ?? false,
      code:     couponInfo.code ?? '',
      num_uses:     couponInfo.num_uses ?? 0,
      max_uses:     couponInfo.max_uses ?? 0,
      max_uses_per_customer:     couponInfo.max_uses_per_customer ?? 0
    }
  };

  return new Promise<OrderDoc>((resolve, _) => resolve(orderDoc));
}

export function getSeconds(time) {
  const timeParts = time.split(':'); // split it at the colons

  // minutes are worth 60 seconds. Hours are worth 60 minutes.
  return (+timeParts[0]) * 60 * 60 + (+timeParts[1]) * 60
}

// TODO
export async function mapToDishStory(_: AxiosResponse<Product>): Promise<CreateStoryRequest<DishStory>> {
  const dish: CreateStoryRequest<DishStory> = {
    name: "",
    slug: "",
    content: {
      sku: "",
      _uid: "",
      price: "",
      kitchen: "",
      component: "",
      product_id: "",
      description: "",
      ingredients: [""],
      out_of_stock: false,
      ingredient_list: [""],
    },
  };

  return new Promise<CreateStoryRequest<DishStory>>((resolve, _) => resolve(dish));
}

export async function mapToTask(order: OrderDoc): Promise<CreateTaskProps> {
  // Get the street number from the street
  // Assuming the last word is the street number
  const parts = order.deliveryAddress.street_1.trim().split(" ");
  const streetNumber: string = parts[parts.length - 1]
  parts.splice(parts.length - 1, 1)
  const streetName: string = parts.join(" ")
  // const streetNumber: string = order.deliveryAddress.street_1.match(/\d+/).toString();
  // console.log(streetNumber)
  // const streetName: string = order.deliveryAddress.street_1.match(/^[a-zA-ZäöåÄÖÅ]+\s?[a-zA-ZäöåÄÖÅ]+\s?/).toString();
  // console.log(streetName)
  const task: CreateTaskProps = {
    destination: {
      address: {
        street: streetName,
        number: streetNumber,
        postalCode: order.deliveryAddress.zip,
        city: order.deliveryAddress.city,
        country: order.deliveryAddress.country
      },
      notes: `Door code: ${order.deliveryAddress.doorCode}`,
    },
    recipients: [
      {
        name: "Order# " + order.orderId + ' - ' + order.recipient.name,
        phone: order.recipient.phoneNumber,
      }
    ],
    // completeAfter: order.estimatedDeliveryTo.getTime(),
    // completeBefore: order.estimatedDeliveryFrom.getTime(),
    notes: order.meta.message,
    metadata: [
      { name: 'orderId', type: "number", value: order.orderId }
    ]
  };

  if(order.location && order.location[0] > 0) {
    task.destination['location'] = [
      order.location[1],  // Longitude
      order.location[0]   // Latitude
    ]
  }

  functions.logger.debug("TASK TO BE SUBMITTED", JSON.stringify(task));
  return new Promise<CreateTaskProps>((resolve, _) => resolve(task));
}
