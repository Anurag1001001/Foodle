<template>
  <div v-if="section" class="faqs">
    <div class="bg-white">
      <div class="max-w-screen-lg mx-auto py-12 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div class="mx-auto">
          <SectionHeader :size="sectionHeaderFontSize">
            {{ section.title }}
          </SectionHeader>
          <div class="mt-16 border-t border-foodler-gray pt-6">
            <dl>
              <FaqEntry v-for="(faq, index) in filteredFaqs" :key="index" :faq="faq" :first="index === 0" :last="index === (faqs.length - 1)" />
            </dl>
          </div>
          <div class="uppercase mt-8 font-bold">
            <nuxt-link v-for="cta in section.cta" :key="cta._uid" :to="cta.link.cached_url.replace('pages/', '')">
              {{ cta.text }}
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FaqEntry from '~/components/sections/faqs/FaqEntry'
import SectionHeader from '~/components/elements/SectionHeader'
export default {
  name: 'FaqSection',
  components: { SectionHeader, FaqEntry },
  props: {
    section: {
      type: Object,
      required: true
    },
    truncated: {
      type: Boolean,
      default: () => true
    }
  },
  data () {
    return {
      sectionHeaderFontSize: { default: '6xl', sm: '5xl' },
      faqs: [
      ]
    }
  },
  async fetch () {
    const context = this.$nuxt.context

    // Check if we are in the editor mode
    const version = context.query._storyblok || context.isDev ? 'draft' : 'published'

    // Load the JSON from the API
    this.faqs = await context.app.$storyapi.get('cdn/stories/faqs/', {
      version
    }).then((res) => {
      return res.data.story.content.items
    }).catch((res) => {
      context.error({ statusCode: res.response.status, message: res.response.data })
    })
  },
  computed: {
    filteredFaqs () {
      return parseInt(this.section.show_count) ? this.faqs.slice(0, parseInt(this.section.show_count)) : this.faqs
    }
  }
}
</script>

<style scoped>

</style>
