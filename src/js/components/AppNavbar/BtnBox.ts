import BtnGroup from './BtnGroup'
import BtnItem from './BtnItem'

/**
 * 导航栏按钮
 */
const BtnBox = {
  sel: {
    navBtns: '.top-nav-bar .nav-btn-box'
  },
  groupList: <{[key: string]: BtnGroup}> {},
  /** 按钮批量添加 */
  groupAdd(groupName: string, btnList: { [key: string]: { title: string, icon: string, onClick?: Function } }) {
    let btnGroup: BtnGroup
    if (!this.getGroup(groupName)) {
      // 创建新的按钮组
      btnGroup = new BtnGroup(groupName)
      this.groupList[groupName] = btnGroup
    } else {
      btnGroup = this.getGroup(groupName)
    }

    // 遍历 在按钮组中添加每一个按钮
    for (let [btnName, value] of Object.entries(btnList)) {
      let btnItem = new BtnItem(btnName, value.title, value.icon)
      if (typeof value.onClick === 'function') {
        btnItem.getElem().click(() => {
          value.onClick()
        })
      }
      btnItem.getElem().tooltip()
      btnGroup.addBtn(btnName, btnItem)
    }

    return btnGroup
  },
  /** 获取按钮组 */
  getGroup(groupName: string): BtnGroup {
    if (!this.groupList.hasOwnProperty(groupName)) return null
    return this.groupList[groupName]
  },
  get(name: string): [ BtnGroup, BtnItem ] {
    let arr: [BtnGroup, BtnItem] = [null, null]
    let nameS = name.split('.')
    if (!!nameS[0]) {
      arr[0] = this.getGroup(nameS[0])
      arr[1] = (!!nameS[1]) ? this.getGroup(nameS[0]).getBtn(nameS[1]) : null
      return arr
    } else {
      return null
    }
  }
}

export default BtnBox
