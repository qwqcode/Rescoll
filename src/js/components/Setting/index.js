import AppAction from '../AppAction'
import AppLayer from '../AppLayer'
import SettingItems from './SettingItems'
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
    this.setSidebarInner(settingSidebar.getInnerDom())
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
  },
  // 设置侧边栏内容
  setSidebarInner (innerDom) {
    let settingDom = $('<div class="setting"></div>').appendTo(innerDom)

    let group = (name, title) => {
      return $(html`
        <div class="setting-group" data-setting-sidebar-group="${name}">
          <h2 class="setting-group-title">${title}</h2>
        </div>
      `).appendTo(settingDom)
    }
    let itemAt = (groupDom) => {
      let boxDom = $('<div class="setting-item"></div>').appendTo(groupDom)

      let innerElement = {}
      // 按钮
      innerElement.btnBlock = (text, onClick) => {
        return $(`<button type="button" class="setting-btn-block">${text}</button>`).click(onClick).appendTo(boxDom)
      }
      // 切换按钮
      innerElement.btnToggle = (text, turnOnEvent, turnOffEvent) => {
        let btnDom = $(html`
        <button type="button" class="setting-btn-block setting-btn-toggle">
          <div class="left-text">${text}</div>
          <div class="toggle">
            <div class="toggle-bar"></div>
            <div class="toggle-button"></div>
          </div>
        </button>`)
        let toggleDom = btnDom.find('.toggle')
        let btnObj = {}
        btnObj.setVal = (bool) => {
          if (typeof bool !== 'boolean') return
          if (bool) toggleDom.addClass('turn-on'); else toggleDom.removeClass('turn-on')
        }
        btnObj.setOn = () => {
          btnObj.setVal(true)
        }
        btnObj.setOff = () => {
          btnObj.setVal(false)
        }
        btnObj.toggle = () => {
          if (!toggleDom.hasClass('turn-on')) { // On
            toggleDom.addClass('turn-on')
            turnOnEvent()
          } else { // Off
            toggleDom.removeClass('turn-on')
            turnOffEvent()
          }
        }
        btnObj.getDom = () => {
          return btnDom
        }
        btnDom.click(() => {
          btnObj.toggle()
        }).appendTo(boxDom)
        return btnObj
      }
      // 信息展示
      innerElement.infoShow = (label, value) => {
        return $(html`
          <div class="two-line">
            <span class="label">${label}</span>
            <span class="value">${value}</span>
          </div>
        `).appendTo(boxDom)
      }

      return innerElement
    }

    SettingItems(this, group, itemAt)
  }
}

export default Setting
