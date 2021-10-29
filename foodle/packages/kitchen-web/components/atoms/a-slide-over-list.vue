<template>
  <div class="flex content-center">
    <input type="checkbox" class="h-6 w-6 mr-2.5 mb-3.5 rounded-5 ipro:mb-6 ipro:h-8 ipro:w-8" :checked="list.selected" @change="toggleSelection">
    <label class="text-14-lineHeight-1.43 font-foodle text-black font-bold ipro:text-xl pt-0.5" @click.prevent.stop="toggleSelection">
      {{ list.content }}
    </label>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },
  methods: {
    toggleSelection () {
      this.$store.dispatch('toggleKitchen', this.index)
    }
  }
}
</script>
