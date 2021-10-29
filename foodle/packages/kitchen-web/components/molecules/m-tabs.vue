<template>
  <div>
    <a-tabs-layout>
      <a-tab v-for="(tabItem, index) in tabs" :key="index" :tab="tabItem" :index="index" :selected-index="selectedIndex">
        {{ tabItem.title }}<div v-if="tabItem.showCount">&nbsp;({{ tabItem.orders.length }})</div>
      </a-tab>
    </a-tabs-layout>
    <m-incoming-tab :cards="tabs[selectedIndex].orders" :status="tabs[selectedIndex].status" />
  </div>
</template>

<script>
import ATabsLayout from '@/components/atoms/a-tabs-layout.vue'
import ATab from '@/components/atoms/a-tab.vue'
import MIncomingTab from '@/components/molecules/m-incoming-tab'
export default {
  components: {
    MIncomingTab,
    ATabsLayout,
    ATab
  },
  props: {
    tabs: {
      type: Array,
      required: true
    },
    selectedIndex: {
      type: Number,
      default: () => 0
    }
  }
}
</script>
