import SidebarItem from './SidebarItem'

/**
 * 内容层 侧边栏
 */
const Sidebar = {
  list: {},
  // 当前显示
  currentDisplayedKey: null,
  // 注册新的 Sidebar
  register (key) {
    if (this.list.hasOwnProperty(key)) {
      throw Error(`侧边栏层：${key} 已存在于list中`)
    }

    let sidebarItem = new SidebarItem(key)

    // 加入 List
    this.list[key] = sidebarItem

    return sidebarItem
  },
  // 获取 sidebarObj
  get (key) {
    if (!this.list.hasOwnProperty(key)) { return null }

    return this.list[key]
  },
  // 获取层 Selector
  getLayerSel () {
    let layerSel = '.sidebar-layer'

    if ($(layerSel).length === 0) { $('<div class="sidebar-layer" />').appendTo('body') }

    return layerSel
  }
}

export default Sidebar
