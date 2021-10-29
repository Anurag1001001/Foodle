<template>
  <div>
    <a-timeslot-title>
      Tidsslots
    </a-timeslot-title>
    <div class="relative min-h-screen bg-white-two px-8 py-8">
      <div class="grid grid-cols-3 gap-10 mb-9">
        <m-date-dropdown v-model="selectedDay" />
        <div class="flex flex-col">
          <div class="font-brown font-bold text-12-lineHeight-1 mb-2 uppercase tracking-wider">
            Dagens öppetider
          </div>
          <div v-if="storeTimings.open_time && storeTimings.close_time" class="grid grid-cols-11 h-17.5">
            <m-time-select v-model="storeTimings.open_time" title="Öppnar" />
            <div class="flex justify-center items-center font-brown text-26-lineHeight-0.58">
              -
            </div>
            <m-time-select v-model="storeTimings.close_time" title="Stänger" />
          </div>
          <a-loader v-else class="text-center" />
        </div>
        <div v-if="storeTimings.open_time && storeTimings.close_time" class="flex flex-col">
          <div class="mb-2 text-12-lineHeight-1 opacity-0">
            .
          </div>
          <button class="font-foodle font-bold text-center text-14-lineHeight-1.43 text-white h-17.5 border border-solid border-light-peach rounded-5 py-6" :class="{ 'bg-greyish': !storeTimeUpdated || processingStoreTimingUpdate, 'bg-blue-500': storeTimeUpdated && !processingStoreTimingUpdate }" :disabled="!storeTimeUpdated || processingStoreTimingUpdate" @click="updateStoreTimings">
            <template v-if="!processingStoreTimingUpdate">
              SPARA NY TID
            </template>
            <template v-else>
              Processing...
            </template>
          </button>
        </div>
      </div>
      <a-timeslot-cards-title>
        Tidsslots
      </a-timeslot-cards-title>
      <a-timeslot-cards-layout>
        <template v-if="!slotsLoading && timeslots.length">
          <m-timeslot-cell v-for="(timeslot, index) in timeslots" :key="selectedDay.date + '-' + index" :name="timeslot.name" :date="selectedDay.date" :value="timeslot.capacity" />
        </template>
        <a-loader v-else class="col-span-3 text-center" />
      </a-timeslot-cards-layout>
    </div>
  </div>
</template>

<script>
import ATimeslotTitle from '@/components/atoms/a-timeslot-title'
import ATimeslotCardsTitle from '@/components/atoms/a-timeslot-cards-title'
import ATimeslotCardsLayout from '@/components/atoms/a-timeslot-cards-layout'
import MTimeSelect from '~/components/molecules/m-time-select'
import MDateDropdown from '~/components/molecules/m-date-dropdown'
import MTimeslotCell from '~/components/molecules/m-timeslot-cell'
import ALoader from '~/components/atoms/a-loader'
export default {
  components: {
    ALoader,
    MTimeslotCell,
    MDateDropdown,
    MTimeSelect,
    ATimeslotTitle,
    ATimeslotCardsTitle,
    ATimeslotCardsLayout
  },
  data () {
    return {
      dropdownPopoverShow: false,
      defaultStoreSettings: { open_time: '11:00', close_time: '21:00', slot_size: 20, capacity: 3 },
      storeTimings: {
        open_time: false,
        close_time: false
      },
      originalStoreTimings: {
        open_time: false,
        close_time: false
      },
      storeTimeUpdated: false,
      processingStoreTimingUpdate: false,
      selectedDay: { id: '0', title: this.$moment().startOf('day').format('LL'), date: this.$moment().startOf('day').format('YYYY-MM-DD') },
      slotOverrides: [],
      slotsLoading: true
    }
  },
  computed: {
    timeslots () {
      const slots = []

      if (this.originalStoreTimings.open_time && this.originalStoreTimings.close_time) {
        // Create start time & end time using store timings
        const openTime = this.$moment(this.selectedDay.date + ' ' + this.originalStoreTimings.open_time)
        const closeTime = this.$moment(this.selectedDay.date + ' ' + this.originalStoreTimings.close_time)

        let startTime = openTime
        while (startTime < closeTime) {
          const startTimeString = startTime.format('HH:mm')
          startTime = startTime.add(this.defaultStoreSettings.slot_size, 'm')
          const endTimeString = startTime.format('HH:mm')

          // get capacity of this slot, of overridden
          const overriddenSlot = this.slotOverrides.find(slot => slot.name === (startTimeString + '-' + endTimeString))
          const newSlotObject = {
            name: startTimeString + '-' + endTimeString,
            capacity: overriddenSlot ? overriddenSlot.capacity : this.defaultStoreSettings.capacity
          }
          slots.push(newSlotObject)
        }
      }

      return slots
    }
  },
  watch: {
    storeTimings: {
      handler (val, oldVal) {
        this.storeTimeUpdated = val.open_time !== this.originalStoreTimings.open_time || val.close_time !== this.originalStoreTimings.close_time
        if (oldVal.open_time !== '' && oldVal.close_time !== '' && val.open_time > val.close_time) {
          this.storeTimings.close_time = this.storeTimings.open_time
        }
      },
      deep: true
    },
    selectedDay (newVal, oldVal) {
      // Load new data
      this.storeTimings = {
        open_time: false,
        close_time: false
      }
      this.slotsLoading = true
      this.fetchPageData(newVal.date)
    }
  },
  async mounted () {
    await this.$fire.firestore.collection('defaults').doc('kitchen').get().then((querySnapshot) => {
      const defaults = querySnapshot.data()
      this.defaultStoreSettings = {
        open_time: defaults.open_time,
        close_time: defaults.close_time,
        capacity: defaults.capacity,
        slot_size: defaults.slot_size
      }
    })

    await this.fetchPageData(this.selectedDay.date)
  },
  methods: {
    async fetchPageData (date) {
      // Check if the DB contains overwridden values?
      await this.$fire.firestore.collection('kitchen_hours').where('date', '==', date).get().then((querySnapshot) => {
        if (querySnapshot.empty) {
          this.storeTimings = {
            open_time: this.defaultStoreSettings.open_time,
            close_time: this.defaultStoreSettings.close_time
          }
          this.originalStoreTimings = {
            open_time: this.defaultStoreSettings.open_time,
            close_time: this.defaultStoreSettings.close_time
          }
        } else {
          // Override present. Pull it now
          const data = querySnapshot.docs[0].data()
          this.storeTimings.open_time = data.open_time
          this.storeTimings.close_time = data.close_time
          this.originalStoreTimings = {
            open_time: data.open_time,
            close_time: data.close_time
          }
        }
      })

      // Fetch Timeslots for the page
      await this.$fire.firestore.collection('time_slots').where('date', '==', date).onSnapshot((querySnapshot) => {
        this.slotOverrides = []
        if (querySnapshot.empty) {
          // No override presents
        } else {
          // Override exists
          querySnapshot.forEach((doc) => {
            this.slotOverrides.push({
              name: doc.data().slot,
              capacity: doc.data().capacity
            })
          })
        }
        this.slotsLoading = false
      })
    },
    async updateStoreTimings () {
      // Check if there was an update available
      this.processingStoreTimingUpdate = true
      await this.$fire.firestore.collection('kitchen_hours').where('date', '==', this.selectedDay.date).get().then((querySnapshot) => {
        if (querySnapshot.empty) {
          // Create new record
          this.$fire.firestore.collection('kitchen_hours').add({
            date: this.selectedDay.date,
            open_time: this.storeTimings.open_time,
            close_time: this.storeTimings.close_time
          }).then(() => {
            this.storeTimeUpdated = false
            this.originalStoreTimings.open_time = this.storeTimings.open_time
            this.originalStoreTimings.close_time = this.storeTimings.close_time
          })
          this.processingStoreTimingUpdate = false
        } else {
          // Update existing record
          this.$fire.firestore.collection('kitchen_hours').doc(querySnapshot.docs[0].id).update({
            date: this.selectedDay.date,
            open_time: this.storeTimings.open_time,
            close_time: this.storeTimings.close_time
          }).then(() => {
            this.storeTimeUpdated = false
            this.originalStoreTimings.open_time = this.storeTimings.open_time
            this.originalStoreTimings.close_time = this.storeTimings.close_time
          })
          this.processingStoreTimingUpdate = false
        }
      })
    }
  }
}
</script>
