<template>
  <div :class="classObject">
    <component :is="section.component" v-for="section in content.sections" :key="section._uid" :section="section" />
  </div>
</template>

<script>
export default {
  name: 'Page',
  props: {
    content: {
      type: Object,
      required: true
    }
  },
  computed: {
    classObject () {
      return [
        'page',
        ''
      ]
    }
  },
  mounted () {
    this.$store.dispatch('states/setNavbarType', this.content.navbar_type)
  }
}
</script>
