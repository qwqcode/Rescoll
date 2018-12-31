import AppAction from './AppAction'
import AppLayer from './AppLayer'
import Downloads from './Downloads'
import AppUpdate from './AppUpdate'

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

    var groupDownloads = group('downloads', '下载内容')
    itemAt(groupDownloads).btnBlock('下载列表清空', function () {
      Downloads.removeDataList()
      AppLayer.Notify.success('下载列表已清空')
    })

    var groupNetwork = group('downloads', '网络配置')
    itemAt(groupNetwork).btnToggle('采集时使用IE代理进行请求', function () {
      AppAction.utilsReqIeProxy(true)
    }, function () {
      AppAction.utilsReqIeProxy(false)
    }).setVal(!!this.get('UtilsReqIeProxy'))

    var groupMaintenance = group('maintenance', '维护')
    itemAt(groupMaintenance).btnBlock('日志文件清理', function () {
      AppAction.logFileClear().then(function () {
        AppLayer.Notify.success('日志文件已清理')
      })
    })
    var updateBtn = itemAt(groupMaintenance).btnBlock('检查更新', function () {
      updateBtn.text('正在检查更新...')
      AppUpdate.check(false, function () {
        updateBtn.text('检查更新')
      })
    })
    var groupAbout = group('about', '关于')
    var infoAppVersion = itemAt(groupAbout).infoShow('版本号', '').find('.value')
    AppAction.tryGetVersion(function (version) {
      infoAppVersion.text(version || '未知版本号')
    })
    itemAt(groupAbout).infoShow('作者', '<a href="https://github.com/qwqcode" target="_blank">qwqcode</a>')
    itemAt(groupAbout).infoShow('联系', '1149527164@qq.com')
    itemAt(groupAbout).infoShow('博客', '<a href="https://qwqaq.com" target="_blank">qwqaq.com</a>')
    itemAt(groupAbout).infoShow('GitHub', '<a href="https://github.com/qwqcode/Nacollector" target="_blank">qwqcode/Nacollector</a>')
    itemAt(groupAbout).infoShow('反馈问题', '<a href="https://github.com/qwqcode/Nacollector/issues" target="_blank">GitHub issue</a>')
    itemAt(groupAbout).infoShow('', '<a href="https://raw.githubusercontent.com/qwqcode/Nacollector/master/LICENSE" target="_blank">您使用 Nacollector 即视为您已阅读并同意本《Nacollector 用户使用许可协议》的约束</a>')
    itemAt(groupAbout).infoShow('', '<a href="https://github.com/qwqcode/Nacollector" target="_blank">Nacollector</a> Copyright (C) 2018 <a href="https://qwqaq.com" target="_blank">qwqaq.com</a>')
  }
}

export default Setting
