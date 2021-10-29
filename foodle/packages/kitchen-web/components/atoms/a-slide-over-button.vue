<template>
  <div class="flex-shrink-0 flex justify-end">
    <button class="w-full h-16.25 text-14-lineHeight-1.43 rounded-5 font-foodle border-2 border-light-royal-blue hover:text-blue-400 hover:border-blue-400 text-light-royal-blue font-bold focus:outline-none uppercase mt-5.5 flex items-center justify-center ipro:h-20 ipro:text-lg" @click.prevent.stop="$emit('click')">
      <slot />
    </button>
  </div>
</template>

<script>
export default {
}
</script>
