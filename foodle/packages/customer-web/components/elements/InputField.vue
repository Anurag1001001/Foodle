<template>
  <div class="inline">
    <div v-if="enabled">
      <input
        v-model="data"
        :type="type"
        class="leading-16 inline bg-white border-4 h-16 px-2 rounded text-foodler-black
      text-opacity-50 focus:text-opacity-100"
        :class="{ 'w-full': widthFull, 'border-red-500': isError, 'border-input-border-active': !isError }"
        @focusout="$v.data.$touch()"
        @change="$v.data.$touch()"
        @input="$emit('input', $event.target.value)"
      >
      <span v-if="isError" class="text-red-500">{{ errorMessage }}</span>
      <slot name="inline-component" />
    </div>
    <input
      v-else
      v-model="data"
      type="text"
      disabled
      class="leading-16 inline bg-warm-gray-light border-4 h-12 p-4 rounded text-foodler-black
      text-opacity-25 border-warm-gray-light pointer-events-none"
      :class="{ 'w-full': widthFull }"
    >
  </div>
</template>

<script>
import { required, email } from 'vuelidate/lib/validators'

export default {
  name: 'InputField',
  props: {
    checks: {
      type: Boolean,
      required: true
    },
    enabled: {
      type: Boolean,
      default: () => true
    },
    value: {
      type: String,
      default: () => ''
    },
    widthFull: {
      type: Boolean,
      default: () => false
    },
    type: {
      type: String,
      default: () => 'text'
    }
  },
  data () {
    return {
      data: this.value
    }
  },
  computed: {
    isError () {
      return this.checks && this.$v.data.$anyError && this.$v.data.$dirty
    },
    isFilled () {
      return this.data !== ''
    },
    errorMessage () {
      if (this.isError) {
        if (!this.$v.data.required) {
          return 'Detta fält krävs'
        } else if (typeof this.$v.data.email !== 'undefined' && !this.$v.data.email) {
          return 'Ange information i e-postformat'
        } else if (typeof this.$v.data.phone !== 'undefined' && !this.$v.data.phone) {
          return 'Ange giltigt telefonnummer'
        }
      }
      return this.$v.data
    },
    rules () {
      const ruleList = {}
      if (this.checks) {
        ruleList.required = required
      }
      if (this.type === 'email') {
        ruleList.email = email
      }
      if (this.type === 'tel') {
        ruleList.phone = (value) => {
          if (value.match(/^(([+]46)\s*(7)|07)[02369]\s*(\d{4})\s*(\d{3})$/)) {
            return true
          } else {
            return false
          }
        }
      }
      return ruleList
    }
  },
  watch: {
    isError (newValue, oldValue) {
      if (newValue && !oldValue) {
        this.$emit('onErrorOccurred')
      } else {
        this.$emit('noError')
      }
    }
  },
  validations () {
    return {
      data: this.rules
    }
  }
}
</script>

<style scoped>
input::placeholder {
  line-height: 4rem;
}
</style>
