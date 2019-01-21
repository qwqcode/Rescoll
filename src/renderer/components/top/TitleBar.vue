<template>
  <div class="title-bar" :class="{ blur: isBlur }">
    <div class="inner">
      <div class="brand">RESCOLL</div>
      <div class="controls">
        <div class="window-icon-bg" @click="minimize">
          <div class="window-icon window-minimize"></div>
        </div>
        <div class="window-icon-bg" @click="maximize">
          <div :class="{ 'window-icon': true, 'window-maximize': !this.isMaximized, 'window-unmaximize': this.isMaximized }"></div>
        </div>
        <div class="window-icon-bg red" @click="close">
          <div class="window-icon window-close"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { remote } from 'electron'

let win = remote.getCurrentWindow()

export default {
  name: 'title-bar',
  data () {
    return {
      isBlur: false,
      isMaximized: false
    }
  },
  mounted () {
    win.on('blur', () => {
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
    })
  },
  methods: {
    maximize () {
      if (win.isMaximized()) {
        win.unmaximize()
      } else {
        win.maximize()
      }
    },
    minimize () {
      win.minimize()
    },
    close () {
      win.close()
    }
  },
  computed: {
  }
}
</script>

<style lang="scss" scoped>
.title-bar {
  @extend %top-bar;
  top: 1px;
  height: 29px;
  z-index: 101;
  background: #21252b;

  &.blur {
    background: #21252b;
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
  background: rgba(255, 255, 255, 0.05);
  position: absolute;
  top: -1px;
  left: 10px;
  font-size: 17px;
  color: #FFF;
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
      -webkit-mask-size: 23.1% !important;
      background-color: #9da5b4;

      &.window-minimize {
        -webkit-mask: url(~@/assets/icons/minimize.svg) no-repeat 50% 50%;
      }

      &.window-maximize {
        -webkit-mask: url(~@/assets/icons/maximize.svg) no-repeat 50% 50%;
      }

      &.window-unmaximize {
        -webkit-mask: url(~@/assets/icons/unmaximize.svg) no-repeat 50% 50%;
      }

      &.window-close {
        -webkit-mask: url(~@/assets/icons/close.svg) no-repeat 50% 50%;
      }
    }

    &:hover {
      background-color: hsla(0,0%,100%,.1);

      .window-icon {
        background-color: #ffffff;
      }
    }

    &.red:hover {
      background-color: rgba(232,17,35,.9);
    }
  }
}
</style>
