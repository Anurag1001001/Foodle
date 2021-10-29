<template>
  <div class="">
    <FormBlock>
      <div class="text-2xl font-bold">
        Leveransuppgifter
      </div>
      <div class="location-section mt-12">
        <FormFieldHeading>
          Din adress
        </FormFieldHeading>
        <LocationBox theme="dark" :width-full="trueValue" :show-change-button="falseValue" />
      </div>
      <DeliveryDateTimeSection v-model="orderDeliveryInfo" />
      <div class="pt-16">
        <div class="flex justify-center">
          <CtaButton type="cart-update" name="updateCart" :enabled="orderDeliveryInfo.startTime !== ''" @clicked="saveData">
            {{ $t('labels.common.buttons.go_to_checkout') }}
          </CtaButton>
        </div>
      </div>
    </FormBlock>
  </div>
</template>

<script>
import FormFieldHeading from '~/components/elements/FormFieldHeading'
import LocationBox from '~/components/sections/hero/LocationBox'
import AvailableTimeSlots from '~/components/sections/checkout/delivery/AvailableTimeSlots'
import DeliveryModes from '~/components/sections/checkout/delivery/DeliveryModes'
import CtaButton from '~/components/elements/CtaButton'
import SelectDay from '~/components/sections/checkout/delivery/SelectDay'
import FormBlock from '~/components/elements/FormBlock'
import DeliveryDateTimeSection from '~/components/sections/checkout/delivery/DeliveryDateTimeSection'
export default {
  name: 'Delivery',
  components: { FormBlock, SelectDay, CtaButton, DeliveryModes, AvailableTimeSlots, LocationBox, FormFieldHeading, DeliveryDateTimeSection },
  data () {
    return {
      orderDeliveryInfo: {
        type: this.$store.state.cart.delivery.type ? this.$store.state.cart.delivery.type : 'Avhämtning',
        date: this.$store.state.cart.delivery.date && this.$store.state.cart.delivery.date >= this.$moment().startOf('day').valueOf() ? this.$store.state.cart.delivery.date : this.$moment().startOf('day').valueOf(),
        startTime: this.$store.state.cart.delivery.startTime ? this.$store.state.cart.delivery.startTime : '',
        endTime: this.$store.state.cart.delivery.endTime ? this.$store.state.cart.delivery.endTime : ''
      }
    }
  },
  watch: {
    delivery: {
      handler (newVal, oldVal) {
        this.orderDeliveryInfo.type = newVal.type
        this.orderDeliveryInfo.date = newVal.date
        this.orderDeliveryInfo.startTime = newVal.startTime
        this.orderDeliveryInfo.endTime = newVal.endTime
      },
      deep: true
    }
  },
  methods: {
    saveData () {
      debugger
      this.$store.dispatch('cart/updateDelivery', this.orderDeliveryInfo)
      this.gotToKassaPage()
    }
  }
}
</script>

<style scoped>

</style>
