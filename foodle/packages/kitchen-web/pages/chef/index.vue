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
    inbox_orders () {
      const filteredOrders = this.active_orders.filter((order) => {
        let found = false
        if (order.dishStatus === 'new' || order.dishStatus === 'processing' || order.dishStatus === 'hold') {
          order.kitchens.forEach((kitchen) => {
            if (this.selectedKitchenIdList.includes(kitchen)) {
              found = true
            }
          })
        }
        return found
      })

      const statusSortOrder = {
        processing: 0,
        new: 1,
        hold: 2
      }
      filteredOrders.sort((a, b) => {
        return statusSortOrder[a.dishStatus] - statusSortOrder[b.dishStatus]
      })

      return filteredOrders
    },
    ready_orders () {
      return this.active_orders.filter((order) => {
        let found = false
        if (order.dishStatus === 'ready') {
          order.kitchens.forEach((kitchen) => {
            if (this.selectedKitchenIdList.includes(kitchen)) {
              found = true
            }
          })
        }
        return found
      })
    },
    tabs () {
      return [
        {
          title: 'Inbox',
          showCount: true,
          status: 'INBOX',
          orders: this.inbox_orders
        },
        {
          title: 'Färdigt',
          showCount: true,
          status: 'ready',
          orders: this.ready_orders
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
    this.$fire.firestore.collection('active_orders').orderBy('deliveryDate').orderBy('estimatedDeliveryFrom', 'asc').orderBy('status').onSnapshot((querySnapshot) => {
      this.active_orders = []
      this.$store.dispatch('clearOrders')
      querySnapshot.forEach((doc) => {
        this.active_orders = this.active_orders.concat(this.formatDish(doc.data(), doc.id))
      })
    })
  }
}
</script>
