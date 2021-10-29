<template>
  <nuxt-link v-if="internal" :to="url" class="text-white">
    <slot />
  </nuxt-link>
  <a v-else :href="url" class="text-white" target="_blank">
    <slot />
  </a>
</template>

<script>
export default {
  name: 'FooterLink',
  props: {
    url: {
      type: String,
      required: true
    }
  },
  computed: {
    internal () {
      return !this.url.startsWith('http')
    }
  }
}
</script>

<style scoped lang="scss" >
$thetransition: all .5s cubic-bezier(1,.25,0,.75) 0s;

a {
  transition: decoration 0.3s ease-out;
}

a:hover {
  text-decoration: underline;
}
</style>
