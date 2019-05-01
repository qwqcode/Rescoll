import { html } from 'common-tags'

export default class BtnItem {
  protected _elem: JQuery;
  protected _name: string;
  protected _label: string;
  protected _icon: string;

  public constructor(name: string, label: string, icon: string) {
    this._name = name
    this._label = label
    this._icon = icon

    this._elem = $(html`
        <a data-placement="bottom" title="${this._label}">
          <i class="zmdi zmdi-${this._icon}"></i>
        </a>
      `)
  }

  public getName() {
    return this._name
  }

  public getLabel() {
    return this._label
  }

  public getIcon() {
    return this._icon
  }

  public getElem() {
    return this._elem
  }

  public showBadge() {
    this._elem.addClass('show-top-badge')
    return this
  }

  public hideBadge() {
    this._elem.removeClass('show-top-badge')
    return this
  }
}
