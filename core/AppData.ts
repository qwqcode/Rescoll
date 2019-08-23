import Task from './models/Task'
import CollerGrp from './models/CollerGrp'
import Tab from './models/Tab'

export default class AppData {
  appVersion = '' // 程序版本号
  taskList: Task[] = []
  collerGrpList: CollerGrp[] = []
  tabList: Tab[] = []
}
