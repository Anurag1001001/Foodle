<template>
  <div class="mt-12">
    <!-- Time Selection -->
    <FormFieldHeading>
      Välj leveranstid
    </FormFieldHeading>
    <div class="mt-1 grid grid-cols-1 lg:grid-cols-3 gap-5">
      <FormRadioButton
        v-for="(availableTimeItem, index) in availableTimes"
        :id="availableTimeItem.title"
        :key="index"
        v-model="availableTime"
        :disable="availableTimeItem.disabled"
        name="available_time"
        icon="time.svg"
        :joined="falseValue"
      >
        {{ availableTimeItem.title }}
        <template #disabledButton>
          <span class="float-right text-foodler-black font-bold opacity-25 text-sm">SLUT</span>
        </template>
        <template #deselectedButton>
          <span class="float-right text-greyish-brown font-bold text-sm mt-1">LEDIG</span>
        </template>
      </FormRadioButton>
    </div>
  </div>
</template>

<script>
import FormFieldHeading from '~/components/elements/FormFieldHeading'
import FormRadioButton from '~/components/elements/FormRadioButton'
export default {
  name: 'AvailableTimeSlots',
  components: { FormRadioButton, FormFieldHeading },
  props: {
    availableTimes: {
      type: Array,
      default: () => null
    },
    value: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      availableTime: this.value
    }
  },
  watch: {
    value (newValue, oldValue) {
      this.availableTime = newValue
    },
    availableTime (newValue, oldValue) {
      this.$emit('input', newValue)
    }
  }
}
</script>

<style scoped>

</style>
