import { html } from 'common-tags'

const Sidebar = {
  list: {},
  // 当前显示
  currentDisplayedKey: null,
  /**
   * 注册新的 Sidebar
   * @return { SidebarItem }
   */
  register (key) {
    if (this.list.hasOwnProperty(key)) { throw Error(`侧边栏层：${key} 已存在于list中`) }
    let sidebarItem = new SidebarItem(key)
    // 加入 List
    this.list[key] = sidebarItem
    return sidebarItem
  },
  /**
   * 获取 sidebarObj
   * @return { SidebarItem }
   */
  get (key) {
    if (!this.list.hasOwnProperty(key)) { return null }
    return this.list[key]
  }
}

class SidebarItem {
  constructor (key) {
    this._key = key
    this._elem = $(html`<div class="sidebar-block" data-sidebar-layer-key="${key}" />`)
    this._elem.appendTo(this.getLayerElem())

    this._width = 360
  }

  getKey () {
    return this._key
  }

  getElem () {
    return this._elem
  }

  /** 设置标题 */
  setTitle (val, titleBg) {
    let header = $(html`
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

  /** 设置内容 */
  setInner (elem) {
    let innerElem = $(`<div class="sidebar-inner"></div>`).appendTo(this.getElem())
    innerElem.append(elem)
  }

  /** 设置宽度 */
  setWidth (width) {
    if (!!width && !isNaN(parseInt(width))) { this._width = parseInt(width) }

    this.getElem().css('width', `${this._width}px`).css('transform', `translate(${this._width}px, 0px)`)
  }

  /** 显示 */
  show () {
    if (Sidebar.currentDisplayedKey !== null && Sidebar.currentDisplayedKey !== this.getKey()) {
      Sidebar.get(Sidebar.currentDisplayedKey).hide()
    }

    if (Sidebar.currentDisplayedKey === this.getKey()) { throw Error('侧边栏层：' + this.getKey() + ' 已显示') }

    if (!$(this.getLayerElem()).hasClass('show')) { $(this.getLayerElem()).addClass('show') }

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
        if ($(e.target).is(this.getLayerElem()) || !$(e.target).closest(this.getLayerElem()).length) {
          this.hide()
        }
      })
    }, 20)

    Sidebar.currentDisplayedKey = this.getKey()
  }

  /** 隐藏 */
  hide () {
    if (
      Sidebar.currentDisplayedKey === null ||
      Sidebar.currentDisplayedKey !== this.getKey()
    ) { throw Error('侧边栏层：' + this.getKey() + ' 未显示') }

    this.getElem().removeClass('show')

    if ($('.sidebar-layer > .sidebar-block.show').length === 0) {
      // 若已经没有显示层
      $(this.getLayerElem()).removeClass('show')
      $('body').css('overflow', '')
    }

    $(document).unbind('click.sidebar-layer-' + this.getKey()) // 解绑事件

    Sidebar.currentDisplayedKey = null
  }

  /** 显隐切换 */
  toggle () {
    if (!this.isShow()) {
      this.show()
    } else {
      this.hide()
    }
  }
  /** 是否显示 */
  isShow () {
    return $(this.getLayerElem()).hasClass('show') && this.getElem().hasClass('show')
  }

  /** 获取 Inner Elem */
  getInnerElem () {
    return this.getElem().find('.sidebar-inner')
  }

  /** 获取层 Elem */
  getLayerElem () {
    let elem = $('.sidebar-layer')
    if (elem.length === 0) {
      elem = $('<div class="sidebar-layer" />').appendTo('body')
    }
    return elem
  }
}

export { Sidebar, SidebarItem }
