import AppLayer from '../AppLayer'
import AppAction from '../AppAction'
import Dialog from '../AppLayer/Dialog'
import { html } from 'common-tags'
import Notify from '../AppLayer/Notify'
import AppUpdatePanel from './AppUpdatePanel'

const AppConfig = window.AppConfig
const UpdateAction = window.UpdateAction || {}

/**
 * 升级检测
 */
export default class AppUpdate {
  /** 模块版本号列表 */
  public static moduleVersionList: any = {}
  public static panel: AppUpdatePanel

  public static async init() {
    // 获取升级参数
    let updateParms: any
    try {
      updateParms = JSON.parse(await UpdateAction.getUpdateParms())
    } catch {
      console.error('UpdateParms 获取失败')
      return
    }
    window.AppConfig.updateCheckUrl = updateParms.updateCheckUrl
    window.AppConfig.updateCheckToken = updateParms.updateCheckToken
    // 获取当前的模块版本信息
    await this.refreshModuleVersionList()
    // 检测更新
    this.reqUpdates((remoteData: any) => {
      if (this.isNeedUpdate(remoteData)) {
        this.openPanel(remoteData)
      }
    })
  }

  /** 刷新模块版本号列表 */
  public static async refreshModuleVersionList() {
    try {
      this.moduleVersionList = await UpdateAction.getAllModuleVersion()
    } catch {
      console.error('模块版本号列表刷新失败')
    }
  }

  /** 打开更新面板 */
  public static openPanel(remoteData: any = null) {
    this.panel = new AppUpdatePanel(remoteData)

    if (remoteData === null) {
      this.panel.setLoading(true)
      this.reqUpdates((obj: any) => {
        this.panel.setLoading(false)
        this.panel.updateRemoteData(obj)
      })
    } else {
      this.panel.updateRemoteData(remoteData)
    }
  }

  // 获取已打开的面板
  public static getPanel()
  {
    return this.panel
  }

  /** 判断是否需要更新 */
  public static isNeedUpdate(remoteData: any): boolean {
    let localVersionList = this.moduleVersionList
    let remoteModules = remoteData['modules']

    // 版本号检测
    let needUpdate = false
    for (let i in remoteModules) {
      let moduleName = remoteModules[i]['name']
      if (
        !this.moduleVersionList.hasOwnProperty(moduleName) // 新的模块
        || this.isHigherVersion(localVersionList[moduleName], remoteModules[i]['version']) // 更高版本
      )
        needUpdate = true
    }

    return needUpdate
  }

  /** 开始更新 */
  public static startUpdate(remoteData: any, localModuleVersionList: any) {
    if (!this.isNeedUpdate(remoteData)) {
      Notify.success('无需更新')
      return
    }

    this.panel.setIsUpdating({
      onUiReady: async () => {
        // 创建更新模块列表
        let updateModules: Array<any> = []
        for (var i in remoteData['modules']) {
          let module = remoteData['modules'][i]
          let remoteVersion = module['version'] || ''
          let localVersion = this.moduleVersionList[module['name']] || ''
          if (
            !this.moduleVersionList.hasOwnProperty(module['name']) // 新的模块
            || this.isHigherVersion(localVersion, remoteVersion) // 全新版本
          ) {
            updateModules.push(module)
          }
        }

        if (updateModules.length <= 0) {
          Notify.error('更新失败，升级数据不可用')
          return
        }

        await UpdateAction.startUpdateWork(JSON.stringify(updateModules))
      }
    })
  }

  /** 远程请求获取更新 */
  public static reqUpdates(onFinish: Function) {
    // 执行请求
    $.ajax({
      type: 'GET',
      url: AppConfig.updateCheckUrl,
      dataType: 'json',
      data: {
        'token': AppConfig.updateCheckToken,
        'time': new Date().getTime() // 防缓存
      },
      beforeSend() {},
      success(remoteData) {
        if (!!onFinish) onFinish(remoteData)
      },
      error() {
        if (!!onFinish) onFinish(null)
        AppLayer.Notify.error('更新信息获取失败')
      }
    })
  }

  /**
   * 比较版本号
   * @param localV 本地版本号
   * @param remoteV 远程版本号
   * @param equalCondition 版本号相等时也返回 true
   */
  public static isHigherVersion(localV: string, remoteV: string, equalCondition: boolean = false): boolean {
    if (localV === '')
      localV = '0.0.0.0'
    
    let diff

    try {
      let localArr = localV.split('.')
      let remoteArr = remoteV.split('.')

      let minL = Math.min(localArr.length, remoteArr.length)
      let pos = 0
      diff = 0

      while (pos < minL) {
        diff = parseInt(remoteArr[pos]) - parseInt(localArr[pos])
        if (diff != 0) {
          break
        }
        pos++
      }

      /* if (diff > 0) {
        console.log('新版本')
      } else if (diff == 0) {
        console.log('稳定版')
      } else {
        console.log('旧版本')
      } */
    }
    catch
    {
      console.error('版本号错误，无法比较', localV, remoteV)
    }

    return !equalCondition ? (diff > 0) : (diff >= 0)
  }
}
