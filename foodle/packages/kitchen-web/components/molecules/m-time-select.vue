<template>
  <div class="col-span-5 bg-white border border-solid border-light-peach rounded-5">
    <span class="flex">
      <span class="flex-grow" />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        aria-hidden="true"
        focusable="false"
        width="1.25em"
        height="1em"
        style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);"
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 3 16 13"
      ><g fill="#d6d2d2"><path d="M3 9.5a1.5 1.5 0 1 1 0-3a1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3a1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3a1.5 1.5 0 0 1 0 3z" /></g><rect x="0" y="0" width="16" height="16" fill="rgba(0, 0, 0, 0)" />
      </svg>
    </span>
    <div class="font-brown text-16-lineHeight-0.94 text-center">
      <VueCtkDateTimePicker
        :id="title"
        v-model="dataTemp"
        :only-time="true"
        format="HH:mm"
        minute-interval="20"
        label=""
        formatted="HH:mm"
        overlay-background="true"
      />
    </div>
    <div class="font-brown opacity-50 text-13-lineHeight-1.15 text-center pt-2">
      {{ title }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'MTimeSelect',
  props: {
    value: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      dataTemp: this.value
    }
  },
  watch: {
    value (newValue, oldValue) {
      this.dataTemp = newValue
    },
    dataTemp (newValue, oldValue) {
      this.$emit('input', newValue)
    }
  }
}
</script>

<style scoped>

</style>
