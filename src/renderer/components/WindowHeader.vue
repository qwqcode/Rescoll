<template>
  <header class="header" :class="{ blur: isBlur }">
    <div class="header-inner">
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
  </header>
</template>

<script>
import { remote } from 'electron'

let win = remote.getCurrentWindow()

export default {
  name: 'window-header',
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
.header {
  position: fixed;
  top: 1px;
  left: 1px;
  right: 1px;
  z-index: 100;
  height: 34px;
  width: 100%;
  background: rgb(40, 44, 52);

  &.blur {
    background: rgb(40, 44, 52);
  }
}

.header-inner {
  height: 34px;
  width: 100%;
  position: fixed;
  top: 1px;
  left: 1px;
  right: 1px;
  -webkit-app-region: drag;
  user-select: none;
  display: flex;
  justify-content: center;
  align-items: center;
}

.controls {
  display: flex;
  width: 136px;
  height: 34px;
  justify-content: space-between;
  position: fixed;
  right: 0px;

  .window-icon-bg {
    display: inline-block;
    -webkit-app-region: no-drag;
    height: 100%;
    width: 33.34%;

    .window-icon {
      height: 100%;
      width: 100%;
      -webkit-mask-size: 23.1%;
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
    }

    &.red:hover {
      background-color: rgba(232,17,35,.9);
    }
  }
}
</style>
