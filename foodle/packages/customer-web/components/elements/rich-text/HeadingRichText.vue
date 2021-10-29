<template>
  <div class="text-2xl font-bold mt-24 mb-8" :class="{ 'text-secondary': attrs.isDark }">
    <slot />
  </div>
</template>

<script>
import { defineComponent, ref } from '@vue/composition-api'
import { HeadingAttributes } from '@marvr/storyblok-rich-text-types'

export default {
  name: 'HeadingRichText',
  props: {
    attrs: {
      type: Object,
      required: true
    },
    isDark: {
      type: Boolean,
      default: () => false
    }
  },
  setup ({ attrs: { level } }) {
    const tag = ref(`h${level}`)
    return {
      tag
    }
  }
}
</script>

<style scoped>
</style>
