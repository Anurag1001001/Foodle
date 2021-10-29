<template>
  <div class="w-screen h-screen py-8 lg:py-12 flex flex-col items-center justify-center bg-secondary">
    <div class="w-full px-6 lg:px-24 max-w-screen-sm">
      <div class="mx-auto flex flex-col items-center justify-center">
        <div>
          <img v-if="paymentStatus" src="/images/svg/checkmark.svg" class="bg-white w-16 h-16 p-2 rounded-full" alt="">
        </div>
        <br>
        <div v-if="paymentStatus" class="font-bold text-xl foodler-black mt-4">
          Tack för din beställning!
        </div>
        <br>
        <div class="text-md foodler-black text-center">
          {{ message }}
        </div>
        <br>
        <div v-if="paymentStatus" class="text-md foodler-black">
          DItt ordernummer är:
        </div>
        <br>
        <div v-if="paymentStatus" class="text-lg font-bold foodler-black">
          {{ orderNo }}
        </div>

        <div class="flex">
          <div class="mt-4 mx-auto">
            <CtaButton type="white-background-no-border" @clicked="gotToHomePage">
              Ta mig hem
            </CtaButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CtaButton from '~/components/elements/CtaButton'

export default {
  name: 'Index',
  components: { CtaButton },
  layout: 'fullpage',
  data () {
    return {
      orderNo: null,
      status: '',
      message: '',
      paymentStatus: false
    }
  },
  async created () {
    this.orderNo = this.$route.params.oid
    this.status = this.$route.params.status
    if (this.orderNo === undefined && this.status === undefined) {
      this.orderNo = this.$route.query.oid
      this.status = this.$route.query.status
    }
    switch (this.status) {
      case 'Authorised':
        await this.$store.dispatch('cart/clearCart')
        await this.$store.dispatch('cart/clearDelivery')
        this.paymentStatus = true
        this.message = 'Vi tillagar din order och hör av oss när maten är på väg. Vi har mailat dig din orderbekräftelse och kvitto.'
        break
      case 'Pending':
        this.paymentStatus = true
        this.message = 'Vi tillagar din order och hör av oss när maten är på väg. Vi har mailat dig din orderbekräftelse och kvitto.'
        break
      case 'Received':
        this.paymentStatus = true
        this.message = 'Vi tillagar din order och hör av oss när maten är på väg. Vi har mailat dig din orderbekräftelse och kvitto.'
        break
      case 'Refused':
        this.message = 'Betalningen har inte gått igenom. Försök gärna igen med en annan betalnings metod eller ett annat kort.'
        break
      default:
        this.message = 'Ett oväntat fel. Försök igen!'
        break
    }
  }
}
</script>

<style scoped>

</style>
