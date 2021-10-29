<template>
  <div class="w-full h-full bg-secondary pb-12">
    <CheckoutHeader>
      KASSA
    </CheckoutHeader>
    <OrderSummaryDetail :order="order" />
  </div>
</template>

<script>
import axios from 'axios'
import CheckoutHeader from '~/components/sections/checkout/CheckoutHeader'
import OrderSummaryDetail from '~/components/sections/checkout/payment/OrderSummaryDetail'
export default {
  name: 'Index',
  components: { CheckoutHeader, OrderSummaryDetail },
  data () {
    return {
      order: {}
    }
  },
  async mounted () {
    this.$store.dispatch('states/setNavbarType', 'default')
    if (this.$store.getters['cart/getSavedOrder']) {
      const orderInfo = await axios.get('/api/order/' + this.$store.getters['cart/getSavedOrder'])
      // Update Cart amount so we know the net amount to pay during payment
      this.order = orderInfo.data
      await this.$store.dispatch('cart/updateCartPayableAmount', this.order.amounts.total_amount)
    } else {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>

</style>
