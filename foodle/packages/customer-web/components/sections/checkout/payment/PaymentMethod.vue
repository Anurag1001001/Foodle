<template>
  <FormBlock>
    <template #header>
      <div class="text-2xl font-bold float-left">
        2. Välj betalsätt
      </div>
    </template>

    <div class="mt-16">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-12">
        <FormRadioButton
          v-for="(paymentModeItem, index) in paymentModes"
          :id="paymentModeItem.id"
          :key="index"
          :value="paymentMode"
          name="mode_of_delivery"
          :icon="paymentModeItem.icon"
          @change="changePaymentMode"
        >
          {{ paymentModeItem.title }}
        </FormRadioButton>
      </div>
    </div>
    <div class="mt-16">
      <div class="grid justify-center">
        <CtaButton type="white-background-with-border" name="makePayment" :enabled="!loading" @clicked="gotToCheckout">
          <span v-if="!loading">Till betalning</span>
          <span v-else>Skickar beställning</span>
        </CtaButton>
      </div>
    </div>
  </FormBlock>
</template>

<script>
import FormBlock from '~/components/elements/FormBlock'
import FormRadioButton from '~/components/elements/FormRadioButton'
import CtaButton from '~/components/elements/CtaButton'
export default {
  name: 'PaymentMethod',
  components: { CtaButton, FormRadioButton, FormBlock },
  data () {
    return {
      paymentModes: [
        { id: 'swish', title: 'Betala med Swish', icon: 'date.svg' },
        { id: 'card', title: 'Betala med kort', icon: 'cart.svg' }
      ],
      paymentMode: 'swish'
    }
  },
  methods: {
    changePaymentMode (newValue) {
      this.paymentMode = newValue
    }
  }
}
</script>

<style scoped>

</style>
