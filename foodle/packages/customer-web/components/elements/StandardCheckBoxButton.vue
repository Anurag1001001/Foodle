<template>
  <label class="flex relative" @click.prevent.stop="clicked">
    <input :id="id" type="checkBox" :name="name" class="appearance-none">
    <div class="mr-4">
      <CheckIndicator v-if="checkIndicator" />
      <div v-else class="bg-warm-gray-light w-6 h-6 rounded-full" />
    </div>
    <span class="text-foodler-black flex-1" :class="{ 'opacity-50': !checkIndicator }"><slot /></span>
    <span class="text-foodler-black " style="margin-left: auto" :class="{ 'opacity-50': !checkIndicator }"><slot name="additional" /></span>
  </label>
</template>

<script>
import CheckIndicator from '~/components/elements/CheckIndicator'
export default {
  name: 'StandardCheckBoxButton',
  components: { CheckIndicator },
  props: {
    name: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    selectedId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      checkIndicator: false
    }
  },
  methods: {
    clicked () {
      this.checkIndicator = !this.checkIndicator
      this.$emit('radioSelected')
    }
  }
}
</script>

<style scoped>
</style>
