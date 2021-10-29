<template>
  <div class="rounded-md p-2" :class="{ 'bg-green-50': !error, 'bg-red-100': error }">
    <div class="flex">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'AAlert',
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
