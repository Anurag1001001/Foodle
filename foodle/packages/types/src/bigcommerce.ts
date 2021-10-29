export enum BigCommerceOrderStatus {
  PENDING = 1,
  INCOMPLETE = 0,
  SHIPPED = 2,
  AWAITING_PICKUP = 8,
  AWAITING_SHIPMENT = 9,
  COMPLETED = 10,
  AWAITING_FULFILLMENT = 11,
  CANCELLED = 5,
  REFUNDED = 4,
}

export interface BigCommerceWebhook {
  scope: string;
  store_id: string;
  data: Data;
  hash: string;
  created_at: number;
  producer: string;
}

export interface Data {
  type: string;
  id: number;
  status?: DataStatus;
}

export interface DataStatus {
  previous_status_id: number;
  new_status_id: number;
}

export interface Order {
  id: number;
  customer_id: number;
  date_created: string;
  date_modified: string;
  date_shipped: string;
  status_id: number;
  status: string;
  subtotal_ex_tax: string;
  subtotal_inc_tax: string;
  subtotal_tax: string;
  base_shipping_cost: string;
  shipping_cost_ex_tax: string;
  shipping_cost_inc_tax: string;
  shipping_cost_tax: string;
  shipping_cost_tax_class_id: number;
  base_handling_cost: string;
  handling_cost_ex_tax: string;
  handling_cost_inc_tax: string;
  handling_cost_tax: string;
  handling_cost_tax_class_id: number;
  base_wrapping_cost: string;
  wrapping_cost_ex_tax: string;
  wrapping_cost_inc_tax: string;
  wrapping_cost_tax: string;
  wrapping_cost_tax_class_id: number;
  total_ex_tax: string;
  total_inc_tax: string;
  total_tax: string;
  items_total: number;
  items_shipped: number;
  payment_method: string;
  payment_provider_id: string;
  payment_status: string;
  refunded_amount: string;
  order_is_digital: boolean;
  store_credit_amount: string;
  gift_certificate_amount: string;
  ip_address: string;
  geoip_country: string;
  geoip_country_iso2: string;
  currency_id: number;
  currency_code: string;
  currency_exchange_rate: string;
  default_currency_id: number;
  default_currency_code: string;
  staff_notes: string;
  customer_message: string;
  discount_amount: string;
  coupon_discount: string;
  shipping_address_count: number;
  is_deleted: boolean;
  ebay_order_id: string;
  cart_id: string;
  billing_address: BillingAddress;
  is_email_opt_in: boolean;
  credit_card_type: null;
  order_source: string;
  channel_id: number;
  external_source: null;
  products: Resource;
  shipping_addresses: Resource | ShippingAddress[];
  coupons: Resource;
  external_id: null;
  external_merchant_id: null;
  tax_provider_id: string;
  store_default_currency_code: string;
  store_default_to_transactional_exchange_rate: string;
  custom_status: string;
  customer_locale: string;
}

export interface BillingAddress {
  first_name: string;
  last_name: string;
  company: string;
  street_1: string;
  street_2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  country_iso2: string;
  phone: string;
  email: string;
  form_fields: FormField[];
}

export interface FormField {
  name: string;
  value: string;
}

export interface Resource {
  url: string;
  resource: string;
}

export interface Product {
  data: ProductData;
  meta: any;
}

export interface ProductData {
  availability: string;
  availability_description: string;
  base_variant_id: number;
  bin_picking_number: string;
  brand_id: number;
  calculated_price: number;
  categories: number[];
  condition: string;
  cost_price: number;
  custom_url: CustomURL;
  date_created: Date;
  date_modified: Date;
  depth: number;
  description: string;
  fixed_cost_shipping_price: number;
  gift_wrapping_options_list: any[];
  gift_wrapping_options_type: string;
  gtin: string;
  height: number;
  id: number;
  inventory_level: number;
  inventory_tracking: string;
  inventory_warning_level: number;
  is_condition_shown: boolean;
  is_featured: boolean;
  is_free_shipping: boolean;
  is_preorder_only: boolean;
  is_price_hidden: boolean;
  is_visible: boolean;
  layout_file: string;
  map_price: number;
  meta_description: string;
  meta_keywords: any[];
  mpn: string;
  name: string;
  open_graph_description: string;
  open_graph_title: string;
  open_graph_type: string;
  open_graph_use_image: boolean;
  open_graph_use_meta_description: boolean;
  open_graph_use_product_name: boolean;
  option_set_display: string;
  option_set_id: number;
  order_quantity_maximum: number;
  order_quantity_minimum: number;
  page_title: string;
  preorder_message: string;
  preorder_release_date: Date;
  price: number;
  price_hidden_label: string;
  product_tax_code: string;
  related_products: number[];
  retail_price: number;
  reviews_count: number;
  reviews_rating_sum: number;
  sale_price: number;
  search_keywords: string;
  sku: string;
  sort_order: number;
  tax_class_id: number;
  total_sold: number;
  type: string;
  upc: string;
  view_count: number;
  warranty: string;
  weight: number;
  width: number;
}

export interface CustomURL {
  is_customized: boolean;
  url: string;
}

export interface ShippingAddress {
  id: number;
  order_id: number;
  first_name: string;
  last_name: string;
  company: string;
  street_1: string;
  street_2: string;
  city: string;
  zip: string;
  country: string;
  country_iso2: string;
  state: string;
  email: string;
  phone: string;
  items_total: number;
  items_shipped: number;
  shipping_method: string;
  base_cost: string;
  cost_ex_tax: string;
  cost_inc_tax: string;
  cost_tax: string;
  cost_tax_class_id: number;
  base_handling_cost: string;
  handling_cost_ex_tax: string;
  handling_cost_inc_tax: string;
  handling_cost_tax: string;
  handling_cost_tax_class_id: number;
  shipping_zone_id: number;
  shipping_zone_name: string;
  shipping_quotes: Resource;
  form_fields: any[];
}

export interface Metafields {
  data: Metafield[];
  meta: Meta;
}

export interface Metafield {
  id: number;
  key: string;
  value: string;
  namespace: string;
  permission_set: string;
  resource_type: string;
  resource_id: number;
  description: string;
  date_created: Date;
  date_modified: Date;
}

export interface Meta {
  pagination: Pagination;
}

export interface Pagination {
  total: number;
  count: number;
  per_page: number;
  current_page: number;
  total_pages: number;
  links: Links;
}

export interface Links {
  current: string;
}

export interface OrderMeta {
  port_code: string;
  productsMeta: ProductMeta[];
  delivery: string;
  location?: Array<number>;
  couponInfo?: string;
}

export interface CouponInfo {
  id:         number;
  name:       string;
  type:       string;
  amount:     string;
  min_purchase:     string;
  expires:     string;
  enabled:     boolean;
  code:     string;
  num_uses:     number;
  max_uses:     number;
  max_uses_per_customer:     number;
}

export interface DeliveryMeta {
  type:      DeliveryType;
  date:      number;
  startTime: string;
  endTime:   string;
}

export enum DeliveryType {
  HOME_DELIVERY = "Hemleverans",
  PICKUP = "Avhämtning",
}

export interface ProductMeta {
  id: number;
  sku: string;
  name: string;
  price: number;
  removeIngredients: string[];
  addOns: Map<string, AddOn[] | AddOn>;
  variant: Variant;
  kitchen: string;
  quantity? : number
}

export interface Variant {
  product_id: number;
  sku_id: number;
  variant_id: number;
  price: number;
  options: Array<VariantOptions>;
}

export interface VariantOptions {
  label: string;
  id: number
}

export interface AddOn {
  id: number;
  name: string;
  price: number;
  sku: string;
  quantity?: number
}

export interface Drink {
  id: number;
  name: string;
  price: number;
  sku: string;
}

export interface Kitchen {
  name: string;
  brandId: number;
  storyId: number;
  storyUuid: string;
}
