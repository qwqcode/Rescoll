import { html } from 'common-tags'

/**
 * 内容层 对话框
 */
const Dialog = {
  open (title, content, yesBtn, cancelBtn) {
    if ($('.dialog-layer').length !== 0) {
      $('.dialog-layer').remove()
    }

    let dialogLayerElem = $('<div class="dialog-layer anim-fade-in" />').appendTo('body')
    let hideDialogLayer = () => {
      dialogLayerElem.addClass('anim-fade-out')
      setTimeout(() => {
        dialogLayerElem.hide()
      }, 200)
    }

    let dialogDom = $(html`
    <div class="dialog-inner">
      <div class="dialog-title">${title}</div>
      <div class="dialog-content">${content}</div>
    </div>
    `).appendTo(dialogLayerElem)

    // 底部按钮
    let genBottomBtn = (text, onClickFunc) => {
      let dialogBottomElem = $('.dialog-bottom')
      if (!dialogBottomElem.length) {
        dialogBottomElem = $(`<div class="dialog-bottom"></div>`).appendTo(dialogDom)
      }
      let btnElem = $(`<a class="dialog-btn yes-btn"></a>`)
      btnElem.text(text)
      btnElem.click(() => {
        hideDialogLayer()
        if (typeof onClickFunc === 'function') {
          onClickFunc()
        }
      })
      btnElem.appendTo(dialogBottomElem)
    }

    // 确定按钮
    if (yesBtn) {
      genBottomBtn(yesBtn[0] || '确定', yesBtn[1])
    }

    // 取消按钮
    if (cancelBtn) {
      genBottomBtn(cancelBtn[0] || '取消', cancelBtn[1])
    }

    // 右上角关闭按钮
    if (!yesBtn && !cancelBtn) {
      let closeBtn = $('<a class="right-btn"><i class="zmdi zmdi-close"></i></a>')
      closeBtn.appendTo(dialogDom.find('.dialog-title'))
      closeBtn.click(() => {
        hideDialogLayer()
      })
    }
  }
}

export default Dialog
