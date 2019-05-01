import AppLayer from '../AppLayer'
import Task from './index'
import { html } from 'common-tags'

export default class TaskManagerLayer {
  public static init() {
    let taskManager = AppLayer.Sidebar.register('taskManager')
    taskManager.setTitle('任务列表', '#4265c7')
    taskManager.setWidth(450)
    taskManager.setInner('<div class="task-manager"></div>')
  }

  public static getItemSel(taskId: string) {
    return '[data-taskmanager-taskid="' + taskId + '"]'
  }

  public static addItem(taskId: string) {
    if (!Task.get(taskId)) { throw Error('未找到此任务 ' + taskId) }

    let task = Task.get(taskId)
    let taskItem = $(html`
      <div class="task-item" data-taskmanager-taskid="${taskId}">
        <div class="left">
          <i class="zmdi zmdi-view-carousel" data-toggle="task-show"></i>
        </div>
        <div class="right">
          <h2 class="task-title" data-toggle="task-show">${task.getClassLabel()}</h2>
          <p class="task-desc"><span class="task-id">任务ID：${taskId}</span></p>
          <div class="action-bar">
            <a class="action-btn" data-toggle="task-show"><i class="zmdi zmdi-layers"></i> 显示</a>
            <a class="action-btn" data-toggle="task-remove"><i class="zmdi zmdi-close"></i> 删除</a>
          </div>
        </div>
      </div>`)
    taskItem.find('[data-toggle="task-show"]').click(() => {
      Task.show(taskId)
    })
    taskItem.find('[data-toggle="task-remove"]').click(() => {
      Task.get(taskId).remove()
    })
    taskItem.prependTo(this.getLayer().getElem().find('.task-manager'))
  }

  public static removeItem(taskId: string) {
    if ($(this.getItemSel(taskId)).length === 0) { throw Error(`未找到此任务 ${taskId}`) }

    setTimeout(() => {
      // console.log(this.getItemSel(taskId))
      $(this.getItemSel(taskId)).remove()
    }, 20)
  }

  public static toggleLayer() {
    this.getLayer().toggle()
  }

  public static getLayer() {
    return AppLayer.Sidebar.get('taskManager')
  }
}
