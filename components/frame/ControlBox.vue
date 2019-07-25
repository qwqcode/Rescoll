<template>
  <div class="control-box" :class="{ blur: isBlur }">
    <div class="inner">
      <div class="brand">RESCOLL</div>
      <div class="controls">
        <div class="window-icon-bg" @click="minimize">
          <div class="window-icon window-minimize"></div>
        </div>
        <div class="window-icon-bg" @click="maximize">
          <div
            :class="{
              'window-icon': true,
              'window-maximize': !isMaximized,
              'window-unmaximize': isMaximized
            }"
          ></div>
        </div>
        <div class="window-icon-bg red" @click="close">
          <div class="window-icon window-close"></div>
        </div>
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

  mounted() {
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

  maximize() {
    /* if (win.isMaximized()) {
      win.unmaximize()
    } else {
      win.maximize()
    } */
  }

  minimize() {
    // win.minimize()
  }

  close() {
    // win.close()
  }
}
</script>

<style lang="scss" scoped>
.control-box {
  @extend %top-bar;
  z-index: 101;
  top: 1px;
  height: 29px;
  background-color: #21252b;

  &.blur {
    background-color: #21252b;
  }
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
  padding: 2px 22px 2px 14px;
  background-color: rgba(255, 255, 255, 0.05);
  position: absolute;
  top: -1px;
  left: 10px;
  font-size: 17px;
  color: #fff;
  font-family: 'SAOUI';
  border-top: 1px solid #808080;
}

.controls {
  display: flex;
  width: 136px;
  height: 29px;
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
      background-color: #9da5b4;
      $iconBasePath: '~@/assets/img/icons';

      &.window-minimize {
        mask: url($iconBasePath+'/minimize.svg') no-repeat 50% 50%;
      }

      &.window-maximize {
        mask: url($iconBasePath+'/maximize.svg') no-repeat 50% 50%;
      }

      &.window-unmaximize {
        mask: url($iconBasePath+'/unmaximize.svg') no-repeat 50% 50%;
      }

      &.window-close {
        mask: url($iconBasePath+'/close.svg') no-repeat 50% 50%;
      }
    }

    &:hover {
      background-color: hsla(0, 0%, 100%, 0.1);

      .window-icon {
        background-color: #ffffff;
      }
    }

    &.red:hover {
      background-color: rgba(232, 17, 35, 0.9);
    }
  }
}
</style>
