interface Window {
  $: JQueryStatic
  AppNavbar: any
  TaskGen: any
  Task: any
  Downloads: any
  AppWidget: any
  Setting: any
  AppLayer: any
  AppUpdate: any
  AppAction: any
  AppWrapEl: any
  AppConfig: any
  CrDownloadsCallBack: any
  taskItem: any
  TaskController: any
  downloadFile: Function,
  InputValidators: any
}

declare var window: Window

interface JQuery {
  tooltip(): Function
}