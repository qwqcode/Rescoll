import AppNavbar from '../AppNavbar'
import AppLayer from '../AppLayer'
import { Base64 } from 'js-base64'
import { html } from 'common-tags'
import TaskManagerLayer from './TaskManagerLayer'

const TaskController = window.TaskController

/**
 * 任务
 */
const Task = {
  sel: {
    runtime: '.task-runtime'
  },
  // 任务列表
  list: {},
  // 当前显示的任务ID
  currentDisplayedId: null,
  // 创建任务
  createTask (typeName, classLabel, parmsObj) {
    let taskId = new Date().getTime().toString()
    let runtimeSel = this.sel.runtime
    // 创建元素
    $(html`
      <div class="task-item" data-task-id="${taskId}" style="display: none">
        <div class="container" style="width: 95%;"><div class="task-log-table"></div>
      </div>`).appendTo(runtimeSel)
    let taskItemSel = `[data-task-id="${taskId}"]`
    let taskLogTableSel = taskItemSel + ' .task-log-table'
    // 工厂模式
    let taskObj = {}
    // 获取任务ID
    taskObj.getId = () => {
      return taskId
    }
    // 获取任务调用类名
    taskObj.getTypeName = () => {
      return typeName
    }
    // 获取任务调用类标签
    taskObj.getClassLabel = () => {
      return classLabel
    }
    // 获取任务参数对象
    taskObj.getParmsObj = () => {
      return parmsObj
    }
    // 设置标题
    taskObj.setTitle = () => {
      AppNavbar.setTitle(taskObj.getTitle())
    }
    // 获取标题
    taskObj.getTitle = () => {
      return `${classLabel} 任务ID：${taskId}`
    }
    // 恢复成原来的标题
    taskObj.setOriginalTitle = () => {
      AppNavbar.setTitle('')
    }
    // 显示
    taskObj.show = () => {
      Task.show(taskId)
    }
    // 隐藏
    taskObj.hide = () => {
      Task.hide()
    }
    // 显示任务信息
    taskObj.showInfo = () => {
      console.log(AppNavbar)
      AppLayer.Dialog.open(
        '任务信息',

        `ID：${taskId}<br>` +
        `标题：${taskObj.getTitle()}<br><br>` +
        `调用类标签：${taskObj.getClassLabel()}<br>` +
        `调用类名：${taskObj.getTypeName()}<br><br>` +
        `执行开始时间：${new Date(parseInt(taskId))}<br><br>` +
        `参数：${JSON.stringify(parmsObj)}`
      )
    }
    // 日志
    taskObj.log = (text, level) => {
      let line = $('<div class="line" style="display: none" />')
      let levelsList = { I: '消息', S: '成功', W: '警告', E: '错误' }
      let innerText = ''
      if (levelsList[level]) {
        line.attr('data-level', level)
        innerText += `<span class="tag">[${levelsList[level]}]</span> `
      }
      let textHandle = (str) => {
        return str.replace(/\n/g, '<br/>')
      }
      innerText += textHandle(text)
      line.html(innerText)
      line.appendTo(taskLogTableSel)
      line.css('display', '')
      taskObj.scrollToBottom()
    }
    // 自动滚动到底部
    taskObj.allowAutoScrollToBottom = true
    taskObj.scrollToBottom = () => {
      // 功能有待优化，当终端快速显示日志时有问题
      /* if (!taskObj.allowAutoScrollToBottom)
                  return; // throw ('不允许自动滚动到底部啦'); */

      $(runtimeSel).scrollTop($(runtimeSel)[0].scrollHeight)
    }
    // 删除
    taskObj.remove = () => {
      if (taskObj.getIsInProgress()) {
        AppLayer.Dialog.open('删除任务', `任务 “${taskObj.getTitle()}” 正在执行中...`,
          ['中止并删除任务', () => {
            TaskController.abortTask(taskId).then((isSuccess) => {
              if (isSuccess) {
                taskObj._remove()
              } else {
                AppLayer.Notify.error('任务中止失败')
              }
            })
          }],
          ['取消', () => {}])
      } else {
        taskObj._remove()
      }
    }
    taskObj._remove = () => {
      if (!!Task.getCurrent() && Task.getCurrent().getId() === taskId) {
        taskObj.hide()
      }
      // 对象删掉！
      delete Task.list[taskId]
      // 任务管理器删除项目
      Task.taskManagerLayer.removeItem(taskId)
      // 提示
      AppLayer.Notify.success('任务删除成功')
    }
    // 任务是否正在进行中
    taskObj.isInProgress = true
    // 设置任务已结束状态
    taskObj.taskIsEnd = () => {
      taskObj.isInProgress = false
    }
    // 获取任务是否在进行中
    taskObj.getIsInProgress = () => {
      return taskObj.isInProgress
    }
    // 获取 Selector
    taskObj.getSel = () => {
      return taskItemSel
    }
    // 获取 Log Table Selector
    taskObj.getLogTableSel = () => {
      return taskLogTableSel
    }

    this.list[taskId] = taskObj

    // 让任务控制器 开始一个执行新任务
    TaskController.createTask(taskId, typeName, classLabel, JSON.stringify(parmsObj)).then((callback) => {
      taskObj.show()
      Task.taskManagerLayer.addItem(taskId)
    })

    return taskObj
  },
  // 获取任务
  get (taskId) {
    if (!this.list.hasOwnProperty(taskId)) { return null }

    return this.list[taskId]
  },
  // 获取当前显示任务
  getCurrent () {
    if (!this.get(this.currentDisplayedId)) { return null }

    return this.get(this.currentDisplayedId)
  },
  // 显示指定任务
  show (taskId) {
    if (!this.get(taskId)) { throw Error(`未找到任务 ${taskId}`) }

    if (this.getCurrent() !== null) { this.hide() }

    let taskObj = this.get(taskId)
    let runtimeSel = this.sel.runtime
    let taskItemSel = taskObj.getSel()

    $(taskItemSel).show()
    $(runtimeSel).show()

    $(runtimeSel).on('scroll', () => {
      taskObj.allowAutoScrollToBottom = false

      let documentheight = $(taskObj.getSel() + ' > .container').innerHeight()

      let totalheight = $(runtimeSel).height() + $(runtimeSel).scrollTop()

      if (documentheight === totalheight) {
        taskObj.allowAutoScrollToBottom = true
      }
    })

    taskObj.setTitle()

    // 显示导航栏控制按钮组
    AppNavbar.Btn.get('task-runtime').show()

    this.currentDisplayedId = taskId
  },
  // 隐藏
  hide () {
    if (this.currentDisplayedId === null) { throw Error('未显示任何任务') }

    let runtimeSel = this.sel.runtime
    let taskItemSel = Task.getCurrent().getSel()

    $(runtimeSel).hide()
    $(runtimeSel).off('scroll')
    $(taskItemSel).hide()

    this.getCurrent().setOriginalTitle()

    // 隐藏导航栏控制按钮组
    AppNavbar.Btn.get('task-runtime').hide()

    this.currentDisplayedId = null
  },
  // 日志
  log (taskId, text, level, timeStamp, textIsBase64) {
    if (!this.get(taskId)) { throw Error(`未找到任务 ${taskId}`) }

    if (typeof textIsBase64 === 'boolean' && textIsBase64 === true) { text = Base64.decode(text) }

    this.get(taskId).log(text, level)
  }
}

// 任务管理器层
Task.taskManagerLayer = TaskManagerLayer

export default Task
