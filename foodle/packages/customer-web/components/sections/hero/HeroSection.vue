<template>
  <section class="hero h-screen w-full bg-cover py-1 px-0 lg:px-8 flex items-center" :style="heroBackground">
    <div class="items max-w-screen-sm lg:max-w-screen-lg leading-none px-0 lg:px-24 xl:px-48 align-middle">
      <div class="heading">
        <div class="font-colby text-3-5xl uppercase lg:text-7xl">
          <div v-html="section.title" />
        </div>
      </div>
      <div class="mt-12">
        <LocationBox :show-change-button="falseValue" />
      </div>
    </div>
  </section>
</template>

<script>
import LocationBox from '~/components/sections/hero/LocationBox'

export default {
  name: 'HeroSection',
  components: { LocationBox },
  props: {
    section: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      heroBackground: {
        'background-image': "linear-gradient( rgba(47, 0, 0, 0.3), rgba(47, 0, 0, 0.0) 30% ), url('" + this.section.background.filename + "')",
        'background-size': 'cover',
        'background-position': 'center'
      }
    }
  }
}
</script>

<style scoped>
.hero {
  /* grid styles */
}

.hero > * {
  color: white;
}

.hero .items {
  width:auto;
  filter: brightness(100%);
}

.hero .items .title {
  font-size: 1.2rem;
  color: white;
}

.hero .items .heading {
  font-weight: bold;
}

.hero .items .description {
  width: 50%;
  font-size: 1.5rem;
  margin-top: 2rem;
  margin-bottom: 4rem;
  font-stretch: normal;
  line-height: 1.25;
  letter-spacing: normal;
}

@media only screen and (max-width:1080px) {
  .hero .items {
    margin: 250px 25px;
    width:auto;
    filter: brightness(100%);
  }
  .hero .items .title {
    font-size: 1.25rem;
  }

  .hero .items .heading {
    font-size:4rem !important;
    margin-top: 2.5rem;
    line-height: 1.22;
  }

  .hero .items .description {
    margin: 20px auto;
    font-size: 1.5rem;
    font-weight: 100;
    line-height: 1.55;
    width: 80%;
    margin-bottom: 40px;
  }

  .cta-button {
    margin: 20px;
  }
}

@media only screen and (max-width:767px) {
  .hero .items .title {
    font-size: 1rem;
  }

  .hero .items .heading {
    font-size:1.6rem !important;
    margin-top: 1.25rem;
    line-height: 1;
  }

  .hero .items .description {
    margin: 20px auto;
    font-size: 1.05rem;
    font-weight: 100;
    line-height: 1.55;
    width: 80%;
  }

  .cta-button {
    margin: 20px;
  }
}
</style>
