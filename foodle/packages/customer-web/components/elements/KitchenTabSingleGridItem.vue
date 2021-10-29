<template>
  <div
    class="grid grid-cols-1 items-start text-center text-lg"
    :class="{ 'opacity-50': item.outOfStock }"
  >
    <div class="font-bold">
      {{ item.heading }}
    </div>
    <div class="self-end">
      <div class="flex justify-center grid-image-custom py-4">
        <img :src="thumbnail" :alt="item.heading" height="220" width="163" style="height: 220px">
      </div>
      <div class="pb-4 lg:pb-0">{{ formatAmount(item.price) }}</div>
      <div class="text-center">
        <CtaButton
          type="yellow-background-no-border-small"
          :full-width="!largeAndAbove"
        >
          <button
            class="px-2 font-bold"
            @click.prevent.stop="removeItem"
          >
            -
          </button>
          <span class="pt-1 pb-1">
          {{ item.selectedItems }}
        </span>
          <button
            class="px-2 font-bold"
            @click.prevent.stop="addItem"
          >
            +
          </button>
        </CtaButton>

        <CtaButton
          class="mt-4"
          type="yellow-background-no-border-small"
          :name="'addButton-' + kitchen.name + '-' + item.heading"
          :enabled="!item.outOfStock"
          :full-width="!largeAndAbove"
          @clicked="addItemToCart"
        >
          {{ !item.outOfStock ? 'Lägg till' : 'Tillfälligt slut' }}
        </CtaButton>
      </div>
    </div>
  </div>
</template>

<script>
import CtaButton from '~/components/elements/CtaButton'
export default {
  name: 'KitchenTabSingleGridItem',
  components: { CtaButton },
  props: {
    kitchen: {
      type: Object,
      required: true
    },
    item: {
      type: Object,
      required: true
    }
  },
  computed: {
    largeAndAbove () {
      return this.$screen.lg || this.$screen.xl
    },
    thumbnail () {
      return this.item.image ? this.item.image.url_thumbnail : '/images/na.jpg'
    }
  },
  methods: {
    removeItem () {
      this.$emit('itemRemoved')
    },
    addItem () {
      this.$emit('itemAdded')
    },
    addItemToCart () {
      this.$emit('itemAddedToCart')
    }
  }
}
</script>

<style scoped>

</style>
