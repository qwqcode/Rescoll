<template>
  <div class="workspace" @mousedown="onMouseDown" @mousemove="onMouseMove" @mouseup="onMouseUp">
    <div class="workspace-canvas"><div class="233" style="width: 100px;height: 20px;background: rgb(76, 151, 255);text-align: center;border-radius: 3px;left: 200px;top: 200px;position: absolute;">233</div></div>
    <div class="float-btns">
      <button type="button" @click="zoomIn">+</button>
      <button type="button" @click="zoomOut">-</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'wrokspace',
  data () {
    return {
      canvasEl: null,
      dragMode: false,
      drag: {startX: 0, startY: 0},
      scale_: 1,
      lastTransform: {x: 0, y: 0}
    }
  },
  mounted () {
    this.canvasEl = document.querySelector('.workspace-canvas')
    // this.update(1.0)
  },
  methods: {
    moveTo (x, y) {
      this.setTransform(null, x, y)
    },

    zoomIn () {
      this.setTransform(this.scale_ + 0.5, null, null)
    },

    zoomOut () {
      this.setTransform(this.scale_ - 0.5, null, null)
    },

    onMouseDown (e) {
      this.dragMode = true
      this.drag.startX = e.pageX - this.lastTransform.x
      this.drag.startY = e.pageY - this.lastTransform.y
    },

    onMouseMove (e) {
      e.preventDefault()
      if (!this.dragMode) {
        return false
      }

      let newDx = e.pageX - this.drag.startX
      let newDy = e.pageY - this.drag.startY

      this.moveTo(newDx, newDy)
    },

    onMouseUp () {
      if (this.dragMode) {
        this.dragMode = false
      }
    },

    setTransform (scale, transformX, transformY) {
      this.scale_ = scale || this.scale_
      this.lastTransform.x = transformX || this.lastTransform.x
      this.lastTransform.y = transformY || this.lastTransform.y
      this.canvasEl.style.transform = `scale(${this.scale_})` // translate(${this.lastTransform.x}px, ${this.lastTransform.y}px)
      this.canvasEl.style.top = this.lastTransform.y + 'px'
      this.canvasEl.style.left = this.lastTransform.x + 'px'
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

.workspace-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #F9F9F9;
  outline: none;
  overflow: hidden;
  background: url('~@/assets/grid-points.svg') repeat
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
