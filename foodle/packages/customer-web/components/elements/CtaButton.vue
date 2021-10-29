<template>
  <button
    :class="className"
    class="inline uppercase button-spacing font-bold"
    :disabled="!enabled"
    @click.prevent.stop="buttonClicked"
  >
    <slot />
  </button>
</template>

<script>
export default {
  name: 'CtaButton',
  props: {
    name: {
      type: String,
      default: () => 'default'
    },
    enabled: {
      type: Boolean,
      default: () => true
    },
    extraClasses: {
      type: String,
      default: () => ''
    },
    type: {
      type: String,
      default: () => 'standard'
    },
    fullWidth: {
      type: Boolean,
      default: () => false
    }
  },
  computed: {
    className () {
      let name = ''
      if (this.enabled) {
        switch (this.type) {
          case 'white-background-no-border':
            name = 'button-xl bg-white hover:bg-primary hover:text-white transition duration-200 ease-in-out'
            break
          case 'white-background-with-border':
            name = 'button-xl bg-white border border-black hover:bg-primary hover:text-white hover:border-primary hover:border-0'
            break
          case 'white-outline':
            name = 'button-xl text-white bg-transparent border-4 border-white hover:bg-white hover:text-black hover:border-none hover:border-0 transition duration-200 ease-in-out'
            break
          case 'cart-button':
            name = 'button text-white bg-transparent border-4 border-white hover:bg-secondary hover:text-black hover:border-transparent hover:border-0 transition duration-200 ease-in-out lowercase'
            break
          case 'cart-update':
            name = 'button-xl bg-secondary hover:bg-primary hover:text-white transition duration-200 ease-in-out w-full lg:w-auto'
            break
          case 'yellow-background-no-border-small':
            name = 'button-sm bg-secondary hover:bg-primary hover:text-white'
            break
          case 'clear-backgraound-no-hover':
            name = 'w-6'
            break
          default:
            name = 'button bg-secondary hover:bg-primary hover:text-white transition duration-200 ease-in-out'
        }
      } else {
        name = 'button bg-muted'
        if (this.type === 'yellow-background-no-border-small') {
          name = 'button-sm bg-muted'
        }

        if (this.type === 'white-background-with-border') {
          name += ' button-xl ease-in-out'
        }
      }

      if (this.fullWidth) {
        name = name + ' w-full'
      }

      return name
    },
    style () {
      return {
        'box-shadow': '0 2px 40px 0 rgba(0, 0, 0, 0.1)'
      }
    }
  },
  methods: {
    buttonClicked () {
      this.$emit('clicked')
      this.$nuxt.$emit('buttonClicked', { name: this.name })
    }
  }
}
</script>

<style scoped>

</style>
