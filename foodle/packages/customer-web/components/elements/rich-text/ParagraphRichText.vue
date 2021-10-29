<template>
  <div class="text-lg my-4 inline-block" :class="{ 'text-white': attrs.isDark }">
    <slot />
  </div>
</template>

<script>
import { defineComponent, ref } from '@vue/composition-api'
import { HeadingAttributes } from '@marvr/storyblok-rich-text-types'

export default {
  name: 'ParagraphRichText',
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
