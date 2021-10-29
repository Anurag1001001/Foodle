<template>
  <div>
    <DeliveryInfoLineItem :item="{ image: 'delivery', text: deliveryInfo.type }" />
    <DeliveryInfoLineItem :item="{ image: 'date', text: this.$moment(deliveryInfo.date).format('LL') }" />
    <DeliveryInfoLineItem :item="{ image: 'time', text: deliveryInfo.startTime + ' - ' + deliveryInfo.endTime }" />
  </div>
</template>

<script>
import DeliveryInfoLineItem from '~/components/elements/order/DeliveryInfoLineItem'

export default {
  name: 'DeliveryInfoSection',
  components: { DeliveryInfoLineItem },
  props: {
    deliveryInfo: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>

</style>
