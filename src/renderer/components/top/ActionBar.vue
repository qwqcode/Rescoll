<template>
  <div class="action-bar">
    <div class="info">
    </div>
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
export default {
  name: 'action-bar'
}
</script>


<style lang="scss" scoped>
.action-bar {
  @extend %top-bar;
  background-color: #21252b;
  top: 30px;
  height: 35px;
  -webkit-app-region: drag;
  display: flex;
  flex-direction: row;
  align-items: center;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px;

  .info {
    flex: 1;
  }

  .btn-group {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    flex: 1;

    .btn {
      -webkit-app-region: no-drag;
      text-align: center;
      width: 50px;
      height: 35px;
      line-height: 35px;
      color: #FFF;
      font-size: 15px;
      cursor: pointer;
      user-select: none;

      &:hover {
        background-color: hsla(0,0%,100%,.1);
      }

      & > i {}
    }
  }
}
</style>
