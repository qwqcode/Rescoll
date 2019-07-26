<template>
  <div class="action-bar">
    <div class="info"></div>
    <div class="btn-group">
      <span class="btn">
        <i class="zmdi zmdi-folder-outline"></i>
      </span>
      <span class="btn">
        <i class="zmdi zmdi-download"></i>
      </span>
      <span class="btn">
        <i class="zmdi zmdi-settings"></i>
      </span>
    </div>
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class TabBar extends Vue {}
</script>

<style lang="scss" scoped>
.action-bar {
  @extend %app-top-bar;
  top: 30px;
  height: 35px;
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #21252b;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px;
  -webkit-app-region: drag;

  .info {
    flex: 1;
  }

  .btn-group {
    display: flex;
    flex: 1;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;

    .btn {
      width: 50px;
      height: 35px;
      line-height: 35px;
      color: #fff;
      font-size: 15px;
      text-align: center;
      cursor: pointer;
      user-select: none;
      -webkit-app-region: no-drag;

      &:hover {
        background-color: hsla(0, 0%, 100%, 0.1);
      }

      & > i {
      }
    }
  }
}
</style>
