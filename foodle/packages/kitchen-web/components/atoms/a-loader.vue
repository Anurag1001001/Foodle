<template>
  <div class="w-full text-2xl py-4">
    {{ message }}
  </div>
</template>

<script>
export default {
  name: 'ALoader',
  props: {
    message: {
      type: String,
      default: () => 'Loading...'
    }
  }
}
</script>

<style scoped>

</style>
