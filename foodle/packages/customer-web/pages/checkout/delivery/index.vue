<template>
  <div class="w-full h-full bg-secondary pb-12">
    <CheckoutHeader>
      LEVERANSUPPGIFTER
    </CheckoutHeader>
    <Delivery />
  </div>
</template>

<script>
import CheckoutHeader from '~/components/sections/checkout/CheckoutHeader'
import Delivery from '~/components/sections/checkout/delivery/Delivery'
export default {
  name: 'Index',
  components: { CheckoutHeader, Delivery },
  mounted () {
    this.$store.dispatch('states/setNavbarType', 'default')
  }
}
</script>

<style scoped>

</style>
