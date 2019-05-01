import Setting from './Setting'

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

export default AppAction
