<template>
  <div class="pb-5 ipro:pb-8">
    <input
      :id="id"
      :value="value"
      :type="type"
      @input="$emit('input', $event.target.value)"
      required
      class="w-full h-16.25 border border-solid border-warm-grey rounded-5 focus:outline-none text-14-lineHeight-1 font-foodle pl-5">
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: String,
      default: () => ''
    },
    id: {
      type: String,
      default: () => ''
    },
    type: {
      type: String,
      default: () => ''
    }
  }
}
</script>
