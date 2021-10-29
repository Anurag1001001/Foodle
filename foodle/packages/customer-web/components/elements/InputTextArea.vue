<template>
  <div class="inline">
    <textarea
      v-model="data"
      v-bind="$attrs"
      maxlength="250"
      class="inline border-4 h-32 p-4 rounded text-foodler-black"
      :class="[{ 'w-full': widthFull }, active]"
      @input="$emit('input', $event.target.value)"
    />
  </div>
</template>

<script>
export default {
  name: 'InputTextArea',
  props: {
    value: {
      type: String,
      default: () => ''
    },
    enabled: {
      type: Boolean,
      default: () => true
    },
    widthFull: {
      type: Boolean,
      default: () => false
    },
    lines: {
      type: Number,
      default: () => 4
    }
  },
  data () {
    return {
      data: this.value
    }
  },
  computed: {
    active () {
      return this.enabled
        ? ['bg-white', 'text-opacity-50', 'border-input-border-active', 'focus:text-opacity-100']
        : ['bg-warm-gray-light text-opacity-25 border-warm-gray-light pointer-events-none']
    }
  }
}
</script>

<style scoped>

</style>
