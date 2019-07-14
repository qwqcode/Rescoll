import { html } from "common-tags"
import AppUpdate from "./"
import Dialog from "../AppLayer/Dialog"

export default class AppUpdatePanel {
  public remoteData: any
  public elem: JQuery<HTMLElement>
  public dialogElem: JQuery<HTMLElement>
  public isUpdating: boolean = false

  public constructor(remoteData: any) {
    this.remoteData = remoteData
    this.elem = $(html`<div class="update-manager"></div>`)
    this.dialogElem = Dialog.open('Nacollector 版本管理器', this.elem).addClass('dialog-large')
    return this
  }

  public getElem() {
    return this.elem
  }

  public updateRemoteData(remoteData: any) {
    this.remoteData = remoteData
    this.render(this.remoteData)
  }

  public setLoading(status: boolean) {
    if (status)
      $(html`<div class="update-manager-loading"><div class="loading-css-icon"></div> 数据获取中...</div>`).appendTo(this.elem)
    else
      this.elem.find('.update-manager-loading').remove(); 
  }

  /** 开始更新 */
  public setIsUpdating(opts: {onUiReady: Function}) {
    if (this.isUpdating) {
      console.error('已开始升级，无需重复调用 setIsUpdating')
      return
    }

    this.isUpdating = true

    this.dialogElem.find('.close-btn').hide()
    this.elem.find('.update-btn').hide()
    this.setProgress(0, '正在准备更新...')
    opts.onUiReady()
  }

  public setProgress(percentage: number, statusText: string = null) {
    if (!this.isUpdating) {
      console.error('AppUpdatePanel.setProgress 方法不可用，因为未在升级')
      return
    }

    if (statusText !== null) {
      this.elem.find('.update-status-text').show().html(statusText)
    }

    this.elem.find('.update-progress-bar-wrap').show().find('.update-progress-bar').css('width', percentage + '%')
  }

  public setSuccess(desc?: string) {
    this.setResult(true, desc)
  }

  public setError(reason?: string) {
    this.setResult(false, reason)
  }

  public setResult(isSuccess: boolean, desc?: string) {
    this.isUpdating = false
    this.dialogElem.find('.close-btn').show()
    this.elem.html('')
    let resultElem = $(html`
      <div class="update-result ${isSuccess ? 'is-success' : ''}">
        <div class="icon"><i class="zmdi zmdi-${isSuccess ? 'check' : 'alert-triangle'}"></i></div>
        <div class="status">${isSuccess ? '升级成功' : '升级失败'}</div>
        <div class="desc"></div>
      </div>
    `).appendTo(this.elem)
    resultElem.find('.desc').html(desc)
  }
  
  public render(remoteData: object) {
    this.elem.find('.module-list-wrap').remove()
    let wrapElem = $(html`<div class="module-list-wrap"></div>`).appendTo(this.elem)
    
    // 操作按钮
    let actionBarElem = $(html`<div class="action-bar"></div>`).appendTo(wrapElem)
    $(html`<a class="dialog-btn update-btn"><i class="zmdi zmdi-cloud-upload"></i> 一键升级</a>`).appendTo(actionBarElem)
    .click(() => {
      // 更新按钮
      AppUpdate.startUpdate(this.remoteData, AppUpdate.moduleVersionList)
    })
    let updateStatusTextElem = $(html`<div class="update-status-text"></div>`).appendTo(actionBarElem)
    let updateProgressBarWrap = $(html`<div class="update-progress-bar-wrap" style="display: none;"></div>`).appendTo(actionBarElem)
    let updateProgressBaElem = $(html`<div class="update-progress-bar"></div>`).appendTo(updateProgressBarWrap)
    
    // 更新说明
    let updateNoteElem = $(html`<div class="update-note"></div>`).appendTo(wrapElem)
    let updateNote = ''
    for (let version in this.remoteData['release_notes']) {
      if (!AppUpdate.isHigherVersion(AppUpdate.moduleVersionList['Nacollector'], version, true))
        continue
      updateNote += `#### ${version}\n${this.remoteData['release_notes'][version]}\n\n`
    }
    updateNoteElem.html('<h2 class="update-note-title">发行说明</h2>' + window.marked(updateNote))

    // 创建列表
    let needUpdateModuleNameList = []
    let listElem = $(html`<div class="module-list"></div>`).appendTo(wrapElem)
    let remoteModules = this.remoteData['modules']
    let moduleIconDict: any = {
      'Nacollector': 'zmdi-picture-in-picture',
      'NacollectorSpiders': 'zmdi-cloud-box',
      'NacollectorUpdater': 'zmdi-arrow-merge'
    } // 图标字典
    for (let i in remoteModules) {
      let module = remoteModules[i]
      let moduleName = module['name']
      let localVersion = AppUpdate.moduleVersionList[moduleName] || ''
      let remoteVersion = module['version'] || ''
      let isNeedUpdate = AppUpdate.isHigherVersion(localVersion, remoteVersion)
      if (isNeedUpdate) needUpdateModuleNameList.push(moduleName)
      let itemElem = $(html`
        <div class="module-item">
          <div class="icon">
            <i class="zmdi ${moduleIconDict[moduleName] || 'zmdi-puzzle-piece'}"></i>
          </div>
          <div class="info">
            <div class="name"></div>
            <div class="desc"></div>
            <div class="badge-box">
              <div class="badge ${isNeedUpdate ? 'need' : 'no-need'}">${isNeedUpdate ? '待升级' : '无需升级'}</div>
            </div>
          </div>
        </div>
      `).appendTo(listElem)
      itemElem.find('.info > .name').text(moduleName)
      itemElem.find('.info > .desc').html(html`
      <span>本地: ${localVersion || '无'}</span>
      <span class="${isNeedUpdate ? 'marked-text' : ''}">远程: ${remoteVersion}</span>
      <span class="${isNeedUpdate ? 'marked-text' : ''}">大小: ${module['size']}</span>`)
    }

    updateStatusTextElem.text(needUpdateModuleNameList.length > 0 ? `待更新模块: ${needUpdateModuleNameList.join(', ')}` : `无更新`)
  }
}