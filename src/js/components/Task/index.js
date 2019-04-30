import AppNavbar from '../AppNavbar'

import { Base64 } from 'js-base64'
import TaskItem from './TaskItem'
import TaskManagerLayer from './TaskManagerLayer'

const TaskController = window.TaskController

window.taskItem = TaskItem

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

    // 实例化 TaskItem
    let taskItem = new TaskItem(taskId, typeName, classLabel, parmsObj)
    this.list[taskId] = taskItem

    // 让任务控制器 开始一个执行新任务
    TaskController.createTask(taskId, typeName, classLabel, JSON.stringify(parmsObj)).then((callback) => {
      taskItem.show()
      Task.taskManagerLayer.addItem(taskId)
    })

    return taskItem
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
    AppNavbar.BtnBox.get('task-runtime').show()

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
    AppNavbar.BtnBox.get('task-runtime').hide()

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
