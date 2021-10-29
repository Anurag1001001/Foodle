<template>
  <div>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-x-5">
      <div class="lg:col-start-1 lg:col-span-2 inline">
        <DeliveryModes v-model="orderDeliveryInfo.type" :delivery-modes="deliveryModes" />
      </div>
      <div class="lg:col-start-3 lg:col-span-1 inline">
        <SelectDay v-model="orderDeliveryInfo.date" :days="days" />
      </div>
    </div>
    <PickUpAddress v-if="isPickUp" />
    <AvailableTimeSlots v-if="!loading && availableTimes !== null" v-model="availableTime" :available-times="availableTimes" />
    <template v-else>
      <div class="my-6 text-2xl text-center">
        {{ $t('labels.common.loading') }}
      </div>
    </template>
  </div>
</template>

<script>
import DeliveryModes from '~/components/sections/checkout/delivery/DeliveryModes'
import SelectDay from '~/components/sections/checkout/delivery/SelectDay'
import AvailableTimeSlots from '~/components/sections/checkout/delivery/AvailableTimeSlots'
import PickUpAddress from '~/components/sections/checkout/delivery/PickUpAddress'

export default {
  name: 'DeliveryDateTimeSection',
  components: { DeliveryModes, SelectDay, AvailableTimeSlots, PickUpAddress },
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      pickUpSelected: false,
      slots: [],
      orderDeliveryInfo: { ...this.value },
      orderDeliveryInfoOld: { ...this.value },
      days: [
        { id: '0', title: this.$moment().startOf('day').format('LL'), date: this.$moment().startOf('day').valueOf() },
        { id: '1', title: this.$moment().startOf('day').add(1, 'd').format('LL'), date: this.$moment().startOf('day').add(1, 'd').valueOf() },
        { id: '2', title: this.$moment().startOf('day').add(2, 'd').format('LL'), date: this.$moment().startOf('day').add(2, 'd').valueOf() },
        { id: '3', title: this.$moment().startOf('day').add(3, 'd').format('LL'), date: this.$moment().startOf('day').add(3, 'd').valueOf() },
        { id: '4', title: this.$moment().startOf('day').add(4, 'd').format('LL'), date: this.$moment().startOf('day').add(4, 'd').valueOf() }
      ],
      availableTimes: null,
      availableTime: this.value.startTime + '-' + this.value.endTime
    }
  },
  computed: {
    deliveryModes () {
      return [
        { id: this.deliveryTypeDelivery, title: this.deliveryTypeDelivery, icon: 'delivery.svg', disable: !this.serviceable || JSON.stringify(this.location) === '{}' },
        { id: this.deliveryTypePickup, title: this.deliveryTypePickup, icon: 'pickup.svg', disable: false }
      ]
    },
    isPickUp () {
      return this.orderDeliveryInfo.type === this.deliveryTypePickup || !this.serviceable
    }
  },
  watch: {
    orderDeliveryInfo: {
      async handler (val) {
        this.$emit('input', this.orderDeliveryInfo)
        if (this.orderDeliveryInfo.date !== this.orderDeliveryInfoOld.date) {
          const date = this.$moment(this.orderDeliveryInfo.date).format('YYYY-MM-DD')
          this.slots = await this.getSlots(date)
          this.setDefaultSlotSelection()
          if (this.slots.data) {
            this.availableTimes = this.slots.data.filter(slot => slot.date === date)
          }
          this.orderDeliveryInfoOld.date = this.orderDeliveryInfo.date
        }

        if (this.orderDeliveryInfo.type !== this.orderDeliveryInfoOld.type) {
          this.pickUpSelected = this.orderDeliveryInfo.type === this.deliveryTypePickup
          this.orderDeliveryInfoOld.type = this.orderDeliveryInfo.type
        }
      },
      deep: true
    },
    availableTime (newValue, oldValue) {
      if (typeof newValue !== 'undefined') {
        this.orderDeliveryInfo.startTime = newValue.substr(0, 5)
        this.orderDeliveryInfo.endTime = newValue.substr(6, 5)
        this.$emit('input', this.orderDeliveryInfo)
      }
    }
  },
  async mounted () {
    const todayDate = this.$moment(this.value.date).format('YYYY-MM-DD')
    this.slots = await this.getSlots(todayDate)
    this.setDefaultSlotSelection()
    if (this.slots.data) {
      this.availableTimes = this.slots.data.filter(slot => slot.date === todayDate)
    }
  },
  methods: {
    async getSlots (date) {
      this.loading = true
      const result = await this.getDeliverySlots(date)
      this.loading = false
      return result
    },
    setDefaultSlotSelection () {
      const slot = this.slots.data.find((slot) => {
        return !slot.disabled
      })
      if (slot && this.availableTime === '-') {
        this.availableTime = slot.title
      }
    }
  }
}
</script>

<style scoped>

</style>
