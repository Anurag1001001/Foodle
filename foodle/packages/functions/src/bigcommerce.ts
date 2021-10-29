import axios, {AxiosResponse} from "axios";
import * as functions from "firebase-functions";
import {Metafields, Order, Product, ShippingAddress} from "@foodleab/types/lib/bigcommerce";
import {PaymentMeta} from "./adyen";
const NodeCache = require( "node-cache" );

const myCache = new NodeCache( { checkperiod: 120, useClones: true } );
const cacheKey = 'BigCommerceData'

const storeHash = functions.config().big_commerce.store_hash

const bigcommerce = axios.create({
  baseURL: `https://api.bigcommerce.com/stores/${storeHash}`,
  timeout: 15000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Auth-Token": functions.config().big_commerce.auth_token,
  }
});

export async function fetchProduct(productId: number): Promise<AxiosResponse<Product>> {
  return bigcommerce.get(`/v3/catalog/products/${productId}`);
}

export async function fetchOrder(orderId: number): Promise<AxiosResponse<Order>> {
  return bigcommerce.get(`/v2/orders/${orderId}`);
}

export async function fetchOrderMetafields(orderId: number, key: string): Promise<AxiosResponse<Metafields>> {
  return bigcommerce.get(`/v3/orders/${orderId}/metafields`, {params: {key}});
}

export async function fetchShippingAddresses(orderId: number): Promise<AxiosResponse<ShippingAddress[]>> {
  return bigcommerce.get(`/v2/orders/${orderId}/shipping_addresses`);
}

export async function updatePaymentInfo(orderId: number, paymentInfo: PaymentMeta): Promise<AxiosResponse<Order>> {
  const paymentPayload = {
    permission_set: 'write',
    namespace: 'string',
    key: 'payment',
    value: JSON.stringify(paymentInfo),
    description: 'string'
  }
  return bigcommerce.post(`https://api.bigcommerce.com/stores/${storeHash}/v3/orders/${orderId}/metafields`, paymentPayload);
}

export async function updateOrderStatusOnBigcommerce(orderId: number, statusId: number): Promise<AxiosResponse<Order>> {
  return bigcommerce.put(`/v2/orders/${orderId}`, { 'status_id': statusId });
}

export async function disableCouponOnBigcommerce(couponId: number): Promise<AxiosResponse<void>> {
  console.log('Disabling Coupon')
  return bigcommerce.put(`/v2/coupons/${couponId}`, { 'enabled': false });
}

export async function getBigCommerceData(): Promise<any> {
  let response = {}

  if (myCache.get(cacheKey)) {
    response = myCache.get(cacheKey)
  } else {
    const allProducts = await bigcommerce.get('/v3/catalog/products', {
      params: {
        limit: 500,
        include_fields: 'name,description,price,categories,sku,brand_id,availability,sort_order',
        include: 'variants,custom_fields,images',
        sort: 'price',
        is_visible: true
      }
    })

    allProducts.data.data.sort((a, b) => {
      return a.sort_order - b.sort_order
    })

    const allBrands = await bigcommerce.get('/v3/catalog/brands')

    const allCategories = await bigcommerce.get('/v3/catalog/categories', { params: { include_fields: 'name,parent_id,description' } })
    const products = allProducts.data.data
    const brands = allBrands.data.data
    const categories = allCategories.data.data

    products.forEach((product) => {
      // First check if the product is a Brand specific product
      if (product.brand_id) {
        const brandIndex = brands.findIndex(brand => brand.id === product.brand_id)
        const productCategory = categories.find(category => category.id === product.categories[0])
        if (productCategory) {
          const categoryName = productCategory.name.toLowerCase()
          if (!('products' in brands[brandIndex])) {
            brands[brandIndex].products = {}
          }
          if (!(categoryName in brands[brandIndex].products)) {
            brands[brandIndex].products[categoryName] = []
          }
          brands[brandIndex].products[categoryName].push(product)
        }
      } else if (product.categories.length) {
        // This is not a Brand specific product. Add to Global list
        product.categories.forEach((productCategory) => {
          const index = categories.findIndex(node => node.id === productCategory)
          if (index !== -1) {
            if (!('products' in categories[index])) {
              categories[index].products = []
            }
            categories[index].products.push(product)
          }
        })
      }
    })
    response = {
      brands,
      categories
    }
    // Save data in cache
    myCache.set(cacheKey, response)
  }

  return new Promise((resolve, _) => resolve(response))
}

export async function clearBigCommerceCache(): Promise<boolean> {
  console.log(await myCache.del(cacheKey), ' deleted')
  return new Promise((resolve, _) => resolve(true))
}
