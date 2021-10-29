<template>
  <div class="w-full h-full bg-secondary pb-12">
    <CheckoutHeader>
      Betalning
    </CheckoutHeader>
    <FormBlock size="sm">
      <div class="vld-parent">
        <loading
          :active="isLoading"
          :can-cancel="falseValue"
          :is-full-page="falseValue"
          :color="color"
          :loader="loader"
          z-index="9999"
          :background-color="bgColor"
        />
        <div class="payment-container py-10">
          <div ref="dropin" class="payment" />
        </div>
        <SlotUnavailable v-if="!slotAvailable" v-model="message" />
      </div>
    </FormBlock>
  </div>
</template>

<script>
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import AdyenCheckout from '@adyen/adyen-web'
import CheckoutHeader from '~/components/sections/checkout/CheckoutHeader'
import FormBlock from '~/components/elements/FormBlock'
import SlotUnavailable from '~/components/elements/SlotUnavailable.vue'

export default {
  name: 'PaymentPage',
  components: { SlotUnavailable, CheckoutHeader, FormBlock, Loading },
  data () {
    return {
      isLoading: false,
      loader: 'dots',
      color: '#313336',
      bgColor: 'rgb(229,229,229)',
      slotAvailable: true,
      message: this.$t('labels.common.messages.slot_unavailable')
    }
  },
  async mounted () {
    this.$store.dispatch('states/setNavbarType', 'default')
    await initCheckout(this)
  }
}

// Event handlers called when the shopper selects the pay button,
// or when additional information is required to complete the payment
async function handleSubmission (state, component, ref, url) {
  try {
    const res = await callServer(url, state.data)
    handleServerResponse(res, component, ref)
  } catch (error) {
    // alert('Error occurred. Look at console for details')
  }
}

// Calls your server endpoints
async function callServer (url, data) {
  const res = await fetch(url, {
    method: 'POST',
    body: data ? JSON.stringify(data) : '',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return await res.json()
}

// Handles responses sent from your server to the client
function handleServerResponse (res, component, ref) {
  if (res.action) {
    component.handleAction(res.action)
  } else {
    ref.$router.replace(ref.localeRoute({ name: 'checkout-complete', params: { oid: res.merchantReference, status: res.resultCode } }))
  }
}

function filterUnimplemented (pm) {
  // return pm
  pm.paymentMethods = pm.paymentMethods.filter(it =>
    [
      'scheme',
      'swish'
      // 'scheme',
      // 'ideal',
      // 'dotpay',
      // 'giropay',
      // 'sepadirectdebit',
      // 'directEbanking',
      // 'ach',
      // 'alipay',
      // 'klarna_paynow',
      // 'klarna'
      // 'klarna_account',
      // 'boletobancario_santander'
    ].includes(it.type)
  )
  return pm
}

async function initCheckout (ref) {
  try {
    const orderNo = localStorage.getItem('order')
    const cartTotal = (ref.discountedAmount) * 100
    const { response, clientKey } = await callServer('/api/payments/getPaymentMethods')
    const configuration = {
      paymentMethodsResponse: filterUnimplemented(response),
      clientKey,
      locale: 'sv_SE',
      environment: process.env.ADYEN_ENVIRONMENT,
      showPayButton: true,
      paymentMethodsConfiguration: {
        ideal: {
          showImage: true
        },
        card: {
          hasHolderName: true,
          holderNameRequired: true,
          name: 'Kredit-eller betalkort',
          amount: {
            value: cartTotal,
            currency: 'SEK'
          }
        }
      },
      onSubmit: async (state, component) => {
        ref.isLoading = true
        ref.slotAvailable = await ref.validateSlot(ref.$moment(ref.$store.state.cart.delivery.date).format('YYYY-MM-DD'), ref.$store.state.cart.delivery.startTime + '-' + ref.$store.state.cart.delivery.endTime)
        if (ref.slotAvailable && state.isValid) {
          handleSubmission(state, component, ref, `/api/payments/initiatePayment?ord=${orderNo}`)
        }
        ref.isLoading = false
      },
      onAdditionalDetails: (state, component) => {
        handleSubmission(state, component, ref, '/api/payments/submitAdditionalDetails')
      }
    }

    const checkout = new AdyenCheckout(configuration)
    checkout.create('dropin').mount(ref.$refs.dropin)
  } catch (error) {
    alert('Error occurred. Look at console for details')
  }
}
</script>

<style scoped>

</style>
