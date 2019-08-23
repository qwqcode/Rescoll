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
      <HeaderTabBox />

      <div class="btn-group">
        <span class="btn" @click="() => { $notify.info('文件管理器，敬请期待') }">
          <i class="zmdi zmdi-folder-outline" />
        </span>
        <span class="btn" @click="() => { $store.commit('ui/setSidebar', 'downloads'); downloadsNum = 0 }">
          <i class="zmdi zmdi-download" />
          <span v-if="downloadsNum > 0" class="btn-badge">{{ downloadsNum }}</span>
        </span>
        <span class="btn" @click="() => { $store.commit('ui/setSidebar', 'settings') }">
          <i class="zmdi zmdi-settings" />
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator'
import HeaderTabBox from './HeaderTabBox.vue'

@Component({
  components: { HeaderTabBox }
})
export default class Header extends Vue {
  isBlur: boolean = false
  isMaximized: boolean = false
  downloadsNum = 0

  created () {
    Vue.prototype.$header = this
  }

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
    (window as any).AppAction.appMaxMini()
  }

  minimize () {
    // win.minimize()
    (window as any).AppAction.appMin()
  }

  close () {
    // win.close()
    /* if (!!App.AppUpdate.panel && App.AppUpdate.panel.isUpdating) {
      this.$notify.error(`Nacollector 正在升级中，暂时无法退出，请稍等片刻`)
      return
    } */

    const dlInProgressNum = this.$downloads.inProgressNum // 正在执行的下载任务数
    if (dlInProgressNum > 0) {
      this.$dialog.open('退出 Nacollector', `有 ${dlInProgressNum} 个下载任务仍在继续！是否结束下载并退出 Nacollector？`, ['确定', () => {
        (window as any).AppAction.appClose()
      }], ['取消'])
    } else {
      try {
        (window as any).AppAction.appClose()
      } catch {
        console.error('AppAction.appClose 调用失败')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$hover-bg: hsla(0, 0%, 100%, 0.1);
$bg: #1565c0;

.app-header {
  user-select: none;
}

.app-control-box {
  $height: 30px;

  @extend %app-top-bar;
  z-index: 99999;
  top: 0;
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
    justify-content: space-between;
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

/deep/ .app-action-bar {
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

  .btn-group {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;

    .btn {
      position: relative;
      width: 50px;
      height: $height;
      line-height: $height;
      color: #fff;
      font-size: 15px;
      text-align: center;
      cursor: pointer;
      user-select: none;
      -webkit-app-region: no-drag;
      transition: background 0.15s ease;

      &:hover {
        background-color: $hover-bg;
      }

      & > i {
      }

      & > .btn-badge {
        position: absolute;
        top: 1px;
        right: 7px;
        pointer-events: none;
        background: rgba(255, 64, 61, 0.774);
        height: 13px;
        line-height: 10px;
        padding: 1px 4px;
        font-size: 12px;
        border-radius: 2px;
      }
    }
  }
}
</style>
