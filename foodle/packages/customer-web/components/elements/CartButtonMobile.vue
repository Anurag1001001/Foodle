<template>
  <button
    class="cart-image bg-white px-4 py-4 h-12 w-12 absolute hover:cursor-pointer rounded-full lg:hidden"
    :class="{ 'bg-secondary': itemInCart }"
    :style="style"
    @click.prevent.stop="cartButtonClicked"
  >
    <div class="relative">
      <img src="/images/svg/cart.svg" alt="cart">
      <span v-if="$store.state.cart.cart.items.length" class="cart-counter-badge">
        {{ $store.state.cart.cart.items.length }}
      </span>
    </div>
  </button>
</template>

<script>
export default {
  name: 'CartButtonMobile',
  computed: {
    style () {
      return {
        'box-shadow': '0 0 20px 0 rgba(0, 0, 0, 0.1)'
      }
    }
  },
  methods: {
    cartButtonClicked () {
      this.$emit('clicked')
    }
  }
}
</script>

<style scoped>
.cart-counter-badge {
  position: absolute;
  background: white;
  color: black;
  border-radius: 12px;
  width: 24px;
  height: 24px;
  top: -1.5rem;
  left: -1.5rem;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  padding-top: 2px;
}
</style>
