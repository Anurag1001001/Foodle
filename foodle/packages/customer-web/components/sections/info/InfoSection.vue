<template>
  <div v-if="section" class="py-20 px-6 sm:px-6 sm:pt-48 lg:px-8 lg:py-24 lg:pt-48" :class="section.background_style">
    <div class="relative max-w-xl mx-auto">
      <div class="">
        <SectionHeader :color="isDark ? 'secondary' : 'foodler-black'" class="mb-16">
          {{ section.title }}
        </SectionHeader>
        <div v-if="section.content" class="text-lg lg:text-lg mt-8 text-center">
          <rich-text-renderer :document="content" />
        </div>
        <!--        <div v-for="(element, index) in section.elements[0].text.content" :key="index" class="text-lg lg:text-lg mt-8">-->
        <!--          <div v-if="element.type === 'heading'" class="text-2xl font-bold" :class="{ 'text-secondary': isDark }">-->
        <!--            <div v-for="(line, lineIndex) in element.content" :key="lineIndex">-->
        <!--              {{ line.text }}-->
        <!--            </div>-->
        <!--          </div>-->
        <!--          <div v-if="element.type === 'paragraph'" class="mt-4" :class="{ 'text-white': isDark }">-->
        <!--            <div v-for="(line, lineIndex) in element.content" :key="lineIndex">-->
        <!--              {{ line.text }}-->
        <!--            </div>-->
        <!--          </div>-->
      </div>
    </div>
  </div>
</template>
<script>
import SectionHeader from '~/components/elements/SectionHeader'
export default {
  name: 'InfoComponent',
  components: { SectionHeader },
  props: {
    section: {
      type: Object,
      required: true
    }
  },
  computed: {
    content () {
      const contentObj = this.section.content
      contentObj.content.forEach((contentSingle, index) => {
        if (typeof contentSingle.attrs === 'undefined') {
          contentSingle.attrs = {}
        }
        contentSingle.attrs.isDark = this.isDark
      })
      return contentObj
    },
    theme () {
      return this.section.background_style === 'bg-white' ? 'light' : 'dark'
    },
    isDark () {
      return this.section.background_style !== 'bg-white'
    }
  }
}
</script>

<style scoped>
</style>
