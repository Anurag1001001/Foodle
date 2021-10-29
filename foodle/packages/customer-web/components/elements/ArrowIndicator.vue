<template>
  <img
    :src="image"
    class="bg-white lg:mx-10 my-48 px-4 py-4 lg:my-32 lg:px-6 lg:py-6 h-12 w-12 lg:h-16 lg:w-16 absolute lg:relative hover:cursor-pointer rounded-full z-50 "
    alt=""
    :style="style"
    :class="{ 'left-6': direction === 'left', 'right-6': direction === 'right', 'opacity-25': disabled}"
    @click.prevent.stop="arrowClicked"
  >
</template>

<script>
export default {
  name: 'ArrowIndicator',
  props: {
    parent: {
      type: String,
      required: true
    },
    direction: {
      type: String,
      default: () => 'left'
    },
    disabled: {
      type: Boolean,
      default: () => false
    }
  },
  computed: {
    image () {
      return '/images/arrow-' + this.direction + '.png'
    },
    style () {
      return {
        'box-shadow': '0 0 20px 0 rgba(0, 0, 0, 0.1)'
      }
    }
  },
  methods: {
    arrowClicked () {
      if (!this.disabled) {
        this.$nuxt.$emit('arrowClicked-' + this.parent, { direction: this.direction })
      }
    }
  }
}
</script>

<style scoped>

</style>
