<template>
  <div class="bg-white border border-solid border-light-peach rounded-5 pb-4 pt-2" style="height: fit-content">
    <span class="flex">
      <span class="flex-grow" />
      <button class="rounded-md focus:outline-none ease-linear transition-all duration-150 mr-2" type="button" @click="toggleDropdown()">
        <img :src="dropdownOpen ? '/images/svg/dropdown-up.svg' : '/images/svg/dropdown-down.svg'" class="rounded-md focus:outline-none ease-linear transition-all duration-150 mr-2 h-4 w-4" alt="">
      </button>
    </span>
    <div class="font-brown opacity-50 text-16-lineHeight-0.94 text-center mb-2 pt-2">
      Orderkapacitet: {{ value }} st
    </div>
    <div class="font-brown opacity-50 text-14-lineHeight-1.29 text-center">
      {{ name }}
    </div>
    <div :class="{'hidden': !dropdownOpen, 'block': dropdownOpen}" class="bg-white text-base float-bottom py-2 list-none border-solid border-light-peach rounded-5">
      <div class="py-2 px-4 block w-full whitespace-nowrap bg-transparent font-brown text-16-lineHeight-0.94 text-center">
        Nytt värde:
      </div>
      <div class="flex justify-center my-3">
        <input v-model="capacity" type="text" name="capacity" class="border border-solid border-light-peach rounded-5 h-12 w-32 text-center font-brown text-16-lineHeight-0.94 value-black">
      </div>
      <div class="px-6 py-2">
        <button class="h-16 w-full rounded-5 flex justify-center font-foodle text-14-lineHeight-1.43 font-bold text-white flex justify-center items-center" :class="{ 'bg-greyish': !capacityUpdated, 'bg-blue-500': capacityUpdated }" @click="updateCapacity">
          SPARA
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MTimeslotCell',
  props: {
    date: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    value: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      dropdownOpen: false,
      capacity: this.value,
      originalCapacity: this.value
    }
  },
  computed: {
    capacityUpdated () {
      return this.capacity !== this.originalCapacity
    }
  },
  watch: {
    value (newValue, oldValue) {
      this.capacity = newValue
      this.originalCapacity = newValue
    }
  },
  methods: {
    toggleDropdown () {
      this.dropdownOpen = !this.dropdownOpen
    },
    async updateCapacity () {
      await this.$fire.firestore.collection('time_slots').where('date', '==', this.date)
        .where('slot', '==', this.name).get().then((querySnapshot) => {
          if (querySnapshot.empty) {
            // Create new record
            this.$fire.firestore.collection('time_slots').doc(this.date + ' ' + this.name).set({
              slot: this.name,
              date: this.date,
              capacity: parseInt(this.capacity),
              orderCount: 0,
              orders: []
            })
          } else {
            // Update existing record
            this.$fire.firestore.collection('time_slots').doc(querySnapshot.docs[0].id).update({
              capacity: parseInt(this.capacity)
            })
          }
        })
    }
  }
}
</script>

<style scoped>

</style>
