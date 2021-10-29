<template>
  <nuxt-link :to="url" class="nav-link-custom no-underline transition underline duration-300 ease-in-out text-white font-bold" exact-active-class="active-link">
    <slot />
  </nuxt-link>
</template>

<script>
export default {
  name: 'NavLink',
  props: {
    url: {
      type: String,
      required: true
    },
    inverseTheme: {
      type: Boolean,
      default: () => false
    }
  }
}
</script>

<style scoped>

.nav-link-custom {
  font-size: 18px;
}
a:not(.active-link) {
  animation-play-state: paused;
}
a:not(.active-link):hover {
  padding-bottom: 10px;
  background: url("/images/svg/wave_2px.svg");
  background-repeat: repeat-x;
  background-size: 15px 12px;
  background-position: 12px 19px;
  background-color: transparent;
  -webkit-text-decoration-skip: objects;
  animation-play-state: running;
  animation: move 25s linear infinite;
  -webkit-animation: move 25s linear infinite;
}

.active-link {
  padding-bottom: 10px;
  background: url("/images/svg/wave_2px.svg");
  background-repeat: repeat-x;
  background-size: 15px 12px;
  background-position: 12px 19px;
  background-color: transparent;
}

@media only screen and (max-width: 1021px) {
  a:not(.active-link):hover {
    background-size: 15px 20px;
  }
}

@-webkit-keyframes move {
  from {
    background-position: 2px 19px;
  }
  to {
    background-position: 500px 19px;
  }
}

@keyframe move {
  from {
    background-position: 2px 19px;
  }
  to {
    background-position: 500px 19px;
  }
}
</style>
