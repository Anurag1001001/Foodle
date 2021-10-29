<template>
  <div class="alternate-small-header text-center leading-9 font-bold sm:leading-10 leading-tight" :class="'text-' + color">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'SectionAlternateSmallHeader',
  props: {
    color: {
      type: String,
      default: () => 'foodler-black'
    },
    basicFont: {
      type: Boolean,
      default: () => false
    }
  }
}
</script>

<style scoped>
.alternate-small-header {
  font-size: 1.375rem;
}
</style>
