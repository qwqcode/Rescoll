/**
 * 小部件
 */
const AppWidget = {
  loadingIndicator: function (putInto) {
    $('<div class="loading-indicator" style="opacity: .9;"><div class="inner"><svg viewBox="25 25 50 50"><circle cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"></circle></svg></div></div>').prependTo(putInto)

    var indicatorObj = {}
    indicatorObj.remove = function () {
      $(putInto).find('.loading-indicator').remove()
    }

    return indicatorObj
  },
  floatImg: function (parent, imgSrc) {
    if ($('body .widget-float-img').length !== 0) { return }

    var parentDom = $(parent)
    var parentPos = $(parent)[0].getBoundingClientRect()

    setTimeout(function () {
      if ($(':hover').filter(parentDom).length === 0) { return }

      var left = parentPos['left']
      var top = parentPos['top']
      if (parentPos['top'] >= (window.AppWrapEl.height() - parentPos['bottom'])) {
        // Floater 显示在父元素之上
        top = top - 250 - 10
      } else {
        // Floater 显示在父元素之下
        top = top + parentDom.height() + 10
      }

      var floaterDom = $('<div class="widget-float-img anim-fade-in" style="left: ' + left + 'px; top: ' + top + 'px;"></div>').appendTo('body')

      var loadingIndicator = AppWidget.loadingIndicator(floaterDom)

      var imgDom = $('<img src="' + imgSrc + '" class="anim-fade-in" style="display: none;">').appendTo(floaterDom)
      imgDom.on('load', function () {
        loadingIndicator.remove()
        imgDom.show()
      })

      parentDom.on('mouseout', function (e) {
        floaterDom.remove()
      })
    }, 200)
  }
}

export default AppWidget
