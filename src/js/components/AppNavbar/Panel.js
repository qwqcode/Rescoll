import AppNavbar from '../AppNavbar'
import { html } from 'common-tags'

/**
 * 导航栏 面板
 */
const Panel = {
  list: {},
  /**
   * 注册新面板
   * @param {*} key 面板 key
   * @param {*} btnName navbar 按钮 name
   * @returns { PanelItem }
   */
  register (key, btnName) {
    if (this.list.hasOwnProperty(key)) { return `导航栏面板： ${key} 已存在于list中` }
    let panelItem = new PanelItem(key, btnName)
    // 加入 List
    this.list[key] = panelItem
    return panelItem
  },
  // 获取面板
  get (key) {
    if (!this.list.hasOwnProperty(key)) { return null }
    return this.list[key]
  }
}

class PanelItem {
  constructor (key, btnName) {
    this._key = key
    this._btnName = btnName
    this._btnElem = AppNavbar.BtnBox.get(this.getBtnName()).getElem()
    this._elem = $(html`<div class="navbar-panel anim-fade-in" data-navbar-panel="${key}" />`)
    this._isShow = false

    this.getBtnElem().after(this.getElem())

    this.getBtnElem().bind('click', () => {
      this.toggle()
    })
  }
  getKey () {
    return this._key
  }
  getBtnName () {
    return this._btnName
  }
  getBtnElem () {
    return this._btnElem
  }
  getElem () {
    return this._elem
  }
  // 设置标题
  setTitle (val) {
    $(html`<div class="panel-header"><div class="panel-title">${val}</div></div>`).prependTo(this.getElem())
  }
  // 设置内容
  setInner (content) {
    let elem = $(html`<div class="panel-inner"></div>`).appendTo(this.getElem())
    elem.append(content)
  }
  // 设置尺寸
  setSize (width, height) {
    this.getElem().css('width', width + 'px')
    this.getElem().css('height', height + 'px')
  }
  // 自动调整位置
  setPosition () {
    let position = this.getBtnElem()[0].getBoundingClientRect()
    let panelWidth = this.getElem().outerWidth()
    this.getElem()
      .css('top', position['top'] - 25 + 'px')
      .css('left', position['right'] - panelWidth + 'px')
  }
  // 显示
  show () {
    if (this.getIsShow()) { throw Error(`导航栏面板：${this.getKey()} 已显示`) }

    this.setPosition()
    this.getElem().addClass('show')
    this._isShow = true

    // 若点按的元素非面板内元素
    setTimeout(() => {
      $(document).bind('click.nav-panel-' + this.getKey(), (e) => {
        if (!$(e.target).is(this.getElem()) && !$(e.target).closest(this.getElem()).length) {
          this.hide()
        }
      })
    }, 20)
    // 自动调整面板位置
    $(window).bind('resize.nav-panel-' + this.getKey(), () => {
      this.setPosition()
    })
    // 导航栏按钮隐藏通知小红点
    AppNavbar.BtnBox.get(this.getBtnName()).hideBadge()
  }
  // 隐藏
  hide () {
    if (!this.getIsShow()) { throw Error(`导航栏面板：${this.getKey()} 未显示`) }

    $(window).unbind('resize.nav-panel-' + this.getKey())
    $(document).unbind('click.nav-panel-' + this.getKey()) // 解绑事件

    this.getElem().removeClass('show')
    this._isShow = false
  }
  // 切换
  toggle () {
    !this.getIsShow() ? this.show() : this.hide()
  }
  // 是否显示
  getIsShow () {
    return this._isShow
  }
}

export { Panel, PanelItem }
