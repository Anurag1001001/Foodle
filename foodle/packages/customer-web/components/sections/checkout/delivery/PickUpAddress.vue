<template>
  <div class="mt-10">
    <div
      class="mt-1 border-2 rounded-md"
    >
      <div class="m-6 left-0">
        <h1 class="text-base font-bold">
          {{ city }}
        </h1>
        <p class="opacity-50">
          {{ address }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import FormFieldHeading from '~/components/elements/FormFieldHeading'
export default {
  name: 'PickUpAddress',
  components: { FormFieldHeading },
  data () {
    return {
      city: null,
      address: null
    }
  },
  created () {
    this.city = process.env.STORE_ADDRESS_CITY
    this.address = process.env.STORE_ADDRESS_STREET_1 + ' ' + process.env.STORE_ADDRESS_CITY + ' ' + process.env.STORE_ADDRESS_ZIP + ' ' + ' ' + process.env.STORE_ADDRESS_COUNTRY
  }
}
</script>
<style scoped>

</style>
