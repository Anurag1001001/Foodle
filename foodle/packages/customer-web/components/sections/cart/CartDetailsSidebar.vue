<template>
  <div v-show="show" class="cart-slider fixed inset-0 overflow-hidden bg-gray-800 bg-opacity-50" @click="closeSideBar">
    <div class="absolute inset-0 overflow-hidden">
      <section class="absolute inset-y-0 right-0 sm:pl-10 max-w-full flex">
        <transition
          enter-active-class="transform transition ease-in-out duration-500 sm:duration-700"
          enter-class="translate-x-full"
          enter-to-class="translate-x-0"
          leave-active-class="transform transition ease-in-out duration-500 sm:duration-700"
          leave-class="translate-x-0"
          leave-to-class="translate-x-full"
        >
          <div v-show="show" class="w-screen w-full lg:max-w-md xl:max-w-md" @click.prevent.stop="">
            <div class="h-full divide-y divide-gray-200 flex flex-col bg-white shadow-xl">
              <div class="min-h-0 flex-1 flex flex-col py-6 overflow-y-scroll">
                <header class="px-4 sm:px-6">
                  <div class="flex items-start justify-between space-x-3">
                    <h1 class="font-bold text-lg leading-7 font-medium text-foodler-black">
                      Varukorg <span class="font-normal">({{ $store.state.cart.cart.items.length }} varor) </span>
                    </h1>
                    <div class="h-7 flex items-center">
                      <button aria-label="Close panel" class="transition ease-in-out duration-150 focus:outline-none" @click.prevent.stop="closeSideBar">
                        <!-- Heroicon name: x -->
                        <svg class="h-8 w-8 px-1 py-1 bg-white use-shadow rounded-full" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </header>
                <div class="relative flex-1 px-4 sm:px-6">
                  <!-- Replace with your content -->
                  <div class="absolute inset-0 py-6">
                    <div class="px-4 lg:px-6">
                      <div v-if="isLocationInput" class="bg-warm-gray-light rounded px-4 py-7 lg:px-5 text-black">
                        <div class="grid grid-cols-2">
                          <p class="text-base font-bold">
                            Leveransuppgifter
                          </p>
                          <p class="text-right text-xs opacity-50" @click="showLocationInput">
                            ÄNDRA
                          </p>
                        </div>
                        <div class="pt-4 text-base">
                          <p>{{ location.formatted_address }}</p>
                        </div>
                      </div>
                      <LocationBox v-else :width-full="trueValue" :show-change-button="falseValue" />
                      <div v-if="cartDetails.items.length" class="h-full mb-24">
                        <div v-for="(item, index) in cartDetails.items" :key="index" class="grid grid-cols-4 mt-12">
                          <p class="text-base font-bold col-span-3">
                            {{ item.heading }}
                          </p>
                          <p class="justify-self-end">
                            {{ formatAmount(item.price) }}
                          </p>
                          <p v-if="item.customizations !== undefined" class="pt-2 col-span-3">
                            <span v-if="'variant_id' in item.customizations.variant">
                              {{ (item.customizations.variant.options[0]).label }}<br>
                            </span>
                            <span v-for="(customization, cIndex) in item.customizations.customize.items" :key="key + cIndex">
                              - {{ customization }}<br>
                            </span>
                            <template v-for="(key, index) in addOnList">
                              <span v-if="key.toLowerCase() in item.customizations" :key="key + index">
                                <template v-for="(key1, idx) in item.customizations[key.toLowerCase()]">
                                  <span :key="key1 + idx">+ {{ item.customizations[key.toLowerCase()][idx].name }}<br></span>
                                </template>
                              </span>
                            </template>
                          </p>
                          <div v-if="item.kitchenModuleType === moduleTypes.grid" class="pt-2 col-span-3 text-base font-bold">
                            <button :disabled="item.customizations.selectedItems < 2" :class="{ 'text-gray-300': item.customizations.selectedItems <= 1 }" @click.prevent.stop="decreaseItemCount(index, item)">
                              -
                            </button>
                            <span class="pl-2 pr-2">{{ item.customizations.selectedItems }}</span>
                            <button @click.prevent.stop="increaseItemCount(index, item)">
                              +
                            </button>
                          </div>
                          <nuxt-link to="/" class="justify-self-end pt-2">
                            <img src="/images/svg/trash.svg" class="w-6 h-6" alt="" @click.prevent.stop="removeItemFromCart(index, item)">
                          </nuxt-link>
                        </div>
                      </div>
                      <div v-else class="pt-20">
                        <div class="text-center leading-20 font-bold font-colby leading-tight text-3-5xl lg:text-3rem text-foodler-black">
                          Här var det <br>TOMT!
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- /End replace -->
                </div>
              </div>
              <div class="bottomDiv use-shadow px-4 lg:px-6">
                <div class="grid grid-cols-2 mt-6 text-lg">
                  <div>
                    <h1>
                      <span class="font-bold">{{ $t('labels.cart.final_amount_to_pay') }}</span> <span class="sm:text-base text-sm">({{ $t('labels.cart.including_taxes') }})</span>
                    </h1>
                  </div>
                  <div class="text-right">
                    <p>{{ formatAmount(discountedAmount) }}</p>
                  </div>
                  <div v-if="coupon && discountedAmount">
                    <h2 class="font-bold text-sm">
                      {{ $t('labels.cart.rebate') }} <span class="text-sm opacity-75 text-green-600">{{ couponText }}</span>
                    </h2>
                  </div>
                  <div v-if="coupon && discountedAmount" class="text-right text-sm">
                    <p>{{ formatAmount(discountAmount) }}</p>
                  </div>
                  <div v-if="shippingAmount">
                    <h2 class="font-bold text-sm">
                      {{ $t('labels.cart.delivery_cost') }}
                    </h2>
                  </div>
                  <div v-if="shippingAmount" class="text-right text-sm">
                    <p>{{ shippingAmountFormatted }}</p>
                  </div>
                </div>
                <div class="mt-3 mb-6 lg:mt-4">
                  <span class="flex w-full rounded-md shadow-sm">
                    <CtaButton class="w-full" name="goToCheckout" :enabled="isOverMinimumCartAmount" @clicked="goToDelivery">
                      <template v-if="!isOverMinimumCartAmount">
                        {{ $t('buttons.sidebar_checkout_minimum_cart_value', { min_amount: minimumCartAmountFormatted }) }}
                      </template>
                      <template v-else>
                        {{ $t('buttons.sidebar_checkout') }}
                      </template>
                    </CtaButton>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </section>
    </div>
  </div>
</template>

<script>
import CtaButton from '~/components/elements/CtaButton'
import LocationBox from '~/components/sections/hero/LocationBox'
export default {
  name: 'CartDetailsSidebar',
  components: { CtaButton, LocationBox },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isLocationInput: true
    }
  },
  methods: {
    closeSideBar () {
      this.isLocationInput = true
      this.$store.dispatch('states/showSidebar', false)
    },
    goToDelivery () {
      this.closeSideBar()
      if (JSON.stringify(this.location) === '{}') {
        this.$store.dispatch('cart/setDeliveryType', this.deliveryTypePickup)
      }
      this.goToDeliveryPage()
    },
    showLocationInput () {
      this.isLocationInput = false
    }
  }
}
</script>

<style scoped>
.cart-slider {
  z-index: 9999;
}
.bottomDiv{
  position: sticky;
}
.use-shadow {
  box-shadow: 0 0 40px 0 rgba(0, 0, 0, 0.1);
}
</style>
