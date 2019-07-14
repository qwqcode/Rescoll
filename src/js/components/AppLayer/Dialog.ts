import { html } from 'common-tags'

/**
 * 内容层 对话框
 */
export default class Dialog {
  public static open(title: string, content: string|JQuery<HTMLElement>, yesBtn?: [string?, Function?], cancelBtn?: [string?, Function?]): JQuery<HTMLElement> {
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
      <div class="dialog-title"><span class="title-text">${title}</span></div>
      <div class="dialog-content"></div>
    </div>
    `).appendTo(dialogLayerElem)

    dialogDom.find('.dialog-content').append(content)

    // 底部按钮
    let genBottomBtn = (text: string, onClickFunc: Function) => {
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
      let closeBtn = $('<a class="right-btn close-btn"><i class="zmdi zmdi-close"></i></a>')
      closeBtn.appendTo(dialogDom.find('.dialog-title'))
      closeBtn.click(() => {
        hideDialogLayer()
      })
    }

    return dialogDom
  }
}
