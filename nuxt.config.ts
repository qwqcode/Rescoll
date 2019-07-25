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
  loading: { color: '#FFF' },
  css: [
    '@/assets/css/main.scss',
    'material-design-iconic-font/dist/css/material-design-iconic-font.min.css'
  ],
  styleResources: {
    scss: ['@/assets/css/_variables.scss', '@/assets/css/_extends.scss']
  },
  modules: ['@nuxtjs/axios', '@nuxtjs/style-resources'],
  plugins: [
    '@/plugins/jquery',
    '@/plugins/outclick.min.js',
    '@/plugins/tooltip.js'
  ],
  axios: {},
  build: {
    extend(config, { isDev, isClient }) {
      if (isDev && isClient) {
        // ...
      }
    }
  }
}

export default config
