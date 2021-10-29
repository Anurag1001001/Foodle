<template>
  <div class="flex flex-col overflow-hidden max-w-xs ipro:max-w-sm" :class="cardOpacity">
    <div class="flex-1 bg-white pb-6 flex flex-col">
      <div :id="cardNumber">
        <div class="printBlock" />
        <div class="flex-shrink-0 h-24 w-full" :class="backgroundColorClass">
          <div class="grid grid-cols-2 pt-7 px-5">
            <p class="text-3xl text-24-lineHeight-1 font-foodle font-bold text-black">
              {{ card.orderno }}<span v-if="$store.state.user.role === 'chef'">-{{ card.counter }}</span>
            </p>
            <p
              class="text-3xl text-24-lineHeight-1 font-foodle font-bold text-black justify-self-end"
            >
              {{ card.delivery }}
            </p>
          </div>
          <div class="grid grid-cols-2 pt-2.5 px-5">
            <p class="text-16-lineHeight-1.29 font-foodle text-black">
              {{ card.arrivedTime }}
            </p>
            <p
              class="text-16-lineHeight-1.29 font-foodle text-black justify-self-end"
            >
              {{ card.estimatedTime }}
            </p>
          </div>
        </div>
        <div class="flex-1 bg-white pb-6 flex flex-col">
          <div class="text-14-lineHeight-1.43 font-foodle text-black pl-5">
            <template v-if="$store.state.user.role === 'headchef'">
              <div v-for="(item,index) in card.items" :key="index" :class="circleLayout">
                <div class="mt-7 row-span-5" :class="cirleVisibility">
                  <a-dish-status-circle :status="item.status" />
                </div>
                <div>
                  <div class="font-bold mt-6">
                    {{ item.name }} - {{ item.kitchenName.toUpperCase() }} <span v-if="item.quantity > 1">x {{ item.quantity }}</span>
                  </div>
                  <div v-if="item.variant">
                    <i>{{ item.variant }}</i>
                  </div>
                  <div v-for="(leave, i) in item.removeIngredient" :key="i" class="opacity-50">
                    - {{ leave }}
                  </div>
                  <div>
                    <div v-for="(side, i) in item.sides" :key="i">
                      {{ side }}
                    </div>
                  </div>
                  <div>
                    <div v-for="(drink, i) in item.drink" :key="i">
                      {{ drink }}
                    </div>
                  </div>
                  <div>
                    <div v-for="(extra, i) in item.extra" :key="i">
                      {{ extra }}
                    </div>
                  </div>
                  <div>
                    <div v-for="(accessory, i) in item.accessory" :key="i">
                      {{ accessory }}
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <div>
                <div class="font-bold mt-6">
                  {{ card.name }} <span v-if="card.quantity > 1">x {{ card.quantity }}</span>
                </div>
                <div v-if="card.variant">
                  <i>{{ card.variant }}</i>
                </div>
                <div v-for="(leave, i) in card.removeIngredient" :key="i" class="opacity-50">
                  - {{ leave }}
                </div>
                <div>
                  <div v-for="(side, i) in card.sides" :key="i">
                    {{ side }}
                  </div>
                </div>
                <div>
                  <div v-for="(drink, i) in card.drink" :key="i">
                    {{ drink }}
                  </div>
                </div>
                <div>
                  <div v-for="(extra, i) in card.extra" :key="i">
                    {{ extra }}
                  </div>
                </div>
                <div>
                  <div v-for="(accessory, i) in card.accessory" :key="i">
                    {{ accessory }}
                  </div>
                </div>
              </div>
            </template>
          </div>
          <div class="divider border-b border-black border-opacity-10  my-8" />
          <div class="font-foodle text-black px-5">
            <div class="uppercase font-bold text-12-lineHeight-1">
              {{ card.address }}
            </div>
            <div class="text-16-lineHeight-1.29 mt-2 mb-5">
              <span v-if="card.street_1">{{ card.street_1 + ',' }}</span>
              <span v-if="card.street_2">{{ card.street_2 + ',' }}</span>
              <span v-if="card.city">{{ card.city + ',' }}</span>
              <span v-if="card.state">{{ card.state + ',' }}</span>
              <span v-if="card.zip">{{ card.zip + ',' }}</span>
              <span>{{ card.country }}</span>
            </div>
            <div class="uppercase font-bold text-12-lineHeight-1">
              {{ card.telephone }}
            </div>
            <div class="text-16-lineHeight-1.29 mt-2 mb-5">
              {{ card.telephoneVal }}
            </div>
            <div class="uppercase font-bold text-12-lineHeight-1">
              {{ card.code }}
            </div>
            <div class="text-16-lineHeight-1.29 mt-2 mb-5">
              {{ card.codeVal }}
            </div>
            <div class="uppercase font-bold text-12-lineHeight-1">
              {{ card.message }}
            </div>
            <div class="text-16-lineHeight-1.29 mt-2 mb-5">
              {{ card.messageVal }}
            </div>
            <div class="printMessageForCustomer">
              <div class="divider border-b border-black border-opacity-10 my-8" />
              <div class="py-4 text-center">Tack för din beställning! </div>
              <div class="text-center">Ditt original kvitto har du fått skickat till det angivna e-mail adressen du angav när du beställde på https://foodler.se</div>
              <div class="font-bold py-4 text-center">
                Smaklig måltid //Foodle
              </div>
            </div>
          </div>
        </div>
        <div class="printBlock" />
      </div>
      <div class="px-5" :class="buttonVisibility">
        <button
          class="w-full h-14 font-foodle font-bold text-14-lineHeight-1.43 border border-solid border-light-royal-blue rounded-5 focus:outline-none"
          :class="buttonLayout"
          :disabled="isDisabled"
          @click="show = !show"
        >
          {{ buttonText }}
        </button>
      </div>
      <div v-if="$store.state.user.role === 'headchef'" class="px-5 py-4">
        <button
          class="w-full h-14 font-foodle font-bold text-14-lineHeight-1.43 border border-solid border-light-royal-blue rounded-5 focus:outline-none bg-white text-light-royal-blue hover:bg-light-royal-blue hover:text-white"
          @click="printReceipt"
        >
          Print
        </button>
      </div>
    </div>
    <o-modal :show="show" :modal="modal" @close="closeModal" @goAhead="goAhead" />
  </div>
</template>

<script>
import OModal from '@/components/organisms/o-modal.vue'
import ADishStatusCicle from '@/components/atoms/a-dish-status-circle.vue'
export default {
  components: {
    OModal,
    ADishStatusCicle
  },
  props: {
    status: {
      type: String,
      required: true
    },
    card: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      show: false
    }
  },
  computed: {
    buttonText () {
      let text = ''
      if (this.$store.state.user.role === 'headchef') {
        switch (this.card.status.toLowerCase()) {
          case 'ready':
          case 'shipped':
            text = 'Utkörd'
            break
          case 'delivered':
            text = 'LEVERERAD'
        }
      } else {
        switch (this.card.dishStatus.toLowerCase()) {
          case 'new':
            text = 'Påbörja'
            break
          case 'processing':
            text = 'Färdig'
            break
          case 'hold':
            text = 'On hold'
            break
          case 'ready':
            text = 'Färdig'
            break
        }
      }
      return text
    },
    modal () {
      return {
        heading: 'Är du säker?',
        yes: 'Ja, ' + this.buttonText,
        no: 'Avbryt'
      }
    },
    backgroundColorClass () {
      if (this.$store.state.user.role === 'headchef') {
        return 'bg-' + this.getBackgrounColorString(this.status)
      } else {
        return 'bg-' + this.getBackgrounColorString(this.card.dishStatus.toUpperCase())
      }
    },
    buttonVisibility () {
      let buttonVisibility
      if (this.status === 'NEW' || this.status === 'PROCESSING' || this.card.dishStatus === 'ready') {
        buttonVisibility = 'hidden'
      }

      return buttonVisibility
    },
    cirleVisibility () {
      let cirleVisibility = 'hidden'
      if (this.status === 'PROCESSING') {
        cirleVisibility = 'visible'
      }
      return cirleVisibility
    },
    circleLayout () {
      let circleLayout
      if (this.status === 'PROCESSING') {
        circleLayout = 'grid grid-cols-2 grid-cols-min-content gap-x-3'
      }
      return circleLayout
    },
    cardOpacity () {
      let cardOpacity = 'opacity-100'
      if (this.$store.state.user.role === 'chef' && this.card.dishStatus === 'hold') {
        cardOpacity = 'opacity-50'
      }

      return cardOpacity
    },
    buttonLayout () {
      let buttonLayout = 'bg-white text-light-royal-blue'
      if (this.status === 'DELIVERED' || this.status === 'SHIPPED') {
        buttonLayout = 'bg-light-royal-blue-50 text-white'
      } else if (this.card.button === 'Färdig') {
        buttonLayout = 'bg-light-royal-blue text-white'
      }
      return buttonLayout
    },
    isDisabled () {
      return this.card.dishStatus === 'hold' || (this.card.status === 'shipped' && this.$store.state.user.role === 'headchef') || this.card.status === 'delivered' || this.card.dishStatus === 'out_for_delivery'
    },
    cardNumber () {
      return 'card-' + this.card.orderno
    }
  },
  methods: {
    async printReceipt () {
      await this.$htmlToPaper(this.cardNumber)
    },
    closeModal () {
      this.show = false
    },
    goAhead () {
      const activeDoc = this.$fire.firestore.collection('active_orders').doc(this.card.firebaseDocumentId)
      const cardTemp = this.card
      // If card has address, that means it's for an order. So, go ahead accordingly
      if (this.isHeadchef) {
        this.$fire.firestore.runTransaction((transaction) => {
          return transaction.get(activeDoc).then((orDoc) => {
            if (!orDoc.exists) {
              console.log('Document does not exist!')
            } else {
              transaction.update(activeDoc, { status: 'shipped' })
              return status
            }
          })
        }).then(() => {
          console.log('updated successfully')
          this.closeModal()
        }).catch((err) => {
          console.log('Error:' + err)
          this.closeModal()
        })
      } else {
        this.$fire.firestore.runTransaction((transaction) => {
          return transaction.get(activeDoc).then((orDoc) => {
            if (!orDoc.exists) {
              console.log('Document does not exist!')
            } else {
              const orderRecord = orDoc.data()
              orderRecord.kitchens[cardTemp.kitchenCounter - 1].dishes[cardTemp.counter - 1].dishStatus = cardTemp.dishStatus === 'new' ? 'processing' : (cardTemp.dishStatus === 'processing' ? 'ready' : '')
              transaction.update(activeDoc, orderRecord)
              return orderRecord
            }
          }).then(() => {
            console.log('updated successfully')
            this.closeModal()
          }).catch((err) => {
            console.log('Error:' + err)
            this.closeModal()
          })
        })
      }
    }
  }
}
</script>

<style scoped>
.printMessageForCustomer {
  display: none;
}
.printBlock {
  display: none;
}

@media print {
  .printMessageForCustomer {
    display: block!important;
  }

  .printBlock {
    display: block;
    height: 20px;
  }
}

</style>
