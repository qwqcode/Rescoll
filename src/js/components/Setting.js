import AppAction from './AppAction'
import AppLayer from './AppLayer'
import SettingItems from './SettingItems'
/**
 * 设置
 */
const Setting = {
  init: function () {
    AppAction.utilsReqIeProxy() // 无参数代表同步
    var settingSidebar = AppLayer.Sidebar.register(this.sidebarKey)
    settingSidebar.setTitle('设置', '#0089ff')
    settingSidebar.setWidth(360)
    this.setSidebarInner(settingSidebar.getInnerDom())
  },
  get: function (key) {
    var settingValue = JSON.parse(localStorage.getItem('setting')) || {}
    return settingValue.hasOwnProperty(key) ? settingValue[key] : null
  },
  set: function (key, val) {
    var settingValue = JSON.parse(localStorage.getItem('setting')) || {}
    settingValue[key] = val
    localStorage.setItem('setting', JSON.stringify(settingValue))
  },
  sidebarKey: 'setting',
  getSidebar: function () {
    return AppLayer.Sidebar.get(this.sidebarKey)
  },
  // 设置侧边栏内容
  setSidebarInner: function (innerDom) {
    var settingDom = $('<div class="setting"></div>').appendTo(innerDom)

    var group = function (name, title) {
      return $('<div class="setting-group" data-setting-sidebar-group="' + name + '"><h2 class="setting-group-title">' + title + '</h2></div>').appendTo(settingDom)
    }
    var itemAt = function (groupDom) {
      var boxDom = $('<div class="setting-item"></div>').appendTo(groupDom)

      var innerElement = {}
      // 按钮
      innerElement.btnBlock = function (text, onClick) {
        return $('<button type="button" class="setting-btn-block">' + text + '</button>').click(onClick).appendTo(boxDom)
      }
      // 切换按钮
      innerElement.btnToggle = function (text, turnOnEvent, turnOffEvent) {
        var btnDom = $('<button type="button" class="setting-btn-block setting-btn-toggle"><div class="left-text">' + text + '</div><div class="toggle"><div class="toggle-bar"></div><div class="toggle-button"></div></div></button>')
        var toggleDom = btnDom.find('.toggle')
        var btnObj = {}
        btnObj.setVal = function (bool) {
          if (typeof bool !== 'boolean') return
          if (bool) toggleDom.addClass('turn-on'); else toggleDom.removeClass('turn-on')
        }
        btnObj.setOn = function () {
          btnObj.setVal(true)
        }
        btnObj.setOff = function () {
          btnObj.setVal(false)
        }
        btnObj.toggle = function () {
          if (!toggleDom.hasClass('turn-on')) { // On
            toggleDom.addClass('turn-on')
            turnOnEvent()
          } else { // Off
            toggleDom.removeClass('turn-on')
            turnOffEvent()
          }
        }
        btnObj.getDom = function () {
          return btnDom
        }
        btnDom.click(function () {
          btnObj.toggle()
        }).appendTo(boxDom)
        return btnObj
      }
      // 信息展示
      innerElement.infoShow = function (label, value) {
        return $('<div class="two-line"><span class="label">' + label + '</span><span class="value">' + value + '</span></div>').appendTo(boxDom)
      }

      return innerElement
    }

    SettingItems(this, group, itemAt)
  }
}

export default Setting
