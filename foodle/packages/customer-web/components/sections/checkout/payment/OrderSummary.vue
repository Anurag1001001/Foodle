<template>
  <div class="">
    <button class="header-row w-full flex justify-between focus:outline-none" @click="open = !open">
      <div class="text-2xl font-bold float-left">
        Varukorg
      </div>
      <div class="text-2xl font-bold float-right">
        <span class="ml-6 h-7 flex items-center">
          <img
            src="/images/down.png"
            alt=""
            class="rotate-0 w-4 h-auto transform translate"
            :class="{ '-rotate-180': open, 'rotate-0': !open }"
          >
        </span>
      </div>
    </button>
    <div v-if="open" class="summary">
      <OrderSummaryItem v-for="(orderItem, index) in cartDetails.items" :key="index" :order-item="orderItem" :index="index" />
      <CouponSection />
      <div class="mt-12">
        <TotalSection />
      </div>
    </div>
  </div>
</template>

<script>
import OrderSummaryItem from '~/components/sections/checkout/payment/OrderSummaryItem'
import CouponSection from '~/components/sections/checkout/payment/CouponSection'
import TotalSection from '~/components/sections/checkout/payment/TotalSection'
export default {
  name: 'OrderSummary',
  components: { TotalSection, CouponSection, OrderSummaryItem },
  data () {
    return {
      open: true,
      orderItems: [
        {
          name: 'Lorem ipsum dolor sit amet 1',
          amount: '123',
          customizations: {
            removed: [
              'Hamburgerdressing'
            ],
            added: [
              'Coca-cola 33 cl',
              'Mellan Pommes Frites'
            ]
          }
        },
        {
          name: 'Lorem ipsum dolor sit amet 2',
          amount: '123',
          customizations: {
            removed: [
              'Hamburgerdressing'
            ],
            added: [
              'Coca-cola 33 cl',
              'Mellan Pommes Frites'
            ]
          }
        },
        {
          name: 'Lorem ipsum dolor sit amet 3',
          amount: '123',
          customizations: {
            removed: [
              'Hamburgerdressing'
            ],
            added: [
              'Coca-cola 33 cl',
              'Mellan Pommes Frites'
            ]
          }
        }
      ]
    }
  }
}
</script>

<style scoped>

</style>
