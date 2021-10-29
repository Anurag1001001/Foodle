<template>
  <div v-show="show" class="fixed z-50 inset-0 overflow-y-auto">
    <div
      class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
    >
      <div class="fixed inset-0 transition-opacity">
        <div class="absolute inset-0 bg-black opacity-20" />
      </div>
      <span
        class="hidden sm:inline-block sm:align-middle sm:h-screen"
      />&#8203;
      <div
        class="inline-block bg-white rounded-5 overflow-hidden transform transition-all sm:align-middle max-w-lg w-full ipro:max-w-2xl sm:p-4"
        aria-modal="true"
      >
        <div class="flex justify-center mt-15">
          <div class="font-foodle text-black text-24-lineHeight-0.83">
            {{ modal.heading }}
          </div>
        </div>
        <div class="px-20 mt-15">
          <button
            class="w-full h-15 font-foodle font-bold bg-light-royal-blue text-white text-14-lineHeight-1.43 rounded-5 focus:outline-none uppercase"
            @click="goAhead"
          >
            {{ modal.yes }}
          </button>
        </div>
        <div class="px-20">
          <button
            class="w-full h-15 font-foodle font-bold bg-white text-light-royal-blue text-14-lineHeight-1.43 rounded-5 focus:outline-none uppercase"
            @click="closeModal"
          >
            {{ modal.no }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: () => false
    },
    modal: {
      type: Object,
      required: false
    }
  },
  methods: {
    closeModal () {
      this.$emit('close')
    },
    goAhead () {
      this.$emit('goAhead')
    }
  }
}
</script>
