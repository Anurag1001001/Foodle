<template>
  <div class="mx-2">
    <div class="mt-10 mx-2 mx-auto bg-white rounded-md py-12 px-4 lg:px-10 foodler-box-shadow" :class="{ 'lg:max-w-screen-lg' : size === 'lg', 'lg:max-w-screen-sm' : size === 'sm' }">
      <slot name="header" />
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'FormBlock',
  props: {
    size: {
      type: String,
      default: () => 'lg'
    }
  }
}
</script>

<style scoped>

</style>
