<template>
  <div :class="{ 'mt-6 border-t border-foodler-gray pt-6' : !first, 'border-b border-foodler-gray pb-6' : last }">
    <dt class="text-lg leading-7">
      <button
        class="text-left w-full flex justify-between items-start text-gray-400 focus:outline-none focus:text-gray-900"
        aria-expanded="false"
        @click.prevent.stop="openPanel = !openPanel"
      >
        <span class="font-bold text-gray-900">
          {{ faq.question }}
        </span>
        <span class="ml-6 h-7 flex items-center">
          <img
            src="/images/down.png"
            alt=""
            class="rotate-0 w-4 h-auto transform translate"
            :class="{ '-rotate-180': openPanel, 'rotate-0': !openPanel }"
          >
        </span>
      </button>
    </dt>
    <dd class="pr-12" :class="openPanel ? 'visible h-auto mt-2' : 'invisible h-0'">
      <p class="text-base leading-6 text-gray-500">
        {{ faq.answer }}
      </p>
    </dd>
  </div>
</template>

<script>
export default {
  name: 'FaqEntry',
  props: {
    faq: {
      type: Object,
      required: true
    },
    first: {
      type: Boolean,
      default: () => false
    },
    last: {
      type: Boolean,
      default: () => false
    }
  },
  data () {
    return {
      openPanel: false
    }
  }
}
</script>

<style scoped>

</style>
