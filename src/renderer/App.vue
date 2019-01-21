<template>
  <div id="app" class="app">
    <div class="app-wrap">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import 'material-design-iconic-font/dist/css/material-design-iconic-font.min.css'
  import 'normalize.css/normalize.css'

  export default {
    name: 'rescoll',
    components: { }
  }
</script>

<style lang="scss">
@font-face {
  font-family: SAOUI;
  src: url('~@/fonts/SAOUI.otf');
}

body, html {
  font-family: "Helvetica Neue", "PingFangSC-Light", "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
  color: #FFF;
  background-color: #535f6f;
  -webkit-font-smoothing: antialiased;
}

.app {
  border: 1px solid rgb(51, 51, 51);
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;

  .app-wrap {
    position: relative;
    margin-top: 70px;
    margin-left: calc(250px + 10px);
    margin-right: 10px;
    height: calc(100vh - 65px - 1px);
  }
}
</style>
