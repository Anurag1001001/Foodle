<template>
  <div class="px-6 py-6">
    <div class="flex items-baseline justify-center">
      <img :src="entry.image.filename" class="h-32" :alt="entry.title">
    </div>
    <div class="mt-4 text-center">
      <SectionSubHeader>
        {{ entry.title }}
      </SectionSubHeader>
      <p class="mt-5 text-base leading-6 text-foodler-black font-hairline">
        {{ entry.text }}
      </p>
    </div>
  </div>
</template>

<script>
import SectionSubHeader from '~/components/elements/SectionSubHeader'
export default {
  name: 'GridEntry',
  components: { SectionSubHeader },
  props: {
    entry: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>

</style>
