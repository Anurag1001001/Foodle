<template>
  <!-- Delivery Modes -->
  <div class="mt-12 lg:mt-2">
    <div class="space-y-1">
      <FormFieldHeading>
        dag
      </FormFieldHeading>

      <div class="relative">
        <span class="inline-block w-full shadow-sm" :class="{ 'rounded-t': !open, 'rounded': open }" @click.prevent.stop="open = !open">
          <button type="button" aria-haspopup="listbox" aria-expanded="true" aria-labelledby="listbox-label" class="cursor-default relative w-full rounded border-2 border-gray-300 bg-white pl-3 pr-10 py-6 text-left focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition ease-in-out duration-150 sm:text-sm sm:leading-5">
            <span class="block truncate py-1">
              <img src="/images/svg/date.svg" class="w-6 inline float-left pr-2" alt="">
              <span>{{ selectedDayObject.title }}</span>
            </span>
            <span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
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
          <div v-if="open" class="absolute w-full rounded-b bg-white shadow-lg z-50">
            <ul tabindex="-1" role="listbox" aria-labelledby="listbox-label" aria-activedescendant="listbox-item-3" class="max-h-300 text-base leading-6 shadow-xs focus:outline-none sm:text-sm sm:leading-5">
              <li
                v-for="(day, index) in days"
                id="listbox-option-0"
                :key="index"
                role="option"
                class="text-gray-900 cursor-default select-none relative py-6 pl-3 pr-9 border-b-2"
                @click.prevent.stop="changeSelectedDay(day)"
              >
                <!-- Selected: "font-semibold", Not Selected: "font-normal" -->
                <span class="font-normal block truncate" :class="{ 'opacity-50': day.date !== selectedDay }">
                  {{ day.title }}
                </span>

                <!--
                    Checkmark, only display for selected option.

                    Highlighted: "text-white", Not Highlighted: "text-indigo-600"
                  -->
                <span v-if="day.date === selectedDay" class="text-indigo-600 absolute inset-y-0 right-0 flex items-center pr-4">
                  <CheckIndicator />
                </span>
              </li>

              <!-- More options... -->
            </ul>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import FormFieldHeading from '~/components/elements/FormFieldHeading'
import CheckIndicator from '~/components/elements/CheckIndicator'
export default {
  name: 'SelectDay',
  components: { CheckIndicator, FormFieldHeading },
  props: {
    days: {
      type: Array,
      required: true
    },
    value: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      selectedDay: this.value,
      open: false
    }
  },
  computed: {
    imageName () {
      return this.open ? 'dropdown-up.svg' : 'dropdown-down.svg'
    },
    selectedDayObject () {
      const seletedDay = this.days.filter((day) => { return day.date === this.selectedDay })[0]
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
  methods: {
    changeSelectedDay (date) {
      this.selectedDay = date.date
      this.open = false
      this.$emit('input', this.selectedDay)
    }
  }
}
</script>

<style scoped>

</style>
