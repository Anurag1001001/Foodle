import {AddOn, CouponInfo} from "./bigcommerce";

export enum OrderState {
  NEW = "new",
  PROCESSING = "processing",
  READY = "ready",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
}

export enum DishState {
  NEW = "new",
  PROCESSING = "processing",
  READY = "ready",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
}

export class OrderDoc {
  constructor(createdAt: Date, deliveryAddress: DeliveryAddress, estimatedDeliveryFrom: Date, estimatedDeliveryTo: Date, timeslotId: string, kitchens: Kitchen[], recipient: Recipient, meta: Meta, number: number, orderId: number, delivery: string, status: OrderState, deliveryDate: string, deliveredAt: Date, location: Array<number>, refunded: boolean, coupon: CouponInfo) {
    this.createdAt = createdAt;
    this.deliveryAddress = deliveryAddress;
    this.estimatedDeliveryFrom = estimatedDeliveryFrom;
    this.estimatedDeliveryTo = estimatedDeliveryTo;
    this.timeslotId = timeslotId;
    this.kitchens = kitchens;
    this.recipient = recipient;
    this.meta = meta;
    this.number = number;
    this.orderId = orderId;
    this.delivery = delivery;
    this.status = status;
    this.deliveryDate = deliveryDate;
    this.deliveredAt = deliveredAt;
    this.location = location;
    this.refunded = refunded;
    this.coupon = coupon
  }

  createdAt: Date;
  deliveryAddress: DeliveryAddress;
  estimatedDeliveryFrom: Date;
  estimatedDeliveryTo: Date;
  timeslotId: string;
  kitchens: Kitchen[];
  recipient: Recipient;
  meta: Meta;
  number: number;
  orderId: number;
  delivery: string;
  status: OrderState;
  deliveryDate: string;
  deliveredAt: Date;
  location: Array<number>;
  refunded: boolean;
  coupon: CouponInfo
}

export type DocRef = number | string;

export class Timeslot {
  constructor(id: string, capacity: number, date: String, slot: string, orders: DocRef[], orderCount: number) {
    this.id = id;
    this.capacity = capacity;
    this.date = date;
    this.slot = slot;
    this.orders = orders;
    this.orderCount = orderCount
  }

  id: string;
  capacity: number;
  date: String;
  slot: string;
  orders: DocRef[];
  orderCount: number;
}

export interface DeliveryAddress {
  street_2: string | undefined;
  country: string;
  city: string;
  street_1: string;
  state: string | undefined;
  zip: string;
  doorCode: string | undefined;
}

export interface Kitchen {
  kitchenId: number;
  kitchenName: string;
  dishes: Dish[];
}

export interface Dish {
  id: number;
  name: string;
  sku: string;
  dishStatus: DishState;
  drink: AddOn[];
  side: AddOn[];
  extra: AddOn[];
  accessory: AddOn[];
  removeIngredients: string[];
  variant: string,
  quantity: number,
  price: number
}

export interface Recipient {
  name: string;
  phoneNumber: string;
  email: String;
}

export interface Meta {
  doorCode:    string;
  phoneNumber: string;
  message:     string;
  notes:       string;
}
