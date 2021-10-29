<template>
  <div v-if="title !== ''" class="bg-tomato p-0.5 font-medium leading-5 banner text-center" v-html="title" />
</template>

<script>
export default {
  name: 'Banner',
  props: {
    title: {
      type: String,
      required: true
    }
  }
}
</script>
<style scoped>
.banner {
    color: white !important;
}
/* Media Queries */

/* Mobile Devices - Phones/Tablets */
@media only screen and (max-width: 1021px) {
    .banner {
        /* margin: 0 0.5rem 0 0.5rem; */
        color: white !important;
        padding: 0.2rem 1.5rem 0.2rem 1.5rem;
    }
}
</style>
