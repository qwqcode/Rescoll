import AppNavbar from '../AppNavbar'
import BtnBox from './BtnBox'
import BtnItem from './BtnItem'

export default class BtnGroup {
  protected _elem: JQuery
  protected _groupName: string
  protected _btnList: { [key: string]: BtnItem }

  public constructor(groupName: string) {
    this._elem = $(`<div class="btn-group" data-nav-btn-group="${groupName}"></div>`).appendTo(BtnBox.sel.navBtns)
    this._groupName = groupName
    this._btnList = {}
  }

  /** 设置按钮组显示在最左 */
  public setMostLeft() {
    this._elem.insertBefore($(AppNavbar.BtnBox.sel.navBtns + ' .btn-group:first-child'))
    return this
  }

  /** 设置按钮组显示在最右 */
  public setMostRight() {
    this._elem.insertAfter($(AppNavbar.BtnBox.sel.navBtns + ' .btn-group:last-child'))
    return this
  }

  /** 获取 Dom */
  public getElem() {
    return this._elem
  }

  /** 获取 GroupName */
  public getGroupName() {
    return this._groupName
  }

  /** 显示 */
  public show() {
    this._elem.show()
    return this
  }

  /** 隐藏 */
  public hide() {
    this._elem.hide()
    return this
  }

  /** 获取按钮列表 */
  public getBtnList() {
    return this._btnList
  }

  /**
   * 添加图标
   */
  public addBtn(btnName: string, btnObj: BtnItem) {
    this._btnList[btnName] = btnObj
    btnObj.getElem().appendTo(this._elem)
    return btnObj
  }

  public getBtn(btnName: string) {
    if (!this._btnList[btnName]) return null
    return this._btnList[btnName]
  }
}
