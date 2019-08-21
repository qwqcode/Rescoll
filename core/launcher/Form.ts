import $ from 'jquery'
import { html } from 'common-tags'
import LaunchPad from '~/components/LaunchPad.vue'

export default class Form {
  launchPad: LaunchPad
  curtInputs: { [key: string]: { label: string, inputSel: string, validator?: Function } } = {}
  constructor (launchPad: LaunchPad) {
    this.launchPad = launchPad
  }

  // 当前表单数据添加
  protected currentInfoAdd (fieldName: string, label: string, inputTagId: string, validator?: Function) {
    this.curtInputs[fieldName] = {
      label,
      inputSel: '#' + inputTagId
    }
    // 验证器
    if (validator) { this.curtInputs[fieldName].validator = validator }
  }

  protected genBaseFormGroup (tagId: string, label: string) {
    const formGroup = $(`
      <div class="form-group">
      <label for="${tagId}">${label}</label>
      </div>
    `).appendTo('#LaunchForm')
    return formGroup
  }

  protected genBaseTextInput (tagId: string, fieldName: string, label: string, defaultVal?: string) {
    defaultVal = defaultVal || ''
    const inputElem = $(`
      <input id="${tagId}" name="${fieldName}" type="text"
              class="form-control" autocomplete="off" spellcheck="false"
              placeholder="输入文字" value="${defaultVal}">
    `)
    inputElem.appendTo(this.genBaseFormGroup(tagId, label))
    return inputElem
  }

  protected genBaseTextarea (tagId: string, fieldName: string, label: string, defaultVal?: string) {
    defaultVal = defaultVal || ''
    const formInput = $(html`
      <textarea id="${tagId}" name="${fieldName}" class="form-control" spellcheck="false" placeholder="输入文字"></textarea>
    `)
      .html(defaultVal)
      .appendTo(this.genBaseFormGroup(tagId, label))
    return formInput
  }

  // 文本框
  public textInput (fieldName: string, label: string, defaultVal?: string, validator?: Function) {
    const tagId = 'TaskGen_' + fieldName
    const inputElem = this.genBaseTextInput(tagId, fieldName, label, defaultVal)
    this.currentInfoAdd(fieldName, label, tagId, validator)
    return inputElem
  }

  // 数字框
  public numberInput (fieldName: string, label: string, defaultVal?: number, min?: number, max?: number) {
    const tagId = 'TaskGen_' + fieldName
    const inputElem = this.genBaseTextInput(tagId, fieldName, label, String(defaultVal || ''))
    inputElem.attr('type', 'number')
    inputElem.attr('placeholder', '输入数字')
    if (min) { inputElem.attr('min', min) }
    if (max) { inputElem.attr('max', max) }
    this.currentInfoAdd(fieldName, label, tagId)
    return inputElem
  }

  // 多行文本框
  public textareaInput (fieldName: string, label: string, defaultVal?: string, height?: string | number) {
    const tagId = 'TaskGen_' + fieldName
    const textareaElem = this.genBaseTextarea(tagId, fieldName, label, defaultVal)
    if (height) { textareaElem.css('height', height) } // 设置高度
    this.currentInfoAdd(fieldName, label, tagId)
    return textareaElem
  }

  // 选择菜单
  public selectInput (fieldName: string, label: string, values: object, selectValue?: string) {
    const tagId = 'TaskGen_' + fieldName
    let inputHtml = `<select id="${tagId}" name="${fieldName}" class="form-control">`
    for (const [val, label] of Object.entries(values)) {
      const inputVal = (typeof (val) !== 'number') ? val : label
      const afterOpt = ((!!selectValue && (inputVal === selectValue)) ? 'selected' : '')
      inputHtml += `<option value="${inputVal}" ${afterOpt}>${label}</option>`
    }
    inputHtml += `</select>`
    const formInput = $(inputHtml)
    formInput.appendTo(this.genBaseFormGroup(tagId, label))
    this.currentInfoAdd(fieldName, label, tagId)
    return formInput
  }

  public formCheck () {
    let isInputAllRight = true
    for (const [i, obj] of Object.entries(this.curtInputs)) {
      if (!obj.inputSel || $(obj.inputSel).length === 0) { throw new TypeError(`表单输入元素 ${i} 的 Selector 无效`) }

      const inputSel = obj.inputSel
      const inputDom = $(inputSel)
      const inputVal = $.trim((inputDom.val() || '').toString())

      if (inputVal === '') {
        inputDom.focus()
        isInputAllRight = false
        return false
      }

      // 验证器
      if (!!obj.validator && !obj.validator(inputVal)) {
        inputDom.addClass('has-error').focus()
        inputDom.bind('input propertychange', (evt) => {
          if (obj.validator !== undefined && obj.validator(
            $.trim((inputDom.val() || '').toString())
          )) { inputDom.unbind('input propertychange').removeClass('has-error') }
        })
        isInputAllRight = false
        return false
      }
    }

    return isInputAllRight
  }
}
