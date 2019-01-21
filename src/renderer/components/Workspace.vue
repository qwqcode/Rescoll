<template>
  <div class="workspace">
    <div class="workspace-canvas-wrap" ref="canvasWrap">
      <div class="workspace-canvas" ref="canvas">
        <workspace-block ref="startBlock"></workspace-block>
        <workspace-block></workspace-block>
      </div>
    </div>
    <div class="float-btns">
      <button type="button" @click="zoomIn">+</button>
      <button type="button" @click="zoomOut">-</button>
      <button type="button" @click="backToCenter">0</button>
    </div>
  </div>
</template>

<script>
import WorkspaceBlock from './Workspace/WorkspaceBlock.vue'
import { setTimeout } from 'timers'

export default {
  name: 'wrokspace',
  data () {
    return {
      scale_: 1
    }
  },
  components: { WorkspaceBlock },
  mounted () {
    this.canvasEl = this.$refs.canvas
    this.canvasWrapEl = this.$refs.canvasWrap
    // this.update(1.0)

    this.canvasDragMove = false
    this.canvasCurPos = {x: 0, y: 0}
    window.addEventListener('mousedown', this.onMouseDown, 0)
    window.addEventListener('mousemove', this.onMouseMove, 0)
    window.addEventListener('mouseup', this.onMouseUp, 0)

    this.canvasCenterPos = {x: this.canvasEl.offsetWidth / 2, y: this.canvasEl.offsetHeight / 2}
    this.screenCenterPos = {x: this.canvasWrapEl.offsetWidth / 2, y: this.canvasWrapEl.offsetHeight / 2}

    this.backToCenter()

    setTimeout(() => {
      let startBlockEl = this.$refs.startBlock.$el
      startBlockEl.style.transform = `translate(${this.canvasCenterPos.x - startBlockEl.offsetWidth / 2}px, ${this.canvasCenterPos.y - startBlockEl.offsetHeight / 2}px)`
    }, 80)
  },
  methods: {
    onMouseDown (e) {
      if (['workspace-canvas', 'workspace-canvas-wrap'].indexOf(e.target.className) <= -1) {
        return false
      }

      this.canvasCurPos.x = e.clientX
      this.canvasCurPos.y = e.clientY
      this.canvasDragMove = true

      e.preventDefault()
    },

    onMouseMove (e) {
      if (!this.canvasDragMove) {
        return false
      }

      this.canvasWrapEl.scrollLeft -= -this.canvasCurPos.x + (this.canvasCurPos.x = e.clientX)
      this.canvasWrapEl.scrollTop -= -this.canvasCurPos.y + (this.canvasCurPos.y = e.clientY)

      e.preventDefault()
    },

    onMouseUp () {
      if (this.canvasDragMove) {
        this.canvasDragMove = false
      }
    },

    backToCenter () {
      this.canvasWrapEl.scrollTo((this.canvasWrapEl.scrollWidth - this.canvasWrapEl.clientWidth) / 2, (this.canvasWrapEl.scrollHeight - this.canvasWrapEl.clientHeight) / 2)
    },

    zoomIn () {
      let multiple = 0.3

      this.scale_ += multiple
      this.canvasEl.style.transform = `scale(${this.scale_})`
    },

    zoomOut () {
      let multiple = 0.3
      if (this.scale_ <= multiple) {
        return false
      }

      this.scale_ -= multiple
      this.canvasEl.style.transform = `scale(${this.scale_})`
    }
  }
}
</script>

<style lang="scss" scoped>
.workspace {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.workspace-canvas-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: auto;
}

.workspace-canvas-wrap::-webkit-scrollbar {
  /* width: 0px;
  height: 0px; */
}

.workspace-canvas {
  width: 20000px;
  height: 20000px;
  background-color: #F9F9F9;
  outline: none;
  background-image: url('~@/assets/grid-points.svg');
  background-repeat: repeat;
  transition: transform 200ms;
  transform: scale(1);
  transform-origin: center;
}

.float-btns {
  position: absolute;
  right: 10px;
  bottom: 0;
  height: 120px;
  width: 30px;

  button {
    display: block;
    width: 100%;
    &:not(:last-child) {
      margin-bottom: 5px;
    }
  }
}
</style>
