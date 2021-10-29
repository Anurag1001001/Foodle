<template>
  <div class="relative overflow-hidden" :class="{ 'font-bold text-xl': highlighted, 'border-t-2': border, 'text-sm py-0': small, 'py-4': !small }">
    <div class="title-row">
      <div class="float-left">
        {{ amountItem.title }}
      </div>
      <div class="float-right">
        {{ formatAmount(amountItem.amount) }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AmountLineItem',
  props: {
    amountItem: {
      type: Object,
      required: true
    },
    highlighted: {
      type: Boolean,
      default: () => false
    },
    border: {
      type: Boolean,
      default: () => true
    },
    small: {
      type: Boolean,
      default: () => false
    }
  }
}
</script>

<style scoped>

</style>
