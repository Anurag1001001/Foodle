import { messages } from './plugins/i18n'

export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'Foodle',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'facebook-domain-verification', content: 'day4cg02vju7831ynzcfm1ulyy51kp' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/foodle_favicon.png' }
    ],
    script: [
      {
        hid: 'maps-googleapis',
        src: `https://maps.googleapis.com/maps/api/js?libraries=places&key=${process.env.GOOGLE_MAPS_API_KEY}`,
        defer: true
      },
      {
        hid: 'maps-googleapis',
        src: 'https://www.googletagmanager.com/gtag/js?id=G-YC9H4S8XY0',
        defer: true
      }
    ]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
    '~/assets/css/main.css'
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '~/plugins/composition-api.js',
    '~/plugins/carousel.js',
    '~/plugins/storyblok-components.js',
    // https://storyblok-rich-text-renderer.netlify.app/vue-plugin/usage/#with-nuxt-js
    '~/plugins/rich-text-renderer.js',
    { src: '~/plugins/global.js', mode: 'client' },
    { src: '~/plugins/autocomplete.js', mode: 'client' },
    '~/plugins/vuelidate.js',
    '~/plugins/axios.js',
    '~/plugins/adyen-web.js',
    '~/plugins/i18n.js'
  ],
  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://github.com/nuxt-community/fontawesome-module
    '@nuxtjs/fontawesome',
    '@nuxtjs/dotenv',
    '@nuxtjs/moment'
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/apollo',
    // https://go.nuxtjs.dev/pwa
    'vue-screen/nuxt',
    // https://github.com/storyblok/storyblok-nuxt
    ['storyblok-nuxt', {
      accessToken: process.env.STORYBLOK_ACCESS_TOKEN,
      cacheProvider: 'none'
    }],
    'nuxt-i18n',
    'nuxt-facebook-pixel-module',
    ['nuxt-lazy-load',
      {
        images: true,
        videos: true
      }]
  ],

  facebook: {
    /* module options */
    track: 'PageView',
    pixelId: '918952558946064',
    autoPageView: true,
    disabled: false
  },

  i18n: {
    locales: ['se'],
    defaultLocale: 'se',
    vueI18n: {
      fallbackLocale: 'se',
      messages
    }
  },

  fontawesome: {
    icons: {
      brands: ['faInstagram', 'faFacebookF']
    }
  },

  moment: {
    locales: ['sv'],
    defaultLocale: 'sv',
    timezone: true,
    defaultTimezone: 'Europe/Stockholm'
  },

  screen: {
    extend: 'tailwind'
  },

  serverMiddleware: [
    { path: '/api', handler: '~/server-middleware/rest.js' },
    { path: '/api/serviceableArea', handler: '~/server-middleware/serviceableArea.js' },
    { path: '/api/payments/', handler: '~/server-middleware/payment.js' }
  ],

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    baseURL: '/'
  },

  // Apollo Configuration (https://github.com/nuxt-community/apollo-module)
  apollo: {
    clientConfigs: {
      default: '~/plugins/apollo.js'
    },
    authenticationType: 'Bearer'
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    devtools: true
  },

  typescript: {
    typeCheck: true
  },

  publicRuntimeConfig: {
    addons: 'Extras, Accessories, Sides, Drinks'
  }
}
