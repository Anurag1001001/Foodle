export const state = () => ({
  showSideBar: false,
  navbarType: 'transparent'
})

export const mutations = {
  showSideBar (state, show) {
    state.showSideBar = show
  },
  setNavbarType (state, type) {
    state.navbarType = type
  }
}

export const actions = {
  showSidebar ({ commit }, show) {
    commit('showSideBar', show)
  },
  setNavbarType ({ commit }, type) {
    commit('setNavbarType', type)
  }
}

export const getters = {}
