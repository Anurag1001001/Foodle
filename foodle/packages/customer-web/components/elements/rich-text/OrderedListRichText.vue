<template>
  <ol class="mt-2 list-decimal" :class="{ 'text-white': attrs.isDark }" style="padding-left: 0!important; list-style-position: inside!important;">
    <slot />
  </ol>
</template>

<script>
export default {
  name: 'OrderedListRichText',
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
