<template>
  <div class="kitchen-tabs">
    <div>
      <div class="relative z-50">
        <div class="max-w-screen-lg flex mx-auto relative">
          <nav
            ref="navHead"
            class="flex overflow-x-scroll select-none pt-2 mx-4 lg:mx-8"
            :style="grabStatus"
            @mousedown="mouseDown"
            @mousemove="mouseMove"
            @mouseup="mouseUp"
          >
            <div
              v-for="(kitchen, index) in kitchens"
              :key="index"
              class="whitespace-no-wrap py-4 border-b-6 font-medium text-base font-bold text-foodler-black leading-5 hover:cursor-pointer uppercase"
              :class="{ 'border-transparent text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700 focus:border-gray-300' : index !== selectedIndex,
                        'highlighted border-b-8 focus:outline-none focus:text-indigo-800 focus:border-indigo-700 focus:border-b-4' : index === selectedIndex,
                        'mr-6': index < kitchens.length - 1
              }"
              @click.prevent.stop="makeSelection(index)"
            >
              {{ kitchen.name }}
            </div>
          </nav>
        </div>
      </div>
    </div>
    <div class="kitchen-wrapper relative" style="z-index: 100">
      <KitchenTabSingle
        v-for="(kitchen, index) in kitchens"
        :key="index"
        :kitchen="kitchen"
        :index="index"
        :selected-index="selectedIndex"
        :total-kitchens="kitchens.length"
      />
    </div>
  </div>
</template>

<script>
import KitchenTabSingle from '@/components/sections/kitchens/KitchenTabSingle'
export default {
  name: 'KitchenTabsSection',
  components: { KitchenTabSingle },
  props: {
    section: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      selectedIndex: 0,
      pos: {
        top: 0,
        left: 0,
        x: 0,
        y: 0
      },
      status: 'grab',
      showLeftGradient: false,
      showRightGradient: true
    }
  },
  computed: {
    grabStatus () {
      return {
        cursor: this.status
      }
    },
    kitchens () {
      return this.$store.state.cart.kitchens
    }
  },
  mounted () {
    // Set the first selected position
    this.scrollSelectedKitchen()
    this.$nuxt.$on('arrowClicked-kitchen-slider', (payload) => {
      if (payload.direction === 'left') {
        this.makeSelection(this.selectedIndex - 1)
      } else if (payload.direction === 'right') {
        this.makeSelection(this.selectedIndex + 1)
      }
    })
  },
  created () {
    let kitchenIndex = 0
    const kitchenSlug = this.$route.params.slug

    if (typeof kitchenSlug !== 'undefined') {
      kitchenIndex = this.kitchens.findIndex(kitchen => kitchen.slug === kitchenSlug)
      if (kitchenIndex <= 0) {
        kitchenIndex = 0
      }
    }
    this.selectedIndex = kitchenIndex
  },
  destroyed () {
    this.$nuxt.$off()
  },
  methods: {
    makeSelection (index) {
      this.selectedIndex = index
      this.scrollSelectedKitchen()
      const pathSeparated = this.$route.fullPath.split('/')
      history.pushState(
        {},
        null,
        [pathSeparated[0], pathSeparated[1], this.kitchens[this.selectedIndex].slug].join('/')
      )
    },
    mouseDown (e) {
      this.status = 'grabbing'
      const navHead = this.$refs.navHead
      this.pos = {
        left: navHead.scrollLeft,
        top: navHead.scrollTop,
        // Get the current mouse position
        x: e.clientX,
        y: e.clientY
      }
    },
    mouseMove (e) {
      if (this.status === 'grabbing') {
        const dx = e.clientX - this.pos.x
        const dy = e.clientY - this.pos.y

        const navHead = this.$refs.navHead

        // Scroll the element
        navHead.scrollTop = this.pos.top - dy
        navHead.scrollLeft = this.pos.left - dx
      }
    },
    mouseUp (e) {
      this.status = 'grab'
    },
    onSeek (e) {
    },
    scrollSelectedKitchen () {
      this.$refs.navHead.children[this.selectedIndex].scrollIntoView({ block: 'end', inline: 'center', behavior: 'smooth' })
      this.showLeftGradient = this.$refs.navHead.children[0].getBoundingClientRect().x < this.$refs.navHead.getBoundingClientRect().x
    }
  }
}
</script>

<style scoped>
.gradient {
  width: 125px;
  height: 100%;
  background: rgb(255,255,255);
  background: linear-gradient(to right, rgba(255, 255, 255, 0) 1%, #ffffff);
}
.gradient-reverse{
  width: 125px;
  height: 100%;
  background: rgb(255,255,255);
  background: linear-gradient(to left, rgba(255, 255, 255, 0) 1%, #ffffff);
}

.highlighted {
  border-bottom: 4px solid #1e1e1e;
}
nav {
  cursor: grab;
  overflow: auto;
}
nav::-webkit-scrollbar{
  display:none;
}
nav{
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;
}
</style>
