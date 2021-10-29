<template>
  <div class="mt-2 relative">
    <div class="title-row block grid grid-cols-2">
      <span class="text-xl font-bold">{{ $t('labels.cart.final_amount_to_pay') }} <span class="text-base font-normal">({{ $t('labels.cart.including_taxes') }})</span></span>
      <span class="text-xl font-bold justify-self-end">{{ formatAmount(discountedAmount) }}</span>
    </div>
    <div v-if="discountAmount" class="details-row block grid grid-cols-2">
      <div>
        <span class="text-sm opacity-75">{{ $t('labels.cart.rebate') }}</span>
        <span v-if="coupon !== null" class="text-sm opacity-75" :class="{ 'text-red-600': error, 'text-green-600': !error }">{{ couponText }}</span>
      </div>
      <span class="text-sm justify-self-end opacity-75">{{ formatAmount(discountAmount) }}</span>
    </div>
    <div v-if="shippingAmount" class="details-row block grid grid-cols-2">
      <div>
        <span class="text-sm opacity-75">{{ $t('labels.cart.delivery_cost') }}</span>
      </div>
      <span class="text-sm justify-self-end opacity-75">{{ shippingAmountFormatted }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TotalSection'
}
</script>

<style scoped>

</style>
