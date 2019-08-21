import Terminal from './Terminal'
import Tab from './Tab'

export default class Task {
  /** 任务ID */
  public id: string
  /** 标题 */
  public title: string
  /** 任务提供者类名 */
  public collerType: string
  /** 参数对象 */
  public parms: object
  /** 任务是否处于执行中状态 */
  public isInProgress: boolean = true
  /** terminal */
  public terminal: Terminal = new Terminal()
  /** Header Tab */
  public headerTab?: Tab

  public constructor (id: string, title: string, collerType: string, parms: object) {
    this.id = id
    this.title = title
    this.collerType = collerType
    this.parms = parms
  }

  /** TASK 已结束 */
  public setTaskIsDone () {
    this.isInProgress = false
  }

  /** @deprecated 旧接口 */
  public taskIsEnd () {
    this.setTaskIsDone()
  }
}
