/* eslint-disable vue/component-definition-name-casing */
import Vue from 'vue'
import Page from '~/components/Page'

import DiscoverKitchens from '~/components/sections/discover/DiscoverKitchens'
import FaqSection from '~/components/sections/faqs/FaqSection'
import GridSection from '~/components/sections/grid/GridSection'
import HeroSection from '~/components/sections/hero/HeroSection'
import InfoSection from '~/components/sections/info/InfoSection'
import KitchenTabs from '~/components/sections/kitchens/KitchenTabs'
import StorySection from '~/components/sections/story/StorySection'

import CtaButton from '~/components/elements/CtaButton'

// Layout Sections
Vue.component('page', Page)
Vue.component('discover_kitchens_section', DiscoverKitchens)
Vue.component('faq_section', FaqSection)
Vue.component('grid_section', GridSection)
Vue.component('hero_section', HeroSection)
Vue.component('info_section', InfoSection)
Vue.component('kitchen_tabs_section', KitchenTabs)
Vue.component('story_section', StorySection)

// Layout Elements
Vue.component('cta_button', CtaButton)
