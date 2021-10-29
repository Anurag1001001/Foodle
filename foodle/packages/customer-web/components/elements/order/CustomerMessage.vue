<template>
  <div v-if="message">
    <span class="col-span-2 uppercase font-bold">MEDDELANDE</span>
    <div class="mt-4">
      <div>{{ message }}</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'CustomerMessage',
  props: {
    message: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>

</style>
