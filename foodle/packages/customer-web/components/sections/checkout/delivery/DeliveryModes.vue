<template>
  <!-- Delivery Modes -->
  <div class="mt-2">
    <FormFieldHeading>
      Leveranssätt
    </FormFieldHeading>
    <div class="grid grid-cols-1 lg:grid-cols-2 mt-1">
      <FormRadioButton
        v-for="(deliveryModeItem, index) in deliveryModes"
        :id="deliveryModeItem.id"
        :key="index"
        v-model="deliveryMode"
        name="mode_of_delivery"
        :disable=deliveryModeItem.disable
        :icon="deliveryModeItem.icon"
        :joined="1 === 1"
        :first="index === 0"
        :last="index === deliveryModes.length - 1"
      >
        {{ deliveryModeItem.title }}
      </FormRadioButton>
    </div>
  </div>
</template>

<script>
import FormFieldHeading from '~/components/elements/FormFieldHeading'
import FormRadioButton from '~/components/elements/FormRadioButton'
export default {
  name: 'DeliveryModes',
  components: { FormRadioButton, FormFieldHeading },
  props: {
    deliveryModes: {
      type: Array,
      required: true
    },
    value: {
      type: String,
      default: () => 'Hemleverans'
    }
  },
  data () {
    return {
      deliveryMode: this.value
    }
  },
  watch: {
    deliveryMode (newValue, oldValue) {
      this.$emit('input', newValue)
    },
    value (newValue, oldValue) {
      this.deliveryMode = this.value
    }
  },
  methods: {
    changeDeliveryValue (newValue) {
      this.deliveryMode = newValue
    }
  }
}
</script>

<style scoped>

</style>
