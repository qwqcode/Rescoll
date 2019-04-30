import { html } from 'common-tags'

export default class SettingItem {
  constructor (groupDom) {
    this._elem = $('<div class="setting-item"></div>').appendTo(groupDom)
    this._groupDom = groupDom
  }

  getElem () {
    return this._elem
  }

  /** 按钮 */
  btnBlock (text, onClick) {
    return $(`<button type="button" class="setting-btn-block">${text}</button>`).click(onClick).appendTo(this.getElem())
  }

  /** 按钮 · 开关 */
  btnToggle (text, turnOnEvent, turnOffEvent) {
    let btnDom = $(html`
        <button type="button" class="setting-btn-block setting-btn-toggle">
          <div class="left-text">${text}</div>
          <div class="toggle">
            <div class="toggle-bar"></div>
            <div class="toggle-button"></div>
          </div>
        </button>`)
    let toggleDom = btnDom.find('.toggle')
    let btnObj = {}
    btnObj.setVal = (bool) => {
      if (typeof bool !== 'boolean') return
      if (bool) toggleDom.addClass('turn-on'); else toggleDom.removeClass('turn-on')
    }
    btnObj.setOn = () => {
      btnObj.setVal(true)
    }
    btnObj.setOff = () => {
      btnObj.setVal(false)
    }
    btnObj.toggle = () => {
      if (!toggleDom.hasClass('turn-on')) { // On
        toggleDom.addClass('turn-on')
        turnOnEvent()
      } else { // Off
        toggleDom.removeClass('turn-on')
        turnOffEvent()
      }
    }
    btnObj.getDom = () => {
      return btnDom
    }

    btnDom.click(() => {
      btnObj.toggle()
    })
    btnDom.appendTo(this.getElem())
    return btnObj
  }

  /** 信息展示 */
  infoShow (label, value) {
    return $(html`
          <div class="two-line">
            <span class="label">${label}</span>
            <span class="value">${value}</span>
          </div>
        `).appendTo(this.getElem())
  }
}
