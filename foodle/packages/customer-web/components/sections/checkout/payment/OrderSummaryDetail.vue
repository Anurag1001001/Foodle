<template>
  <div v-if="order && order['orderId'] !== undefined" class="min-h-screen">
    <main class="py-10">
      <div class="max-w-3xl mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-4">
        <section aria-labelledby="order-info-1" class="space-y-6 lg:col-start-1 lg:col-span-2">
          <FormBlock>
            <!-- Steps -->
            <div class="mt-6 flow-root">
              <ul class="-mb-8">
                <li>
                  <div class="relative">
                    <div>
                      <div class="relative flex space-x-3">
                        <div>
                          <span class="h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center ring-8 bg-secondary text-xl">
                            <!-- Heroicon name: solid/user -->
                            1
                          </span>
                        </div>
                        <div class="min-w-0 flex-1 flex justify-between space-x-4">
                          <div class="text-2xl font-bold">
                            Leveransuppgifter
                          </div>
                          <div class="text-right text-sm whitespace-nowrap text-gray-500">
                            <div class="absolute text-foodler-black inset-y-0 right-0 pr-5 flex items-center cursor-pointer text-opacity-50" @click.prevent="goToDeliveryPage">
                              ÄNDRA
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="relative my-12">
                        <span class="absolute left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                        <div class="grid grid-cols-12 divide-x-4 divide-gray-400">
                          <div class="col-span-11 col-start-2">
                            <DeliveryInfoSection :delivery-info="order.delivery" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
                <li class="py-8">
                  <div class="relative">
                    <div>
                      <div class="relative flex space-x-3">
                        <div>
                          <span class="h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center ring-8 bg-secondary text-xl">
                            <!-- Heroicon name: solid/user -->
                            2
                          </span>
                        </div>
                        <div class="min-w-0 flex-1 flex justify-between space-x-4">
                          <div class="text-2xl font-bold">
                            Dina uppgifter
                          </div>
                          <div class="text-right text-sm whitespace-nowrap text-gray-500">
                            <div class="absolute text-foodler-black inset-y-0 right-0 pr-5 flex items-center cursor-pointer text-opacity-50" @click.prevent="gotToKassaPage">
                              ÄNDRA
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="relative my-12">
                        <span class="absolute left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                        <div class="grid grid-cols-12 divide-x-4 divide-gray-400">
                          <div class="col-span-11 col-start-2">
                            <AddressFormatter :customer_info="order.customer_info" />
                            <CustomerMessage :message="order.customer_info.customer_message" class="mt-8" />
                            <div class="mt-6 flex flex-col justify-stretch">
                              <CtaButton type="yellow-background-no-border" @clicked="makePayment">
                                FORTÄTT TILL BETALNING
                              </CtaButton>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </FormBlock>
        </section>
        <section aria-labelledby="order-info-2" class="lg:col-start-3 lg:col-span-2">
          <FormBlock>
            <div class="relative mt-6">
              <div>
                <div class="relative flex space-x-3">
                  <div class="min-w-0 flex-1 flex justify-between space-x-4">
                    <div class="text-2xl font-bold">
                      Din beställning
                    </div>
                    <div class="text-2xl font-bold">
                      <span class="align-text-top">{{ formatAmount(order.amounts.total_amount_inc_tax) }}</span>
                    </div>
                  </div>
                </div>
                <div class="text-xl whitespace-nowrap text-gray-500">
                  <span class="align-text-top">Ordernummer: #{{ order.orderId }}</span>
                </div>
                <OrderSummaryItem v-for="(product, index) in order.products" :key="index" :order-item="product" :editable="falseValue" :index="index" />
                <div v-if="order.amounts.discount > 0" class="float-left font-bold">
                  Rabbatkod är till lagd
                </div>
                <div class="pt-12">
                  <AmountLineItem :amount-item="{ title: $t('labels.cart.subtotal'), amount: order.amounts.total_amount_inc_tax }" />
                  <AmountLineItem :amount-item="{ title: $t('labels.cart.rebate'), amount: order.amounts.discount * -1 }" />
                  <AmountLineItem v-if="order.amounts.shipping_cost_inc_tax" :amount-item="{ title: $t('labels.cart.delivery_cost') , amount: order.amounts.shipping_cost_inc_tax }" />
                  <AmountLineItem :amount-item="{ title: $t('labels.cart.final_amount_to_pay'), amount: order.amounts.total_amount }" :highlighted="trueValue" />
                </div>
                <AmountLineItem :amount-item="{ title: 'Varav moms', amount: order.amounts.tax }" :border="falseValue" :small="trueValue" />
              </div>
            </div>
          </FormBlock>
        </section>
      </div>
    </main>
  </div>
</template>

<script>
import FormBlock from '~/components/elements/FormBlock'
import DeliveryInfoSection from '~/components/elements/order/DeliveryInfoSection'
import AddressFormatter from '~/components/elements/order/AddressFormatter'
import CustomerMessage from '~/components/elements/order/CustomerMessage'
import CtaButton from '~/components/elements/CtaButton'
import OrderSummaryItem from '~/components/sections/checkout/payment/OrderSummaryItem'
import AmountLineItem from '~/components/elements/order/AmountLineItem'

export default {
  name: 'OrderSummaryDetail',
  components: { FormBlock, DeliveryInfoSection, AddressFormatter, CustomerMessage, CtaButton, OrderSummaryItem, AmountLineItem },
  props: {
    order: {
      type: Object,
      required: true
    }
  },
  methods: {
    makePayment () {
      this.$router.push('/checkout/payment')
    }
  }
}
</script>

<style scoped>

</style>
