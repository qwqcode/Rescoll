import TaskGen from '../TaskGen'

// 表单控件
const Form = {
  // 当前表单数据添加
  _currentInfoAdd: function (fieldName, label, inputTagId, validator) {
    TaskGen.current.inputs[fieldName] = {
      label: label,
      inputSel: '#' + inputTagId
    }
    // 验证器
    if (validator) { TaskGen.current.inputs[fieldName].validator = validator }
  },
  // 文本框
  textInput: function (fieldName, label, defaultVal, validator) {
    defaultVal = defaultVal || ''
    var tagId = 'TaskGen_' + fieldName
    var formGroup = $('<div class="form-group">\n<label for="' + tagId + '">' + label + '</label>\n</div>').appendTo(TaskGen.sel.form)
    var formInput = $('<input id="' + tagId + '" name="' + fieldName + '" type="text" class="form-control" autocomplete="off" spellcheck="false" placeholder="输入文字" value="' + defaultVal + '">')
    formInput.appendTo(formGroup)
    this._currentInfoAdd(fieldName, label, tagId, validator)
  },
  // 数字框
  numberInput: function (fieldName, label, defaultVal, min, max) {
    defaultVal = defaultVal || ''
    min = min || ''
    max = max || ''
    var tagId = 'TaskGen_' + fieldName
    var formGroup = $('<div class="form-group">\n<label for="' + tagId + '">' + label + '</label>\n</div>').appendTo(TaskGen.sel.form)
    var formInput = $('<input id="' + tagId + '" name="' + fieldName + '" type="number" class="form-control" autocomplete="off" spellcheck="false" placeholder="输入数字" value="' + defaultVal + '" min="' + min + '" max="' + max + '">')
    formInput.appendTo(formGroup)
    this._currentInfoAdd(fieldName, label, tagId)
  },
  // 多行文本框
  textareaInput: function (fieldName, label, defaultVal, height) {
    defaultVal = defaultVal || ''
    var tagId = 'TaskGen_' + fieldName
    var formGroup = $('<div class="form-group">\n<label for="' + tagId + '">' + label + '</label>\n</div>').appendTo(TaskGen.sel.form)
    var formInput = $('<textarea id="' + tagId + '" name="' + fieldName + '" class="form-control" spellcheck="false" placeholder="输入文字">' + defaultVal + '</textarea>').appendTo(formGroup)
    if (height) formInput.css('height', height) // 设置高度
    this._currentInfoAdd(fieldName, label, tagId)
  },
  // 选择菜单
  selectInput: function (fieldName, label, values, selectValue) {
    var tagId = 'TaskGen_' + fieldName
    var formGroup = $('<div class="form-group">\n<label for="' + tagId + '">' + label + '</label>\n</div>').appendTo(TaskGen.sel.form)
    var inputHtml = '<select id="' + tagId + '" name="' + fieldName + '" class="form-control">\n'
    $.each(values, function (val, label) {
      val = (typeof (val) !== 'number') ? val : label
      var afterOpt = (val === selectValue ? 'selected' : '')
      inputHtml += '<option value="' + val + '" ' + afterOpt + '>' + label + '</option>'
    })
    inputHtml += '\n</select>'
    var formInput = $(inputHtml)
    formInput.appendTo(formGroup)
    this._currentInfoAdd(fieldName, label, tagId)
  }
}

export default Form
