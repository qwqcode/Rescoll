import TaskGen from '../TaskGen'

// 表单控件
const Form = {
  // 当前表单数据添加
  _currentInfoAdd(fieldName: string, label: string, inputTagId: string, validator: Function) {
    TaskGen.current.inputs[fieldName] = {
      label: label,
      inputSel: '#' + inputTagId
    }
    // 验证器
    if (validator) { TaskGen.current.inputs[fieldName].validator = validator }
  },
  _genBaseFormGroup(tagId: string, label: string) {
    let formGroup = $(`
      <div class="form-group">
      <label for="${tagId}">${label}</label>
      </div>
    `).appendTo(TaskGen.sel.form)
    return formGroup
  },
  _genBaseTextInput(tagId: string, fieldName: string, label: string, defaultVal?: string) {
    defaultVal = defaultVal || ''
    let inputElem = $(`
      <input id="${tagId}" name="${fieldName}" type="text"
              class="form-control" autocomplete="off" spellcheck="false"
              placeholder="输入文字" value="${defaultVal}">
    `)
    inputElem.appendTo(this._genBaseFormGroup(tagId, label))
    return inputElem
  },
  _genBaseTextarea(tagId: string, fieldName: string, label: string, defaultVal?: string) {
    defaultVal = defaultVal || ''
    let formInput = $(`<textarea id="${tagId}" name="${fieldName}" class="form-control" spellcheck="false" placeholder="输入文字"></textarea>`)
      .html(defaultVal)
      .appendTo(this._genBaseFormGroup(tagId, label))
    return formInput
  },
  // 文本框
  textInput(fieldName: string, label: string, defaultVal: string, validator: Function) {
    let tagId = 'TaskGen_' + fieldName
    let inputElem = this._genBaseTextInput(tagId, fieldName, label, defaultVal)
    this._currentInfoAdd(fieldName, label, tagId, validator)
    return inputElem
  },
  // 数字框
  numberInput(fieldName: string, label: string, defaultVal?: number, min?: number, max?: number) {
    let tagId = 'TaskGen_' + fieldName
    let inputElem = this._genBaseTextInput(tagId, fieldName, label, defaultVal || '')
    inputElem.attr('type', 'number')
    inputElem.attr('placeholder', '输入数字')
    if (!!min) inputElem.attr('min', min)
    if (!!max) inputElem.attr('max', max)
    this._currentInfoAdd(fieldName, label, tagId)
    return inputElem
  },
  // 多行文本框
  textareaInput(fieldName: string, label: string, defaultVal?: string, height?: string | number) {
    let tagId = 'TaskGen_' + fieldName
    let textareaElem = this._genBaseTextarea(tagId, fieldName, label, defaultVal)
    if (height) textareaElem.css('height', height) // 设置高度
    this._currentInfoAdd(fieldName, label, tagId)
    return textareaElem
  },
  // 选择菜单
  selectInput(fieldName: string, label: string, values: object, selectValue?: string) {
    let tagId = 'TaskGen_' + fieldName
    let inputHtml = `<select id="${tagId}" name="${fieldName}" class="form-control">`
    for (let [val, label] of Object.entries(values)) {
      val = (typeof (val) !== 'number') ? val : label
      let afterOpt = ((!!selectValue && (val === selectValue)) ? 'selected' : '')
      inputHtml += `<option value="${val}" ${afterOpt}>${label}</option>`
    }
    inputHtml += `</select>`
    let formInput = $(inputHtml)
    formInput.appendTo(this._genBaseFormGroup(tagId, label))
    this._currentInfoAdd(fieldName, label, tagId)
    return formInput
  }
}

export default Form
