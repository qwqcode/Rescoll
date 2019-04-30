import _ from 'lodash'
import BtnGroup from './BtnGroup'
import BtnItem from './BtnItem'

/**
 * 导航栏按钮
 */
const BtnBox = {
  sel: {
    navBtns: '.top-nav-bar .nav-btn-box'
  },
  groupList: {},
  // 按钮批量添加
  groupAdd (groupName, btnList) {
    let btnGroup
    if (!this.getGroup(groupName)) {
      // 创建新的按钮组
      btnGroup = new BtnGroup(groupName)
      this.groupList[groupName] = btnGroup
    } else {
      btnGroup = this.getGroup(groupName)
    }

    // 遍历在按钮组中添加每一个按钮
    _.each(btnList, (value, btnName) => {
      let btnItem = new BtnItem(btnName, value['title'], value['icon'])
      if (typeof value['onClick'] === 'function') {
        btnItem.getElem().click(() => {
          value['onClick']()
        })
      }
      btnItem.getElem().tooltip()
      btnGroup.addBtn(btnName, btnItem)
    })

    return btnGroup
  },
  // 获取按钮组
  getGroup (groupName) {
    if (!this.groupList.hasOwnProperty(groupName)) return null
    return this.groupList[groupName]
  },
  /**
   * 获取 按钮组 / 按钮 对象
   * @return { BtnGroup, BtnItem }
   */
  get (name) {
    name = name.split('.')
    if (!!name[0] && !!name[1]) { return this.getGroup(name[0]).getBtn(name[1]) }
    if (!!name[0] && !name[1]) { return this.getGroup(name[0]) }
    return null
  }
}

export default BtnBox
