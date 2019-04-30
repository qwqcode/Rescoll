import AppLayer from '../AppLayer'
import Sidebar from './Sidebar'

export default class SidebarItem {
  constructor (key) {
    this._key = key
    this._elem = $(`<div class="sidebar-block" data-sidebar-layer-key="${key}" />`)
    this._elem.appendTo(Sidebar.getLayerSel())

    this._width = 360
  }

  getKey () {
    return this._key
  }

  getElem () {
    return this._elem
  }

  // 设置标题
  setTitle (val, titleBg) {
    let header = $(`
      <div class="sidebar-header">
        <div class="header-left">${val}</div>
        <div class="header-right">
          <button type="button" data-toggle="sidebar-layer-hide"><i class="zmdi zmdi-close"></i></button>
        </div>
      </div>
      `)
    if (titleBg) {
      header.css('background', titleBg)
    }
    header.prependTo(this.getElem())
    this.getElem().find('[data-toggle="sidebar-layer-hide"]').click(() => {
      this.hide()
    })
  }

  // 设置内容
  setInner (elem) {
    let innerElem = $(`<div class="sidebar-inner"></div>`).appendTo(this.getElem())
    innerElem.append(elem)
  }

  // 设置宽度
  setWidth (width) {
    if (!!width && !isNaN(parseInt(width))) { this._width = parseInt(width) }

    this.getElem().css('width', `${this._width}px`).css('transform', `translate(${this._width}px, 0px)`)
  }

  // 显示
  show () {
    if (AppLayer.Sidebar.currentDisplayedKey !== null && AppLayer.Sidebar.currentDisplayedKey !== this.getKey()) {
      AppLayer.Sidebar.get(AppLayer.Sidebar.currentDisplayedKey).hide()
    }

    if (AppLayer.Sidebar.currentDisplayedKey === this.getKey()) { throw Error('侧边栏层：' + this.getKey() + ' 已显示') }

    if (!$(Sidebar.getLayerSel()).hasClass('show')) { $(Sidebar.getLayerSel()).addClass('show') }

    // 设置宽度
    this.setWidth()

    this.getElem()
      .css('transform', 'translate(' + (this.getElem().width() + 10) + 'px, 0px)')
      .addClass('show')

    $('body').css('overflow', 'hidden')

    if ($('.sidebar-layer > .sidebar-block.show').length !== 0) {
      // 变为标签内最后一个元素，显示置顶
      this.getElem().insertAfter($('.sidebar-layer > .sidebar-block.show:last-child'))
    }

    // 若点按的元素非 block 内元素
    setTimeout(() => {
      $(document).bind('click.sidebar-layer-' + this.getKey(), (e) => {
        if ($(e.target).is(Sidebar.getLayerSel()) || !$(e.target).closest(Sidebar.getLayerSel()).length) {
          this.hide()
        }
      })
    }, 20)

    AppLayer.Sidebar.currentDisplayedKey = this.getKey()
  }

  // 隐藏
  hide () {
    if (
      AppLayer.Sidebar.currentDisplayedKey === null ||
      AppLayer.Sidebar.currentDisplayedKey !== this.getKey()
    ) { throw Error('侧边栏层：' + this.getKey() + ' 未显示') }

    this.getElem().removeClass('show')

    if ($('.sidebar-layer > .sidebar-block.show').length === 0) {
      // 若已经没有显示层
      $(Sidebar.getLayerSel()).removeClass('show')
      $('body').css('overflow', '')
    }

    $(document).unbind('click.sidebar-layer-' + this.getKey()) // 解绑事件

    AppLayer.Sidebar.currentDisplayedKey = null
  }

  // 显隐切换
  toggle () {
    if (!this.isShow()) {
      this.show()
    } else {
      this.hide()
    }
  }
  // 是否显示
  isShow () {
    return $(Sidebar.getLayerSel()).hasClass('show') && this.getElem().hasClass('show')
  }

  // 获取 Inner Elem
  getInnerElem () {
    return this.getElem().find('.sidebar-inner')
  }
}
