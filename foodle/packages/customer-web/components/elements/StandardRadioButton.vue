<template>
  <label class="flex" @click.prevent.stop="clicked">
    <input :id="id" type="radio" :name="name" class="appearance-none">
    <div class="mr-4">
      <CheckIndicator v-if="id === selectedId" />
      <div v-else class="bg-warm-gray-light w-6 h-6 rounded-full" />
    </div>
    <span class="text-foodler-black" :class="{ 'opacity-50': id !== selectedId }"><slot /></span>
    <span class="text-foodler-black right-0 absolute" :class="{ 'opacity-50': id !== selectedId }"><slot name="additional" /></span>
  </label>
</template>

<script>
import CheckIndicator from '~/components/elements/CheckIndicator'
export default {
  name: 'StandardRadioButton',
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
  methods: {
    clicked () {
      this.$emit('radioSelected')
    }
  }
}
</script>

<style scoped>
</style>
