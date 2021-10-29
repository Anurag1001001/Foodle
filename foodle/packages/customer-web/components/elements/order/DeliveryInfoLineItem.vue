<template>
  <div class="my-4">
    <img :src="'/images/svg/' + item.image + '.svg'" class="w-6 inline" alt="">
    {{ item.text }}
  </div>
</template>

<script>
export default {
  name: 'DeliveryInfoLineItem',
  props: {
    item: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>

</style>
