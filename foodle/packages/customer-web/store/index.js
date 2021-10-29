import {
  getCartDataFromCookie,
  getDeliveryDataFromCookie,
  getCustomerDataFromCookie,
  getLocationDataFromCookie,
  getCouponDataFromCookie,
  getSortedCategoryProducts,
  fetchDataFromStore, fetchDataFromStoryblok
} from '~/plugins/global'

export const state = () => ({
  termsAccepted: false,
  settings: {}
})

export const mutations = {
  markTermsAccepted (state) {
    state.termsAccepted = true
  },
  addSettings (state, settings) {
    state.settings = settings
  },
  addSetting (state, setting) {
    state.settings[setting.key] = setting.value
  }
}

export const actions = {
  acceptCookies ({ commit }) {
    return new Promise(function (resolve, reject) {
      localStorage.setItem('terms', true)
      commit('markTermsAccepted')
      resolve(true)
    })
  },
  addSettings (context, settings) {
    context.commit('addSettings', settings)
  },
  addSetting (context, setting) {
    context.commit('addSetting', setting)
  },
  async nuxtServerInit (context, nuxtContext) {
    const version = nuxtContext.query._storyblok || nuxtContext.isDev ? 'draft' : 'published'

    const allBigCommerceData = await fetchDataFromStore()

    const allStoryblokData = await fetchDataFromStoryblok()

    if (allStoryblokData.settings) {
      const settings = {}
      allStoryblokData.settings.data.stories.forEach((setting) => {
        settings[setting.content.key] = setting.content.value
      })
      await context.dispatch('addSettings', settings)
    }

    // await Promise.resolve(
    //   nuxtContext.app.$storyapi.get('cdn/stories/?starts_with=settings', { version })
    // ).then((values) => {
    //   if (values.data.stories) {
    //     const settings = {}
    //     values.data.stories.forEach((setting) => {
    //       settings[setting.content.key] = setting.content.value
    //     })
    //     context.dispatch('addSettings', settings)
    //   }
    // }).catch((err) => {
    //   nuxtContext.error(err)
    // })

    const categories = allBigCommerceData.categories
    // await Promise.all([
    //   nuxtContext.app.$storyapi.get('cdn/stories/?starts_with=menus&resolve_relations=kitchen', { version }),
    //   allBigCommerceData
    // ]).then((values) => {
    //   context.dispatch('cart/setKitchenData', values)
    // }).catch((err) => {
    //   nuxtContext.error(err)
    // })

    await context.dispatch('cart/setKitchenData', [
      allStoryblokData.kitchens,
      allBigCommerceData
    ])

    // Load Addon Data
    const addOns = nuxtContext.$config.addons.split(',').map(i => i.trim())
    addOns.forEach((addOn) => {
      context.dispatch('cart/setAddOnsData', { name: addOn.toLowerCase(), addOns: getSortedCategoryProducts(categories.find((v, i) => v.name === addOn)) })
    })

    if (process.server) {
      const cartData = getCartDataFromCookie(nuxtContext)
      if (cartData) {
        context.commit('cart/setCart', cartData)
      }

      const customerData = getCustomerDataFromCookie(nuxtContext)
      if (customerData) {
        context.commit('cart/updateCustomer', customerData)
      }

      const deliveryData = getDeliveryDataFromCookie(nuxtContext)
      if (deliveryData) {
        context.commit('cart/updateDelivery', deliveryData)
      }

      const locationData = getLocationDataFromCookie(nuxtContext)

      if (locationData) {
        if (typeof locationData.latitude !== 'undefined') {
          context.commit('cart/addLocation', locationData)
        }
      }

      const couponData = getCouponDataFromCookie(nuxtContext)
      if (couponData) { context.commit('cart/updateCoupon', couponData) }
    }
  }
}

export const getters = {
  areTermsAccepted (state) {
    if (state.termsAccepted) {
      return state.termsAccepted
    }
    if (process.client) {
      return localStorage.getItem('terms') !== null
    } else {
      return false
    }
  }
}
