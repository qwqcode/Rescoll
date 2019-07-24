import AppNavbar from './AppNavbar'
import AppAction from './AppAction'
import { html } from 'common-tags'

const CrDownloadsCallBack = window.CrDownloadsCallBack

enum DownloadsStatus {
  downloading = 1,
  pause = 2,
  done = 3,
  cancelled = 4,
  fail = 5
}

enum DownloadsActions {
  pause = 1,
  resume = 2,
  cancel = 3
}

/**
 * 浏览器下载管理器
 */
export default class Downloads {
  public static readonly navbarBtnName = 'main-btns.downloadManager'

  public static list: {
    [key: string]: {
      fullPath: string,
      downloadUrl: string,
      totalBytes: number,
      receivedBytes: number,
      currentSpeed: number,
      status: DownloadsStatus
    }
  } = {}
  public static itemElemList: {[key: string]: JQuery} = {}

  public static Status = DownloadsStatus
  public static Actions = DownloadsActions

  public static readonly sel = {
    downloadsList: '.download-list'
  }
  public static readonly panelKey = 'downloads'
  public static readonly localStorageKey = 'downloads'
  public static listElem: JQuery

  /** 初始化 */
  public static init() {
    this.listElem = $('<div class="downloads-list"></div>')
    let panelObj = AppNavbar.Panel.register(this.panelKey, this.navbarBtnName)
    panelObj.setTitle('<i class="zmdi zmdi-download"></i> 下载列表')
    panelObj.setInner(this.listElem)
    panelObj.setSize(400, 430)
    // 读取 localStorage 恢复下载列表
    this.restoreDataList()
  }

  /** 新增任务 */
  public static addTask(json: { key: string, fullPath: string, downloadUrl: string, totalBytes: number}) {
    // console.log("ADD: " + JSON.stringify(json));
    this._addTask(json.key, json.fullPath, json.downloadUrl, json.totalBytes)
  }

  public static _addTask(key: string, fullPath: string, downloadUrl: string, totalBytes: number) {
    if (this.list[key]) { throw Error(`${key} 下载任务已存在，无需再新建`) }

    this.list[key] = {
      fullPath: fullPath,
      downloadUrl: downloadUrl,
      totalBytes: totalBytes,
      receivedBytes: 0,
      currentSpeed: 0,
      status: 0
    }
    this.itemElemList[key] = $()

    // 导航栏按钮显示通知小红点
    AppNavbar.BtnBox.getBtnItem(this.navbarBtnName).showBadge()
  }

  /** 更新任务 */
  public static updateTask(json: { key: string, receivedBytes: number, currentSpeed: number, status: DownloadsStatus, fullPath: string, downloadUrl: string }) {
    // console.log("UPD: " + JSON.stringify(json));
    this._updateTask(json.key, json.receivedBytes, json.currentSpeed, json.status, json.fullPath, json.downloadUrl)
  }

  public static _updateTask(key: string, receivedBytes: number, currentSpeed: number, status: DownloadsStatus, fullPath: string, downloadUrl: string) {
    if (!this.list[key]) { throw Error(`${key} 下载任务不存在，或许已被删除`) }

    this.list[key].receivedBytes = receivedBytes
    this.list[key].currentSpeed = currentSpeed
    this.list[key].status = status

    if (fullPath !== '' && this.list[key].fullPath !== fullPath)
      this.list[key].fullPath = fullPath
    
    if (this.list[key].downloadUrl !== downloadUrl)
      this.list[key].downloadUrl = downloadUrl

    this.updateItemUi(key) // 刷新界面
    this.storeDataList() // 存储下载列表
  }

  /** 更新列表项目 UI */
  public static updateItemUi(key: string) {
    if (!this.list[key]) { throw Error(`${key} 下载任务不存在，或许已被删除`) }

    let taskData = this.list[key]
    let itemElem = this.itemElemList[key]

    if (!itemElem || (!!itemElem && itemElem.length === 0)) {
      // 初始化 item elem
      itemElem = this.itemElemList[key] = $(html`
      <div class="download-item">
        <div class="details">
          <div class="header">
            <a class="file-name"></a>
            <a class="download-url"></a>
          </div>
          <div class="description"></div>
          <div class="progress"><div class="progress-bar"></div></div>
          <div class="action-bar"></div>
        </div>
        <div class="icon-wrapper">
          <button class="remove-btn" title="从列表中移除">✕</button>
        </div>
      </div>
      `).prependTo(this.listElem)

      itemElem.find('.download-url').text(taskData.downloadUrl)
      
      // click 绑定
      itemElem.find('.file-name').click(() => {
        Downloads.fileLaunch(key)
      })
      itemElem.find('.download-url').click(() => {
        Downloads.urlOpenInDefaultBrowser(key)
      })
      itemElem.find('.remove-btn').click(() => {
        Downloads.taskRemove(key)
      })
    }

    let fileNameElem = itemElem.find('.file-name')
    let progressElem = itemElem.find('.progress')
    let progressBarElem = itemElem.find('.progress .progress-bar')
    let descriptionElem = itemElem.find('.description')
    let actionBarElem = itemElem.find('.action-bar')

    // 若状态改变 则更新 dl-status
    if (itemElem.attr('dl-status') !== this.getStatusName(taskData.status)) {
      itemElem.attr('dl-status', this.getStatusName(taskData.status))
    }

    // 文件名 （路径 => 文件名）
    if (fileNameElem.text() !== this.extractFilename(taskData.fullPath)) {
      fileNameElem.text(this.extractFilename(taskData.fullPath))
    }

    // 下载数据
    let speed = this.bytesToSize(taskData.currentSpeed) + '/s' // 当前速度
    let received = this.bytesToSize(taskData.receivedBytes) // 已下载
    let total = this.bytesToSize(taskData.totalBytes) // 总共大小

    // 进度百分比，保留2位小数
    let progressPercentage = ((taskData.receivedBytes / taskData.totalBytes) * 100).toFixed(2) + '%'

    // description & actionBar
    let descriptionText = ''
    let actionBarElemN = $()

    switch (taskData.status) {
      case DownloadsStatus.downloading: // 下载中
        if (taskData.totalBytes !== 0) {
          // Progress Bar
          if (progressElem.hasClass('indeterminate')) {
            progressElem.removeClass('indeterminate')
          }

          if (progressBarElem.css('width') !== progressPercentage) {
            progressBarElem.css('width', progressPercentage)
          }

          descriptionText = `${progressPercentage}，速度 ${speed}，已下载 ${received}，共 ${total}`
        } else {
          // Indeterminate Progress
          if (!progressElem.hasClass('indeterminate')) {
            progressElem.addClass('indeterminate')
          }

          descriptionText = `速度 ${speed}，已下载 ${received}`
        }

        actionBarElemN = $(html`
        <span>
          <a class="btn-pause">暂停</a>
          <a class="btn-cancel">取消</a>
        </span>
        `)
        actionBarElemN.find('.btn-pause').click(() => {
          Downloads.taskAction(key, DownloadsActions.pause)
        })
        actionBarElemN.find('.btn-cancel').click(() => {
          Downloads.taskAction(key, DownloadsActions.cancel)
        })

        break

      case DownloadsStatus.pause: // 暂停
        if (taskData.totalBytes !== 0) {
          // Progress Bar
          descriptionText = `${progressPercentage}，已下载 ${received}，共 ${total}`
        } else {
          // Indeterminate Progress
          descriptionText = `已下载 ${received}`
        }

        actionBarElemN = $(html`
        <span>
          <a class="btn-resume">恢复</a>
          <a class="btn-cancel">取消</a>
        </span>
        `)
        actionBarElemN.find('.btn-resume').click(() => {
          Downloads.taskAction(key, DownloadsActions.resume)
        })
        actionBarElemN.find('.btn-cancel').click(() => {
          Downloads.taskAction(key, DownloadsActions.cancel)
        })

        break

      case DownloadsStatus.done: // 已完毕
        descriptionText = `总大小：${received}`
        actionBarElemN = $(html`<a>在文件夹中显示</a>`)
        actionBarElemN.click(() => {
          Downloads.fileShowInExplorer(key)
        })
        break

      case DownloadsStatus.cancelled: // 已取消
        actionBarElemN = $(html`<a>重试下载</a>`)
        actionBarElemN.click(() => {
          Downloads.downloadAgain(key)
        })
        break

      case DownloadsStatus.fail: // 错误
        actionBarElemN = $(html`<a>重试下载</a>`)
        actionBarElemN.click(() => {
          Downloads.downloadAgain(key)
        })
        break
    }

    // description & actionBar
    if (descriptionElem.text() !== descriptionText) {
      descriptionElem.text(descriptionText)
    }

    if (actionBarElemN.html() !== actionBarElem.html()) {
      actionBarElem.html('')
      actionBarElem.append(actionBarElemN)
    }
  }

  /** 下达任务操作命令 */
  public static taskAction(key: string, action: DownloadsActions) {
    if (!this.list[key]) { throw Error(`任务操作失败，或许已被删除，未找到 ${key}`) }

    CrDownloadsCallBack.downloadingTaskAction(key, action)
  }

  /** 任务从列表移除 */
  public static taskRemove(key: string) {
    if (!this.list[key]) { throw Error(`任务从列表移除失败，或许已被删除，未找到 ${key}`) }

    if (this.isTaskInProgress(key)) {
      CrDownloadsCallBack.downloadingTaskAction(key, DownloadsActions.cancel)
    }
    
    this.itemElemList[key].hide()
    delete this.list[key]

    this.storeDataList() // 存储下载列表
  }

  /** 获取正在下载的任务数 */
  public static countDownloadingTask() {
    let num = 0
    for (let key in this.list) {
      if (this.isTaskInProgress(key)) { num++ }
    }
    return num
  }

  /** localStorage 储存下载列表 */
  public static storeDataList() {
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.list))
  }

  /** localStorage 恢复下载列表 */
  public static restoreDataList() {
    let data = localStorage.getItem(this.localStorageKey)
    if (data === null) return

    let downloadsListObj = JSON.parse(data)
    this.list = {}

    // console.log(JSON.stringify(downloadsListJson));
    for (let key in downloadsListObj) {
      if (!downloadsListObj.hasOwnProperty(key)) { continue }

      this.list[key] = downloadsListObj[key]
      if (this.isTaskInProgress(key)) { this.list[key].status = DownloadsStatus.cancelled }

      this.updateItemUi(key)
    }
  }

  /** 清空下载列表 */
  public static removeDataList() {
    // 将正在执行的下载任务取消
    for (let key in this.list) {
      if (this.isTaskInProgress(key)) { this.taskAction(key, DownloadsActions.cancel) }
    }

    this.list = {}
    this.listElem.find('.download-item').remove()
    localStorage.setItem(this.localStorageKey, null)

    // 导航栏按钮隐藏通知小红点
    AppNavbar.BtnBox.getBtnItem(this.navbarBtnName).hideBadge()
  }

  /** 启动文件 */
  public static fileLaunch(key: string) {
    if (!this.list[key] || this.list[key].status !== DownloadsStatus.done) { return }

    CrDownloadsCallBack.fileLaunch(this.list[key].fullPath).then((isSuccess: boolean) => {
      if (!isSuccess) {
        Downloads.list[key].status = DownloadsStatus.cancelled
        Downloads.updateItemUi(key)
      }
    })
  }

  /** URL 在系统默认浏览器中打开 */
  public static urlOpenInDefaultBrowser(key: string) {
    if (!this.list[key]) { return }

    CrDownloadsCallBack.urlOpenInDefaultBrowser(this.list[key].downloadUrl)
  }

  /** 文件在资源管理器中显示 */
  public static fileShowInExplorer(key: string) {
    if (!this.list[key]) { return }

    CrDownloadsCallBack.fileShowInExplorer(this.list[key].fullPath).then((isSuccess: boolean) => {
      if (!isSuccess) {
        Downloads.list[key].status = DownloadsStatus.cancelled
        Downloads.updateItemUi(key)
      }
    })
  }

  /** 任务是否正在进行中 */
  public static isTaskInProgress(key: string) {
    if (!this.list[key]) { return false }
    if (
      this.list[key].status === DownloadsStatus.done ||
      this.list[key].status === DownloadsStatus.cancelled
    ) {
      return false
    } else {
      return true
    }
  }

  /** 重新下载 */
  public static downloadAgain(key: string) {
    if (!this.list[key]) { return false }

    AppAction.downloadUrl(this.list[key].downloadUrl)
  }

  /** 获取状态名 */
  public static getStatusName(status: DownloadsStatus | string) {
    for (let key in DownloadsStatus) {
      if (DownloadsStatus[key] === status) {
        return key
      }
    }
  }

  /** 路径中提取文件名 */
  public static extractFilename(path: string) {
    let lastSlash = Math.max(path.lastIndexOf('\\'), path.lastIndexOf('/'))
    return path.substring(lastSlash + 1)
  }

  /** bytes 格式化 */
  public static bytesToSize(bytes: number) {
    if (bytes === 0) return '0 B'
    let k = 1000
    // or 1024

    let sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    let i = Math.floor(Math.log(bytes) / Math.log(k))
    return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i]
  }
}
