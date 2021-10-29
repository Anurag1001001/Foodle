import axios from 'axios'
import Cookies from 'js-cookie'

export default {
  data () {
    return {
      loading: false
    }
  },
  computed: {
    isHomePage () {
      return this.$route.path === '/'
    },
    moduleTypes () {
      return {
        grid: 'grid',
        list: 'list'
      }
    },
    itemInCart () {
      return this.$store.state.cart.cart.items.length !== 0
    },
    addOnList () {
      return this.$config.addons.split(',').map(i => i.trim())
    },
    location () {
      return this.$store.state.cart.location
    },
    serviceable () {
      return this.$store.state.cart.serviceable
    },
    coupon () {
      return this.$store.state.cart.coupon
    },
    couponText () {
      if (this.coupon === null) {
        return 'Ogiltig kupongkod'
      }

      if (this.coupon.type === 'percentage_discount') {
        return parseInt(this.coupon.amount) + '%'
      }

      if (this.coupon.type === 'per_total_discount') {
        return this.formatAmount(this.coupon.amount)
      }

      return ''
    },
    discountedAmount () {
      return this.$store.state.cart.cart.total - (this.$store.state.cart.cart.total > this.discountAmount ? this.discountAmount : 0)
    },
    discountAmount () {
      const coupon = this.$store.state.cart.coupon
      let discount = 0
      if (coupon !== null && this.$store.state.cart.cart.total > 0) {
        if (coupon.type === 'percentage_discount') {
          discount = (this.$store.state.cart.cart.total * coupon.amount / 100).toFixed(2)
        }

        if (coupon.type === 'per_total_discount') {
          discount = coupon.amount
        }
      }

      return discount
    },
    cartDetails () {
      return this.$store.state.cart.cart
    },
    trueValue () {
      return true
    },
    falseValue () {
      return false
    },
    today () {
      return (new Date())
    },
    delivery () {
      return this.$store.state.cart.delivery
    },
    kitchenList () {
      return this.$store.state.cart.kitchens
    },
    minimumCartValueForFreeShipping () {
      return this.$store.state.settings.free_shipping_minimum ? parseFloat(this.$store.state.settings.free_shipping_minimum) : 350
    },
    minimumCartValueForFreeShippingFormatted () {
      return this.formatAmount(this.minimumCartValueForFreeShipping)
    },
    minimumCartAmount () {
      return this.$store.state.settings.min_order_value ? parseFloat(this.$store.state.settings.min_order_value) : 140
    },
    minimumCartAmountFormatted () {
      return this.formatAmount(this.minimumCartAmount)
    },
    isOverMinimumCartAmount () {
      return this.discountedAmount >= this.minimumCartAmount
    },
    shippingAmount () {
      return (this.$store.state.cart.delivery.type === this.deliveryTypePickup || this.discountedAmount >= this.minimumCartValueForFreeShipping || this.discountedAmount === 0) ? 0 : parseFloat(this.$store.state.settings.flat_shipping_amount)
    },
    shippingAmountFormatted () {
      return this.formatAmount(this.shippingAmount)
    },
    deliveryTypePickup () {
      return this.$t('keys.delivery_types.pickup')
    },
    deliveryTypeDelivery () {
      return this.$t('keys.delivery_types.delivery')
    }
  },
  methods: {
    increaseItemCount (index, item) {
      let selectedItems = this.cartDetails.items[index].customizations.selectedItems
      selectedItems += 1
      item.customizations.selectedItems = selectedItems
      item.price = item.customizations.price * selectedItems
      this.$store.dispatch('cart/updateItemFromCart', { index, item })
    },
    decreaseItemCount (index, item) {
      let selectedItems = this.cartDetails.items[index].customizations.selectedItems
      selectedItems -= 1
      item.customizations.selectedItems = selectedItems
      item.price = item.customizations.price * selectedItems
      this.$store.dispatch('cart/updateItemFromCart', { index, item })
    },
    isCouponValid (coupon) {
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
          if (this.$store.state.cart.cart.total >= coupon.min_purchase && !isExpired) {
            isValid = true
          }
        }
      }

      return isValid
    },
    formatAmount (amount, fractionDigits = 2) {
      return new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK', maximumFractionDigits: fractionDigits }).format(amount)
    },
    goToDeliveryPage () {
      this.$router.push('/checkout/delivery')
    },
    gotToKassaPage () {
      this.$router.push('/checkout/kassa')
    },
    removeItemFromCart (index, item) {
      this.$store.dispatch('cart/removeItemFromCart', { index, item })
    },
    goToKitchen (slug) {
      this.$router.push('/menys/' + slug)
    },
    async gotToCheckout () {
      this.loading = true
      this.$store.dispatch('states/setNavbarType', 'default')
      this.addSettingsToCookies()
      const orderInfo = await axios.post('/api/createOrder')
        .catch((err) => {
          console.log(err)
        })
      if (orderInfo) {
        await this.$store.dispatch('cart/updateOrder', orderInfo.data)
        this.loading = false
        this.$router.push('/checkout/order')
      }
    },
    addSettingsToCookies () {
      Cookies.set('settings', JSON.stringify(this.$store.state.settings))
    },
    gotToCheckoutComplete () {
      this.$router.push('/checkout/complete')
    },
    gotToHomePage () {
      this.$router.push('/')
    },
    async getDeliverySlots (date) {
      return await axios.get('/api/deliverySlots/', { params: { date } })
    },
    async validateSlot (date, slot) {
      return (await axios.get('/api/validateSlot/', { params: { date, slot } })).data
    },
    async getBannerTitle () {
      return await axios.get('/api/getBannerTitle')
    },
    goToUrl (url) {
      this.$router.push(url)
    },
    async getIngredientData (ingredients) {
      const context = this.$nuxt.context

      // Check if we are in the editor mode
      const version = context.query._storyblok || context.isDev ? 'draft' : 'published'
      const ingredientList = []

      // Load the JSON from the API
      await context.app.$storyapi.get('cdn/stories/', {
        version,
        by_uuids: ingredients.join()
      }).then((res) => {
        res.data.stories.forEach((ingredient) => {
          ingredientList.push({
            name: ingredient.content.display_name,
            id: ingredient.content.id,
            selectedValue: ingredient.content.selectedValue,
            removedValue: ingredient.content.removedValue
          })
        })
      })
      return ingredientList
    },
    addDays (baseDate, dayCount) {
      return baseDate.setDate(baseDate.getDate() + dayCount)
    },
    async isHomeDelivery (postalCode) {
      return await axios.get(`/api/serviceableArea/addBounds?postal=${postalCode}`)
    }
  }
}
