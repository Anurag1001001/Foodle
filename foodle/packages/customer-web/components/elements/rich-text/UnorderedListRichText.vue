<template>
  <ul class="mt-2 list-decimal" :class="{ 'text-white': attrs.isDark }" style="padding-left: 0!important; list-style-position: inside!important;">
    <slot />
  </ul>
</template>

<script>
export default {
  name: 'UnorderedListRichText',
  props: {
    attrs: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.list-container {
  width: fit-content;
}
</style>
