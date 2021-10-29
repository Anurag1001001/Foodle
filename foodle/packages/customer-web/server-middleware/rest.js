import axios from 'axios'
import bodyParser from 'body-parser'
import express, { query, response } from 'express'
import { getCartData, getCustomerData, getDeliveryData, getLocationData, getCouponData, getDiscountAmount, getSettingsData } from './functions'
const moment = require('moment')

const COMMERCE_BASE = 'https://api.bigcommerce.com/stores/rrhwqda318'
const FOODLE_BASE = 'https://europe-west1-foodler-kitchen-web.cloudfunctions.net'

const app = express()
const options = {
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Auth-Client': 'foodler-customer-web',
    'X-Auth-Token': process.env.COMMERCE_TOKEN
  }
}

app.use(bodyParser.json())

// Create New Order
app.post('/createOrder', async (req, res) => {
  const cartItems = getCartData(req)

  const deliveryInfo = getDeliveryData(req)

  const customerData = getCustomerData(req)

  const customerDataInfo = JSON.parse(customerData)

  const discountAmount = getDiscountAmount(req)

  const settingsData = getSettingsData(req)

  const netAmount = cartItems.total - (discountAmount ?? 0)

  if (parseFloat(settingsData.min_order_value) > netAmount) {
    res.status(406).send('Order Amount should be > ' + settingsData.min_order_value)
  }
  const locationData = getLocationData(req)

  let shippingCostIncTax = 0
  let shippingCostExTax = 0
  let billingAddress = {}
  if (JSON.parse(deliveryInfo).type === 'Avhämtning') {
    billingAddress = {
      first_name: customerDataInfo.first_name,
      last_name: customerDataInfo.last_name,
      street_1: process.env.STORE_ADDRESS_STREET_1,
      city: process.env.STORE_ADDRESS_CITY,
      state: '',
      zip: process.env.STORE_ADDRESS_ZIP,
      country: process.env.STORE_ADDRESS_COUNTRY,
      country_iso2: process.env.STORE_ADDRESS_COUNTRY_ISO,
      phone: customerDataInfo.phone,
      email: customerDataInfo.email
    }
  } else {
    billingAddress = {
      first_name: customerDataInfo.first_name,
      last_name: customerDataInfo.last_name,
      street_1: locationData.route + (typeof locationData.street_number !== 'undefined' ? ' ' + locationData.street_number : ''),
      city: locationData.administrative_area_level_1,
      state: '',
      zip: locationData.postal_code,
      country: process.env.STORE_ADDRESS_COUNTRY,
      country_iso2: process.env.STORE_ADDRESS_COUNTRY_ISO,
      phone: customerDataInfo.phone,
      email: customerDataInfo.email
    }

    // Only apply shipping if order value is less than minimum order
    if (parseFloat(settingsData.free_shipping_minimum) > netAmount) {
      shippingCostIncTax = parseFloat(settingsData.flat_shipping_amount)
      shippingCostExTax = (parseFloat(settingsData.flat_shipping_amount) * 100) / (100 + parseFloat(settingsData.shipping_tax_rate))
    }
  }

  const products = []
  const productsMeta = []
  cartItems.items.forEach((item) => {
    const product = {}
    product.product_id = item.productId
    product.quantity = item.customizations.selectedItems
    let variant = false
    if (item.customizations.variant !== undefined) {
      product.variant_id = item.customizations.variant.variant_id ?? 0
      if (product.variant_id) {
        variant = item.customizations.variant
      }
    }
    products.push(product)

    const addOns = { }
    Object.keys(item.customizations).forEach((key) => {
      if (key !== 'customize' && key !== 'variant' && key !== 'selectedItems' && key !== 'price') {
        item.customizations[key].forEach((obj) => {
          if (obj.id != null) {
            const addOn = {}
            addOn.product_id = obj.id
            addOn.quantity = 1
            products.push(addOn)
          }
        })
        addOns[key] = item.customizations[key]
        // if (item.customizations[key].id != null) {
        //   const addOn = {}
        //   addOn.product_id = item.customizations[key].id
        //   addOn.quantity = 1
        //   products.push(addOn)
        //   addOns[key] = item.customizations[key]
        // }
      }
    })

    const metaData = {
      id: item.productId,
      sku: item.sku,
      name: item.heading,
      price: item.price,
      removeIngredients: item.customizations.customize.items,
      kitchen: item.kitchen,
      variant,
      quantity: item.customizations.selectedItems
    }
    metaData.addOns = addOns
    productsMeta.push(metaData)
  })

  const orderPayload = JSON.stringify({
    billing_address: billingAddress,
    shipping_addresses: [billingAddress],
    products,
    customer_message: customerDataInfo.message,
    discount_amount: discountAmount,
    shipping_cost_inc_tax: shippingCostIncTax,
    shipping_cost_ex_tax: shippingCostExTax
  })

  const order = await axios.post(COMMERCE_BASE + '/v2/orders', orderPayload, options)
    .catch((err) => {
      console.error(err.response?.data)
      throw new Error('Error creating order')
    })

  if (order) {
    // Create order meta fields
    const metadata = {
      port_code: customerDataInfo.port_code !== undefined && customerDataInfo.port_code !== '' ? customerDataInfo.port_code : '',
      productsMeta,
      delivery: deliveryInfo,
      couponInfo: getCouponData(req),
      location: [
        locationData ? locationData.latitude : 0,
        locationData ? locationData.longitude : 0
      ]
    }

    // console.log('metaInfo', metadata)

    const metaPayload = JSON.stringify({
      permission_set: 'write',
      namespace: 'string',
      key: 'metadata',
      value: JSON.stringify(metadata),
      description: 'string'
    })

    // Post metadata
    await axios.post(COMMERCE_BASE + '/v3/orders/' + order.data.id + '/metafields', metaPayload, options)
      .catch((err) => {
        console.error(err.response?.data)
        throw new Error('Error creating meta fields')
      })
  }

  res.send(order.data)
})

// Get order details
app.get('/order/:id', async (req, res) => {
  const order = await axios.get(COMMERCE_BASE + '/v2/orders/' + req.params.id, options)
    .catch((err) => {
      console.error(err.response?.data)
      throw new Error('Error getting order')
    })
  let metadata = {}
  const finalProducts = []
  if (order) {
    // get Meta fields as well
    const metafields = await axios.get(COMMERCE_BASE + '/v3/orders/' + req.params.id + '/metafields', options)
      .catch((err) => {
        console.error(err.response?.data)
        throw new Error('Error getting meta fields')
      })

    metadata = JSON.parse(metafields.data.data[0].value)
    // Create an array of products here now to show on order summary
    // products.data.data
    metadata.productsMeta.forEach((product) => {
      // console.log(product)
      const productConverted = {
        heading: product.name,
        price: product.price,
        customizations: {}
      }

      if (product.variant) {
        productConverted.customizations.variant = product.variant
      }

      if (product.removeIngredients) {
        productConverted.customizations.customize = {
          items: product.removeIngredients
        }
      }
      if (product.quantity) {
        productConverted.customizations.selectedItems = product.quantity
      }

      Object.keys(product.addOns).forEach((key) => {
        productConverted.customizations[key] = product.addOns[key]
      })

      finalProducts.push(productConverted)
    })
  }

  const orderInfo = {
    orderId: order.data.id,
    customer_info: {
      address: order.data.billing_address,
      port_code: metadata.port_code,
      customer_message: order.data.customer_message
    },
    products: finalProducts,
    amounts: {
      total_amount: parseFloat(order.data.total_inc_tax),
      total_amount_inc_tax: parseFloat(order.data.subtotal_inc_tax),
      shipping_cost_inc_tax: parseFloat(order.data.shipping_cost_inc_tax),
      shipping_cost_ex_tax: parseFloat(order.data.shipping_cost_ex_tax),
      subtotal: parseFloat(order.data.subtotal_ex_tax),
      discount: parseFloat(order.data.discount_amount) + parseFloat(order.data.coupon_discount),
      tax: parseFloat(order.data.total_tax)
    },
    delivery: metadata.delivery ? JSON.parse(metadata.delivery) : { },
    coupon: metadata.couponInfo ? JSON.parse(metadata.couponInfo) : {}
  }

  res.send(orderInfo)
})

app.get('/getBannerTitle', async (req, res) => {
  const bannerTitle = await axios.get(COMMERCE_BASE + '/v2/banners', options)
    .catch((err) => {
      console.error(err.response?.data)
      throw new Error('Error Banner Title')
    })
  let title = ''
  if (bannerTitle.data && bannerTitle.data.length) {
    title = bannerTitle.data[0].content
  }
  return res.send(title)
})

// Get deliverySlots
app.get('/deliverySlots', async (req, res) => {
  const date = req.query.date
  const availableSlots = []
  const deliverySlots = await axios.get(FOODLE_BASE + `/delivery_slots?date=${date}`)
    .catch((err) => {
      console.error(err.response?.data)
      throw new Error('Error getting delivery slots')
    })

  return res.send(deliverySlots.data)
})

app.get('/validateSlot/', async (req, res) => {
  const { date, slot } = req.query
  const result = await axios.get(FOODLE_BASE + `/validate_slot?date=${date}&slot=${slot}`)
    .catch((err) => {
      throw new Error(`${err.response.data}`)
    })
  return res.send(result.data)
})

function generateDeliverySlots () {
  const availableSlots = []
  const slots = ['12:00 – 12:20', '12:20 – 12:40', '12:40 – 13:00', '13:00 – 13:20', '13:20 – 13:40', '13:40 – 14:00', '14:00 – 14:20', '14:20 – 14:40']
  for (let day = 0; day < 5; day++) {
    const currDate = moment().startOf('day').add(day, 'd').format('YYYY-MM-DD')
    for (let slot = 0; slot < 8; slot++) {
      availableSlots.push({
        id: day + '' + slot,
        title: slots[slot],
        icon: 'time.svg',
        disabled: Math.random() >= 0.5,
        date: currDate
      })
    }
  }
  return availableSlots
}

// Get coupon info
app.get('/coupons/:coupon', async (req, res) => {
  const coupons = await axios.get(COMMERCE_BASE + '/v2/coupons?code=' + req.params.coupon, options)
    .catch((err) => {
      console.error(err.response?.data)
      throw new Error('Error getting coupons')
    })

  const coupon = coupons.data.filter((coupon) => {
    return coupon.code === req.params.coupon
  })

  if (coupon.length > 0) {
    res.send(coupon[0])
  } else {
    res.status(404).send('Coupon not found')
  }
})

module.exports = app
