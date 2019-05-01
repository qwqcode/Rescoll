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
  public static data = {
    list: <any> {}
  }

  public static Status = DownloadsStatus
  public static Actions = DownloadsActions

  public static readonly sel = {
    downloadsList: '.download-list'
  }
  public static readonly panelKey = 'downloads'
  public static readonly localStorageConf = {
    key: 'downloads'
  }

  public static listElem: JQuery

  // 初始化
  public static init() {
    this.listElem = $('<div class="downloads-list"></div>')
    let panelObj = AppNavbar.Panel.register(this.panelKey, this.navbarBtnName)
    panelObj.setTitle('<i class="zmdi zmdi-download"></i> 下载列表')
    panelObj.setInner(this.listElem)
    panelObj.setSize(400, 430)
    // 读取 localStorage 恢复下载列表
    this.restoreDataList()
  }

  // 新增任务
  public static addTask(json: { key: string, fullPath: string, downloadUrl: string, totalBytes: string}) {
    // console.log("ADD: " + JSON.stringify(json));
    this._addTask(json.key, json.fullPath, json.downloadUrl, json.totalBytes)
  }

  public static _addTask(key: string, fullPath: string, downloadUrl: string, totalBytes: string) {
    if (this.data.list[key]) { throw Error(`${key} 下载任务已存在，无需再新建`) }

    this.data.list[key] = {
      fullPath: fullPath,
      downloadUrl: downloadUrl,
      totalBytes: totalBytes,
      receivedBytes: 0,
      currentSpeed: 0,
      status: 0
    }

    // 导航栏按钮显示通知小红点
    AppNavbar.BtnBox.getBtnItem(this.navbarBtnName).showBadge()
  }

  // 更新任务
  public static updateTask(json: { key: string, receivedBytes: string, currentSpeed: string, status: string, fullPath: string, downloadUrl: string }) {
    // console.log("UPD: " + JSON.stringify(json));
    this._updateTask(json.key, json.receivedBytes, json.currentSpeed, json.status, json.fullPath, json.downloadUrl)
  }

  public static _updateTask(key: string, receivedBytes: string, currentSpeed: string, status: string, fullPath: string, downloadUrl: string) {
    if (!this.data.list[key]) { throw Error(`${key} 下载任务不存在，或许已被删除`) }

    this.data.list[key].receivedBytes = receivedBytes
    this.data.list[key].currentSpeed = currentSpeed
    this.data.list[key].status = status

    if (this.data.list[key].fullPath !== fullPath && fullPath !== '') { this.data.list[key].fullPath = fullPath }

    if (this.data.list[key].downloadUrl !== downloadUrl) { this.data.list[key].downloadUrl = downloadUrl }

    this.updateItemUi(key) // 刷新界面
    this.storeDataList() // 存储下载列表
  }

  // 列表项目获取 Selector
  public static getItemElem(key: string) {
    return this.listElem.find(`[data-key="${key}"]`) // $().find() 导致界面不停更新；当不断执行一个方法时，拒绝使用 find()
  }

  // 更新列表项目 UI
  public static updateItemUi(key: string) {
    if (!this.data.list[key]) { throw Error(`${key} 下载任务不存在，或许已被删除`) }

    let taskData = this.data.list[key]
    let itemElem = this.getItemElem(key) // $().find() 导致界面不停更新；当不断执行一个方法时，拒绝使用 find()

    if (itemElem.length === 0) {
      // 新增一个 item 并返回 selector
      $(html`
      <div class="download-item" data-key="${key}">
        <div class="details">
          <div class="header">
            <a class="file-name" onclick="Downloads.fileLaunch('${key}')"></a>
            <a class="download-url" onclick="Downloads.urlOpenInDefaultBrowser('${key}')">${taskData.downloadUrl}</a>
          </div>
          <div class="description"></div>
          <div class="progress"><div class="progress-bar"></div></div>
          <div class="action-bar"></div>
        </div>
        <div class="icon-wrapper">
          <button class="remove-btn" title="从列表中移除" onclick="Downloads.taskRemove('${key}')">✕</button>
        </div>
      </div>
      `).prependTo(this.listElem)
    }

    let fileName = itemElem.find('.file-name')
    let progress = itemElem.find('.progress')
    let progressBar = itemElem.find('.progress .progress-bar')
    let description = itemElem.find('.description')
    let actionBar = itemElem.find('.action-bar')

    // 若状态改变 则更新 dl-status
    if (itemElem.attr('dl-status') !== this.getStatusName(taskData.status)) {
      itemElem.attr('dl-status', this.getStatusName(taskData.status))
    }

    // 文件名 （路径 => 文件名）
    if (fileName.text() !== this.extractFilename(taskData.fullPath)) { fileName.text(this.extractFilename(taskData.fullPath)) }

    // 下载数据
    let speed = this.bytesToSize(taskData.currentSpeed) + '/s' // 当前速度
    let received = this.bytesToSize(taskData.receivedBytes) // 已下载
    let total = this.bytesToSize(taskData.totalBytes) // 总共大小

    // description & actionBar
    let descriptionText = ''
    let actionBarHtml = ''

    let progressPercentage = ''

    switch (taskData.status) {
      // 下载中
      case this.Status.downloading:
        if (taskData.totalBytes !== 0) {
          // Progress Bar
          if (progress.hasClass('indeterminate')) { progress.removeClass('indeterminate') }

          // 进度百分比，保留2位小数
          progressPercentage = ((taskData.receivedBytes / taskData.totalBytes) * 100).toFixed(2) + '%'

          if (progressBar.css('width') !== progressPercentage) { progressBar.css('width', progressPercentage) }

          descriptionText = `${progressPercentage}，速度 ${speed}，已下载 ${received}，共 ${total}`
        } else {
          // Indeterminate Progress
          if (!progress.hasClass('indeterminate')) { progress.addClass('indeterminate') }

          descriptionText = `速度 ${speed}，已下载 ${received}`
        }

        actionBarHtml = html`
          <a onclick="Downloads.taskAction('${key}', Downloads.Actions.pause)">暂停</a>
          <a onclick="Downloads.taskAction('${key}', Downloads.Actions.cancel)">取消</a>
        `
        break
        // 暂停
      case this.Status.pause:
        if (taskData.totalBytes !== 0) {
          // Progress Bar
          descriptionText = `${progressPercentage}，已下载 ${received}，共 ${total}`
        } else {
          // Indeterminate Progress
          descriptionText = `已下载 ${received}`
        }

        actionBarHtml = html`
          <a onclick="Downloads.taskAction('${key}', Downloads.Actions.resume)">恢复</a>
          <a onclick="Downloads.taskAction('${key}', Downloads.Actions.cancel)">取消</a>
        `
        break
        // 完毕
      case this.Status.done:
        descriptionText = `总大小：${received}`
        actionBarHtml = `<a onclick="Downloads.fileShowInExplorer('${key}')">在文件夹中显示</a>`
        break
        // 已取消
      case this.Status.cancelled:
        actionBarHtml = `<a onclick="Downloads.downloadAgain('${key}')">重试下载</a>`
        break
        // 错误
      case this.Status.fail:
        actionBarHtml = `<a onclick="Downloads.downloadAgain('${key}')">重试下载</a>`
        break
    }

    // description & actionBar
    if (description.text() !== descriptionText) { description.text(descriptionText) }

    if (actionBar.html() !== actionBarHtml) { actionBar.html(actionBarHtml) }
  }

  // 下达任务操作命令
  public static taskAction(key: string, action: DownloadsActions) {
    if (!this.data.list[key]) { throw Error(`任务操作失败，或许已被删除，未找到 ${key}`) }

    CrDownloadsCallBack.downloadingTaskAction(key, action)
  }

  // 任务从列表移除
  public static taskRemove(key: string) {
    if (!this.data.list[key]) { throw Error(`任务从列表移除失败，或许已被删除，未找到 ${key}`) }

    if (this.isTaskInProgress(key)) {
      CrDownloadsCallBack.downloadingTaskAction(key, this.Actions.cancel)
    }

    delete this.data.list[key]

    this.getItemElem(key).hide()

    this.storeDataList() // 存储下载列表
  }

  // 获取正在下载的任务数
  public static countDownloadingTask() {
    let num = 0
    for (let key in this.data.list) {
      if (this.isTaskInProgress(key)) { num++ }
    }
    return num
  }

  // localStorage 恢复下载列表
  public static restoreDataList() {
    let data = localStorage.getItem(this.localStorageConf.key)
    if (data === null) return

    let downloadsListObj = JSON.parse(data)
    this.data.list = {}

    // console.log(JSON.stringify(downloadsListJson));
    for (let key in downloadsListObj) {
      if (!downloadsListObj.hasOwnProperty(key)) { continue }

      this.data.list[key] = downloadsListObj[key]
      if (this.isTaskInProgress(key)) { this.data.list[key].status = this.Status.cancelled }

      this.updateItemUi(key)
    }
  }

  // localStorage 储存下载列表
  public static storeDataList() {
    localStorage.setItem(this.localStorageConf.key, JSON.stringify(this.data.list))
  }

  // 清空下载列表
  public static removeDataList() {
    // 将正在执行的下载任务取消
    for (let key in this.data.list) {
      if (this.isTaskInProgress(key)) { this.taskAction(key, this.Actions.cancel) }
    }

    this.data.list = {}
    this.listElem.find('.download-item').remove()
    localStorage.setItem(this.localStorageConf.key, null)

    // 导航栏按钮隐藏通知小红点
    AppNavbar.BtnBox.getBtnItem(this.navbarBtnName).hideBadge()
  }

  // 启动文件
  public static fileLaunch(key: string) {
    if (!this.data.list[key] || this.data.list[key].status !== this.Status.done) { return }

    CrDownloadsCallBack.fileLaunch(this.data.list[key].fullPath).then((isSuccess: boolean) => {
      if (!isSuccess) {
        Downloads.data.list[key].status = this.Status.cancelled
        Downloads.updateItemUi(key)
      }
    })
  }

  // URL 在系统默认浏览器中打开
  public static urlOpenInDefaultBrowser(key: string) {
    if (!this.data.list[key]) { return }

    CrDownloadsCallBack.urlOpenInDefaultBrowser(this.data.list[key].downloadUrl)
  }

  // 文件在资源管理器中显示
  public static fileShowInExplorer(key: string) {
    if (!this.data.list[key]) { return }

    CrDownloadsCallBack.fileShowInExplorer(this.data.list[key].fullPath).then((isSuccess: boolean) => {
      if (!isSuccess) {
        Downloads.data.list[key].status = this.Status.cancelled
        Downloads.updateItemUi(key)
      }
    })
  }

  // 任务是否正在进行中
  public static isTaskInProgress(key: string) {
    if (!this.data.list[key]) { return false }

    if ((this.data.list[key].status !== this.Status.done) &&
              (this.data.list[key].status !== this.Status.cancelled)) {
      return true
    } else {
      return false
    }
  }

  // 重新下载
  public static downloadAgain(key: string) {
    if (!this.data.list[key]) { return false }

    AppAction.downloadUrl(this.data.list[key].downloadUrl)
  }

  // 获取任务数据
  public static getTask(key: string) {
    if (!this.data.list[key]) { return null }

    return this.data.list[key]
  }

  // 获取状态名
  public static getStatusName(status: string) {
    for (let key in this.Status) {
      if (this.Status[key] === status) {
        return key
      }
    }
  }

  // 路径中提取文件名
  public static extractFilename(path: string) {
    let lastSlash = Math.max(path.lastIndexOf('\\'), path.lastIndexOf('/'))
    return path.substring(lastSlash + 1)
  }

  // bytes 格式化
  public static bytesToSize(bytes: number) {
    if (bytes === 0) return '0 B'
    let k = 1000
    // or 1024

    let sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    let i = Math.floor(Math.log(bytes) / Math.log(k))
    return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i]
  }
}
