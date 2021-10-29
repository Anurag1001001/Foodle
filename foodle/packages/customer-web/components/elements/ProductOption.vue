<template>
  <div v-if="options && options.length" class="my-12 sm:my-16 relative">
    <h3 class="text-lg leading-6 font-bold text-gray-900">
      {{ title }}
    </h3>
    <div v-if="optionSelected" class="max-w-lg" :class="{'pb-4': !showExpand}">
      <div v-for="(radioItem, index) in options" :key="index" class="relative mt-4" :class="{'hidden': index > 3 && !showExpand }">
        <StandardRadioButton v-if="radioItem.price === 0" :id="optionKey + '-' + index" :name="optionKey" :selected-id="optionSelected.id" @radioSelected="selectOption(index)">
          {{ radioItem.name }}
          <template #additional>
            {{ radioItem.price >= 0 ? '+ ' : '- ' }}{{ formatAmount(radioItem.price) }}
          </template>
        </StandardRadioButton>
        <StandardCheckBoxButton v-else :id="optionKey + '-' + index" :name="optionKey" :selected-id="optionSelected.id" @radioSelected="selectOption(index)">
          {{ radioItem.name }}
          <template #additional>
            {{ radioItem.price >= 0 ? '+ ' : '- ' }}{{ formatAmount(radioItem.price) }}
          </template>
        </StandardCheckBoxButton>
      </div>
      <div class="relative">
        <div v-if="options.length > 3 && !showExpand" class="flex justify-center mt-1.5 cursor-pointer gradient absolute pt-8 more-button" @click="showItem">
          <span class="VISA-FLER pb-4">VISA FLER</span>
          <div class="Path">
            <img src="/images/down.png" alt="">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import StandardCheckBoxButton from '~/components/elements/StandardCheckBoxButton'
import StandardRadioButton from '~/components/elements/StandardRadioButton'
export default {
  name: 'ProductOption',
  components: { StandardCheckBoxButton, StandardRadioButton },
  props: {
    value: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    kitchen: {
      type: Object,
      required: true
    },
    optionKey: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      showExpand: false,
      // deepak
      optionSelected: this.value ?? this.$store.state.cart[this.optionKey][0],
      itemSelected: []
    }
  },
  computed: {
    options () {
      if (this.optionKey in this.kitchen.options) {
        return this.kitchen.options[this.optionKey].concat(this.$store.state.cart[this.optionKey])
      } else {
        return this.$store.state.cart[this.optionKey]
      }
    }
  },
  methods: {
    showItem () {
      this.showExpand = true
    },
    selectOption (index) {
      // deepak
      const newKey = this.optionKey + '-' + index
      if (this.options[index].price === 0) {
        addFreeItem(this, index, newKey)
      } else {
        addSelectedItem(this, index, newKey)
      }

      this.$emit('input', this.itemSelected)
    }
  }
}
function addFreeItem (ref, index, newKey) {
  if (newKey === ref.optionSelected.id) {
    ref.optionSelected = {
      id: '',
      object: {}
    }
    addSelectedItem(ref, index, newKey)
  } else {
    if (ref.optionSelected.id) {
      addSelectedItem(ref, index, ref.optionSelected.id)
    }
    ref.optionSelected = {
      id: newKey,
      object: ref.options[index]
    }
    addSelectedItem(ref, index, newKey)
  }
}

function addSelectedItem (ref, index, newKey) {
  // if item already exist in array, remove it
  const idx = ref.itemSelected.findIndex(obj => newKey === obj.id)
  if (idx > -1) {
    ref.itemSelected.splice(idx, 1)
  } else {
    ref.itemSelected.push({
      id: newKey,
      object: ref.options[index]
    })
  }
}
</script>

<style scoped>
.gradient {
  width: 100%;
  height: 24px;
  background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0) -14%, #ffffff);
}

.more-button {
  top: -32px;
}

.Path {
  width: 16px;
  height: 8px;
  margin: 7px 0 0 0;
}
.VISA-FLER {
  width: 86px;
  height: 13px;
  margin: 5px 0 0 0;
  font-family: Brown;
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 0.93;
  letter-spacing: 1px;
  text-align: left;
  color: #1E1E1E;
}
</style>
