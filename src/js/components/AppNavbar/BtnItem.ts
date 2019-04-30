import { html } from 'common-tags'

export default class BtnItem {
  constructor (name, label, icon) {
    this._name = name
    this._label = label
    this._icon = icon

    this._elem = $(html`
        <a data-placement="bottom" title="${this.getLabel()}">
          <i class="zmdi zmdi-${this.getIcon()}"></i>
        </a>
      `)
  }

  getName () {
    return this._name
  }

  getLabel () {
    return this._label
  }

  getIcon () {
    return this._icon
  }

  showBadge () {
    this._elem.addClass('show-top-badge')
    return this
  }

  hideBadge () {
    this._elem.removeClass('show-top-badge')
    return this
  }

  getElem () {
    return this._elem
  }
}
