import AppAction from '../AppAction'
import AppLayer from '../AppLayer'
import SettingContent from './SettingContent'
import { html } from 'common-tags'

/**
 * 设置
 */
const Setting = {
  init () {
    AppAction.utilsReqIeProxy() // 无参数代表同步
    let settingSidebar = AppLayer.Sidebar.register(this.sidebarKey)
    settingSidebar.setTitle('设置', '#0089ff')
    settingSidebar.setWidth(360)
    // Setting Content
    let settingDom = $('<div class="setting"></div>')
    let group = (name, title) => {
      return $(html`
        <div class="setting-group" data-setting-sidebar-group="${name}">
          <h2 class="setting-group-title">${title}</h2>
        </div>
      `).appendTo(settingDom)
    }
    SettingContent(this, group)
    settingSidebar.setInner(settingDom)
  },
  get (key) {
    let settingValue = JSON.parse(localStorage.getItem('setting')) || {}
    return settingValue.hasOwnProperty(key) ? settingValue[key] : null
  },
  set (key, val) {
    let settingValue = JSON.parse(localStorage.getItem('setting')) || {}
    settingValue[key] = val
    localStorage.setItem('setting', JSON.stringify(settingValue))
  },
  sidebarKey: 'setting',
  getSidebar () {
    return AppLayer.Sidebar.get(this.sidebarKey)
  }
}

export default Setting
