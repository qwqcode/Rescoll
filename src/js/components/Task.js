import AppNavbar from './AppNavbar'
import AppLayer from './AppLayer'
import { Base64 } from 'js-base64'

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
  createTask: function (typeName, classLabel, parmsObj) {
    var taskId = new Date().getTime().toString()
    var runtimeSel = this.sel.runtime
    // 创建元素
    $('<div class="task-item" data-task-id="' + taskId + '" style="display: none">\n<div class="container" style="width: 95%;">\n<div class="task-log-table"></div>\n</div>').appendTo(runtimeSel)
    var taskItemSel = '[data-task-id="' + taskId + '"]'
    var taskLogTableSel = taskItemSel + ' .task-log-table'
    // 工厂模式
    var taskObj = {}
    // 获取任务ID
    taskObj.getId = function () {
      return taskId
    }
    // 获取任务调用类名
    taskObj.getTypeName = function () {
      return typeName
    }
    // 获取任务调用类标签
    taskObj.getClassLabel = function () {
      return classLabel
    }
    // 获取任务参数对象
    taskObj.getParmsObj = function () {
      return parmsObj
    }
    // 设置标题
    taskObj.setTitle = function () {
      AppNavbar.setTitle(taskObj.getTitle())
    }
    // 获取标题
    taskObj.getTitle = function () {
      return classLabel + ' 任务ID：' + taskId
    }
    // 恢复成原来的标题
    taskObj.setOriginalTitle = function () {
      AppNavbar.setTitle('')
    }
    // 显示
    taskObj.show = function () {
      Task.show(taskId)
    }
    // 隐藏
    taskObj.hide = function () {
      Task.hide()
    }
    // 显示任务信息
    taskObj.showInfo = function () {
      console.log(AppNavbar)
      AppLayer.Dialog.open('任务信息', 'ID：' + taskId + '<br>标题：' + taskObj.getTitle() + '<br><br>调用类标签：' + taskObj.getClassLabel() + '<br>调用类名：' + taskObj.getTypeName() + '<br><br>执行开始时间：' + new Date(parseInt(taskId)) + '<br><br>参数：' + JSON.stringify(parmsObj) + '')
    }
    // 日志
    taskObj.log = function (text, level) {
      var line = $('<div class="line" style="display: none" />')
      var levelsList = { I: '消息', S: '成功', W: '警告', E: '错误' }
      var innerText = ''
      if (levelsList[level]) {
        line.attr('data-level', level)
        innerText += '<span class="tag">[' + levelsList[level] + ']</span> '
      }
      var textHandle = function (str) {
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
    taskObj.scrollToBottom = function () {
      // 功能有待优化，当终端快速显示日志时有问题
      /* if (!taskObj.allowAutoScrollToBottom)
                  return; // throw ('不允许自动滚动到底部啦'); */

      $(runtimeSel).scrollTop($(runtimeSel)[0].scrollHeight)
    }
    // 删除
    taskObj.remove = function () {
      if (taskObj.getIsInProgress()) {
        AppLayer.Dialog.open('删除任务', '任务 “' + taskObj.getTitle() + '” 正在执行中...',
          ['中止并删除任务', function () {
            TaskController.abortTask(taskId).then(function (isSuccess) {
              if (isSuccess) {
                taskObj._remove()
              } else {
                AppLayer.Notify.error('任务中止失败')
              }
            })
          }],
          ['取消', function () {}])
      } else {
        taskObj._remove()
      }
    }
    taskObj._remove = function () {
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
    taskObj.taskIsEnd = function () {
      taskObj.isInProgress = false
    }
    // 获取任务是否在进行中
    taskObj.getIsInProgress = function () {
      return taskObj.isInProgress
    }
    // 获取 Selector
    taskObj.getSel = function () {
      return taskItemSel
    }
    // 获取 Log Table Selector
    taskObj.getLogTableSel = function () {
      return taskLogTableSel
    }

    this.list[taskId] = taskObj

    // 让任务控制器 开始一个执行新任务
    TaskController.createTask(taskId, typeName, classLabel, JSON.stringify(parmsObj)).then(function (callback) {
      taskObj.show()
      Task.taskManagerLayer.addItem(taskId)
    })

    return taskObj
  },
  // 获取任务
  get: function (taskId) {
    if (!this.list.hasOwnProperty(taskId)) { return null }

    return this.list[taskId]
  },
  // 获取当前显示任务
  getCurrent: function () {
    if (!this.get(this.currentDisplayedId)) { return null }

    return this.get(this.currentDisplayedId)
  },
  // 显示指定任务
  show: function (taskId) {
    if (!this.get(taskId)) { throw Error('未找到任务 ' + taskId) }

    if (this.getCurrent() !== null) { this.hide() }

    var taskObj = this.get(taskId)
    var runtimeSel = this.sel.runtime
    var taskItemSel = taskObj.getSel()

    $(taskItemSel).show()
    $(runtimeSel).show()

    $(runtimeSel).on('scroll', function () {
      taskObj.allowAutoScrollToBottom = false

      var documentheight = $(taskObj.getSel() + ' > .container').innerHeight()

      var totalheight = $(runtimeSel).height() + $(runtimeSel).scrollTop()

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
  hide: function () {
    if (this.currentDisplayedId === null) { throw Error('未显示任何任务') }

    var runtimeSel = this.sel.runtime
    var taskItemSel = Task.getCurrent().getSel()

    $(runtimeSel).hide()
    $(runtimeSel).off('scroll')
    $(taskItemSel).hide()

    this.getCurrent().setOriginalTitle()

    // 隐藏导航栏控制按钮组
    AppNavbar.Btn.get('task-runtime').hide()

    this.currentDisplayedId = null
  },
  // 日志
  log: function (taskId, text, level, timeStamp, textIsBase64) {
    if (!this.get(taskId)) { throw Error('未找到任务 ' + taskId) }

    if (typeof textIsBase64 === 'boolean' && textIsBase64 === true) { text = Base64.decode(text) }

    this.get(taskId).log(text, level)
  },
  // 任务管理器层
  taskManagerLayer: {
    init: function () {
      var taskManager = AppLayer.Sidebar.register('taskManager')
      taskManager.setTitle('任务列表', '#4265c7')
      taskManager.setWidth(450)
      taskManager.setInner('<div class="task-manager"></div>')
    },
    getItemSel: function (taskId) {
      return '[data-taskmanager-taskid="' + taskId + '"]'
    },
    addItem: function (taskId) {
      if (!Task.get(taskId)) { throw Error('未找到此任务 ' + taskId) }

      var task = Task.get(taskId)
      var taskItem = $('<div class="task-item" data-taskmanager-taskid="' + taskId + '">\n<div class="left">\n<i class="zmdi zmdi-view-carousel" data-toggle="task-show"></i>\n</div>\n<div class="right">\n<h2 class="task-title" data-toggle="task-show">' + task.getClassLabel() + '</h2>\n<p class="task-desc"><span class="task-id">任务ID：' + taskId + '</span></p>\n<div class="action-bar">\n<a class="action-btn" data-toggle="task-show"><i class="zmdi zmdi-layers"></i> 显示</a>\n<a class="action-btn" data-toggle="task-remove"><i class="zmdi zmdi-close"></i> 删除</a>\n</div>\n</div>\n</div>')
      taskItem.find('[data-toggle="task-show"]').click(function () {
        Task.show(taskId)
      })
      taskItem.find('[data-toggle="task-remove"]').click(function () {
        Task.get(taskId).remove()
      })
      taskItem.prependTo(this.getLayer().getSel() + ' .task-manager')
    },
    removeItem: function (taskId) {
      if ($(this.getItemSel(taskId)).length === 0) { throw Error('未找到此任务 ' + taskId) }

      setTimeout(function () {
        $(Task.taskManagerLayer.getItemSel(taskId)).remove()
      }, 20)
    },
    toggleLayer: function () {
      this.getLayer().toggle()
    },
    getLayer: function () {
      return AppLayer.Sidebar.get('taskManager')
    }
  }
}

export default Task
