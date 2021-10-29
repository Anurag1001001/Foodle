<template>
  <div>
    <FormBlock>
      <OrderSummary />
    </FormBlock>
    <YourInformation @customerInfoFilled="showPaymentOption = true" />
    <PaymentMethod v-if="showPaymentOption" />
  </div>
</template>

<script>
import OrderSummary from '~/components/sections/checkout/payment/OrderSummary'
import FormBlock from '~/components/elements/FormBlock'
import YourInformation from '~/components/sections/checkout/payment/YourInformation'
import PaymentMethod from '~/components/sections/checkout/payment/PaymentMethod'
export default {
  name: 'Payment',
  components: { PaymentMethod, OrderSummary, FormBlock, YourInformation },
  data () {
    return {
      showPaymentOption: false
    }
  }
}
</script>

<style scoped>

</style>
