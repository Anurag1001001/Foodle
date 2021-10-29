<template>
  <div class="header" :style="topMargin">
    <div>
      <div ref="navbar" :style="backgroundColor" class="nav-wrapper sticky" :class="{ 'navbar--hidden': !showNavbar && !toggleOpen, 'navbar--background bg-tomato': showNavBackground, 'white-background': toggleOpen }">
        <Banner v-if="bannerTitle" :title="bannerTitle" />
        <nav v-if="navbar" class="navbar max-w-screen-lg mx-auto" :style="backgroundColor">
          <span class="name">
            <nuxt-link to="/">
              <img src="/images/svg/foodle-logo.svg" alt="" class="h-6">
            </nuxt-link>
          </span>
          <div id="mobile-menu" class="menu-toggle" :class="{'is-active': toggleOpen }" @click="toggleMobileMenu">
            <img :src="toggleOpen ? '/images/svg/close.svg' : '/images/svg/menu.svg'" alt="" class="h-6">
          </div>
          <ul class="nav bg-tomato lg:bg-transparent" :class="{'mobile-nav': toggleOpen}">
            <li v-for="(navLink, index) in navbar.navLinks" :key="index" class="nav-item">
              <NavLink :url="navLink.url" :inverse-theme="showNavBackground">
                {{ navLink.text }}
              </NavLink>
            </li>
            <client-only>
              <li v-if="$screen.lg || $screen.xl" class="nav-item">
                <CtaButton
                  type="cart-button"
                  name="cartDetails"
                  :class="{'bg-secondary text-black border-none': itemInCart}"
                  @mouseover.native="cartImage = cartImageInverse"
                  @mouseleave.native="cartImage = cartImageRegular"
                  @clicked="showSideBar(true)"
                >
                  <div class="relative">
                    {{ formatAmount(discountedAmount) }}
                    <img :src="$store.state.cart.cart.items.length ? cartImageInverse: cartImage" class="h-6 inline transition-all duration-200 ease-in-out" alt="">
                    <span v-if="$store.state.cart.cart.items.length" class="cart-counter-badge">
                      {{ $store.state.cart.cart.items.length }}
                    </span>
                  </div>
                </CtaButton>
              </li>
            </client-only>
          </ul>
        </nav>
      </div>
      <CartButtonMobile @clicked="showSideBar(true)" />
    </div>
    <CookieSection />
    <CartDetailsSidebar :show="$store.state.states.showSideBar" />
  </div>
</template>

<script>
import NavLink from '~/components/elements/NavLink'
import CookieSection from '~/components/sections/cookie/CookieSection'
import CtaButton from '~/components/elements/CtaButton'
import CartDetailsSidebar from '~/components/sections/cart/CartDetailsSidebar'
import CartButtonMobile from '~/components/elements/CartButtonMobile'
import Banner from '~/components/sections/header/Banner'

export default {
  name: 'Navbar',
  components: { Banner, CartButtonMobile, CartDetailsSidebar, CtaButton, CookieSection, NavLink },
  props: {
    alternateBackground: {
      type: Boolean,
      default: () => true
    },
    navbar: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      toggleOpen: false,
      showNavbar: true,
      lastScrollPosition: 0,
      showNavBackground: false,
      theme: 'transparent',
      cartImageRegular: '/images/cart-white.png',
      cartImage: '/images/cart-white.png',
      cartImageInverse: '/images/cart-black.png',
      bannerTitle: '',
      height: 0
    }
  },
  computed: {
    topMargin () {
      if (!this.isHomePage) {
        return {
          'margin-bottom': this.height + 'px'
        }
      } else {
        return {
          'margin-bottom': 0
        }
      }
    },
    isTransparent () {
      return this.$store.state.states.navbarType === 'transparent'
    },
    isHidden () {
      return this.$store.state.states.navbarType === 'hidden'
    },
    isDefault () {
      return this.$store.state.states.navbarType === 'default'
    },
    backgroundColor () {
      if (this.isDefault || this.showNavBackground) {
        return {
          'background-color': '#f43b24'
        }
      } else {
        return {
          'background-color': 'transparent'
        }
      }
    },
    cartDetails () {
      return process.browser ? this.$store.getters['cart/getCartDetails'] : { total: 0, items: [] }
    }
  },
  watch: {
    $route () {
      this.toggleOpen = false
    }
  },
  async mounted () {
    window.addEventListener('scroll', this.onScroll)
    this.bannerTitle = (await this.getBannerTitle()).data
    this.$nextTick(() => {
      this.height = this.$refs.navbar.clientHeight
    })
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
    },
    showSideBar (show) {
      this.$store.dispatch('states/showSidebar', show)
    }
  }
}
</script>

<style scoped>
.addMargin {
  margin-top: 1.75rem;
}
.header {
  width: 100%;
  height: auto;
  position: -webkit-sticky; /* Safari */
  position: sticky;
  z-index: 9999;
}
/* i have to make z-index -ve in order to make Banner visible */
.nav-wrapper {
  width: 100%;
  top: 0;
  z-index: -1;
  /* z-index: 9999; */
}

.navbar--hidden {
  box-shadow: none;
  transform: translate3d(0, -100%, 0);
  -webkit-transition: transform 0.3s, background 0.3s
}

.cart-counter-badge {
  position: absolute;
  background: white;
  color: black;
  border-radius: 12px;
  width: 24px;
  height: 24px;
  top: -1rem;
  left: -2.5rem;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  padding-top: 2px;
}

.navbar--background {
  -webkit-box-shadow: 0px -2px 19px 0px rgba(0,0,0,0.66);
  -moz-box-shadow: 0px -2px 19px 0px rgba(0,0,0,0.66);
  box-shadow: 0px -2px 19px 0px rgba(0,0,0,0.66);
  transform: translate3d(0, 0, 0);
  -webkit-transition: transform 0.3s, background 0.3s
}

/* NAVIGATION */

.navbar {
  display: grid;
  grid-template-columns: 1fr 2fr;
  align-items: center;
  padding: 10px 20px;
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
  align-items: center;
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
@media only screen and (max-width: 1021px) {
  /* MOBILE NAVIGATION */

  .white-background {
    background-color: #fff;
  }
  .addMargin {
    margin-top: 2rem;
  }

  .navbar ul {
    display: flex;
    flex-direction: column;
    padding: 0;
    position: fixed;
    justify-content: center;
    top: 0;
    width: 100%;
    height: 100vh;
    transform: translate(-101%);
    text-align: center;
    overflow: hidden;
    z-index:-1;
    row-gap: 60px;
  }

  .nav-item {
    margin-left: 0;
  }

  .navbar li {
    padding: 15px;
  }

  .navbar li:first-child {
    margin-top: 50px;
  }

  .navbar li a {
    font-size: 1.5rem;
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
    padding: 20px 20px;
  }

}
</style>
