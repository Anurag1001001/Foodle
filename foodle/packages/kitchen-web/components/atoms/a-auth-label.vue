<template>
  <div class="pb-1.5 ipro:pb-2.5">
    <label class="text-11-lineHeight-1 font-foodle text-black font-bold uppercase ipro:text-14-lineHeight-1">
      <slot />
    </label>
  </div>
</template>

<script>
export default {
  props: {
    for: {
      type: String,
      default: () => ''
    }
  }
}
</script>
