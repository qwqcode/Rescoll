import AppLayer from '../AppLayer'

/**
 * 内容层 侧边栏
 */
const Sidebar = {
  list: {},
  // 当前显示
  currentDisplayedKey: null,
  // 注册新的 Sidebar
  register: function (key) {
    if (this.list.hasOwnProperty(key)) { return '侧边栏层： ' + key + ' 已存在于list中' }

    var layerSel = this.getLayerSel()
    $('<div class="sidebar-block" data-sidebar-layer-key="' + key + '" />')
      .appendTo($(layerSel))
    var sidebarSel = '[data-sidebar-layer-key="' + key + '"]'
    var sidebarObj = {}
    // 设置标题
    sidebarObj.setTitle = function (val, titleBg) {
      var header = $('<div class="sidebar-header"><div class="header-left">' + val + '</div><div class="header-right"><button type="button" data-toggle="sidebar-layer-hide"><i class="zmdi zmdi-close"></i></button></div></div>')
      if (titleBg) header.css('background', titleBg)
      header.prependTo(sidebarSel)
      $(sidebarSel + ' [data-toggle="sidebar-layer-hide"]').click(function () {
        sidebarObj.hide()
      })
    }
    // 设置内容
    sidebarObj.setInner = function (val) {
      $('<div class="sidebar-inner">' + val + '</div>').appendTo(sidebarSel)
    }
    sidebarObj.width = 360
    // 设置宽度
    sidebarObj.setWidth = function (width) {
      if (!!width && !isNaN(parseInt(width))) { sidebarObj.width = parseInt(width) }

      $(sidebarSel).css('width', sidebarObj.width + 'px').css('transform', 'translate(' + sidebarObj.width + 'px, 0px)')
    }
    // 显示
    sidebarObj.show = function () {
      if (AppLayer.Sidebar.currentDisplayedKey !== null && AppLayer.Sidebar.currentDisplayedKey !== key) {
        AppLayer.Sidebar.get(AppLayer.Sidebar.currentDisplayedKey).hide()
      }

      if (AppLayer.Sidebar.currentDisplayedKey === key) { throw Error('侧边栏层：' + key + ' 已显示') }

      if (!$(layerSel).hasClass('show')) { $(layerSel).addClass('show') }

      // 设置宽度
      sidebarObj.setWidth()

      $(sidebarSel)
        .css('transform', 'translate(' + ($(sidebarSel).width() + 10) + 'px, 0px)')
        .addClass('show')

      $('body').css('overflow', 'hidden')

      if ($('.sidebar-layer > .sidebar-block.show').length !== 0) {
        // 变为标签内最后一个元素，显示置顶
        $(sidebarSel).insertAfter($('.sidebar-layer > .sidebar-block.show:last-child'))
      }

      // 若点按的元素非 block 内元素
      setTimeout(function () {
        $(document).bind('click.sidebar-layer-' + key, function (e) {
          if (!$(e.target).is(sidebarSel) && !$(e.target).closest(sidebarSel).length) {
            sidebarObj.hide()
          }
        })
      }, 20)

      AppLayer.Sidebar.currentDisplayedKey = key
    }
    // 隐藏
    sidebarObj.hide = function () {
      if (AppLayer.Sidebar.currentDisplayedKey === null || AppLayer.Sidebar.currentDisplayedKey !== key) { throw Error('侧边栏层：' + key + ' 未显示') }

      $(sidebarSel).removeClass('show')

      if ($('.sidebar-layer > .sidebar-block.show').length === 0) {
        // 若已经没有显示层
        $(layerSel).removeClass('show')
        $('body').css('overflow', '')
      }

      $(document).unbind('click.sidebar-layer-' + key) // 解绑事件

      AppLayer.Sidebar.currentDisplayedKey = null
    }
    // 显隐切换
    sidebarObj.toggle = function () {
      if (!sidebarObj.isShow()) {
        sidebarObj.show()
      } else {
        sidebarObj.hide()
      }
    }
    // 是否显示
    sidebarObj.isShow = function () {
      return $(layerSel).hasClass('show') && $(sidebarSel).hasClass('show')
    }
    // 获取 Selector
    sidebarObj.getSel = function () {
      return sidebarSel
    }
    // 获取 Inner Selector
    sidebarObj.getInnerSel = function () {
      if ($(sidebarObj.getSel() + ' .sidebar-inner').length === 0) { sidebarObj.setInner('') }

      return sidebarObj.getSel() + ' .sidebar-inner'
    }
    // 获取 InnerDom
    sidebarObj.getInnerDom = function () {
      if ($(sidebarObj.getSel() + ' .sidebar-inner').length === 0) { sidebarObj.setInner('') }

      return $(sidebarObj.getSel() + ' .sidebar-inner')
    }

    // 加入 List
    this.list[key] = sidebarObj

    return sidebarObj
  },
  // 获取 sidebarObj
  get: function (key) {
    if (!this.list.hasOwnProperty(key)) { return null }

    return this.list[key]
  },
  // 获取层 Selector
  getLayerSel: function () {
    var layerSel = '.sidebar-layer'

    if ($(layerSel).length === 0) { $('<div class="sidebar-layer" />').appendTo('body') }

    return layerSel
  }
}

export default Sidebar
