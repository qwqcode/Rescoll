import SpiderList from './SpiderList'
import Task from './Task'
import { html } from 'common-tags'

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
    typeName: <string> null,
    inputs: <{ [key: string]: { label: string, inputSel: string, validator?: Function } }> {}
  },
  // 初始化
  init() {
    // 遍历列表 生成按钮
    let dropdownDom = $(html`
      <div class="namespace-dropdown">
        <div class="dropdown-selected"></div>
        <ul class="dropdown-option anim-fade-in"></ul>
      </div>
    `)

    let dropdownSelectedDom = dropdownDom.find('.dropdown-selected')

    let dropdownOptionDom = dropdownDom.find('.dropdown-option')
    let btnsDom = $('<div class="classname-btns"></div>')

    dropdownDom.appendTo(this.sel.formToggle)
    btnsDom.appendTo(this.sel.formToggle)

    let dropdownOptionShow = () => {
      dropdownOptionDom.addClass('show')
      // 若点击其他地方
      setTimeout(() => {
        $(document).bind('click.dropdown-option', (e) => {
          if (!$(e.target).is('.dropdown-option') && !$(e.target).closest('.dropdown-option').length) {
            dropdownOptionHide()
          }
        })
      }, 20)
    }
    let dropdownOptionHide = () => {
      $(document).unbind('click.dropdown-option')
      dropdownOptionDom.removeClass('show')
    }
    dropdownSelectedDom.click(() => {
      dropdownOptionShow()
    })

    for (let [namespace, eachClass] of Object.entries(SpiderList)) {
      let li = $(`<li data-namespace="${namespace}">${eachClass._NamespaceInfo.label}</li>`)
      // 点击 li
      li.click(() => {
        // 按钮显示
        btnsDom.html('') // 删除原有的所有按钮
        for (let [classname, classInfo] of Object.entries(eachClass)) {
          if (classname.substr(0, 1) === '_') continue
          let typeName = namespace + '.' + classname
          let btn = $(`<a>${classInfo['label']}</a>`).appendTo(btnsDom)
          // 选中之前点击过的按钮
          if (!!TaskGen.current.typeName && TaskGen.current.typeName === typeName) {
            btnsDom.find('a').removeClass('active')
            $(btn).addClass('active')
          }
          btn.click(() => {
            // 表单生成
            TaskGen.formLoad(typeName)
            // 按钮选中
            btnsDom.find('a').removeClass('active')
            btn.addClass('active')
          })
        }
        dropdownSelectedDom.text(li.text())
        dropdownSelectedDom.attr('data-namespace', namespace)
        // 选中当前 li
        dropdownOptionDom.find('li').removeClass('selected')
        li.addClass('selected')
        // 取消显示 dropdown-option
        dropdownOptionHide()
        // 当前 li 置顶
        // li.insertBefore(dropdownOptionDom.find('li:first-child'));
      })
      li.appendTo(dropdownOptionDom)
    }

    // 打开第一个任务生成器
    dropdownOptionDom.find('li:first-child').click()
    btnsDom.find('a:first-child').click()
  },
  // 分析 TypeName
  spiderListGet (typeNameStr: string) {
    let typeName = typeNameStr.split('.') || null
    if (!typeName || !typeName[0] || !typeName[1]) return null
    let namespace = typeName[0]

    let classname = typeName[1]
    if (!SpiderList.hasOwnProperty(namespace) || !SpiderList[namespace].hasOwnProperty(classname)) return null
    return SpiderList[namespace][classname]
  },
  // 表单装载
  formLoad(typeName: string) {
    // 点击操作按钮事件
    if (!this.spiderListGet(typeName)) { throw Error('SpiderList 中没有 ' + typeName + '，无法创建表单！') }

    let spider = this.spiderListGet(typeName)
    let formDom = $(this.sel.form)

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
    let submitBtn = $(html`<div class="form-btns"><button class="submit-btn" type="submit">执行任务</button></div>`)
      .appendTo(formDom)

    submitBtn.click(() => {
      if (!TaskGen.formCheck()) { return false }

      // console.log(formDom.find(':input').serializeArray())
      Task.createTask(typeName, spider.label, formDom.find(':input').serializeArray())

      return false
    })
  },
  // 表单提交检验
  formCheck() {
    let isInputAllRight = true
    for (let [i, obj] of Object.entries(TaskGen.current.inputs)) {
      if (!obj.inputSel || $(obj.inputSel).length === 0) { throw Error(`表单输入元素 ${i} 的 Selector 无效`) }

      let inputSel = obj.inputSel
      let inputDom = $(inputSel)
      let inputVal = $.trim(inputDom.val().toString())

      if (inputVal === '') {
        inputDom.focus()
        isInputAllRight = false
        return false
      }

      // 验证器
      if (!!obj.validator && !obj.validator(inputVal)) {
        inputDom.addClass('has-error').focus()
        inputDom.bind('input propertychange', (evt) => {
          if (obj.validator(
            $.trim(inputDom.val().toString())
          )) inputDom.unbind('input propertychange').removeClass('has-error')
        })
        isInputAllRight = false
        return false
      }
    }

    return isInputAllRight
  }
}

export default TaskGen
