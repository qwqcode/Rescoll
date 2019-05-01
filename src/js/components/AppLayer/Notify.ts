import { html } from 'common-tags'

/**
 * 内容层 通知
 */
const Notify = {
  success(message: string): void {
    this.show(message, 's')
  },
  error(message: string): void {
    this.show(message, 'e')
  },
  // level: s, e
  show(message: string, level: string, timeout?: number): void {
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

    let timeoutKey: number
    if (timeout > 0) {
      timeoutKey = setTimeout(() => {
        notifyRemove()
      }, timeout)
    }

    notifyElem.click(() => {
      notifyRemove()
      clearTimeout(timeoutKey) // 不再定时 out
    })
  }
}

export default Notify
