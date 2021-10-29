<template>
  <div class="grid grid-cols-10 text-white text-lg bg-tomato p-4 mt-2 mb-10 w-full bg-opacity-50">
    <div class="col-span-8">
      <h1><b>Sorry!!</b></h1>
      <p>{{ value }}</p>
    </div>
    <div class="col-span-2 justify-self-end cursor-pointer" @click.prevent="Change">
      <p class="text-sm">
        ÄNDRA
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SlotUnavailable',
  props: {
    value: {
      type: String,
      required: true
    }
  },
  methods: {
    Change () {
      this.$router.push('/checkout/delivery')
    }
  }
}
</script>
