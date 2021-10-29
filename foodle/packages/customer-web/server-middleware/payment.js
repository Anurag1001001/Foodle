import { getCartData, getCustomerData, getDeliveryData, getUrl, getPayableAmount } from './functions'

const express = require('express')
const dotenv = require('dotenv')
const { v4: uuid } = require('uuid')
const { Client, Config, CheckoutAPI } = require('@adyen/api-library')

// init app
const app = express()
// Parse JSON bodies
app.use(express.json())
// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }))

// Import and set Nuxt.js options
const nuxtConfig = require('../nuxt.config.js')
nuxtConfig.dev = process.env.NODE_ENV !== 'production'

// Enables environment variables by parsing the .env file and assigning it to process.env
dotenv.config({
  path: './.env'
})

// Adyen Node.js API library boilerplate (configuration, etc.)
// const config = new Config()
// config.apiKey = process.env.ADYEN_API_KEY
// config.environment = process.env.ADYEN_ENVIRONMENT
// config.liveEndpointUrlPrefix = process.env.ADYEN_LIVE_URL_LINK
// config.merchantAccount = process.env.ADYEN_MERCHANT_ACCOUNT
const client = new Client({ apiKey: process.env.ADYEN_API_KEY, environment: process.env.ADYEN_ENVIRONMENT })
client.setEnvironment(process.env.ADYEN_ENVIRONMENT, process.env.ADYEN_LIVE_URL_LINK)
const checkout = new CheckoutAPI(client)

// A temporary store to keep payment data to be sent in additional payment details and redirects.
// This is more secure than a cookie. In a real application, this should be in a database.
const paymentDataStore = {}

/* ################# API ENDPOINTS ###################### */

// Get payment methods
app.post('/getPaymentMethods', async (req, res) => {
  try {
    const response = await checkout.paymentMethods({
      channel: 'Web',
      merchantAccount: process.env.ADYEN_MERCHANT_ACCOUNT
    })
    res.json({ response, clientKey: process.env.ADYEN_CLIENT_KEY })
  } catch (err) {
    console.error(`Error: ${err.message}, error code: ${err.errorCode}`)
    res.status(err.statusCode).json(err.message)
  }
})

// Submitting a payment
app.post('/initiatePayment', async (req, res) => {
  const { total, items } = getCartData(req)
  const payableAmount = getPayableAmount(req)
  const { first_name: firstName, last_name: lastName, phone, email, port_code: portCode } = getCustomerData(req)
  const { type, date, startTime, endTime } = getDeliveryData(req)
  const currency = 'SEK'

  // find shopper IP from request
  const shopperIP =
    req.headers['x-forwarded-for'] || req.connection.remoteAddress
  try {
    // unique ref for the transaction
    const orderRef = req.query.ord
    // Ideally the data passed here should be computed based on business logic
    const payload = {
      amount: { currency, value: payableAmount * 100 },
      reference: orderRef, // required
      merchantAccount: process.env.ADYEN_MERCHANT_ACCOUNT, // required
      // merchantOrderReference: orderRef,
      // orderReference: orderRef,
      channel: 'Web', // required
      additionalData: {
        // required for 3ds2 native flow
        allow3DS2: true
      },
      origin: getUrl(req), // required for 3ds2 native flow
      browserInfo: req.body.browserInfo, // required for 3ds2
      shopperIP, // required by some issuers for 3ds2
      // we pass the orderRef in return URL to get paymentData during redirects
      returnUrl: `${getUrl(req)}/api/payments/handleShopperRedirect?orderRef=${orderRef}`, // required for 3ds2 redirect flow
      // special handling for boleto
      paymentMethod: req.body.paymentMethod,
      // Below fields are required for Boleto:
      // shopperName: firstName + ' ' + lastName,
      // Below fields are required for Klarna:
      countryCode: 'SE',
      shopperReference: email,
      shopperEmail: email,
      shopperLocale: 'sv_SE'
    }

    const response = await checkout.payments(payload)

    const { action } = response

    if (action) {
      paymentDataStore[orderRef] = action.paymentData
    }
    res.json(response)
  } catch (err) {
    console.error(`Error: ${err.message}, error code: ${err.errorCode}`)
    console.error(`Error Details: ${JSON.stringify(err)}`)
    res.status(err.statusCode).json(err.message)
  }
})

app.post('/submitAdditionalDetails', async (req, res) => {
  // Create the payload for submitting payment details
  const payload = {
    details: req.body.details,
    paymentData: req.body.paymentData
  }

  try {
    // Return the response back to client
    // (for further action handling or presenting result to shopper)
    const response = await checkout.paymentsDetails(payload)

    res.json(response)
  } catch (err) {
    console.error(`Error: ${err.message}, error code: ${err.errorCode}`)
    res.status(err.statusCode).json(err.message)
  }
})

// Handle all redirects from payment type
app.all('/handleShopperRedirect', async (req, res) => {
  // Create the payload for submitting payment details
  const orderRef = req.query.orderRef
  const redirect = req.method === 'GET' ? req.query : req.body
  const details = {}
  if (redirect.payload) {
    details.payload = redirect.payload
  } else if (redirect.redirectResult) {
    details.redirectResult = redirect.redirectResult
  } else {
    details.MD = redirect.MD
    details.PaRes = redirect.PaRes
  }

  const payload = {
    details,
    paymentData: paymentDataStore[orderRef]
  }
  try {
    const response = await checkout.paymentsDetails(payload)
    // Conditionally handle different result codes for the shopper
    res.redirect(`/checkout/complete?oid=${orderRef}&status=${response.resultCode}`)
  } catch (err) {
    console.error(`Error: ${err.message}, error code: ${err.errorCode}`)
    res.redirect('/result/error')
  }
})

/* ################# end API ENDPOINTS ###################### */

module.exports = app
