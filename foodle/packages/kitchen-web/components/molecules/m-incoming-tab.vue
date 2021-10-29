<template>
  <a-cards-layout>
    <a-card v-for="(card,index) in filteredCards" :key="index" :card="card" :status="status" />
  </a-cards-layout>
</template>

<script>
import ACardsLayout from '@/components/atoms/a-cards-layout.vue'
import ACard from '@/components/atoms/a-card.vue'
export default {
  components: {
    ACardsLayout,
    ACard
  },
  props: {
    cards: {
      type: Array,
      required: true
    },
    status: {
      type: String,
      required: true
    }
  },
  computed: {
    filteredCards () {
      return this.cards
    }
  }
}
</script>
