<template>
  <div v-if="selectedIndex === index">
    <div class="relative" :style="style">
      <img
        :src="kitchen.image"
        :alt="kitchen.name"
        class="absolute w-full object-cover"
      >
      <div class="absolute left-2 my-72 invisible lg:visible cursor-pointer">
        <ArrowIndicator
          direction="left"
          parent="kitchen-slider"
          :disabled="selectedIndex === 0"
        />
      </div>
      <div class="absolute right-2 my-72 invisible lg:visible cursor-pointer">
        <ArrowIndicator
          direction="right"
          parent="kitchen-slider"
          :disabled="selectedIndex >= totalKitchens - 1"
        />
      </div>
      <div class="relative flex flex-col">
        <div
          v-if="kitchen.moduleType !== moduleTypes.grid"
          class="px-2 lg:px-48 my-48 lg:my-32"
        >
          <div
            class="bg-white rounded-md items-center lg:mt-48 px-4 lg:px-16 pb-20 m-auto max-w-5xl leading-normal foodler-box-shadow"
          >
            <img :src="kitchen.title" class="m-auto pt-12" alt="">
            <div
              v-for="(item, itemIndex) in kitchen.menu"
              :key="itemIndex"
              class="pt-16"
              :class="{ 'opacity-50': item.outOfStock }"
            >
              <div class="grid grid-cols-2">
                <h1 class="font-bold text-lg">
                  {{ item.heading }}
                </h1>
                <h1 class="mr-4 justify-self-end">
                  {{ formatAmount(item.price) }}
                </h1>
              </div>
              <div class="grid grid-cols-1 lg:grid-cols-2">
                <p class="text-base">
                  <span v-html="item.description" />
                </p>
                <div class="text-right mt-4 lg:mt-0">
                  <CtaButton
                    type="yellow-background-no-border-small"
                    :name="'addButton-' + index + '-' + itemIndex"
                    :enabled="!item.outOfStock"
                    :full-width="!largeAndAbove"
                    @clicked="showItemDetails(index, itemIndex)"
                  >
                    {{ !item.outOfStock ? 'Lägg till' : 'Tillfälligt slut' }}
                  </CtaButton>
                </div>
              </div>
            </div>
            <Modal :show="show" :menu-item="menuItem" :kitchen="kitchen" />
          </div>
        </div>

        <div
          v-if="kitchen.moduleType === moduleTypes.grid"
          class="px-2 lg:px-48 my-48 lg:my-32"
        >
          <div
            class="bg-white rounded-md items-center lg:mt-48 px-4 lg:px-16 pb-20 m-auto max-w-5xl leading-normal foodler-box-shadow"
          >
            <img :src="kitchen.title" class="m-auto pt-12" alt="">

            <div class="grid grid-cols-2 gap-4 lg:grid-cols-3 grid-auto-rows gap-y-16 py-16">
              <KitchenTabSingleGridItem
                v-for="(item, itemIndex) in menuItem"
                :key="itemIndex"
                :kitchen="kitchen"
                :item="item"
                @itemAdded="addItem(index, itemIndex)"
                @itemRemoved="removeItem(index, itemIndex)"
                @itemAddedToCart="addItemToCart(index, itemIndex)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CtaButton from '~/components/elements/CtaButton'
import ArrowIndicator from '~/components/elements/ArrowIndicator'
import Modal from '~/components/sections/modal/Modal'
import KitchenTabSingleGridItem from '~/components/elements/KitchenTabSingleGridItem'
export default {
  name: 'KitchenTabSingle',
  components: { KitchenTabSingleGridItem, ArrowIndicator, CtaButton, Modal },
  props: {
    kitchen: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    selectedIndex: {
      type: Number,
      default: () => 0
    },
    totalKitchens: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      show: false,
      menuItem: {},
      itemQuantity: 0
    }
  },
  computed: {
    itemQuantityOne () {
      return this.itemQuantity
    },
    style () {
      return {
        'background-image': "url('" + this.kitchen.background + "')",
        'background-size': 'contain'
      }
    },
    largeAndAbove () {
      return this.$screen.lg || this.$screen.xl
    },
    kitchenShort () {
      return {
        name: this.kitchen.name
      }
    }
  },
  mounted () {
    if (this.kitchen.moduleType === this.moduleTypes.grid) {
      this.menuItem = this.kitchen.menu
    }
    this.$nuxt.$on('buttonClicked', (payload) => {
      if (payload.name === 'modalClose') {
        this.show = false
        this.menuItem = {}
      }
    })
  },
  methods: {
    showItemDetails (kitchenIndex, itemIndex) {
      if (this.index === kitchenIndex) {
        this.menuItem = this.kitchen.menu[itemIndex]
        this.show = true
      }
    },
    removeItem (kitchenIndex, itemIndex) {
      if (this.menuItem[itemIndex].selectedItems > 1) {
        this.menuItem[itemIndex].selectedItems -= 1
      }
    },
    addItem (kitchenIndex, itemIndex) {
      this.menuItem[itemIndex].selectedItems += 1
    },
    addItemToCart (kitchenIndex, itemIndex) {
      const newItem = JSON.parse(JSON.stringify(this.menuItem[itemIndex]))
      newItem.customizations.variant = {}
      newItem.customizations.selectedItems = newItem.selectedItems
      newItem.customizations.price = newItem.price
      newItem.kitchen = this.kitchen.name
      newItem.kitchenModuleType = this.kitchen.moduleType
      newItem.price = newItem.selectedItems * newItem.price
      const optionsSelected = { sides: [], drinks: [], extras: [], accessories: [] }
      for (const key in optionsSelected) {
        newItem.customizations[key] = []
      }
      this.$store.dispatch('cart/addItemToCart', { item: newItem })
      this.menuItem[itemIndex].selectedItems = 1
    }
  }
}
</script>

<style scoped>
.grid-image-custom img {
  width: auto !important;
  max-height: 220px !important;
}
</style>
