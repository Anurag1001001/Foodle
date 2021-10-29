<template>
  <div class="text-center leading-9 font-bold font-colby sm:leading-10 leading-tight text-5xl lg:text-5rem" :class="'text-' + color">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'SectionHeader',
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

</style>
