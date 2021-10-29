<template>
  <div class="mt-1 mb-8 relative rounded-md locationInput">
    <div class="relative">
      <client-only>
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <img src="/images/svg/location.svg" class="w-5">
        </div>
        <vue-auto-complete
          :id="id"
          :key="id"
          ref="addressField"
          :value="location.formatted_address"
          class="leading-16 bg-white font-brown h-16 w-full px-10 focus:outline-none rounded text-foodler-black shadow-sm
          text-opacity-50 focus:text-opacity-100"
          :class="{ 'bg-warm-gray-light': theme === 'dark', 'lg:w-2/3' : !widthFull, 'lg:pr-8': widthFull }"
          placeholder="Ange din adress"
          types="address"
          country="se"
          @focus="showGetMyLocation = true; error = ''"
          @placechanged="googleAutocompleteInit"
          @error="showError"
        />
      </client-only>
    </div>
    <div v-if="showGetMyLocation" class="relative">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <img src="/images/svg/userLocation.svg" class="w-5">
      </div>
      <div
        class="leading-16 bg-white font-brown h-16 w-full px-10 focus:outline-none rounded text-foodler-black shadow-sm
        text-opacity-50 focus:text-opacity-100 cursor-pointer"
        :class="{ 'bg-warm-gray-light': theme === 'dark', 'lg:w-2/3' : !widthFull, 'lg:pr-24': widthFull }"
        @click.prevent.stop="currentLocation"
      >
        Hämta min position
      </div>
    </div>
    <div v-if="showChangeButton" class="absolute text-foodler-black inset-y-0 right-0 pr-5 flex items-center cursor-pointer text-opacity-50">
      ÄNDRA
    </div>
    <Error v-if="error" v-model="errorMessage" :class="{'lg:w-2/3 md:text-sm' : !widthFull, 'lg:pr-8': widthFull }" />
    <div v-if="showNotification">
      <p class="text-black mt-2 max-w-md">
        {{ notification }}
      </p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Error from '~/components/elements/Error'
export default {
  name: 'LocationInput',
  components: { Error },
  props: {
    value: {
      type: String,
      default: () => ''
    },
    theme: {
      type: String,
      default: () => 'light'
    },
    widthFull: {
      type: Boolean,
      default: () => false
    },
    showChangeButton: {
      type: Boolean,
      default: () => true
    }
  },
  data () {
    return {
      showGetMyLocation: false,
      enableGeoLocation: true,
      error: false,
      errorMessage: '',
      notification: this.$t('labels.common.messages.address_serviceable'),
      showNotification: false,
      randomNumber: Math.random()
    }
  },
  computed: {
    id () {
      return 'map-' + this.randomNumber
    }
  },
  async mounted () {
    this.$nuxt.$on('location-changed', () => {
      this.randomNumber = Math.random()
    })
    if (this.location.postal_code && !(await this.isHomeDelivery(this.location.postal_code)).data) {
      setCartValue(this, true, false, this.deliveryTypePickup, this.$t('labels.common.messages.address_outside_serviceable'))
    } else {
      setCartValue(this, false, true, this.deliveryTypeDelivery)
      if (this.location.country) { this.showNotification = true }
    }
  },
  beforeDestroy () {
    this.$nuxt.$off('location-changed')
  },
  methods: {
    async currentLocation () {
      await navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { addressData, placeResultData } = await getStreetAddressFrom(this, position.coords.latitude, position.coords.longitude)
          await this.googleAutocompleteInit(addressData, placeResultData)
        },
        (error) => {
          this.showError(error.message)
        })
      this.showGetMyLocation = false
    },
    async googleAutocompleteInit (addressData, placeResultData) {
      if (!addressData.postal_code || !addressData.street_number) {
        this.error = true
        this.showNotification = false
        this.errorMessage = this.$t('labels.common.messages.choose_street_address') // Please select street address
      } else {
        if (!(await this.isHomeDelivery(addressData.postal_code)).data) {
          this.showNotification = false
          setCartValue(this, true, false, this.deliveryTypePickup, this.$t('labels.common.messages.address_outside_serviceable'))
        } else {
          this.showNotification = true
          setCartValue(this, false, true, this.deliveryTypeDelivery)
        }
        this.setLocation(addressData, placeResultData)
      }
    },
    showError (error = null) {
      this.error = true
      this.errorMessage = (error === null) ? 'Inga resultat funna' : error // No result found
    },
    setLocation (addressData, placeData) {
      placeData.formatted_address = placeData.formatted_address.split(',').slice(0, -1).join()
      addressData.formatted_address = placeData.formatted_address
      this.$store.dispatch('cart/addLocation', addressData)
      this.showGetMyLocation = false
      this.$nuxt.$emit('location-changed', this)
    }
  }
}
function setCartValue (ref, error, isServiceable, deliveryType, errorMessage = '') {
  ref.error = error
  ref.errorMessage = errorMessage
  ref.$store.dispatch('cart/isServiceable', isServiceable)
  ref.$store.dispatch('cart/setDeliveryType', deliveryType)
}

async function getStreetAddressFrom (ref, lat, long) {
  try {
    const { data } = await axios.get(
      'https://maps.googleapis.com/maps/api/geocode/json?latlng=' +
        lat +
        ',' +
        long +
        `&key=${process.env.GOOGLE_MAPS_API_KEY}`
    )
    if (data.error_message) {
      ref.showError(data.error_message)
    } else {
      const { addressData, placeResultData } = formatStreetAddress(data.results[0])
      return { addressData, placeResultData }
    }
  } catch (error) {
    console.log(error.message)
  }
}

function formatStreetAddress (place) {
  const ADDRESS_COMPONENTS = {
    subpremise: 'short_name',
    street_number: 'short_name',
    route: 'long_name',
    locality: 'long_name',
    administrative_area_level_1: 'short_name',
    administrative_area_level_2: 'long_name',
    country: 'long_name',
    postal_code: 'short_name'
  }
  const addressData = {}
  const placeResultData = {}
  for (let i = 0; i < place.address_components.length; i++) {
    const addressType = place.address_components[i].types[0]
    if (ADDRESS_COMPONENTS[addressType]) {
      const val = place.address_components[i][ADDRESS_COMPONENTS[addressType]]
      addressData[addressType] = val
    }
  }
  addressData.latitude = place.geometry.location.lat
  addressData.longitude = place.geometry.location.lng
  addressData.formatted_address = place.formatted_address
  placeResultData.formatted_address = place.formatted_address
  return { addressData, placeResultData }
}
</script>

<style scoped>
input::placeholder {
  line-height: 4rem;
}
/* this will fix content jumping issue */
.locationInput {
  min-height: 14vh;
}

/* Media Queries */

/* Mobile Devices - Phones/Tablets */
@media only screen and (max-width: 1021px) {
  .locationInput {
  min-height: 18vh;
}
}
</style>
