<template>
  <li>
    <slot />
  </li>
</template>

<script>
import { defineComponent, ref } from '@vue/composition-api'
import { HeadingAttributes } from '@marvr/storyblok-rich-text-types'

export default {
  name: 'ListItemRichText',
  props: {
    attrs: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.list-item {
  width: fit-content;
}
</style>
