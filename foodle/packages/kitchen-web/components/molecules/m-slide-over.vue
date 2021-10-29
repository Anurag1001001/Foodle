<template>
  <div class="sticky top-0 z-20">
    <div class="bg-white">
      <div v-if="this.$route.path !== '/headchef/timeslots'" @keydown.escape="isOpen = !isOpen">
        <section>
          <div class="h-14 ipro:h-20 flex justify-end pr-8 pt-5">
            <button
              class="rounded-md focus:outline-none"
              @click="isOpen = !isOpen"
            >
              <svg
                class="h-9 w-9 ipro:h-12 ipro:w-12"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="black"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </section>
      </div>
      <div v-else @keydown.escape="isOpen = !isOpen">
        <section>
          <div class="h-14 ipro:h-20 flex justify-end pr-8 pt-5">
            <button
              class="rounded-md focus:outline-none"
              @click="close"
            >
              <svg
                class="h-9 w-9 ipro:h-12 ipro:w-12"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="black"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="butt"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </section>
      </div>
      <div v-if="this.$route.path !== '/headchef/timeslots'" @keydown.escape="isOpen = !isOpen">
        <div v-show="!isOpen" class="fixed inset-0 overflow-hidden bg-gray-800 bg-opacity-50 z-50">
          <section class="fixed inset-y-0 right-0 max-w-full flex bg-white">
            <div class="w-screen max-w-sm ipro:max-w-lg">
              <div class="h-full min-h-screen flex flex-col overflow-y-auto pt-8 z-50 pb-12 px-10 bg-white">
                <div class="pb-18 ipro:pb-28 relative">
                  <button
                    class="rounded-md focus:outline-none focus:ring-2 focus:ring-white absolute right-0"
                    @click="isOpen = !isOpen"
                  >
                    <svg
                      class="h-9 w-9 ipro:h-12 ipro:w-12"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="black"
                      aria-hidden="true"
                    >
                      <path
                        stroke-linecap="butt"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <template v-if="isHeadchef">
                  <a-slideover-timeslot-button url="headchef/timeslots">
                    {{ slideOver.timeslotButton }}
                  </a-slideover-timeslot-button>
                </template>
                <a-slide-over-content>
                  <a-slide-over-title>
                    {{ slideOver.title }}
                  </a-slide-over-title>
                  <template v-if="isHeadchef">
                    <a-slide-over-list
                      v-for="(list, index) in $store.state.kitchens"
                      :key="index"
                      :list="list"
                      :index="index"
                    />
                  </template>
                </a-slide-over-content>

                <a-slide-over-button @click="logout">
                  {{ slideOver.button }}
                </a-slide-over-button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ASlideOverButton from '@/components/atoms/a-slide-over-button.vue'
import ASlideOverTitle from '@/components/atoms/a-slide-over-title.vue'
import ASlideOverList from '@/components/atoms/a-slide-over-list.vue'
import ASlideOverContent from '@/components/atoms/a-slide-over-content.vue'
import ASlideoverTimeslotButton from '../atoms/a-slideover-timeslot-button.vue'

export default {
  components: {
    ASlideOverButton,
    ASlideOverTitle,
    ASlideOverList,
    ASlideOverContent,
    ASlideoverTimeslotButton
  },
  props: {
    slideOver: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      isOpen: 'false'
    }
  },
  methods: {
    close () {
      this.$router.back()
    }
  }
}
</script>
