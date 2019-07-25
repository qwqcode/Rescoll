<template>
  <section class="container">
    <div>
      <img width="256" src="~/assets/img/logo.svg" />
      <h1>{{ title }}}</h1>
      <h2>⚔ Web crawling & scraping integration platform for everyone.</h2>
      <a
        href="https://nuxtjs.org/"
        target="_blank"
        class="btn btn-primary"
        style="color: #FFF"
      >
        Documentation
      </a>
      <a
        href="https://github.com/nuxt/nuxt.js"
        target="_blank"
        class="btn btn-primary"
      >
        GitHub
      </a>
      <a
        href="https://electronjs.org/"
        target="_blank"
        class="btn btn-secondary"
      >
        Electron
      </a>
      <a
        href="https://github.com/electron-userland/electron-builder"
        target="_blank"
        class="btn btn-secondary"
      >
        Electron Builder
      </a>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class extends Vue {
  title: string = 'electron'
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.btn {
  margin: 0 8px;
}
</style>
