<template>
  <div id="app" class="app">
    <window-header></window-header>
    <router-view></router-view>
  </div>
</template>

<script>
  import WindowHeader from './components/WindowHeader'

  export default {
    name: 'rescoll',
    components: { WindowHeader }
  }
</script>

<style>
* {
    margin: 0;
    padding: 0;
    text-rendering: optimizeLegibility;
    box-sizing: border-box;
}

body {
  color: #fff;
  -webkit-backface-visibility: hidden;
}

.app {
    border: 1px solid rgb(51, 51, 51);
    position: fixed;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
}
</style>
