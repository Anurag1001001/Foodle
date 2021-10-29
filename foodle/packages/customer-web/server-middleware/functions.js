module.exports =
  {
    getUrl,
    getDeliveryData,
    getCustomerData,
    getCartData,
    getLocationData,
    getCouponData,
    getDiscountAmount,
    getPayableAmount,
    getSettingsData
  }
function getUrl (req) {
  return req.protocol + '://' + req.get('host')
}

function getDeliveryData (req) {
  return getCookieValue('delivery', req.headers.cookie)
}

function getCustomerData (req) {
  return getCookieValue('customer', req.headers.cookie)
}

function getCartData (req) {
  // eventually items array would be collection of objects
  const cartItems = { total: 0, items: [] }
  const cookieValue = getCookieValue('cart', req.headers.cookie)
  if (cookieValue) {
    const cartInfo = JSON.parse(cookieValue)
    cartItems.total = cartInfo.total

    // Now we need to run again through all keys to build cart
    cartInfo.items.forEach((cookieKey) => {
      const cookieValue2 = getCookieValue(cookieKey, req.headers.cookie)

      if (cookieValue2) {
        cartItems.items.push(JSON.parse(cookieValue2))
      }
    })
  }

  return cartItems
}

function getLocationData (req) {
  return getCookieValue('location', req.headers.cookie) !== '' ? JSON.parse(getCookieValue('location', req.headers.cookie)) : null
}

function getSettingsData (req) {
  return JSON.parse(getCookieValue('settings', req.headers.cookie))
}

function getCookieValue (key, cookie) {
  const decodedCookie = decodeURIComponent(cookie)
  const fullKey = key + '='
  let cookieValue = ''
  const ca = decodedCookie.split(';')
  for (let c of ca) {
    while (c.charAt(0) === ' ') {
      c = c.substring(1)
    }
    if (c.indexOf(fullKey) === 0) {
      cookieValue = c.substring(fullKey.length, c.length)
      break
    }
  }

  return cookieValue
}

function getCouponData (req) {
  return getCookieValue('coupon', req.headers.cookie)
}

function isCouponValid (coupon, totalAmount) {
  let isValid = false

  if (coupon !== null) {
    if (coupon.enabled) {
      let isExpired = false
      if (coupon.expires !== '') {
        const expiringAt = new Date(coupon.expires).getTime() / 1000
        const currentTimestamp = new Date().getTime() / 1000

        if (expiringAt < currentTimestamp) {
          isExpired = true
        }
      }

      if (totalAmount >= coupon.min_purchase && !isExpired) {
        isValid = true
      }
    }
  }

  return isValid
}

function getDiscountAmount (req) {
  let discountAmount = 0
  // Check if coupon is valid
  const couponData = getCouponData(req)
  if (couponData !== '') {
    const couponDataObject = JSON.parse(couponData)

    if (isCouponValid(couponDataObject, getCartData(req).total)) {
      switch (couponDataObject.type) {
        case 'per_total_discount':
          discountAmount = couponDataObject.amount
          break
        case 'percentage_discount':
          discountAmount = (getCartData(req).total * couponDataObject.amount / 100).toFixed(2)
          break
      }
    }
    return discountAmount
  }
}

function getPayableAmount (req) {
  return getCookieValue('payableAmount', req.headers.cookie)
}
