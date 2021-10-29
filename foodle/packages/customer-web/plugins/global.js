import Vue from 'vue'
import axios from 'axios'
import Global from '~/mixins/global.js'

Vue.mixin(Global)

export function getCartDataFromCookie (context) {
  if (process.server && context.req != null) {
    const { req } = context

    const cartItemKeys = getCookieValue('cart', req.headers.cookie)

    if (cartItemKeys) {
      const cartInfo = JSON.parse(cartItemKeys)

      const cartItems = { total: cartInfo.total, items: [] }
      // Now we need to run again through all keys to build cart
      cartInfo.items.forEach((cookieKey) => {
        const itemCookie = getCookieValue(cookieKey, req.headers.cookie)
        if (itemCookie) {
          cartItems.items.push(JSON.parse(itemCookie))
        }
      })

      return cartItems
    }
  }
}

export function getCustomerDataFromCookie (context) {
  if (process.server && context.req != null) {
    const { req } = context

    const customerData = getCookieValue('customer', req.headers.cookie)

    if (customerData) {
      return JSON.parse(customerData)
    } else {
      return {}
    }
  }
}

export function getDeliveryDataFromCookie (context) {
  if (process.server && context.req != null) {
    const { req } = context

    const deliveryData = getCookieValue('delivery', req.headers.cookie)

    if (deliveryData) {
      return JSON.parse(deliveryData)
    } else {
      return {}
    }
  }
}

export function getLocationDataFromCookie (context) {
  if (process.server && context.req != null) {
    const { req } = context

    const locationData = getCookieValue('location', req.headers.cookie)

    if (locationData) {
      return JSON.parse(locationData)
    } else {
      return {}
    }
  }
}

export function getCookieValue (key, cookie) {
  const fullKey = key + '='
  const decodedCookie = decodeURIComponent(cookie)
  let data = ''
  const ca = decodedCookie.split('; ')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') {
      c = c.substring(1)
    }
    if (c.indexOf(fullKey) === 0) {
      data = c.substring(fullKey.length, c.length)
      break
    }
  }

  return data
}

export function getCouponDataFromCookie (context) {
  if (process.server && context.req != null) {
    const { req } = context

    const deliveryData = getCookieValue('coupon', req.headers.cookie)

    if (deliveryData) {
      return JSON.parse(deliveryData)
    } else {
      return null
    }
  }
}

export function getSortedCategoryProducts (category) {
  return category.products
}

// export async function fetchDataFromStore () {
//   const COMMERCE_BASE = 'https://api.bigcommerce.com/stores/rrhwqda318'
//
//   const bigcommerce = axios.create({
//     baseURL: COMMERCE_BASE,
//     timeout: 5000,
//     headers: {
//       Accept: 'application/json',
//       'Content-Type': 'application/json',
//       'X-Auth-Token': process.env.COMMERCE_TOKEN
//     }
//   })
//
//   const allProducts = await bigcommerce.get('/v3/catalog/products', {
//     params: {
//       limit: 500,
//       include_fields: 'name,description,price,categories,sku,brand_id,availability,sort_order',
//       include: 'variants,custom_fields,images',
//       sort: 'price',
//       is_visible: true
//     }
//   })
//
//   allProducts.data.data.sort((a, b) => {
//     return a.sort_order - b.sort_order
//   })
//
//   const allBrands = await bigcommerce.get('/v3/catalog/brands')
//
//   const allCategories = await bigcommerce.get('/v3/catalog/categories', { params: { include_fields: 'name,parent_id,description' } })
//   const products = allProducts.data.data
//   const brands = allBrands.data.data
//   const categories = allCategories.data.data
//
//   products.forEach((product) => {
//     // First check if the product is a Brand specific product
//     if (product.brand_id) {
//       const brandIndex = brands.findIndex(brand => brand.id === product.brand_id)
//       const productCategory = categories.find(category => category.id === product.categories[0])
//       if (productCategory) {
//         const categoryName = productCategory.name.toLowerCase()
//         if (!('products' in brands[brandIndex])) {
//           brands[brandIndex].products = {}
//         }
//         if (!(categoryName in brands[brandIndex].products)) {
//           brands[brandIndex].products[categoryName] = []
//         }
//         brands[brandIndex].products[categoryName].push(product)
//       }
//     } else if (product.categories.length) {
//       // This is not a Brand specific product. Add to Global list
//       product.categories.forEach((productCategory) => {
//         const index = categories.findIndex(node => node.id === productCategory)
//         if (index !== -1) {
//           if (!('products' in categories[index])) {
//             categories[index].products = []
//           }
//           categories[index].products.push(product)
//         }
//       })
//     }
//   })
//   return {
//     brands,
//     categories
//   }
// }

export async function fetchDataFromStore () {
  const response = await axios.get(process.env.BACKEND_BASE + '/getAllProductData')
  return response.data
}

export async function fetchDataFromStoryblok () {
  const response = await axios.get(process.env.BACKEND_BASE + '/getAllStoryblokData')
  return response.data
}
