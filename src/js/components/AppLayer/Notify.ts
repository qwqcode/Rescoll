import { html } from 'common-tags'

/**
 * 内容层 通知
 */
const Notify = {
  success (message) {
    this.show(message, 's')
  },
  error (message) {
    this.show(message, 'e')
  },
  // level: s, e
  show (message, level, timeout) {
    timeout = (typeof timeout === 'number') ? timeout : 2000

    let layerElem = $('.notify-layer')
    if (!layerElem.length) {
      layerElem = $('<div class="notify-layer" />').appendTo('body')
    }

    let notifyElem = $(html`
      <div class="notify-item anim-fade-in ${level ? ('type-' + level) : ''}">
        <p class="notify-content">${message}</p>
      </div>
    `).prependTo(layerElem)

    let notifyRemove = () => {
      notifyElem.addClass('anim-fade-out')
      setTimeout(() => {
        notifyElem.remove()
      }, 200)
    }

    let timeoutFn
    if (timeout > 0) {
      timeoutFn = setTimeout(() => {
        notifyRemove()
      }, timeout)
    }

    notifyElem.click(() => {
      notifyRemove()
      clearTimeout(timeoutFn) // 不再定时 out
    })
  }
}

export default Notify
