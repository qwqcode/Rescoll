/**
 * 导航栏
 */
import Panel from './Panel'
import Btn from './Btn'
import Task from '../Task'
import Setting from '../Setting'
import { Base64 } from 'js-base64'

const AppNavbar = {
  sel: {
    nav: '.top-nav-bar',
    navTitle: '.top-nav-bar .nav-title'
  },
  // 初始化 Navbar
  init () {
    $('<div class="left-items"><div class="nav-title"></div></div><div class="right-items"><div class="nav-btns"></div></div>').appendTo(this.sel.nav)
    // 导航栏操作按钮
    AppNavbar.Btn.groupAdd('main-btns', {
      taskManager: {
        icon: 'assignment',
        title: '任务列表',
        onClick () {
          Task.taskManagerLayer.toggleLayer()
        }
      },
      downloadManager: {
        icon: 'download',
        title: '下载列表'
      },
      setting: {
        icon: 'settings',
        title: '设置',
        onClick () {
          Setting.getSidebar().toggle()
        }
      }
    })

    AppNavbar.Btn.groupAdd('task-runtime', {
      backToTaskGen: {
        icon: 'chevron-left',
        title: '返回任务生成器',
        onClick () {
          Task.hide()
        }
      },
      removeTask: {
        icon: 'close',
        title: '删除任务',
        onClick () {
          Task.getCurrent().remove()
        }
      },
      showTaskInfo: {
        icon: 'info',
        title: '任务详情',
        onClick () {
          if (!Task.getCurrent()) { return }

          Task.getCurrent().showInfo()
        }
      }
    }).setMostLeft().hide()
  },
  // 标题设置
  setTitle (value, base64) {
    if (typeof base64 === 'boolean' && base64 === true) { value = Base64.decode(value) }

    let navTitleSel = this.sel.navTitle
    $(navTitleSel).addClass('changing')
    setTimeout(() => {
      $(navTitleSel)
        .text(value)
        .removeClass('changing')
    }, 100)
  },
  // 标题获取
  getTitle () {
    return $(this.sel.navTitle).text()
  }
}

AppNavbar.Panel = Panel
AppNavbar.Btn = Btn

export default AppNavbar
