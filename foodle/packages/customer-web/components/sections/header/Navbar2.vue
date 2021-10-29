<template>
  <div class="header">
    <div class="top-holder">
      <div class="nav-wrapper sticky" :class="{ 'navbar--hidden': !showNavbar && !toggleOpen, 'navbar--background': showNavBackground, 'white-background': toggleOpen }">
        <nav class="navbar">
          <span class="name">
            <nuxt-link to="/">
              <img src="/images/logo.png" alt="" class="h-6">
            </nuxt-link>
          </span>
          <div id="mobile-menu" class="menu-toggle" :class="{'is-active': toggleOpen }" @click="toggleMobileMenu">
            <img :src="toggleOpen ? '/images/food-close.png' : '/images/food-open.png'" alt="" class="h-4">
          </div>
          <ul class="nav" :class="{'mobile-nav': toggleOpen}">
            <li class="nav-item">
              <NavLink url="/">
                Våra kök
              </NavLink>
            </li>
            <li class="nav-item">
              <NavLink url="/">
                Om Foodle
              </NavLink>
            </li>
            <li class="nav-item">
              <NavLink url="/">
                Kontakt
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </div>
    <CookieSection />
  </div>
</template>

<script>
import NavLink from '~/components/elements/NavLink'
import CookieSection from '~/components/sections/cookie/CookieSection'
export default {
  name: 'Navbar2',
  components: { CookieSection, NavLink },
  props: {
    alternate: {
      type: Boolean,
      default: () => false
    }
  },
  data () {
    return {
      toggleOpen: false,
      showNavbar: true,
      lastScrollPosition: 0,
      showNavBackground: false
    }
  },
  watch: {
    $route () {
      this.toggleOpen = false
    }
  },
  mounted () {
    window.addEventListener('scroll', this.onScroll)
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.onScroll)
  },
  methods: {
    toggleMobileMenu () {
      this.toggleOpen = !this.toggleOpen
    },
    onScroll () {
      const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop
      if (currentScrollPosition < 0) {
        return
      }
      // Stop executing this function if the difference between
      // current scroll position and last scroll position is less than some offset
      if (Math.abs(currentScrollPosition - this.lastScrollPosition) < 60) {
        return
      }
      this.showNavbar = currentScrollPosition < this.lastScrollPosition
      this.showNavBackground = currentScrollPosition > 60 && currentScrollPosition < this.lastScrollPosition
      this.lastScrollPosition = currentScrollPosition
    }
  }
}
</script>

<style scoped>
.header {
  width: 100%;
  height: auto;
  position: -webkit-sticky; /* Safari */
  position: sticky;
  z-index: 9999;
}
.nav-wrapper {
  width: 100%;
  top: 0;
  z-index: 9999;
}

.top-holder {
  background-color:#cda181;
}

.navbar--hidden {
  box-shadow: none;
  transform: translate3d(0, -100%, 0);
  -webkit-transition: transform 0.3s, background 0.3s
}

.navbar--background {
  -webkit-box-shadow: 0px -2px 19px 0px rgba(0,0,0,0.66);
  -moz-box-shadow: 0px -2px 19px 0px rgba(0,0,0,0.66);
  box-shadow: 0px -2px 19px 0px rgba(0,0,0,0.66);
  background: #ffffff;
  transform: translate3d(0, 0, 0);
  -webkit-transition: transform 0.3s, background 0.3s
}

/* NAVIGATION */

.navbar {
  display: grid;
  background-color:transparent;
  grid-template-columns: 1fr 2fr;
  align-items: center;
  padding: 30px 140px;
  height: auto;
  overflow: hidden;
}

.sticky {
  position: fixed;
  top: 0;
}

.navbar .name {
  width: auto;
  justify-self: start;
  z-index: 9999;
}
.navbar ul {
  left:0;
  display: flex;
  list-style: none;
  justify-self: end;
}

.nav-item {
  margin-left: 25px;
}

.menu-toggle .bar{
  width: 25px;
  height: 3px;
  background-color: #000000;
  margin: 5px auto;
  -webkit-transition: all 0.3s ease-in-out;
  -o-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
}

.menu-toggle {
  justify-self: end;
  margin-right: 0;
  display: none;
}

.menu-toggle:hover{
  cursor: pointer;
}

#mobile-menu.is-active .bar:nth-child(2){
  opacity: 0;
}

#mobile-menu.is-active .bar:nth-child(1){
  -webkit-transform: translateY(8px) rotate(45deg);
  -ms-transform: translateY(8px) rotate(45deg);
  -o-transform: translateY(8px) rotate(45deg);
  transform: translateY(8px) rotate(45deg);
}

#mobile-menu.is-active .bar:nth-child(3){
  -webkit-transform: translateY(-8px) rotate(-45deg);
  -ms-transform: translateY(-8px) rotate(-45deg);
  -o-transform: translateY(-8px) rotate(-45deg);
  transform: translateY(-8px) rotate(-45deg);
}

/* Media Queries */

/* Mobile Devices - Phones/Tablets */
@media only screen and (max-width: 1080px) {
  /* MOBILE NAVIGATION */

  .white-background {
    background-color: #fff;
  }

  .navbar ul {
    display: flex;
    flex-direction: column;
    padding: 0;
    position: fixed;
    justify-content: center;
    top: 0;
    background-color: #ffffff;
    width: 100%;
    height: 100vh;
    transform: translate(-101%);
    text-align: center;
    overflow: hidden;
    z-index:1000;
    row-gap: 60px;
  }

  .navbar li {
    padding: 15px;
  }

  .navbar li:first-child {
    margin-top: 50px;
  }

  .navbar li a {
    font-size: 1rem;
  }

  .menu-toggle, .bar {
    display: block;
    cursor: pointer;
    z-index: 9999;
  }

  .mobile-nav {
    transform: translate(0%)!important;
  }

  .navbar {
    padding: 30px 20px;
  }

}
</style>
