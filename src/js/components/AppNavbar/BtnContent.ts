import AppNavbar from '../AppNavbar'
import Task from '../Task'
import Setting from '../Setting'

export default () => {
  // 导航栏操作按钮
  AppNavbar.BtnBox.groupAdd('main-btns', {
    taskManager: {
      icon: 'assignment',
      title: '任务列表',
      onClick() {
        Task.taskManagerLayer.toggleLayer()
      }
    },
    downloadManager: {
      icon: 'download',
      title: '下载列表',
    },
    setting: {
      icon: 'settings',
      title: '设置',
      onClick() {
        Setting.getSidebar().toggle()
      }
    }
  })

  AppNavbar.BtnBox.groupAdd('task-runtime', {
    backToTaskGen: {
      icon: 'chevron-left',
      title: '返回任务生成器',
      onClick() {
        Task.hide()
      }
    },
    removeTask: {
      icon: 'close',
      title: '删除任务',
      onClick() {
        Task.getCurrent().remove()
      }
    },
    showTaskInfo: {
      icon: 'info',
      title: '任务详情',
      onClick() {
        if (!Task.getCurrent()) { return }

        Task.getCurrent().showInfo()
      }
    }
  }).setMostLeft().hide()
}