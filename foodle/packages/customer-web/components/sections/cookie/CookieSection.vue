<template>
  <div class="fixed inset-x-0 bottom-0 shadow-sm" :class="{ 'hidden': cookiesAccepted, 'visible': !cookiesAccepted }">
    <div class="bg-white cookies">
      <div class="max-w-screen-lg mx-auto py-8 px-3 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between flex-wrap flex-col lg:flex-row">
          <div class="w-auto flex-1 flex items-center">
            <p class="ml-3 font-medium text-base text-center lg:text-left">
              Vi använder cookies för att ge dig en bättre upplevelse av webbplatsen. Genom att fortsätta accepterar du att cookie används. Lär mer i vår <nuxt-link to="/">
                integritetspolicy
              </nuxt-link>
            </p>
          </div>
          <div class="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto items-center flex">
            <div class="mt-4 mx-auto">
              <CtaButton name="cookiesAccepted">
                Jag accepterar
              </CtaButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CtaButton from '~/components/elements/CtaButton'
export default {
  name: 'CookieSection',
  components: { CtaButton },
  data () {
    return {
      cookiesAccepted: true
    }
  },
  created () {
    this.$nuxt.$on('buttonClicked', (payload) => {
      if (payload.name === 'cookiesAccepted') {
        this.$store.dispatch('acceptCookies').then((res) => {
          this.$nuxt.$emit('cookiesAccepted')
        })
      }
    })
    this.$nuxt.$on('cookiesAccepted', (payload) => {
      this.cookiesAccepted = true
    })
  },
  mounted () {
    this.cookiesAccepted = !!this.$store.getters.areTermsAccepted
  }
}
</script>

<style scoped>
.cookies {
  box-shadow: 0 2px 40px 0 rgba(0, 0, 0, 0.1)

}
</style>
