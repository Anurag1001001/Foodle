<template>
  <FormBlock>
    <template #header>
      <div class="text-2xl font-bold float-left">
        1. Dina uppgifter
      </div>
    </template>

    <div class="location-section mt-12">
      <FormFieldHeading>
        Leveransuppgifter
      </FormFieldHeading>
      <DeliveryInformationBox />
    </div>

    <div class="user-info-section mt-12">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-x-4 lg:gap-y-16 gap-y-8">
        <div>
          <FormFieldHeading :error="errors.first_name">
            Förnamn
            <template #post>
              <RequiredIndicator />
            </template>
          </FormFieldHeading>
          <div>
            <InputField
              v-model="info.first_name"
              :width-full="1 === 1"
              :checks="trueValue"
              @onErrorOccurred="errors.first_name = true"
              @noError="errors.first_name = false"
            />
          </div>
        </div>
        <div>
          <FormFieldHeading :error="errors.last_name">
            Efternamn
            <template #post>
              <RequiredIndicator />
            </template>
          </FormFieldHeading>
          <div>
            <InputField
              v-model="info.last_name"
              :width-full="1 === 1"
              :checks="trueValue"
              @onErrorOccurred="errors.last_name = true"
              @noError="errors.last_name = false"
            />
          </div>
        </div>
        <div>
          <FormFieldHeading :error="errors.phone">
            Telefonnummer
            <template #post>
              <RequiredIndicator />
            </template>
          </FormFieldHeading>
          <div>
            <InputField
              v-model="info.phone"
              :width-full="1 === 1"
              :checks="trueValue"
              type="tel"
              @onErrorOccurred="errors.phone = true"
              @noError="errors.phone = false"
            />
          </div>
        </div>
        <div>
          <FormFieldHeading :error="errors.email">
            E-post
            <template #post>
              <RequiredIndicator />
            </template>
          </FormFieldHeading>
          <div>
            <InputField
              v-model="info.email"
              :width-full="1 === 1"
              :checks="trueValue"
              type="email"
              @onErrorOccurred="errors.email = true"
              @noError="errors.email = false"
            />
          </div>
        </div>
        <div v-if="$store.state.cart.delivery.type === 'Hemleverans'">
          <FormFieldHeading>
            Portkod (valfritt)
          </FormFieldHeading>
          <div>
            <InputField v-model="info.port_code" :checks="falseValue" />
          </div>
        </div>
      </div>
      <div class="lg:mt-16 mt-8">
        <div>
          <FormFieldHeading>
            Meddelande (valfritt)
          </FormFieldHeading>
          <div>
            <InputTextArea v-model="info.message" :width-full="1 === 1" :lines="10" />
          </div>
        </div>
      </div>
      <div class="mt-8">
        <FormFieldHeading>
          <template #pre>
            <RequiredIndicator />
          </template>
          Obligatoriskt
        </FormFieldHeading>
      </div>
      <SlotUnavailable v-if="!slotAvailable" v-model="message"/>
      <div class="mt-16">
        <div class="grid justify-center">
          <CtaButton type="white-background-with-border" class="tracking" :enabled="!isAnyError && !loading" @clicked="submitInfo">
            <span v-if="!loading">Välj betalsätt</span>
            <span v-else>Skickar beställning...</span>
          </CtaButton>
        </div>
      </div>
    </div>
  </FormBlock>
</template>

<script>
import FormBlock from '~/components/elements/FormBlock'
import DeliveryInformationBox from '~/components/elements/DeliveryInformationBox'
import FormFieldHeading from '~/components/elements/FormFieldHeading'
import InputField from '~/components/elements/InputField'
import InputTextArea from '~/components/elements/InputTextArea'
import CtaButton from '~/components/elements/CtaButton'
import RequiredIndicator from '~/components/elements/RequiredIndicator'
import SlotUnavailable from '~/components/elements/SlotUnavailable.vue'
export default {
  name: 'YourInformation',
  components: { SlotUnavailable, RequiredIndicator, CtaButton, InputTextArea, InputField, FormFieldHeading, DeliveryInformationBox, FormBlock },
  data () {
    return {
      info: {
        first_name: this.$store.state.cart.customer.first_name,
        last_name: this.$store.state.cart.customer.last_name,
        phone: this.$store.state.cart.customer.phone,
        email: this.$store.state.cart.customer.email,
        port_code: this.$store.state.cart.customer.port_code,
        message: this.$store.state.cart.customer.message
      },
      errors: {
        first_name: null,
        last_name: null,
        phone: null,
        email: null
      },
      slotAvailable: true,
      message: this.$t('labels.common.messages.slot_unavailable')
    }
  },
  computed: {
    isAnyError () {
      return this.errors.first_name ||
      this.errors.last_name ||
      this.errors.phone ||
      this.errors.email ||
        this.info.first_name === undefined ||
        this.info.last_name === undefined ||
        this.info.phone === undefined ||
        this.info.email === undefined ||
        !this.isOverMinimumCartAmount
    }
  },
  methods: {
    async submitInfo () {
      this.slotAvailable = await this.validateSlot(this.$moment(this.$store.state.cart.delivery.date).format('YYYY-MM-DD'), this.$store.state.cart.delivery.startTime + '-' + this.$store.state.cart.delivery.endTime)
      if (this.slotAvailable) {
        this.$store.dispatch('cart/updateCustomer', this.info)
        this.gotToCheckout()
      } else {
        console.log('Choosen slot is not available, please select another one')
      }
    }
  }
}
</script>

<style scoped>
.tracking {
  letter-spacing: 0px !important;
}
</style>
