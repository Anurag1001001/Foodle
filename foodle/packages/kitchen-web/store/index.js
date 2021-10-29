export const state = () => ({
  kitchens: [],
  user: {},
  orders: {}
})

export const mutations = {
  setKitchens (state, kitchens) {
    state.kitchens = kitchens
  },
  addKitchen (state, kitchen) {
    state.kitchens.push(kitchen)
  },
  toggleKitchen (state, index) {
    state.kitchens[index].selected = !state.kitchens[index].selected
  },
  setUser (state, user) {
    state.user = user
  },
  clearOrders (state) {
    state.orders = {}
  },
  addOrder (state, payload) {
    state.orders[payload.doc_id] = payload.order
  },
  updateDishStatus (state, payload) {
    state.orders[payload.documentId].kitchens[payload.kitchenCounter].dishes[payload.dishCounter].dishStatus = payload.dishStatus
  }
}

export const actions = {
  setKitchens ({ commit }, kitchens) {
    commit('setKitchens', kitchens)
  },
  addKitchen ({ commit }, kitchen) {
    commit('addKitchen', kitchen)
  },
  toggleKitchen ({ commit }, index) {
    commit('toggleKitchen', index)
  },
  logout () {
    this.$fire.auth.signOut().then(() => {
      this.$router.replace('/')
    }).catch((res) => {
      console.log('Internet issue')
    })
  },
  setUser ({ commit }, user) {
    commit('setUser', user)
  },
  clearOrders ({ commit }) {
    commit('clearOrders')
  },
  addOrder ({ commit }, payload) {
    commit('addOrder', payload)
  },
  updateDishStatus ({ commit }, payload) {
    commit('updateDishStatus', payload)
  }
}
