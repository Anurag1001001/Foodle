<template>
  <div class="w-full my-12 grid">
    <div class="title-row">
      <div class="float-left font-bold">
        {{ orderItem.heading }} <span v-if="orderItem.customizations.selectedItems > 1"> x {{ orderItem.customizations.selectedItems }} st</span>
      </div>
      <div class="float-right">
        {{ formatAmount(orderItem.price) }}
      </div>
    </div>
    <div class="details-row mt-4">
      <div class="grid grid-cols-12">
        <div v-if="orderItem.kitchenModuleType === moduleTypes.grid" class="pt-2 col-span-3 text-base font-bold">
          <button :disabled="orderItem.customizations.selectedItems < 2" :class="{ 'text-gray-300': orderItem.customizations.selectedItems <= 1 }" @click.prevent.stop="decreaseItemCount(index, orderItem)">
            -
          </button>
          <span class="pl-2 pr-2">{{ orderItem.customizations.selectedItems }}</span>
          <button @click.prevent.stop="increaseItemCount(index, orderItem)">
            +
          </button>
        </div>
        <div class="details col-start-1 col-span-8 font-normal">
          <span v-if="orderItem.customizations.variant !== undefined && 'variant_id' in orderItem.customizations.variant">
            {{ orderItem.customizations.variant.options[0].label }}
          </span>
          <div v-for="(removedItem, index2) in orderItem.customizations.customize.items" :key="removedItem + index2">
            - {{ removedItem }}
          </div>
          <template v-for="(key, cIndex) in addOnList">
            <div v-if="key.toLowerCase() in orderItem.customizations" :key="cIndex">
              <template v-for="(key1, idx) in orderItem.customizations[key.toLowerCase()]">
                <span :key="key1 + idx">+ {{ orderItem.customizations[key.toLowerCase()][idx].name }}<br></span>
              </template>
            </div>
          </template>
        </div>
        <div v-if="editable" class="delete col-start-9 col-span-4 justify-self-end cursor-pointer" @click.prevent.stop="removeItemFromCart(index, orderItem)">
          <img src="/images/svg/trash.svg" class="w-8 inline float-left pr-2" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderSummaryItem',
  props: {
    index: {
      type: Number,
      required: true
    },
    orderItem: {
      type: Object,
      required: true
    },
    editable: {
      type: Boolean,
      default: () => true
    }
  }
}
</script>

<style scoped>

</style>
