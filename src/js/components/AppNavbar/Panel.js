import AppNavbar from '../AppNavbar'

/**
 * 导航栏 面板
 */
const Panel = {
  list: {},
  // 注册新面板
  register: function (key, btnName) {
    if (this.list.hasOwnProperty(key)) { return '导航栏面板： ' + key + ' 已存在于list中' }

    var btnDom = AppNavbar.Btn.get(btnName).getDom()
    btnDom.after('<div class="navbar-panel anim-fade-in" data-navbar-panel="' + key + '" />')

    var panelSel = '[data-navbar-panel="' + key + '"]'
    // 工厂模式
    var panelObj = {}
    // 设置标题
    panelObj.setTitle = function (val) {
      $('<div class="panel-header"><div class="panel-title">' + val + '</div></div>').prependTo(panelSel)
    }
    // 设置内容
    panelObj.setInner = function (val) {
      $('<div class="panel-inner">' + val + '</div>').appendTo(panelSel)
    }
    // 设置尺寸
    panelObj.setSize = function (width, height) {
      $(panelSel).css('width', width + 'px')
      $(panelSel).css('height', height + 'px')
    }
    // 自动调整位置
    panelObj.setPosition = function () {
      var position = btnDom[0].getBoundingClientRect()
      var panelWidth = $(panelSel).outerWidth()
      $(panelSel)
        .css('top', position['top'] - 25 + 'px')
        .css('left', position['right'] - panelWidth + 'px')
    }
    // 显示
    panelObj.show = function () {
      if (panelObj.isShow()) { throw Error('导航栏面板：' + key + ' 已显示') }

      panelObj.setPosition()
      $(panelSel).addClass('show')
      // 若点按的元素非面板内元素
      setTimeout(function () {
        $(document).bind('click.nav-panel-' + key, function (e) {
          if (!$(e.target).is(panelSel) && !$(e.target).closest(panelSel).length) {
            panelObj.hide()
          }
        })
      }, 20)
      // 自动调整面板位置
      $(window).bind('resize.nav-panel-' + key, function () {
        panelObj.setPosition()
      })
      // 导航栏按钮隐藏通知小红点
      AppNavbar.Btn.get(btnName).hideBadge()
    }
    // 隐藏
    panelObj.hide = function () {
      if (!panelObj.isShow()) { throw Error('导航栏面板：' + key + ' 未显示') }

      $(window).unbind('resize.nav-panel-' + key)
      $(document).unbind('click.nav-panel-' + key) // 解绑事件

      $(panelSel).removeClass('show')
    }
    // 切换
    panelObj.toggle = function () {
      if (!panelObj.isShow(key)) {
        panelObj.show(key)
      } else {
        panelObj.hide(key)
      }
    }
    // 是否显示
    panelObj.isShow = function () {
      return !!($(panelSel).hasClass('show'))
    }
    // 获取 Selector
    panelObj.getSel = function () {
      return panelSel
    }

    // 导航栏按钮点击绑定
    btnDom.bind('click', function () {
      panelObj.toggle()
    })

    // 加入 List
    this.list[key] = panelObj

    return panelObj
  },
  // 获取面板
  get: function (key) {
    if (!this.list.hasOwnProperty(key)) { return null }

    return this.list[key]
  }
}

export default Panel
