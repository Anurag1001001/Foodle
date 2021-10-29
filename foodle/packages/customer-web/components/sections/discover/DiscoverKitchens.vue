<template>
  <div class="discover-kitchens py-12 bg-white lg:py-12">
    <div class="">
      <div class="mx-auto px-0 lg:px-6 lg:max-w-screen-xl lg:px-8 content-center">
        <div class="mx-auto mb-12">
          <SectionAlternateSmallHeader>
            {{ section.title }}
          </SectionAlternateSmallHeader>
        </div>
        <client-only>
          <div class="justify-center">
            <div v-if="slider" class="flex">
              <ArrowIndicator direction="left" parent="home-slider" :disabled="swiperStartReached" />
              <Swiper
                ref="swiper"
                :options="swiperOptions"
                class="swiper"
                @slide-change="slideChanged"
              >
                <KitchenSingle v-for="(kitchen, index) in kitchens" :key="index" :item="kitchen" />
              </Swiper>
              <ArrowIndicator direction="right" parent="home-slider" :disabled="swiperEndReached" />
            </div>
            <div v-else class="mx-6 lg:mx-32 grid grid-cols-1 lg:grid-cols-3 gap-x-5 gap-y-16 lg:mt-0">
              <template v-for="(kitchen, index) in kitchens">
                <KitchenSingle :key="index" :slider-required="falseValue" :item="kitchen"/>
              </template>
            </div>
          </div>
        </client-only>
        <div v-if="slider" class="flex">
          <div class="mt-12 mx-auto">
            <CtaButton v-for="(cta, ctaIndex) in section.cta" :key="ctaIndex" type="white-background-with-border" :name="'goToKitchens-'+ cta.link.cached_url" @clicked="goToUrl(cta.link.cached_url.replace('pages/', '/'))">
              {{ cta.text }}
            </CtaButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SectionAlternateSmallHeader from '~/components/elements/SectionAlternatSmallHeader'
import CtaButton from '~/components/elements/CtaButton'
import KitchenSingle from '~/components/sections/discover/KitchenSingle'
import ArrowIndicator from '~/components/elements/ArrowIndicator'
export default {
  name: 'DiscoverKitchens',
  components: { SectionAlternateSmallHeader, ArrowIndicator, KitchenSingle, CtaButton },
  props: {
    section: {
      type: Object,
      required: true
    },
    basicHeaderFont: {
      type: Boolean,
      default: () => false
    }
  },
  data () {
    return {
      kitchens: this.section.items,
      swiperEndReached: false,
      swiperStartReached: true,
      sectionHeaderFontSize: { default: '6xl', sm: '5xl' }
    }
  },
  fetch () {
    const context = this.$nuxt.context

    // Check if we are in the editor mode
    const version = context.query._storyblok || context.isDev ? 'draft' : 'published'

    // Load the JSON from the API
    this.kitchens = this.kitchenList
  },
  computed: {
    slideCount () {
      return this.$screen.lg ? 3 : 1
    },
    swiperOptions () {
      return {
        slidesPerView: this.$screen.lg ? 3 : 1,
        spaceBetween: 12,
        slidesPerGroup: this.$screen.lg ? 3 : 1,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      }
    },
    slider () {
      return this.section.type === 'slider'
    }
  },
  mounted () {
    this.$nuxt.$on('arrowClicked-home-slider', (payload) => {
      if (payload.direction === 'left') {
        this.prevSlide()
      } else {
        this.nextSlide()
      }
    })
  },
  beforeDestroy () {
    this.$nuxt.$off('arrowClicked-home-slider')
  },
  methods: {
    nextSlide () {
      this.$refs.swiper.swiperInstance.slideNext(1000)
    },
    prevSlide () {
      this.$refs.swiper.swiperInstance.slidePrev(1000)
    },
    slideChanged (payload) {
      this.swiperStartReached = payload.isBeginning
      this.swiperEndReached = payload.isEnd
    }
  }
}
</script>

<style scoped>

</style>
