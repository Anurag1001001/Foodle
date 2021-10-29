<template>
  <div>
    <div class="space-y-1">
      <div class="font-brown font-bold text-12-lineHeight-1 mb-2 uppercase tracking-wider">
        DAG
      </div>

      <div class="relative">
        <span class="inline-block w-full shadow-sm" :class="{ 'rounded-t': !open, 'rounded': open }" @click.prevent.stop="open = !open">
          <button type="button" aria-haspopup="listbox" aria-expanded="true" aria-labelledby="listbox-label" class="cursor-default relative w-full rounded border-2 border-gray-300 bg-white pl-3 pr-10 py-6 text-left focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition ease-in-out duration-150 sm:text-sm sm:leading-5">
            <span class="block truncate">
              <img src="/images/svg/date.svg" class="w-6 inline float-left pr-2" alt="">
              <span v-if="selectedDayObject">{{ selectedDayObject.title }}</span>
            </span>
            <span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none pt-1">
              <img :src="'/images/svg/' + imageName" class="w-6 inline float-right" alt="">
            </span>
          </button>
        </span>
        <transition
          enter-active-class=""
          enter-class=""
          enter-to-class=""
          leave-active-class="transition ease-in duration-100"
          leave-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div v-if="open" class="absolute w-full rounded-b bg-white shadow-lg z-50 h-96 overflow-y-scroll">
            <ul tabindex="-1" role="listbox" aria-labelledby="listbox-label" aria-activedescendant="listbox-item-3" class="max-h-300 text-base leading-6 shadow-xs focus:outline-none sm:text-sm sm:leading-5">
              <li
                v-for="(day, index) in days"
                id="listbox-option-0"
                :key="index"
                role="option"
                class="text-gray-900 cursor-default select-none relative py-6 pl-3 pr-9 border-b-2"
                @click.prevent.stop="changeSelectedDay(day)"
              >
                <span class="font-normal block truncate" :class="{ 'opacity-50': day.date !== selectedDay.date }">
                  {{ day.title }}
                </span>

                <span v-if="day.date === selectedDay.date" class="text-indigo-600 absolute inset-y-0 right-0 flex items-center pr-4">
                  <a-check-indicator />
                </span>
              </li>
            </ul>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import ACheckIndicator from '~/components/atoms/a-check-indicator'
export default {
  name: 'MDateDropDown',
  components: { ACheckIndicator },
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      selectedDay: this.value,
      days: [],
      open: false
    }
  },
  computed: {
    imageName () {
      return this.open ? 'dropdown-up.svg' : 'dropdown-down.svg'
    },
    selectedDayObject () {
      const seletedDay = this.days.filter((day) => { return day.date === this.selectedDay.date })[0]
      if (seletedDay) { return seletedDay }

      return this.days[0]
    }
  },
  watch: {
    value (newValue, oldValue) {
      this.selectedDay = newValue

      const selectedDayObjectList = this.days.filter((day) => {
        return day.date === this.selectedDay
      })

      if (selectedDayObjectList.length) {
        this.selectedDayObject = selectedDayObjectList[0]
      } else {
        this.selectedDayObject = this.days[0]
      }
    }
  },
  mounted () {
    this.days = [
      { id: '0', title: this.$moment().startOf('day').format('LL'), date: this.$moment().startOf('day').format('YYYY-MM-DD') },
      { id: '1', title: this.$moment().startOf('day').add(1, 'd').format('LL'), date: this.$moment().startOf('day').add(1, 'd').format('YYYY-MM-DD') },
      { id: '2', title: this.$moment().startOf('day').add(2, 'd').format('LL'), date: this.$moment().startOf('day').add(2, 'd').format('YYYY-MM-DD') },
      { id: '3', title: this.$moment().startOf('day').add(3, 'd').format('LL'), date: this.$moment().startOf('day').add(3, 'd').format('YYYY-MM-DD') },
      { id: '4', title: this.$moment().startOf('day').add(4, 'd').format('LL'), date: this.$moment().startOf('day').add(4, 'd').format('YYYY-MM-DD') },
      { id: '5', title: this.$moment().startOf('day').add(5, 'd').format('LL'), date: this.$moment().startOf('day').add(5, 'd').format('YYYY-MM-DD') },
      { id: '6', title: this.$moment().startOf('day').add(6, 'd').format('LL'), date: this.$moment().startOf('day').add(6, 'd').format('YYYY-MM-DD') },
      { id: '7', title: this.$moment().startOf('day').add(7, 'd').format('LL'), date: this.$moment().startOf('day').add(7, 'd').format('YYYY-MM-DD') },
      { id: '8', title: this.$moment().startOf('day').add(8, 'd').format('LL'), date: this.$moment().startOf('day').add(8, 'd').format('YYYY-MM-DD') },
      { id: '9', title: this.$moment().startOf('day').add(9, 'd').format('LL'), date: this.$moment().startOf('day').add(9, 'd').format('YYYY-MM-DD') },
      { id: '10', title: this.$moment().startOf('day').add(10, 'd').format('LL'), date: this.$moment().startOf('day').add(10, 'd').format('YYYY-MM-DD') },
      { id: '11', title: this.$moment().startOf('day').add(11, 'd').format('LL'), date: this.$moment().startOf('day').add(11, 'd').format('YYYY-MM-DD') },
      { id: '12', title: this.$moment().startOf('day').add(12, 'd').format('LL'), date: this.$moment().startOf('day').add(12, 'd').format('YYYY-MM-DD') },
      { id: '13', title: this.$moment().startOf('day').add(13, 'd').format('LL'), date: this.$moment().startOf('day').add(13, 'd').format('YYYY-MM-DD') }
    ]
  },
  methods: {
    changeSelectedDay (date) {
      this.selectedDay = date
      this.open = false
      this.$emit('input', this.selectedDay)
    }
  }
}
</script>

<style scoped>

</style>
