import NuxtConfiguration from '@nuxt/config'

const config: NuxtConfiguration = {
  mode: 'spa',
  head: {
    title: 'Rescoll',
    meta: [
      { charset: 'utf-8' },
      { name: 'X-UA-Compatible', content: 'IE=edge,chrome=1' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'renderer', content: 'webkit' },
      { name: 'author', content: 'https://github.com/qwqcode' }
    ]
  },
  loading: false,
  css: [
    '@/assets/css/main.scss',
    'material-design-iconic-font/dist/css/material-design-iconic-font.min.css'
  ],
  styleResources: {
    scss: ['@/assets/css/_variables.scss', '@/assets/css/_extends.scss']
  },
  modules: ['@nuxtjs/axios', '@nuxtjs/style-resources'],
  plugins: [
    '~/plugins/outclick.min.js',
    '~/plugins/marked.js'
  ],
  axios: {},
  router: {
    mode: 'hash'
  },
  build: {
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        // ...
      }
    }
  },
  server: {
    port: 8080, // default: 3000
    host: 'localhost' // default: localhost
  }
}

export default config
