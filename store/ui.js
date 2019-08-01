export const state = () => ({
  sidebar: null
})

export const mutations = {
  setSidebar (state, name) {
    state.sidebar = name
  }
}
