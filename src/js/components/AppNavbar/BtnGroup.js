import AppNavbar from '../AppNavbar'
import BtnBox from './BtnBox'
import BtnItem from './BtnItem'

export default class BtnGroup {
  constructor (groupName) {
    this._elem = $(`<div class="btn-group" data-nav-btn-group="${groupName}"></div>`).appendTo(BtnBox.sel.navBtns)
    this._groupName = groupName
    this._btnList = {}
  }

  /** 设置按钮组显示在最左 */
  setMostLeft () {
    this.getElem().insertBefore($(AppNavbar.BtnBox.sel.navBtns + ' .btn-group:first-child'))
    return this
  }

  /** 设置按钮组显示在最右 */
  setMostRight () {
    this.getElem().insertAfter($(AppNavbar.BtnBox.sel.navBtns + ' .btn-group:last-child'))
    return this
  }

  /** 获取 Dom */
  getElem () {
    return this._elem
  }

  /** 获取 GroupName */
  getGroupName () {
    return this._groupName
  }

  /** 显示 */
  show () {
    this.getElem().show()
    return this
  }

  /** 隐藏 */
  hide () {
    this.getElem().hide()
    return this
  }

  /** 获取按钮列表 */
  getBtnList () {
    return this._btnList
  }

  /**
   * 添加图标
   * @param { String } btnName 按钮名
   * @param { BtnItem } btnObj BtnItem
   */
  addBtn (btnName, btnObj) {
    if (!(btnObj instanceof BtnItem)) {
      throw Error('addBtn 第二个参数需要 BtnItem')
    }

    this._btnList[btnName] = btnObj
    btnObj.getElem().appendTo(this.getElem())
    return btnObj
  }

  getBtn (btnName) {
    if (!this._btnList[btnName]) return null
    return this._btnList[btnName]
  }
}
