import AppNavbar from '../AppNavbar'
import { html } from 'common-tags'
import BtnItem from './BtnItem';

/**
 * 导航栏 面板
 */
class Panel {
  public static list: { [key: string]: PanelItem } = {}

  /**
   * 注册新面板
   * 
   * @param key 面板 key
   * @param btnName navbar 按钮 name
   */
  public static register(key: string, btnName: string): PanelItem {
    if (this.list.hasOwnProperty(key)) { throw Error(`导航栏面板： ${key} 已存在于list中`) }
    let panelItem = new PanelItem(key, btnName)
    // 加入 List
    this.list[key] = panelItem
    return panelItem
  }

  // 获取面板
  public static get(key: string) {
    if (!this.list.hasOwnProperty(key)) { return null }
    return this.list[key]
  }
}

class PanelItem {
  protected _key: string
  protected _btnName: string
  protected _btnItem: BtnItem
  protected _btnElem: JQuery
  protected _elem: JQuery
  protected _isShow: boolean = false

  public constructor(key: string, btnName: string) {
    this._key = key
    this._btnName = btnName
    this._btnItem = AppNavbar.BtnBox.getBtnItem(this._btnName)
    this._btnElem = this._btnItem.getElem()
    this._elem = $(html`<div class="navbar-panel anim-fade-in" data-navbar-panel="${key}" />`)

    this._btnElem.after(this._elem)
    this._btnElem.bind('click', () => {
      this.toggle()
    })
  }
  public getKey() {
    return this._key
  }
  public getBtnName() {
    return this._btnName
  }
  public getBtnElem() {
    return this._btnElem
  }
  public getElem() {
    return this._elem
  }
  /** 设置标题 */
  setTitle(val: string) {
    $(html`<div class="panel-header"><div class="panel-title">${val}</div></div>`).prependTo(this._elem)
  }
  /** 设置内容 */
  setInner(content: JQuery|string) {
    let elem = $(html`<div class="panel-inner"></div>`).appendTo(this._elem)
    elem.append(content)
  }
  /** 设置尺寸 */
  setSize(width: number, height: number) {
    this._elem.css('width', width + 'px')
    this._elem.css('height', height + 'px')
  }
  /** 自动调整位置 */
  public setPosition() {
    let position = this._btnElem[0].getBoundingClientRect()
    let panelWidth = this._elem.outerWidth()
    this._elem
      .css('top', position.top - 25 + 'px')
      .css('left', position.right - panelWidth + 'px')
  }
  /** 显示 */
  public show() {
    if (this._isShow) { throw Error(`导航栏面板：${this._key} 已显示`) }

    this.setPosition()
    this._elem.addClass('show')
    this._isShow = true

    // 若点按的元素非面板内元素
    setTimeout(() => {
      $(document).bind('click.nav-panel-' + this._key, (e) => {
        if (!$(e.target).is(this._elem) && !$(e.target).closest(this._elem).length) {
          this.hide()
        }
      })
    }, 20)
    // 自动调整面板位置
    $(window).bind('resize.nav-panel-' + this._key, () => {
      this.setPosition()
    })
    // 导航栏按钮隐藏通知小红点
    let btnItem = AppNavbar.BtnBox.getBtnItem(this._btnName)
    btnItem.hideBadge()
  }
  // 隐藏
  public hide() {
    if (!this._isShow) { throw Error(`导航栏面板：${this._key} 未显示`) }

    $(window).unbind('resize.nav-panel-' + this._key)
    $(document).unbind('click.nav-panel-' + this._key) // 解绑事件

    this._elem.removeClass('show')
    this._isShow = false
  }
  // 切换
  public toggle (){
    !this._isShow ? this.show() : this.hide()
  }
  // 是否显示
  public getIsShow (){
    return this._isShow
  }
}

export { Panel, PanelItem }
