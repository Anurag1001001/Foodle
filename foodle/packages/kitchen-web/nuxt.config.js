export default {
  // Target (https://go.nuxtjs.dev/config-target)
  target: 'static',

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'Foodle Kitchen',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    // link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/foodle_favicon.png' }]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '~/plugins/global.js',
    '~/plugins/timepicker.js',
    '~/plugins/main.js'
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
    '@nuxtjs/dotenv',
    '@nuxtjs/firebase',
    '@nuxtjs/moment'
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios'
  ],

  // Firebase module configuration (https://firebase.nuxtjs.org/service-options/all-services)
  firebase: {
    lazy: false,
    config: {
      apiKey: 'AIzaSyArWJnUDAOqNC9zLpr3XjSuXFde9vbn7qQ',
      authDomain: 'http://localhost:9099',
      databaseURL: 'http://localhost:9080',
      projectId: 'foodler-kitchen-web',
      storageBucket: 'foodler-kitchen-web.appspot.com',
      messagingSenderId: '414309715950',
      appId: '1:414309715950:web:b91a2dc09a26a1aab6c8ff',
      measurementId: 'G-J4FY1YTXWC'
    },
    // config: {
    //   apiKey: process.env.FIREBASE_API_KEY,
    //   authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    //   databaseURL: process.env.FIREBASE_DATABASE_URL,
    //   projectId: process.env.FIREBASE_PROJECT_ID,
    //   storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    //   messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    //   appId: process.env.FIREBASE_APP_ID,
    //   measurementId: process.env.FIREBASE_MEASUREMENT_ID
    // },
    services: {
      // auth: true,
      // firestore: true,
      functions: true,
      storage: false,
      database: false,
      messaging: false,
      performance: false,
      analytics: false,
      remoteConfig: false,
      auth: {
        initialize: {
          onAuthStateChangedAction: 'onAuthStateChanged'
        },
        ssr: true
        // emulatorPort: process.env.NODE_ENV === 'development' ? 9099 : undefined,
        // disableEmulatorWarnings: false
      },
      firestore: {
        memoryOnly: false
        // emulatorPort: process.env.NODE_ENV === 'development' ? 9080 : undefined
      }
      // functions: {
      //   emulatorPort:
      //     process.env.NODE_ENV === 'development' ? 5001 : undefined,
      // },
      // storage: true,
      // performance: true,
      // analytics: true,
      // remoteConfig: {
      //   settings: {
      //     fetchTimeoutMillis: 60000,
      //     minimumFetchIntervalMillis: 43200000,
      //   },
      //   defaultConfig: {
      //     welcome_message: 'Welcome',
      //   },
      // }
    }
  },

  moment: {
    locales: ['sv'],
    defaultLocale: 'sv',
    timezone: true,
    defaultTimezone: 'Europe/Stockholm'
  },

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {},

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    devtools: true
  },

  typescript: {
    typeCheck: true
  },

  publicRuntimeConfig: {
    open_time: '14:00',
    close_time: '21:00',
    slot_size: 20,
    capacity: 3
  }
}
