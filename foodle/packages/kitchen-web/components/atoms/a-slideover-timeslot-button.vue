<template>
  <div class="flex-shrink-0 flex justify-end">
    <nuxt-link :to="url" class="w-full h-16.25 text-14-lineHeight-1.43 rounded-5 font-foodle bg-light-royal-blue hover:bg-blue-500 font-bold text-white focus:outline-none uppercase flex items-center justify-center ipro:h-20 ipro:text-lg mb-18">
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
