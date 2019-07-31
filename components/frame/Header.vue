<template>
  <div class="app-header">
    <div
      class="app-control-box"
      :class="{
        'blur': isBlur
      }"
    >
      <div class="inner">
        <div class="brand">
          RESCOLL
        </div>
        <div class="controls">
          <div class="window-icon-bg" @click="minimize">
            <div class="window-icon window-minimize" />
          </div>
          <div class="window-icon-bg" @click="maximize">
            <div
              :class="{
                'window-icon': true,
                'window-maximize': !isMaximized,
                'window-unmaximize': isMaximized
              }"
            />
          </div>
          <div class="window-icon-bg red" @click="close">
            <div class="window-icon window-close" />
          </div>
        </div>
      </div>
    </div>

    <div class="app-action-bar">
      <div class="tab-box" @mousewheel="tabBoxMouseWheel">
        <div class="tab active">
          <div class="name">
            首页
          </div><div class="close-btn">
            <i class="zmdi zmdi-close" />
          </div>
        </div>
        <div class="tab">
          <div class="name">
            [结束] 商品详情页图片解析
          </div><div class="close-btn">
            <i class="zmdi zmdi-close" />
          </div>
        </div>
        <div class="tab">
          <div class="name">
            [执行中] 商品详情页视频抓取
          </div><div class="close-btn">
            <i class="zmdi zmdi-close" />
          </div>
        </div>
        <div class="tab">
          <div class="name">
            [结束] 淘宝店铺搜索卖家ID名采集
          </div><div class="close-btn">
            <i class="zmdi zmdi-close" />
          </div>
        </div>
        <div class="tab fixed">
          <div class="add-btn">
            <i class="zmdi zmdi-plus" />
          </div>
        </div>
      </div>
      <div class="btn-group">
        <span class="btn">
          <i class="zmdi zmdi-folder-outline" />
        </span>
        <span class="btn">
          <i class="zmdi zmdi-download" />
        </span>
        <span class="btn">
          <i class="zmdi zmdi-settings" />
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class ControlBox extends Vue {
  isBlur: boolean = false
  isMaximized: boolean = false

  mounted () {
    /* win.on('blur', () => {
      this.isBlur = true
    })

    win.on('focus', () => {
      this.isBlur = false
    })

    win.on('maximize', () => {
      this.isMaximized = true
    })

    win.on('unmaximize', () => {
      this.isMaximized = false
    }) */
  }

  maximize () {
    /* if (win.isMaximized()) {
      win.unmaximize()
    } else {
      win.maximize()
    } */
  }

  minimize () {
    // win.minimize()
  }

  close () {
    // win.close()
  }

  tabBoxMouseWheel (e: WheelEvent) {
    const delta = Math.max(-1, Math.min(1, -e.deltaY))
    const el = e.currentTarget as HTMLElement
    el.scrollLeft -= (delta * 40)
    e.preventDefault()
  }
}
</script>

<style lang="scss" scoped>
$hover-bg: hsla(0, 0%, 100%, 0.1);
$bg: #21252b;

.app-header {
  user-select: none;
}

.app-control-box {
  $height: 29px;

  @extend %app-top-bar;
  z-index: 102;
  top: 1px;
  height: $height;
  background-color: $bg;

  &.blur {
    background-color: $bg;
  }

  .inner {
    position: relative;
    width: 100%;
    height: 100%;
    -webkit-app-region: drag;
    user-select: none;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .brand {
    padding: 1px 22px 1px 15px;
    background-color: rgba(255, 255, 255, 0.05);
    position: absolute;
    top: -1px;
    left: 10px;
    font-size: 16px;
    color: #fff;
    font-family: 'SAOUI';
    border-top: 1px solid #808080;
  }

  .controls {
    display: flex;
    width: 136px;
    height: $height;
    justify-content: space-between;
    position: absolute;
    top: 0;
    right: 0px;

    .window-icon-bg {
      display: inline-block;
      -webkit-app-region: no-drag;
      height: 100%;
      width: 33.34%;

      .window-icon {
        height: 100%;
        width: 100%;
        -webkit-mask-size: 23.2% !important;
        background-color: #FFF;
        $iconBasePath: '~@/assets/img/icons';

        &.window-minimize {
          -webkit-mask: url($iconBasePath+'/minimize.svg') no-repeat 50% 50%;
        }

        &.window-maximize {
          -webkit-mask: url($iconBasePath+'/maximize.svg') no-repeat 50% 50%;
        }

        &.window-unmaximize {
          -webkit-mask: url($iconBasePath+'/unmaximize.svg') no-repeat 50% 50%;
        }

        &.window-close {
          -webkit-mask: url($iconBasePath+'/close.svg') no-repeat 50% 50%;
        }
      }

      &:hover {
        background-color: $hover-bg;

        .window-icon {
          background-color: #ffffff;
        }
      }

      &.red:hover {
        background-color: rgba(232, 17, 35, 0.9);
      }
    }
  }
}

.app-action-bar {
  $height: 35px;

  @extend %app-top-bar;
  z-index: 103;
  top: 30px;
  height: $height;
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: $bg;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 6px 3px, rgba(0, 0, 0, 0.12) 0px 1px 1px;
  -webkit-app-region: drag;

  .tab-box {
    position: relative;
    flex: 1;
    display: flex;
    flex-direction: row;
    margin-top: 1px;
    padding-left: 10px;
    overflow: scroll !important;

    &::-webkit-scrollbar {
      height: 3px;
    }

    &::-webkit-scrollbar-corner {
      background: transparent;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background-color: rgba(255, 255, 255, 0.1);

      &:hover {
        background-color: rgba(255, 255, 255, 0.3);
      }
    }

    .tab {
      display: flex;
      flex-direction: row;
      align-items: center;
      height: $height;
      width: 140px;
      min-width: fit-content;
      color: #FFF;
      white-space: nowrap;
      cursor: default;
      -webkit-app-region: no-drag;
      font-size: 12px;
      box-shadow: rgba(0, 0, 0, 0.12) 0px 6px 3px;

      &.active {
        background-color: #132b5a;
      }

      &:hover:not(.active) {
        background-color: $hover-bg;
      }

      &:not(:last-child) {
        margin-right: 1px;
      }

      & > .name {
        flex: 1;
        padding-left: 14px;
      }

      & > .close-btn {
        height: $height;
        line-height: $height;
        padding: 0 5px 0 5px;
        margin: 0 3px 0 0;
        justify-content: flex-end;

        & > i {
          border-radius: 100px;
          font-size: 14px;
          padding: 3px 6px;
        }

        &:hover > i {
          background-color: $hover-bg;
        }
      }

      &.fixed {
        width: $height;
        height: $height;
        min-width: $height;

        & > .add-btn {
          width: 100%;
          text-align: center;
          font-size: 15px;
        }
      }
    }
  }

  .btn-group {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;

    .btn {
      width: 50px;
      height: $height;
      line-height: $height;
      color: #fff;
      font-size: 15px;
      text-align: center;
      cursor: pointer;
      user-select: none;
      -webkit-app-region: no-drag;

      &:hover {
        background-color: $hover-bg;
      }

      & > i {
      }
    }
  }
}
</style>
