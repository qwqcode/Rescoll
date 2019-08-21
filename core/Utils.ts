import $ from 'jquery'
import { html } from 'common-tags'

export default class Utils {
  static callBackendMethod (code: string): any {
    console.log(code)
  }

  /** bytes 格式化 */
  static formatBytes (bytes: number): string {
    if (bytes === 0) { return '0 B' }
    const k = 1000 // or 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return (bytes / k ** i).toPrecision(3) + ' ' + sizes[i]
  }

  /** 路径中提取文件名 */
  static extractFilename (path: string) {
    const lastSlash = Math.max(path.lastIndexOf('\\'), path.lastIndexOf('/'))
    return path.substring(lastSlash + 1)
  }

  /** 加载动画 */
  static loadingIndicator (putInto: JQuery) {
    $(html`
      <div class="loading-indicator" style="opacity: .9;">
        <div class="inner">
          <svg viewBox="25 25 50 50"><circle cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"></circle></svg>
        </div>
      </div>
      `).prependTo(putInto)

    const indicatorObj = {
      remove () {
        $(putInto).find('.loading-indicator').remove()
      }
    }

    return indicatorObj
  }

  /** 悬浮预览图 */
  static floatImg (parent: JQuery, imgSrc: string) {
    const appPageWrapEl = $('.app-page-wrap') as JQuery<HTMLElement>

    if ($('body .widget-float-img').length !== 0) { return }

    const parentDom = $(parent)
    const parentPos = parentDom[0].getBoundingClientRect()

    setTimeout(() => {
      if ($(':hover').filter(parentDom).length === 0) { return }

      const left = parentPos.left
      let top = parentPos.top
      if (parentPos.top >= ((appPageWrapEl.height() || 650) - parentPos.bottom)) {
        // Floater 显示在父元素之上
        top = top - 250 - 10
      } else {
        // Floater 显示在父元素之下
        top = top + (parentDom.height() || 0) + 10
      }

      const floaterDom = $(html`<div class="widget-float-img anim-fade-in" style="left: ${left}px; top: ${top}px;"></div>`).appendTo('body')

      const loadingIndicator = this.loadingIndicator(floaterDom)

      const imgDom = $(html`<img src="${imgSrc}" class="anim-fade-in" style="display: none;">`).appendTo(floaterDom)
      imgDom.on('load', () => {
        loadingIndicator.remove()
        imgDom.show()
      })

      parentDom.on('mouseout', (e) => {
        floaterDom.remove()
      })
    }, 200)
  }
}
