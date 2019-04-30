import { html } from 'common-tags'
import Task from '../Task'
import AppNavbar from '../AppNavbar'
import AppLayer from '../AppLayer'

const TaskController = window.TaskController

/**
 * Task Item
 */
class TaskItem {
  constructor (taskId, typeName, classLabel, parmsObj) {
    this._taskId = taskId
    this._typeName = typeName
    this._classLabel = classLabel
    this._parmsObj = parmsObj

    this._taskItemSel = `[data-task-id="${taskId}"]`
    this._taskLogTableSel = `${this._taskItemSel} .task-log-table`

    this.isInProgress = true // 任务是否正在进行中
    this.allowAutoScrollToBottom = true

    // 初始化界面
    this.elem = $(html`
      <div class="task-item" data-task-id="${taskId}" style="display: none">
        <div class="container" style="width: 95%;">
        <div class="task-log-table"></div>
      </div>
    `).appendTo(Task.sel.runtime)
  }

  /** 获取任务ID */
  getId () {
    return this._taskId
  }

  /** 获取任务调用类名 */
  getTypeName () {
    return this._typeName
  }

  /** 获取任务调用类标签 */
  getClassLabel () {
    return this._classLabel
  }

  /** 获取任务参数对象 */
  getParmsObj () {
    return this._parmsObj
  }

  /** 设置标题 */
  setTitle () {
    AppNavbar.setTitle(this.getTitle())
  }
  /** 获取标题 */
  getTitle () {
    return `${this.getClassLabel()} 任务ID：${this.getId()}`
  }

  /** 恢复成原来的标题 */
  setOriginalTitle () {
    AppNavbar.setTitle('')
  }

  /** 显示 */
  show () {
    Task.show(this.getId())
  }

  /** 隐藏 */
  hide () {
    Task.hide()
  }

  /** 显示任务信息 */
  showInfo () {
    AppLayer.Dialog.open(
      '任务信息',

      `ID：${this.getId()}<br>` +
      `标题：${this.getTitle()}<br><br>` +
      `调用类标签：${this.getClassLabel()}<br>` +
      `调用类名：${this.getTypeName()}<br><br>` +
      `执行开始时间：${new Date(parseInt(this.getId()))}<br><br>` +
      `参数：${JSON.stringify(this.getParmsObj())}`
    )
  }

  /** 日志 */
  log (text, level) {
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
    line.appendTo(this._taskLogTableSel)
    line.css('display', '')
    this.scrollToBottom()
  }
  // 自动滚动到底部
  scrollToBottom () {
    // 功能有待优化，当终端快速显示日志时有问题
    /* if (!this.allowAutoScrollToBottom)
      return; // throw ('不允许自动滚动到底部啦'); */

    $(Task.sel.runtime).scrollTop($(Task.sel.runtime)[0].scrollHeight)
  }

  /** 删除 */
  remove () {
    if (this.getIsInProgress()) {
      AppLayer.Dialog.open('删除任务', `任务 “${this.getTitle()}” 正在执行中...`,
        ['中止并删除任务', () => {
          TaskController.abortTask(this.getId()).then((isSuccess) => {
            if (isSuccess) {
              this._remove()
            } else {
              AppLayer.Notify.error('任务中止失败')
            }
          })
        }],
        ['取消', () => { }])
    } else {
      this._remove()
    }
  }

  /** 删除，仅限内部调用 */
  _remove () {
    if (!!Task.getCurrent() && Task.getCurrent().getId() === this.getId()) {
      this.hide()
    }
    // 对象删掉！
    delete Task.list[this.getId()]
    // 任务管理器删除项目
    Task.taskManagerLayer.removeItem(this.getId())
    // 提示
    AppLayer.Notify.success('任务删除成功')
  }

  /** 设置任务已结束状态 */
  taskIsEnd () {
    this.isInProgress = false
  }

  /** 获取任务是否在进行中 */
  getIsInProgress () {
    return this.isInProgress
  }

  /** 获取 Selector */
  getSel () {
    return this._taskItemSel
  }

  /** 获取 Log Table Selector */
  getLogTableSel () {
    return this._taskLogTableSel
  }
}

export default TaskItem
