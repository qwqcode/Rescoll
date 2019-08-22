import Utils from '../Utils'
import { DlStatus } from './DlEnums'

export default class DlTask {
  constructor (
    /** 下载任务 ID */
    public id: string,

    /** 标题 */
    public title: string,

    /** 下载地址 */
    public url?: string,

    /** 本地存储路径 */
    public localPath?: string,

    /** 当前下载状态 */
    public status: DlStatus = DlStatus.Downloading
  ) {}

  /** 文件总大小 bytes */
  public sizeTotal?: number

  /** 已下载的大小 bytes */
  public sizeReceived?: number

  /** 当前下载速度 bytes/s */
  public speed?: number

  /** 文件总大小（已格式化的） */
  public get sizeTotalFormatted () {
    if (this.sizeTotal === undefined) { return '' }
    return Utils.formatBytes(this.sizeTotal)
  }

  /** 已下载的大小（已格式化的） */
  public get sizeReceivedFormatted () {
    if (this.sizeReceived === undefined) { return '' }
    return Utils.formatBytes(this.sizeReceived)
  }

  /** 当前下载速度（已格式化的） */
  public get speedFormatted () {
    if (this.speed === undefined) { return '' }
    return Utils.formatBytes(this.speed)
  }

  /** 任务是否处于执行状态 */
  public get isInProgress () {
    return (this.status === DlStatus.Downloading || this.status === DlStatus.Pause)
  }

  /** 下载进度百分比 */
  public get percentage () {
    if (!this.hasPercentage) { return '' }
    return (((this.sizeReceived || 0) / (this.sizeTotal || 1)) * 100).toFixed(2) + '%' // 保留2位小数
  }

  public get hasPercentage () {
    return this.sizeReceived !== undefined && this.sizeTotal !== undefined && this.sizeTotal !== 0
  }

  /** 执行中的描述 */
  public get descInProgress () {
    if ([DlStatus.Fail, DlStatus.Cancelled].includes(this.status)) { return '' }
    if (this.status === DlStatus.Done) { return this.sizeTotalFormatted ? `总大小：${this.sizeTotalFormatted}` : '' }

    let desc = ''
    if (this.status === DlStatus.Pause) {
      desc += '[已暂停] '
    }
    // 百分比
    if (this.hasPercentage) {
      desc += `${this.percentage}，`
    }
    // 速度
    if (this.status === DlStatus.Downloading) {
      desc += `速度 ${this.speedFormatted}，`
    }
    // 文件大小
    desc += `已下载 ${this.sizeReceivedFormatted}`
    if (this.hasPercentage) {
      desc += `，共 ${this.sizeTotalFormatted}`
    }

    return desc
  }
}
