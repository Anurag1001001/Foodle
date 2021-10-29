<template>
  <div class="text-lg">
    <span class="col-span-2 uppercase font-bold">{{ deliveryType }}</span>
    <div class="grid grid-cols-12 mt-4">
      <div class="col-span-1">
        <img src="/images/svg/location.svg" class="w-5">
      </div>
      <div class="col-span-11">
        <div>{{ customer_info.address.first_name }} {{ customer_info.address.last_name }}</div>
        <div>{{ customer_info.address.street_1 }}</div>
        <div>{{ customer_info.address.zip }} {{ customer_info.address.city }}, {{ customer_info.address.country }}</div>
        <div>{{ customer_info.address.email }}</div>
        <div>{{ customer_info.address.phone }}</div>
        <div v-if="customer_info.port_code">Port kod: {{ customer_info.port_code }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddressFormatter',
  props: {
    customer_info: {
      type: Object,
      required: true
    }
  },
  computed: {
    marker () {
      return ['fas', 'map-marker-alt']
    },
    deliveryType () {
      return this.$store.state.cart.delivery.type === this.deliveryTypePickup ? this.deliveryTypePickup : 'Levereras till'
    }
  }
}
</script>

<style scoped>

</style>
