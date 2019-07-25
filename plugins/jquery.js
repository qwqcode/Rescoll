import jquery from 'jquery'

if (!!process.browser) {
  window.jQuery = jquery
  window.$ = jquery
}
