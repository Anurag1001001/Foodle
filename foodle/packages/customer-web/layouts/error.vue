<template>
  <div class="py-8 lg:py-12 flex flex-col items-center justify-center bg-tomato">
    <div class="w-full h-full pt-36 lg:pt-44 max-w-screen-sm">
      <div class="mx-auto flex flex-col items-center justify-center">
        <br>
        <div class="font-bold text-6xl lg:text-7xl text-white mt-4">
          404
        </div>
        <div class="text-lg text-center text-white">
          Sidan hittas inte
        </div>
        <div class="flex">
          <div class="mt-4 mx-auto">
            <CtaButton type="white-background-with-border" @clicked="gotToHomePage">
              Ta mig hem
            </CtaButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CtaButton from '~/components/elements/CtaButton'

export default {
  components: { CtaButton }
}
</script>

<style scoped>

</style>
