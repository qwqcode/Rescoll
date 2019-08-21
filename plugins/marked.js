import marked from 'marked'
import Vue from 'vue'

let renderer = new marked.Renderer()
const linkRenderer = renderer.link
renderer.link = function (href, title, text) {
  const html = linkRenderer.call(renderer, href, title, text)
  return html.replace(/^<a /, '<a target="_blank" ')
}

marked.setOptions({
  renderer: renderer,
  pedantic: false,
  gfm: true,
  tables: true,
  breaks: true,
  sanitize: false, // 净化
  smartLists: true,
  smartypants: true,
  xhtml: false
})

const install = function (Vue) {
  if (install.installed) return

  Vue.filter('marked', function (value) {
    return marked(value.trim())
  })

  Vue.prototype.marked = marked
}

Vue.use(install)
