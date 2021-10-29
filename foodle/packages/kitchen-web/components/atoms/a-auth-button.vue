<template>
  <div>
    <nuxt-link :to="url" class="w-full h-16.25 text-14-lineHeight-1.43 rounded-5 font-foodle bg-light-royal-blue hover:bg-blue-600 font-bold text-white focus:outline-none uppercase mt-5.5 mb-5 flex items-center justify-center">
      <slot />
    </nuxt-link>
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
