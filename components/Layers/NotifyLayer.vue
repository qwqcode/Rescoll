<template>
  <div class="notify-layer" />
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component
export default class NotifyLayer extends Vue {
  created () {
    Vue.prototype.$notify = this
  }

  add (message: string, level?: string, timeout: number = 1000): void {
    window.console.log(`[notify][${level}][${new Date().toLocaleString()}] ${message}`)

    const notifyElem = document.createElement('div')
    notifyElem.className = `notify-item anim-fade-in ${(level ? 'type-' + level : '')}`
    notifyElem.innerHTML = `<p class="notify-content">${message.replace('\n', '<br/>')}</p>`
    this.$el.prepend(notifyElem)

    const notifyRemove = function () {
      notifyElem.className += ' anim-fade-out'
      window.setTimeout(function () {
        notifyElem.remove()
      }, 200)
    }

    const timeOutFn = window.setTimeout(() => {
      notifyRemove()
    }, timeout)

    notifyElem.onclick = () => {
      window.clearTimeout(timeOutFn)
      notifyRemove()
    }
  }

  success (message: string) {
    this.add(message, 's')
  }

  error (message: string) {
    this.add(message, 'e')
  }

  warning (message: string) {
    this.add(message, 'w')
  }

  info (message: string) {
    this.add(message, 'i')
  }
}
</script>

<style lang="scss" scoped>
.notify-layer {
  $width: 600px;

  position: fixed;
  z-index: 9999;
  top: 80px;
  left: calc(50vw - (#{$width} / 2));
  width: $width;
  pointer-events: none;

  /deep/ .notify-item {
    display: block;
    overflow: hidden;
    background-color: #2c2c2c;
    border-color: #2c2c2c;
    color: #FFF;
    cursor: pointer;
    pointer-events: all;
    border-radius: 1px;

    &:not(:last-child) {
      margin-bottom: 13px;
    }

    &.type-s {
      color: #FFF;
      background: rgba(87, 213, 159, 0.83);
    }

    &.type-e {
      color: #FFF;
      background: rgba(255, 111, 108, 0.83);
    }

    &.type-w {
      color: #FFF;
      background: rgba(255, 199, 33, 0.83);
    }

    &.type-i {
      color: #FFF;
      background: rgba(46, 188, 252, 0.83);
    }

    p {
      line-height: 1.8;
      padding: 6px 20px;
      margin: 0;
      text-align: center;
    }
  }
}
</style>
