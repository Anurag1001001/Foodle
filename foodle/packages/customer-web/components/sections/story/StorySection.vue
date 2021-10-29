<template>
  <div>
    <div class="bg-bubblegum px-4 pt-32 pb-8 lg:px-6 sm:pt-48 lg:px-8 lg:pt-48 lg:pb-8">
      <div :class="{ 'relative max-w-xl mx-auto' : !section.is_two_column }">
        <SectionHeader color="tomato" :size="sectionHeaderFontSize">
          {{ section.title }}
        </SectionHeader>
        <div class="max-w-screen-lg mx-auto my-8 lg:my-16 px-4 sm:px-6 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 class="leading-5 text-tomato mb-20 lg:mb-2" :class="{ 'lg:w-1/2 lg:text-left' : section.is_two_column, 'text-center' : !section.is_two_column }">
            {{ section.text }}
          </h2>
          <div v-if="section.image.filename" class="flex flex-col lg:w-1/2">
            <div class="text-6xl mx-auto">
              <img :src="section.image.filename" alt="">
            </div>
            <div class="mt-4 text-5xl lg:text-5rem leading-tight text-tomato font-felt mx-auto text-center px-8">
              {{ section.teaser }}
            </div>
          </div>
        </div>
        <div class="flex">
          <div v-if="section.ctas && section.ctas.length > 0" class="mt-2 mx-auto lg:mt-12">
            <CtaButton
              v-for="cta in section.ctas"
              :key="cta._uid"
              type="white-outline"
              :name="cta._uid"
              :cta="cta"
              @clicked="goToUrl(cta.link.cached_url.replace('pages/', ''))"
            >
              {{ cta.text }}
            </CtaButton>
          </div>
        </div>
      </div>
    </div>
    <span v-if="!section.is_two_column" v-html="section.svg" />
  </div>
</template>

<script>
import SectionHeader from '~/components/elements/SectionHeader'
import CtaButton from '~/components/elements/CtaButton'

export default {
  name: 'StorySection',
  components: { CtaButton, SectionHeader },
  props: {
    section: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      sectionHeaderFontSize: { default: '6xl', sm: '5xl' }
    }
  }
}
</script>

<style scoped>

</style>
