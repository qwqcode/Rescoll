/**
 * Created by qwqcode on 2017/7/15.
 * https://github.com/qwqcode/Nacollector
 */

import AppNavbar from './components/AppNavbar'
import TaskGen from './components/TaskGen'
import Task from './components/Task'
import Downloads from './components/Downloads'
import AppWidget from './components/AppWidget'
import Setting from './components/Setting'
import AppLayer from './components/AppLayer'
import AppUpdate from './components/AppUpdate'
import AppAction from './components/AppAction'

window.$ = $
window.AppNavbar = AppNavbar
window.TaskGen = TaskGen
window.Task = Task
window.Downloads = Downloads
window.AppWidget = AppWidget
window.Setting = Setting
window.AppLayer = AppLayer
window.AppUpdate = AppUpdate
window.AppAction = AppAction

const AppWrapEl = window.AppWrapEl = $('.wrap')

/**
 * 页面初始化
 */
$(document).ready(function () {
  // 初始化 NavBar
  AppNavbar.init()

  // 初始化 Tooltip
  $('[data-toggle="tooltip"]').tooltip()

  // 浏览器初始化时白色闪光 减少违和感
  setTimeout(function () {
    $('body').css('opacity', '1')
    $(AppWrapEl).css('opacity', '1')
  }, 10)

  // 任务生成器初始化
  TaskGen.init()

  // 任务管理器层初始化
  Task.taskManagerLayer.init()

  // 点击操作按钮列表第一个
  $(TaskGen.sel.formToggleBtns + ' a:nth-child(1)').click()

  // 下载面板初始化
  Downloads.init()

  // 设置初始化
  Setting.init()

  // 设置程序当前版本号
  AppAction.tryGetVersion(function (version) {
    if (typeof (version) !== 'undefined') {
      AppAction.version = version
      // 检测更新
      AppUpdate.check(true)
    }
  })

  // 开发者工具显示方式
  $(document).keydown(function (e) {
    if (e.altKey && event.keyCode === 123) {
      AppAction.showDevTools()
    }
  })
})

// 根据URL创建一个下载任务
window.downloadFile = function (srcUrl) {
  AppAction.downloadUrl(srcUrl)
}

/**
 * jQuery 扩展函数
 */
$.extend({
  getPosition: function ($element) {
    var el = $element[0]
    var isBody = el.tagName === 'BODY'

    var elRect = el.getBoundingClientRect()
    if (elRect.width === null) {
      // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
      elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top })
    }
    var isSvg = window.SVGElement && el instanceof window.SVGElement
    // Avoid using $.offset() on SVGs since it gives incorrect results in jQuery 3.
    // See https://github.com/twbs/bootstrap/issues/20280
    var elOffset = isBody ? { top: 0, left: 0 } : (isSvg ? null : $element.offset())
    var scroll = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() }
    var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null

    return $.extend({}, elRect, scroll, outerDims, elOffset)
  },
  sprintf: function (str) {
    var args = arguments

    var flag = true

    var i = 1

    str = str.replace(/%s/g, function () {
      var arg = args[i++]

      if (typeof arg === 'undefined') {
        flag = false
        return ''
      }
      return arg
    })
    return flag ? str : ''
  }
})
