<template>
  <swiper-slide>
    <div class="grid gap-4 grid-cols-1 grid-rows-none">
      <div class="flex items-baseline justify-center">
        <img :src="item.thumbnail" :alt="item.title" :style="style" class="h-auto">
      </div>
      <div class="text-center">
        <img :src="item.title" :alt="item.title" class="h-12 mx-auto">
      </div>
      <div class="text-center leading-5 ext-foodler-black px-10 block">
        <p class="leading-5 h-15 overflow-hidden overflow-ellipsis" v-html="item.description" />
      </div>
      <div v-if="!sliderRequired" class="text-center mt-4 items-stretch">
        <cta_button @clicked="goToKitchen(item.slug)">
          Till Kök
        </cta_button>
      </div>
    </div>
  </swiper-slide>
</template>

<script>
export default {
  name: 'KitchenSingle',
  props: {
    item: {
      type: Object,
      required: true
    },
    sliderRequired: {
      type: Boolean,
      default: () => true
    }
  },
  computed: {
    style () {
      return {
        'background-image': "url('" + this.item.background + "')",
        'background-size': 'cover'
      }
    }
  }
}
</script>

<style scoped>

</style>
