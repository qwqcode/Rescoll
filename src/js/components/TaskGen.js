import SpiderList from './SpiderList'
import Task from './Task'

/**
 * Task Generator (任务生成器)
 */
const TaskGen = {
  sel: {
    form: '.taskgen-form',
    formToggle: '.taskgen-form-toggle',
    formToggleDropdown: '.taskgen-form-toggle .namespace-dropdown',
    formToggleBtns: '.taskgen-form-toggle .classname-btns'
  },
  // 当前
  current: {
    typeName: null,
    inputs: {}
  },
  // 初始化
  init: function () {
    // 遍历列表 生成按钮
    var dropdownDom = $('<div class="namespace-dropdown"><div class="dropdown-selected"></div><ul class="dropdown-option anim-fade-in"></ul></div>')

    var dropdownSelectedDom = dropdownDom.find('.dropdown-selected')

    var dropdownOptionDom = dropdownDom.find('.dropdown-option')
    var btnsDom = $('<div class="classname-btns"></div>')

    dropdownDom.appendTo(this.sel.formToggle)
    btnsDom.appendTo(this.sel.formToggle)

    var dropdownOptionShow = function () {
      dropdownOptionDom.addClass('show')
      // 若点击其他地方
      setTimeout(function () {
        $(document).bind('click.dropdown-option', function (e) {
          if (!$(e.target).is('.dropdown-option') && !$(e.target).closest('.dropdown-option').length) {
            dropdownOptionHide()
          }
        })
      }, 20)
    }
    var dropdownOptionHide = function () {
      $(document).unbind('click.dropdown-option')
      dropdownOptionDom.removeClass('show')
    }
    dropdownSelectedDom.click(function () {
      dropdownOptionShow()
    })

    $.each(SpiderList, function (namespace, eachClass) {
      var li = $('<li data-namespace="' + namespace + '">' + eachClass._NamespaceLabel + '</li>')
      // 点击 li
      li.click(function () {
        // 按钮显示
        btnsDom.html('') // 删除原有的所有按钮
        $.each(eachClass, function (classname, classInfo) {
          if (classname.substr(0, 1) === '_') return
          var typeName = namespace + '.' + classname
          var btn = $('<a>' + classInfo['label'] + '</a>').appendTo(btnsDom)
          // 选中之前点击过的按钮
          if (!!TaskGen.current.typeName && TaskGen.current.typeName === typeName) {
            btnsDom.find('a').removeClass('active')
            $(btn).addClass('active')
          }
          btn.click(function () {
            // 表单生成
            TaskGen.formLoad(typeName)
            // 按钮选中
            btnsDom.find('a').removeClass('active')
            $(this).addClass('active')
          })
        })
        dropdownSelectedDom.text($(this).text())
        dropdownSelectedDom.attr('data-namespace', namespace)
        // 选中当前 li
        dropdownOptionDom.find('li').removeClass('selected')
        $(this).addClass('selected')
        // 取消显示 dropdown-option
        dropdownOptionHide()
        // 当前 li 置顶
        // $(this).insertBefore(dropdownOptionDom.find('li:first-child'));
      })
      li.appendTo(dropdownOptionDom)
    })

    // 打开第一个任务生成器
    dropdownOptionDom.find('li:first-child').click()
    btnsDom.find('a:first-child').click()
  },
  // 分析 TypeName
  spiderListGet: function (typeNameStr) {
    var typeName = typeNameStr.split('.') || null
    if (!typeName || !typeName[0] || !typeName[1]) return null
    var namespace = typeName[0]

    var classname = typeName[1]
    if (!SpiderList.hasOwnProperty(namespace) || !SpiderList[namespace].hasOwnProperty(classname)) return null
    return SpiderList[namespace][classname]
  },
  // 表单装载
  formLoad: function (typeName) {
    // 点击操作按钮事件
    if (!this.spiderListGet(typeName)) { throw Error('SpiderList 中没有 ' + typeName + '，无法创建表单！') }

    var spider = this.spiderListGet(typeName)
    var formDom = $(this.sel.form)

    // 清除当前表单
    formDom.html('')
    // 清除当前数据
    this.current.typeName = null
    this.current.inputs = {}

    // 装入新数据
    this.current.typeName = typeName
    // 执行表单创建
    spider.genForm()
    // 提交按钮
    var submitBtn = $('<div class="form-btns">\n<button class="submit-btn" type="submit">执行任务</button>\n</div>')
      .appendTo(formDom)

    submitBtn.click(function () {
      if (!TaskGen.formCheck()) { return false }

      // console.log(formDom.find(':input').serializeArray())
      Task.createTask(typeName, spider.label, formDom.find(':input').serializeArray())

      return false
    })
  },
  // 表单提交检验
  formCheck: function () {
    var isInputAllRight = true
    $.each(TaskGen.current.inputs, function (i, obj) {
      if (!obj.inputSel || $(obj.inputSel).length === 0) { throw Error('表单输入元素 ' + i + ' 的 Selector 无效') }

      var inputSel = obj.inputSel

      var inputDom = $(inputSel)

      var inputVal = inputDom.val().trim()

      if (inputVal === '') {
        inputDom.focus()
        isInputAllRight = false
        return false
      }

      // 验证器
      if (!!obj.validator && !obj.validator(inputVal)) {
        inputDom.addClass('has-error').focus()
        inputDom.bind('input propertychange', function () {
          if (obj.validator($(this).val().trim())) $(this).unbind('input propertychange').removeClass('has-error')
        })
        isInputAllRight = false
        return false
      }
    })

    return isInputAllRight
  }
}

export default TaskGen
