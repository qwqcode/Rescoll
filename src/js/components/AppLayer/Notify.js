/**
 * 内容层 通知
 */
const Notify = {
  sel: {
    notifyLayer: '.notify-layer'
  },
  success: function (message) {
    this.show(message, 's')
  },
  error: function (message) {
    this.show(message, 'e')
  },
  // level: s, e
  show: function (message, level, timeout) {
    timeout = (timeout !== undefined && typeof timeout === 'number') ? timeout : 2000

    var layerDom = $(this.sel.notifyLayer)
    if (layerDom.length === 0) { layerDom = $('<div class="notify-layer" />').appendTo('body') }

    var notifyDom = $('<div class="notify-item anim-fade-in ' + (level ? 'type-' + level : '') + '"><p class="notify-content">' + message + '</p></div>').prependTo(layerDom)

    var notifyRemove = function () {
      notifyDom.addClass('anim-fade-out')
      setTimeout(function () {
        notifyDom.remove()
      }, 200)
    }

    var autoOut = true
    notifyDom.click(function () {
      notifyRemove()
      autoOut = false
    })

    if (timeout > 0) {
      setTimeout(function () {
        if (!autoOut) return
        notifyRemove()
      }, timeout)
    }
  }
}

export default Notify
