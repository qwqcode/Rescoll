import AppAction from '../AppAction'
import AppLayer from '../AppLayer'
import Downloads from '../Downloads'
import AppUpdate from '../AppUpdate'

export default (setting, group, itemAt) => {
  let groupDownloads = group('downloads', '下载内容')
  itemAt(groupDownloads).btnBlock('下载列表清空', () => {
    Downloads.removeDataList()
    AppLayer.Notify.success('下载列表已清空')
  })

  let groupNetwork = group('downloads', '网络配置')
  itemAt(groupNetwork).btnToggle('采集请求跟随 IE 代理配置', () => {
    AppAction.utilsReqIeProxy(true)
  }, () => {
    AppAction.utilsReqIeProxy(false)
  }).setVal(!!setting.get('UtilsReqIeProxy'))

  let groupMaintenance = group('maintenance', '维护')
  itemAt(groupMaintenance).btnBlock('日志文件清理', () => {
    AppAction.logFileClear().then(() => {
      AppLayer.Notify.success('日志文件已清理')
    })
  })
  let updateBtn = itemAt(groupMaintenance).btnBlock('检查更新', () => {
    updateBtn.text('正在检查更新...')
    AppUpdate.check(false, () => {
      updateBtn.text('检查更新')
    })
  })
  let groupAbout = group('about', '关于')
  let infoAppVersion = itemAt(groupAbout).infoShow('版本号', '').find('.value')
  AppAction.tryGetVersion((version) => {
    infoAppVersion.text(version || '未知版本号')
  })
  itemAt(groupAbout).infoShow('作者', '<a href="https://github.com/qwqcode" target="_blank">qwqcode</a>')
  itemAt(groupAbout).infoShow('联系', '1149527164@qq.com')
  itemAt(groupAbout).infoShow('博客', '<a href="https://qwqaq.com" target="_blank">qwqaq.com</a>')
  itemAt(groupAbout).infoShow('GitHub', '<a href="https://github.com/qwqcode/Nacollector" target="_blank">qwqcode/Nacollector</a>')
  itemAt(groupAbout).infoShow('反馈问题', '<a href="https://github.com/qwqcode/Nacollector/issues" target="_blank">GitHub issue</a>')
  itemAt(groupAbout).infoShow('', '<a href="https://raw.githubusercontent.com/qwqcode/Nacollector/master/LICENSE" target="_blank">您使用 Nacollector 即视为您已阅读并同意本《Nacollector 用户使用许可协议》的约束</a>')
  itemAt(groupAbout).infoShow('', '<a href="https://github.com/qwqcode/Nacollector" target="_blank">Nacollector</a> Copyright (C) 2018 <a href="https://qwqaq.com" target="_blank">qwqaq.com</a>')
}
