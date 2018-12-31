/**
 * 内容层 对话框
 */
const Dialog = {
  sel: {
    dialogLayer: '.dialog-layer'
  },
  open: function (title, content, yesBtn, cancelBtn) {
    var layerSel = this.sel.dialogLayer

    if ($(layerSel).length !== 0) { $(layerSel).remove() }

    var dialogLayerDom = $('<div class="dialog-layer anim-fade-in" />').appendTo('body')
    var dialogLayerHide = function () {
      dialogLayerDom.addClass('anim-fade-out')
      setTimeout(function () {
        dialogLayerDom.hide()
      }, 200)
    }

    var dialogDom = $('<div class="dialog-inner"><div class="dialog-title">' + title + '</div>\n<div class="dialog-content">' + content + '</div></div>').appendTo(dialogLayerDom)

    // 底部按钮
    if (!!yesBtn || !!cancelBtn) {
      var dialogBottomDom = $('<div class="dialog-bottom"></div>')
        .appendTo(dialogDom)

      // 确定按钮
      if (yesBtn) {
        var yesOnClick = yesBtn[1] || function () {}
        var yesBtnText = yesBtn[0] || '确定'

        $('<a class="dialog-btn yes-btn">' + yesBtnText + '</a>').click(function () {
          dialogLayerHide()
          yesOnClick()
        }).appendTo(dialogBottomDom)
      }

      // 取消按钮
      if (cancelBtn) {
        var cancelBtnText = cancelBtn[0] || '取消'
        var cancelOnClick = cancelBtn[1] || function () {}

        $('<a class="dialog-btn cancel-btn">' + cancelBtnText + '</a>').click(function () {
          dialogLayerHide()
          cancelOnClick()
        }).appendTo(dialogBottomDom)
      }
    } else {
      $('<a class="right-btn"><i class="zmdi zmdi-close"></i></a>').appendTo($(dialogDom).find('.dialog-title')).click(function () {
        dialogLayerHide()
      })
    }
  }
}

export default Dialog
