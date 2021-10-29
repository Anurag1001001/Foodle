<template>
  <div>
    <LocationInput :value="value" :theme="theme" :width-full="widthFull" :show-change-button="showChangeButton" />
  </div>
</template>

<script>
import LocationInput from '~/components/elements/LocationInput'
export default {
  name: 'LocationBox',
  components: { LocationInput },
  props: {
    theme: {
      type: String,
      default: () => 'light'
    },
    widthFull: {
      type: Boolean,
      default: () => false
    },
    value: {
      type: String,
      default: () => ''
    },
    showChangeButton: {
      type: Boolean,
      default: () => true
    }
  }
}
</script>

<style scoped>

</style>
