import AppNavbar from '../AppNavbar'

/**
 * 导航栏按钮
 */
const Btn = {
  sel: {
    navBtns: '.top-nav-bar .nav-btns'
  },
  groupList: {},
  // 按钮批量添加
  groupAdd: function (groupName, btnList) {
    var btnGroup, btnGroupDom
    if (!this.getGroup(groupName)) {
      // 创建新的按钮组对象
      btnGroup = {}
      btnGroupDom = $('<div class="btn-group" data-nav-btn-group="' + groupName + '"></div>').appendTo(this.sel.navBtns)
      // 设置按钮组显示在最左
      btnGroup.setMostLeft = function () {
        btnGroupDom.insertBefore($(AppNavbar.Btn.sel.navBtns + ' .btn-group:first-child'))
        return btnGroup
      }
      // 设置按钮组显示在最右
      btnGroup.setMostRight = function () {
        btnGroupDom.insertAfter($(AppNavbar.Btn.sel.navBtns + ' .btn-group:last-child'))
        return btnGroup
      }
      // 隐藏按钮组
      btnGroup.hide = function () {
        btnGroupDom.hide()
        return btnGroup
      }
      // 获取 Dom
      btnGroup.getDom = function () {
        return btnGroupDom
      }
      // 显示
      btnGroup.show = function () {
        btnGroup.getDom().show()
        return btnGroup
      }
      // 隐藏
      btnGroup.hide = function () {
        btnGroup.getDom().hide()
        return btnGroup
      }
      // 添加图标
      btnGroup.btnList = {}
      btnGroup.addBtn = function (btnName, btnObj) {
        btnGroup.btnList[btnName] = btnObj
        return btnObj
      }
      btnGroup.getBtn = function (btnName) {
        if (!btnGroup.btnList[btnName]) return null
        return btnGroup.btnList[btnName]
      }
      this.groupList[groupName] = btnGroup
    } else {
      btnGroup = this.getGroup(groupName)
      btnGroupDom = btnGroup.getDom()
    }

    // 遍历在按钮组中添加每一个按钮
    $.each(btnList, function (btnName, value) {
      var dom = $('<a data-nav-btn="' + groupName + '.' + btnName + '" data-placement="bottom" title="' + value['title'] + '"><i class="zmdi zmdi-' + value['icon'] + '"></i></a>')
      if (typeof (value['onClick']) === 'function') {
        dom.click(function () {
          value['onClick']()
        })
      }
      dom.appendTo(btnGroupDom)
      dom.tooltip()
      var btnObj = {}
      btnObj.showBadge = function () {
        dom.addClass('show-top-badge')
        return btnObj
      }
      btnObj.hideBadge = function () {
        dom.removeClass('show-top-badge')
        return btnObj
      }
      btnObj.getDom = function () {
        return dom
      }
      btnGroup.addBtn(btnName, btnObj)
    })

    return btnGroup
  },
  // 获取按钮组
  getGroup: function (groupName) {
    if (!this.groupList.hasOwnProperty(groupName)) return null
    return this.groupList[groupName]
  },
  // 获取 按钮组 / 按钮 对象
  get: function (name) {
    name = name.split('.')
    if (!!name[0] && !!name[1]) { return this.getGroup(name[0]).getBtn(name[1]) }
    if (!!name[0] && !name[1]) { return this.getGroup(name[0]) }
    return null
  }
}

export default Btn
