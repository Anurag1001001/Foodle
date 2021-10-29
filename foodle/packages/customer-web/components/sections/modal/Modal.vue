<template>
  <div v-show="show" class="fixed z-10 inset-0" @click.prevent.stop="modalClosed">
    <div class="flex items-center h-90 pt-4 px-4 lg:pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 transition-opacity">
        <div class="absolute inset-0 bg-gray-500 opacity-50" />
      </div>
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" />&#8203;
      <div
        v-show="show"
        class="wrapper w-full modal-rectangle h-full mt-48 mb-16 lg:mb-4 inline-block bg-white rounded-lg pt-5 text-left overflow-hidden shadow-xl transform transition-all sm:my-28 align-middle sm:max-w-xl sm:w-full"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
        @click.prevent.stop=""
      >
        <div class="content mt-4 px-4 sm:px-6 pb-24">
          <div class="header">
            <div class="mt-1 sm:mt-2">
              <div class="grid grid-cols-6">
                <h3 id="modal-headline" class="text-2xl font-bold text-gray-900 col-span-5">
                  {{ menuItem.heading }}
                </h3>
                <div class="text-right col-span-1">
                  <button type="button" @click.prevent.stop="modalClosed">
                    <svg
                      id="Lager_1"
                      data-name="Lager 1"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      class="w-6 inline float-right"
                    >
                      <defs><style>.cls-1{fill:#1e1e1e;}</style></defs><title>close</title><polygon class="cls-1" points="18.36 7.05 16.95 5.64 12 10.59 7.05 5.64 5.64 7.05 10.59 12 5.64 16.95 7.05 18.36 12 13.41 16.95 18.36 18.36 16.95 13.41 12 18.36 7.05" />
                    </svg>
                  </button>
                </div>
              </div>
              <div class="mt-1">
                <p class="text-sm leading-5 text-gray-500">
                  <span v-html="menuItem.description" />
                </p>
              </div>
            </div>
          </div>
          <div v-if="menuItem.variants && menuItem.variants.length > 0" class="mt-6 sm:mt-8">
            <h3 class="text-lg leading-6 font-bold text-gray-900">
              Välj variant
            </h3>
            <div v-if="menuItem.variants && menuItem.variants.length" class="max-w-lg">
              <div v-for="(variant, index) in menuItem.variants" :key="index" class="relative flex items-start mt-4">
                <StandardRadioButton :id="'variant-' + index" name="variants" :selected-id="variantSelected.id" @radioSelected="variantSelect(index)">
                  {{ variant.options[0].label }}
                  <template #additional>
                    {{ variant.price >= 0 ? '+ ' : '- ' }}{{ formatAmount(Math.abs(variant.price)) }}
                  </template>
                </StandardRadioButton>
              </div>
            </div>
          </div>
          <div v-if="menuItem && menuItem.customizations !== undefined && undefined !== menuItem.customizations.customize && menuItem.customizations.customize.items.length" class="mt-6 sm:mt-16">
            <h3 class="text-lg leading-6 font-bold text-gray-900">
              {{ (menuItem.customizations !== undefined && undefined !== menuItem.customizations.customize) ? menuItem.customizations.customize.title : '' }}
            </h3>
            <div v-if="menuItem.customizations !== undefined && menuItem.customizations.customize !== undefined" class="flex flex-wrap">
              <div v-for="(checkboxItem, index) in menuItem.customizations.customize.items" :key="index" class="relative flex items-start mt-4 mx-1">
                <StandardCheckBox :id="'customize-' + index" name="customize" :checked="isCustomizeSelected(index)" @checkboxSelected="customizeClicked(index)">
                  {{ checkboxItem }}
                </StandardCheckBox>
              </div>
            </div>
          </div>
          <ProductOption
            v-for="(addOn, index) in addOnList"
            :key="'product-options'+index + '-' + menuItem.sku "
            v-model="optionsSelected[addOn.toLowerCase()]"
            :kitchen="kitchen"
            :option-key="addOn.toLowerCase()"
            :title="$t('labels.addOns.title.' + addOn.toLowerCase())"
          />
        </div>
        <div class="bottomDiv footer pt-4 px-4 sm:px-6 pb-12 md:pb-24 lg:pb-12" style="box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.1);">
          <div class="grid grid-cols-2">
            <div>
              <h1 class="text-lg font-bold text-gray-900">
                Summa
              </h1>
            </div>
            <div class="text-right text-lg font-bold text-gray-900">
              {{ formatAmount(totalAmount) }}
            </div>
          </div>
          <div class="mt-5 sm:mt-6">
            <span class="flex w-full rounded-md shadow-sm">
              <CtaButton type="yellow-background-no-border" class="w-full" name="addItemToCart" @clicked="addItemToCart(menuItem)">
                Lägg i varukorg
              </CtaButton>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CtaButton from '~/components/elements/CtaButton'
import StandardRadioButton from '~/components/elements/StandardRadioButton'
import StandardCheckBox from '~/components/elements/StandardCheckBox'
import ProductOption from '~/components/elements/ProductOption'
export default {
  name: 'Modal',
  components: { ProductOption, StandardCheckBox, StandardRadioButton, CtaButton },
  props: {
    show: {
      type: Boolean,
      default: () => false
    },
    menuItem: {
      type: Object,
      required: true
    },
    kitchen: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      customizeSelected: [],
      variantSelected: this.menuItem.variants && this.menuItem.variants.length ? { id: 'variant-0', object: this.menuItem.variants[0] } : { id: '', object: {} },
      optionsSelected: { sides: [], drinks: [], extras: [], accessories: [] },
      removed: [],
      ingredientData: []
    }
  },
  computed: {
    totalAmount () {
      let amount = this.menuItem.price + (undefined === this.variantSelected.object.price ? 0 : this.variantSelected.object.price)
      for (const key in this.optionsSelected) {
        (this.optionsSelected[key]).forEach((obj) => {
          if (obj.object && obj.object.price) {
            amount += obj.object.price
          }
        })
      }
      return amount
    }
  },
  watch: {
    // deepak
    show (newValue, oldValue) {
      if (newValue !== oldValue) {
        this.customizeSelected = []
        this.variantSelected = this.menuItem.variants && this.menuItem.variants.length ? { id: 'variant-0', object: this.menuItem.variants[0] } : { id: '', object: {} }
        this.optionsSelected = { sides: [], drinks: [], extras: [], accessories: [] }
        this.removed = []
        this.ingredientData = []
        if (this.menuItem.customizations && this.menuItem.customizations.customize && this.menuItem.customizations.customize.ingredients_reference && this.menuItem.customizations.customize.ingredients_reference.length) {
          this.getIngredientData(this.menuItem.customizations.customize.ingredients_reference)
            .then((res) => {
              this.ingredientData = res
            })
        }
      }
    }
  },
  methods: {
    addItemToCart (menuItem) {
      const newItem = JSON.parse(JSON.stringify(menuItem))
      newItem.customizations.customize.items = [...this.removed]
      newItem.customizations.variant = { ...this.variantSelected.object }
      for (const key in this.optionsSelected) {
        const formatSelectedItem = []
        this.optionsSelected[key].forEach((obj) => {
          if (obj.object) {
            formatSelectedItem.push(obj.object)
          }
        })
        newItem.customizations[key] = formatSelectedItem
      }
      newItem.customizations.selectedItems = 1
      newItem.customizations.price = this.totalAmount
      newItem.price = this.totalAmount
      newItem.kitchen = this.kitchen.name
      newItem.kitchenModuleType = this.kitchen.moduleType
      this.$store.dispatch('cart/addItemToCart', { item: newItem })
      this.resetData()
      this.modalClosed()
    },
    modalClosed () {
      this.$nuxt.$emit('buttonClicked', { name: 'modalClose' })
    },
    isCustomizeSelected (index) {
      return !this.customizeSelected.includes('customize-' + index)
    },
    customizeClicked (index) {
      if (!this.customizeSelected.includes('customize-' + index)) {
        this.customizeSelected.push('customize-' + index)
        this.removed.push(this.menuItem.customizations.customize.items[index])
      } else {
        const indexOf = this.customizeSelected.indexOf('customize-' + index)
        this.customizeSelected.splice(indexOf, 1)
        this.removed.splice(indexOf, 1)
      }
    },
    resetData () {
      this.customizeSelected = []
      this.removed = []
      this.ingredientData = []
    },
    variantSelect (index) {
      this.variantSelected = {
        id: 'variant-' + index,
        object: this.menuItem.variants[index]
      }
    }
  }
}
</script>
<style>
.content::-webkit-scrollbar {
  width: 3px;
}
/* Track */
.content::-webkit-scrollbar-track {
  background: #f1f1f1;
}
/* Handle */
.content::-webkit-scrollbar-thumb {
  background: #888;
}
.content {
  height: 58%;
  overflow-y: auto;
}
.h-90 {
  height: 98%;
}

@media only screen and (min-width: 320px) {
  .content {
    height: 80%;
  }
  .h-90 {
    height: 95% !important;
  }
}

@media only screen and (min-width: 500px) {
  .content {
    height: 85%;
  }
  .h-90 {
    height: 95% !important;
  }
}
@media only screen and (min-width: 600px) {
  .content {
    height: 80%;
  }
  .h-90 {
    height: 95% !important;
  }
}
@media only screen and (min-width: 1200px) {
  .content {
    height: 80%;
  }
  .h-90 {
    height: 98% !important;
  }
}

.modal-rectangle{
  border-radius: 5px;
  box-shadow: 0 2px 40px 0 rgba(0, 0, 0, 0.1) !important;
}

.bottomDiv{
  background: white;
  position: sticky;
  bottom: 0 !important;
}
.use-shadow {
  box-shadow: 0 0 40px 0 rgba(0, 0, 0, 0.1);
}
</style>
