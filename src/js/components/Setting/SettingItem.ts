import { html } from 'common-tags'

export default class SettingItem {
  protected _elem: JQuery
  protected _groupDom: JQuery

  public constructor(groupDom: JQuery) {
    this._elem = $('<div class="setting-item"></div>').appendTo(groupDom)
    this._groupDom = groupDom
    return this
  }

  public getElem() {
    return this._elem
  }

  /** 按钮 */
  public btnBlock(text: string, onClick: Function) {
    return $(`<button type="button" class="setting-btn-block">${text}</button>`).click(() => {
      onClick()
    }).appendTo(this._elem)
  }

  /** 按钮 · 开关 */
  public btnToggle(text: string, turnOnEvent: Function, turnOffEvent: Function) {
    let btnDom = $(html`
        <button type="button" class="setting-btn-block setting-btn-toggle">
          <div class="left-text">${text}</div>
          <div class="toggle">
            <div class="toggle-bar"></div>
            <div class="toggle-button"></div>
          </div>
        </button>`)

    let toggleDom = btnDom.find('.toggle')
    let btnObj = {
      setVal(bool: boolean) {
        if (bool) toggleDom.addClass('turn-on'); else toggleDom.removeClass('turn-on')
      },
      setOn() {
        btnObj.setVal(true)
      },
      setOff() {
        btnObj.setVal(false)
      },
      toggle () {
        if (!toggleDom.hasClass('turn-on')) { // On
          toggleDom.addClass('turn-on')
          turnOnEvent()
        } else { // Off
          toggleDom.removeClass('turn-on')
          turnOffEvent()
        }
      },
      getDom () {
        return btnDom
      }
    }
    
    btnDom.click(() => {
      btnObj.toggle()
    })
    btnDom.appendTo(this._elem)
    return btnObj
  }

  /** 信息展示 */
  public infoShow(label: string, value: string) {
    return $(html`
          <div class="two-line">
            <span class="label">${label}</span>
            <span class="value">${value}</span>
          </div>
        `).appendTo(this._elem)
  }
}
