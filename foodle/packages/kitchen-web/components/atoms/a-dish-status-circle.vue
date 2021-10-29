<template>
  <span class="status-dot" :class="backgroundColorClass" />
</template>

<script>
export default {
  name: 'ADishStatusCircle',
  props: {
    status: {
      type: String,
      default: 'new'
    }
  },
  computed: {
    backgroundColorClass () {
      return 'bg-' + this.getBackgrounColorString(this.status.toUpperCase())
    }
  }
}
</script>

<style scoped>

</style>
