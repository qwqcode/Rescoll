/**
 * 导航栏
 */
import { Panel } from './Panel'
import BtnBox from './BtnBox'
import Task from '../Task'
import Setting from '../Setting'
import { Base64 } from 'js-base64'
import { html } from 'common-tags'
import BtnContent from './BtnContent'

export default class AppNavbar {
  public static readonly sel = {
    nav: '.top-nav-bar',
    navTitle: '.top-nav-bar .nav-title'
  }

  // 初始化 Navbar
  public static init() {
    $(html`
      <div class="left-items">
        <div class="nav-title"></div>
      </div>
      <div class="right-items">
        <div class="nav-btn-box"></div>
      </div>
    `).appendTo(this.sel.nav)

    BtnContent()
  }

  // 标题设置
  public static setTitle(value: string, base64?: boolean) {
    if (typeof base64 === 'boolean' && base64 === true) { value = Base64.decode(value) }

    let navTitleSel = this.sel.navTitle
    $(navTitleSel).addClass('changing')
    setTimeout(() => {
      $(navTitleSel)
        .text(value)
        .removeClass('changing')
    }, 100)
  }

  // 标题获取
  public static getTitle() {
    return $(this.sel.navTitle).text()
  }

  public static BtnBox = BtnBox
  public static Panel = Panel
}
