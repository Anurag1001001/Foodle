<template>
  <a class="border-transparent border-b-6 text-24-lineHeight-1.19 font-navbar text-black flex justify-center items-center" :class="{'border-light-royal-blue' : selectedIndex === index }" @click.prevent.stop="tabClicked">
    <slot />
  </a>
</template>

<script>
export default {
  props: {
    tab: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    selectedIndex: {
      type: Number,
      required: true
    }
  },
  methods: {
    tabClicked () {
      this.$nuxt.$emit('tabSelected', { index: this.index })
    }
  }
}
</script>
