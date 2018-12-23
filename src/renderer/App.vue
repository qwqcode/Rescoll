<template>
  <div id="app" class="app">
    <window-header></window-header>
    <div class="app-wrap">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import WindowHeader from './components/WindowHeader'

  export default {
    name: 'rescoll',
    components: { WindowHeader }
  }
</script>

<style lang="scss">
* {
    margin: 0;
    padding: 0;
    text-rendering: optimizeLegibility;
    box-sizing: border-box;
}

body, html {
  font-family: "Helvetica Neue", "PingFangSC-Light", "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
  color: #FFF;
  background-color: #535f6f;
  margin: 0;
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
    margin-top: 34px;
    height: calc(100vh - 34px - 3px);
  }
}
</style>
