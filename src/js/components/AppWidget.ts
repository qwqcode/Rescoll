import { html } from 'common-tags'

/**
 * 小部件
 */
const AppWidget = {
  loadingIndicator (putInto: JQuery) {
    $(html`
    <div class="loading-indicator" style="opacity: .9;">
      <div class="inner">
        <svg viewBox="25 25 50 50"><circle cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"></circle></svg>
      </div>
    </div>
    `).prependTo(putInto)

    let indicatorObj = {
      remove() {
        $(putInto).find('.loading-indicator').remove()
      }
    }

    return indicatorObj
  },

  floatImg (parent: JQuery, imgSrc: string) {
    if ($('body .widget-float-img').length !== 0) { return }

    let parentDom = $(parent)
    let parentPos = parentDom[0].getBoundingClientRect()

    setTimeout(() => {
      if ($(':hover').filter(parentDom).length === 0) { return }

      let left = parentPos['left']
      let top = parentPos['top']
      if (parentPos['top'] >= (window.AppWrapEl.height() - parentPos['bottom'])) {
        // Floater 显示在父元素之上
        top = top - 250 - 10
      } else {
        // Floater 显示在父元素之下
        top = top + parentDom.height() + 10
      }

      let floaterDom = $(html`<div class="widget-float-img anim-fade-in" style="left: ${left}px; top: ${top}px;"></div>`).appendTo('body')

      let loadingIndicator = this.loadingIndicator(floaterDom)

      let imgDom = $(html`<img src="${imgSrc}" class="anim-fade-in" style="display: none;">`).appendTo(floaterDom)
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

export default AppWidget
