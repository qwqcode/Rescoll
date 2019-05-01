import AppLayer from './AppLayer'
import AppAction from './AppAction'

const AppConfig = window.AppConfig

/**
 * 升级检测
 */
const AppUpdate = {
  check (atDocumentReady: boolean, onFinish?: Function) {
    let ajaxOpt: JQuery.AjaxSettings = {
      type: 'GET',
      url: AppConfig.updateCheckUrl,
      dataType: 'json',
      data: { 'token': AppConfig.updateCheckToken },
      beforeSend () {}
    }
    ajaxOpt.success = (json) => {
      if (!!onFinish) onFinish(json)
      let UpdateVersion = json['latest'] || null
      if (!!UpdateVersion && UpdateVersion !== AppAction.version) {
        // 有更新
        let UpdateLog = (!!json['updateLog'] && json['updateLog'].hasOwnProperty(UpdateVersion))
          ? json['updateLog'][UpdateVersion]
          : '无说明'

        AppLayer.Dialog.open(`Nacollector 可更新至 ${json['latest']} 版本`, UpdateLog,
          ['现在更新', () => {
            if (!json['updateRes'] || !json['updateRes'].hasOwnProperty(UpdateVersion)) {
              AppLayer.Notify.error('更新地址获取失败')
              return
            }
            let updateType = 'a'
            if (!!json['updateType'] && json['updateType'].hasOwnProperty(UpdateVersion)) {
              updateType = json['updateType'][UpdateVersion]
            }
            AppAction.appUpdateAction(json['updateRes'][UpdateVersion], updateType)
          }],
          ['以后再说', () => { }])
      } else {
        if (!atDocumentReady) AppLayer.Notify.success('暂无更新')
      }
    }
    ajaxOpt.error = () => {
      if (typeof (onFinish) === 'function') {
        onFinish(null)
      }
      if (!atDocumentReady) AppLayer.Notify.error('更新信息获取失败')
    }

    // 执行请求
    $.ajax(ajaxOpt)
  }
}

export default AppUpdate
