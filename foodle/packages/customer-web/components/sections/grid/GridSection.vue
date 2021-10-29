<template>
  <div class="grid-section py-10 bg-foodler-blue lg:py-24">
    <div class="max-w-screen-lg mx-auto">
      <div class="sm:px-6 content-center">
        <div class="mx-auto mb-6 lg:mb-24">
          <SectionHeader>
            {{ section.title }}
          </SectionHeader>
        </div>
        <div class="lg:grid lg:grid-cols-3">
          <GridEntry v-for="(entry, index) in section.entries" :key="index" :entry="entry" />
        </div>
        <div class="flex">
          <div class="mt-4 mx-auto">
            <CtaButton
              v-for="cta in section.ctas"
              :key="cta._uid"
              type="white-background-no-border"
              :name="section._uid"
              :cta="cta"
              @clicked="goToUrl(cta.link.cached_url.replace('pages/', ''))"
            >
              {{ cta.text }}
            </CtaButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SectionHeader from '~/components/elements/SectionHeader'
import GridEntry from '~/components/sections/grid/GridEntry'
import CtaButton from '~/components/elements/CtaButton'

export default {
  name: 'GridSection',
  components: { CtaButton, GridEntry, SectionHeader },
  props: {
    section: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>

</style>
