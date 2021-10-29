<template>
  <div class="mt-1 relative rounded bg-warm-gray-light px-4 py-8">
    <div class="grid grid-cols-10">
      <div class="col-span-8">
        <div class="inset-y-0 left-0 pl-3 flex items-center">
          <img src="/images/svg/location.svg" class="w-5">
          <span class="text-md px-2">{{ address }}</span>
        </div>
        <div class="inset-y-0 left-0 pl-3 flex items-center">
          <img src="/images/svg/delivery.svg" class="w-5">
          <span class="text-md px-2">{{ $store.state.cart.delivery.type }}</span>
        </div>
        <div class="flex flex-col lg:flex-row">
          <div class="inset-y-0 left-0 pl-3 flex items-center inline">
            <img src="/images/svg/date.svg" class="w-5 inline">
            <span class="text-md px-2">{{ $moment($store.state.cart.delivery.date).format('LL') }}</span>
          </div>
          <div class="inset-y-0 left-0 pl-3 flex items-center inline">
            <img src="/images/svg/time.svg" class="w-5 inline">
            <span class="text-md px-2 inline">{{ $store.state.cart.delivery.startTime }} - {{ $store.state.cart.delivery.endTime }}</span>
          </div>
        </div>
      </div>
      <div class="col-span-2 justify-self-end">
        <div class="text-xs text-foodler-black inset-y-0 pr-5 flex items-center cursor-pointer text-opacity-50" @click.prevent="Change">
          ÄNDRA
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DeliveryInformationBox',
  data () {
    return {
      defaultAddress: process.env.STORE_ADDRESS_STREET_1 + ' ' + process.env.STORE_ADDRESS_CITY + ' ' + process.env.STORE_ADDRESS_ZIP + ' ' + ' ' + process.env.STORE_ADDRESS_COUNTRY
    }
  },
  computed: {
    address () {
      if (this.$store.state.cart.delivery.type === this.deliveryTypePickup) {
        return this.defaultAddress
      } else {
        return this.location.formatted_address
      }
    }
  },
  methods: {
    Change () {
      this.$nuxt.$router.back()
    }
  }
}
</script>

<style scoped>

</style>
