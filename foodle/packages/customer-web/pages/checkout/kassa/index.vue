<template>
  <div class="w-full h-full bg-secondary pb-12">
    <CheckoutHeader>KASSA</CheckoutHeader>
    <Payment />
  </div>
</template>

<script>
import CheckoutHeader from '~/components/sections/checkout/CheckoutHeader'
import Payment from '~/components/sections/checkout/payment/Payment'
export default {
  name: 'Kassa',
  components: { Payment, CheckoutHeader },
  mounted () {
    this.$store.dispatch('states/setNavbarType', 'default')
  }
}
</script>

<style scoped>

</style>
