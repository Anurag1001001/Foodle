<template>
  <span class="uppercase font-bold text-sm">
    <slot name="pre" />
    <span :class="{ 'text-red-500': error }"><slot /></span>
    <slot name="post" />
  </span>
</template>

<script>
export default {
  name: 'FormFieldHeading',
  props: {
    error: {
      type: Boolean,
      default: () => false
    }
  }
}
</script>

<style scoped>

</style>
