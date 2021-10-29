<template>
  <label
    :for="id"
    class="border-2 absolute left-0 px-5 py-6 w-full lg:inline relative"
    :class="{ 'rounded' : !joined,
              'rounded-l': joined && first,
              'rounded-r': joined && last,
              'bg-warm-gray-light border-warm-gray-light': disable,
              'border-foodler-black': selected
    }"
    @click.prevent.stop="markChecked"
  >
    <input
      id="delivery"
      data-v-79d2cc2c=""
      type="radio"
      name="mode_of_delivery"
      class="appearance-none"
      :disabled="disable"
    >
    <img :src="'/images/svg/' + icon" class="w-6 inline mb-1" :class="{ 'opacity-25' : disable, 'opacity-50': !disable && !selected }">
    <span :class="{ 'opacity-25' : disable, 'opacity-50': !disable && !selected }">
      <slot />
    </span>
    <CheckIndicator v-if="selected" />
    <slot v-if="disable" name="disabledButton" class="inline float-right" />
    <slot v-if="!disable && !selected" name="deselectedButton" class="inline float-right" />
  </label>
</template>

<script>
import CheckIndicator from '~/components/elements/CheckIndicator'
export default {
  name: 'FormRadioButton',
  components: { CheckIndicator },
  props: {
    name: {
      type: String,
      required: true
    },
    disable: {
      type: Boolean,
      default: () => false
    },
    id: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    },
    joined: {
      type: Boolean,
      default: () => false
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
      checked: false
    }
  },
  computed: {
    selected () {
      return this.id === this.value
    }
  },
  methods: {
    markChecked () {
      if (!this.disable) { this.$emit('input', this.id) }
    }
  }
}
</script>

<style scoped>
.radio-button {
  width: 200px;
}
</style>
