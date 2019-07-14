import Setting from './Setting'
import Downloads from './Downloads'
import AppLayer from './AppLayer'
import AppUpdate from './AppUpdate'
import Notify from './AppLayer/Notify'

/**
 * functions in .cs
 */
const AppAction = window.AppAction || {}
AppAction.utilsReqIeProxy = (isEnable: boolean) => {
  if (isEnable === undefined) { isEnable = !!Setting.get('UtilsReqIeProxy') }

  Setting.set('UtilsReqIeProxy', isEnable)

  try {
    AppAction._utilsReqIeProxy(isEnable)
  } catch {
    console.error('AppAction._utilsReqIeProxy 调用失败')
  }
}
AppAction.tryGetVersion = (func: Function) => {
  try {
    AppAction.getVersion().then(func)
  } catch {
    console.error('AppAction.getVersion 调用失败')
    func(undefined)
  }
}
AppAction.onExitBtnClick = () => {
  if (AppUpdate.panel.isUpdating) {
    Notify.error(`Nacollector 正在升级中，暂时无法退出，请稍等片刻`)
    return
  }

  let downloadingTaskNum = Downloads.countDownloadingTask() || 0;
  if (downloadingTaskNum > 0) {
    AppLayer.Dialog.open("退出 Nacollector", `有 ${downloadingTaskNum} 个下载任务仍在继续！是否结束下载并退出 Nacollector？`, ['确定', () => {
      AppAction.appClose();
    }], ['取消']);
  } else {
    try {
      AppAction.appClose();
    } catch {
      console.error("AppAction.appClose 调用失败"); 
    }
  }
}

export default AppAction
