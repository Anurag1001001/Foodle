<template>
  <div>
    <FormFieldHeading>Ange rabattkod</FormFieldHeading>
    <div class="mt-2" />
    <InputField v-model="couponCode" :checks="falseValue">
      <template #inline-component>
        <CtaButton :enabled="!loading && couponCode !== ''" class="mt-4" @clicked="validateCoupon">
          Lägg till
        </CtaButton>
        <span v-if="error" class="text-lg" :class="{ 'text-red-600': error, 'text-green-600': !error }">{{ couponText }}</span>
      </template>
    </InputField>
  </div>
</template>

<script>
import FormFieldHeading from '~/components/elements/FormFieldHeading'
import InputField from '~/components/elements/InputField'
import CtaButton from '~/components/elements/CtaButton'
export default {
  name: 'CouponSection',
  components: { CtaButton, InputField, FormFieldHeading },
  data () {
    return {
      couponCode: this.$store.state.cart.coupon !== null ? this.$store.state.cart.coupon.code : '',
      coupon: null,
      error: false
    }
  },
  watch: {
    couponCode (newValue, oldValue) {
      this.coupon = null
      this.error = false
      this.$store.dispatch('cart/updateCoupon', null)
    }
  },
  created () {
    if (this.couponCode !== '') {
      this.validateCoupon()
    }
  },
  methods: {
    async validateCoupon () {
      this.loading = true
      const couponObject = await this.$axios.$get('/api/coupons/' + this.couponCode)
        .catch(() => {
          this.coupon = null
          this.error = true
        })

      if (typeof couponObject !== 'undefined') {
        if (this.isCouponValid(couponObject)) {
          this.error = false
          this.coupon = couponObject
          await this.$store.dispatch('cart/updateCoupon', this.coupon)
        } else {
          this.coupon = null
          this.error = true
          await this.$store.dispatch('cart/updateCoupon', null)
        }
      }

      this.loading = false
    }
  }
}
</script>

<style scoped>

</style>
