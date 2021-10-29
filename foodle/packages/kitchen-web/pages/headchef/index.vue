<template>
  <div>
    <m-tabs :tabs="tabs" :selected-index="selectedTabIndex" />
  </div>
</template>

<script>
import MTabs from '@/components/molecules/m-tabs.vue'
export default {
  components: {
    MTabs
  },
  layout: 'main',
  data () {
    return {
      active_orders: [],
      selectedTabIndex: 0
    }
  },
  computed: {
    incoming_orders () {
      return this.active_orders.filter((order) => {
        let found = false
        if (order.status === 'new') {
          order.kitchens.forEach((kitchen) => {
            if (this.selectedKitchenIdList.includes(kitchen)) {
              found = true
            }
          })
        }
        return found
      })
    },
    processing_orders () {
      return this.active_orders.filter((order) => {
        let found = false
        if (order.status === 'processing') {
          order.kitchens.forEach((kitchen) => {
            if (this.selectedKitchenIdList.includes(kitchen)) {
              found = true
            }
          })
        }
        return found
      })
    },
    ready_orders () {
      return this.active_orders.filter((order) => {
        let found = false
        if (order.status === 'ready') {
          order.kitchens.forEach((kitchen) => {
            if (this.selectedKitchenIdList.includes(kitchen)) {
              found = true
            }
          })
        }
        return found
      })
    },
    shipped_orders () {
      return this.active_orders.filter((order) => {
        let found = false
        if (order.status === 'shipped') {
          order.kitchens.forEach((kitchen) => {
            if (this.selectedKitchenIdList.includes(kitchen)) {
              found = true
            }
          })
        }
        return found
      })
    },
    delivered_orders () {
      const filteredOrders = this.active_orders.filter((order) => {
        let found = false
        if (order.status === 'delivered') {
          order.kitchens.forEach((kitchen) => {
            if (this.selectedKitchenIdList.includes(kitchen)) {
              found = true
            }
          })
        }
        return found
      })

      filteredOrders.sort((a, b) => {
        return b.deliveredAt - a.deliveredAt
      })

      return filteredOrders
    },
    tabs () {
      return [
        {
          title: 'Inkommet',
          showCount: true,
          status: 'NEW',
          orders: this.incoming_orders
        },
        {
          title: 'Tillagas',
          showCount: true,
          status: 'PROCESSING',
          orders: this.processing_orders
        },
        {
          title: 'Färdigt',
          showCount: true,
          status: 'READY',
          orders: this.ready_orders
        },
        {
          title: 'Utkörning',
          showCount: true,
          status: 'SHIPPED',
          orders: this.shipped_orders
        },
        {
          title: 'Levererat',
          showCount: true,
          status: 'DELIVERED',
          orders: this.delivered_orders
        }
      ]
    }
  },
  created () {
    this.$nuxt.$on('tabSelected', (payload) => {
      this.selectedTabIndex = payload.index
    })
  },
  mounted () {
    this.$fire.firestore.collection('active_orders').where('deliveryDate', '>=', this.$moment().add(-7, 'days').format('YYYY-MM-DD')).orderBy('deliveryDate').orderBy('estimatedDeliveryFrom', 'asc').onSnapshot((querySnapshot) => {
      this.active_orders = []
      querySnapshot.forEach((doc) => {
        this.active_orders.push(this.formatOrder(doc.data(), doc.id))
      })
    })
  }
}
</script>
