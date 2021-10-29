<template>
  <label class="flex inline-block p-4 rounded-full text-base text-foodler-black" :class="{ 'bg-secondary': checked, 'bg-warm-gray-light ': !checked }" @click.prevent.stop="clicked">
    <input :id="id" type="checkbox" :name="name" class="appearance-none">
    <span :class="{ 'opacity-50': !checked }"><slot /></span>
    <div class="mr-2 ml-3">
      <img v-if="checked" src="/images/svg/checkmark.svg" class="rounded-full px-1 py-1 checked-image w-6 inline float-right" alt="">
      <svg
        v-else
        id="Lager_1"
        data-name="Lager 1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        class="w-6 inline float-right"
      >
        <defs><style>.cls-1{fill:#1e1e1e50;}</style></defs><title>close</title><polygon class="cls-1" points="18.36 7.05 16.95 5.64 12 10.59 7.05 5.64 5.64 7.05 10.59 12 5.64 16.95 7.05 18.36 12 13.41 16.95 18.36 18.36 16.95 13.41 12 18.36 7.05" />
      </svg>
    </div>
  </label>
</template>

<script>
export default {
  name: 'StandardCheckBox',
  props: {
    name: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    checked: {
      type: Boolean,
      default: () => false
    }
  },
  methods: {
    clicked () {
      this.$emit('checkboxSelected')
    }
  }
}
</script>

<style scoped>

</style>
