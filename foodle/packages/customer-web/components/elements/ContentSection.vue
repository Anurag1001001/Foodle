<template>
  <div class="text-center leading-tight text-lg lg:text-lg mt-16">
    <p class="text-2xl font-bold" :class="{ 'text-secondary': isDark }">
      {{ section.subTitle }}
    </p>
    <div class="mt-8" :class="{ 'text-white': isDark }">
      {{ section.description }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContentSection',
  props: {
    theme: {
      type: String,
      default: () => 'light'
    },
    section: {
      type: Object,
      required: true
    }
  },
  computed: {
    isDark () {
      return this.theme === 'dark'
    }
  }
}
</script>

<style scoped>
</style>
