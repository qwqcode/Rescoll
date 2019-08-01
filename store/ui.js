export const state = () => ({
  sidebar: null
})

export const mutations = {
  showSidebar (state, name) {
    state.sidebar = name
  },

  hideSidebar (state) {
    state.sidebar = null
  }
}
