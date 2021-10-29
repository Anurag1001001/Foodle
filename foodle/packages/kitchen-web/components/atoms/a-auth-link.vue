<template>
  <div class="flex items-center justify-center">
    <div>
      <nuxt-link :to="url" class="font-medium text-light-royal-blue hover:text-blue-600 underline text- font-foodle">
        <slot />
      </nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      default: () => '/'
    }
  }
}
</script>
