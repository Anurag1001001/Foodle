<template>
  <div>
    <div class="w-full flex flex-row text-xl bg-white py-4 lg:py-6 justify-left relative">
      <div class="float-left z-50 px-2 lg:px-10">
        <div class="cursor-pointer" @click.prevent.stop="goBack">
          <img src="/images/svg/arrow-left.svg" class="w-6 inline" alt="">
          <client-only>
            <span v-if="$screen.xl" class="inline">Tillbaka</span>
          </client-only>
        </div>
      </div>
      <div class="absolute inline justify-center float-none flex w-full">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CheckoutHeader',
  methods: {
    goBack () {
      this.$nuxt.$router.back()
    }
  }
}
</script>

<style scoped>

</style>
