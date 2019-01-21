<template>
  <div class="workspace-block" ref="block">
    MODULE {{ id }}
  </div>
</template>

<script>
export default {
  name: 'workspace-block',
  data () {
    return {
      id: null
    }
  },
  mounted () {
    this.id = Date.now()

    this.el = this.$refs.block

    this.dragMove = false
    this.curPos = {x: 0, y: 0, ox: 0, oy: 0}

    window.addEventListener('mousedown', this.onMouseDown, 0)
    window.addEventListener('mousemove', this.onMouseMove, 0)
    window.addEventListener('mouseup', this.onMouseUp, 0)
  },
  destroyed () {
    window.removeEventListener('mousedown', this.onMouseDown)
    window.removeEventListener('mousemove', this.onMouseMove)
    window.removeEventListener('mouseup', this.onMouseUp)
  },
  methods: {
    onMouseDown (e) {
      if (e.target !== this.el) {
        return false
      }

      this.curPos.x = e.clientX
      this.curPos.y = e.clientY
      this.curPos.ox = Number(this.el.style.left.replace('px', ''))
      this.curPos.oy = Number(this.el.style.top.replace('px', ''))

      this.dragMove = true
      // console.log('[onMouseDown] ', e.clientX, e.clientY)

      e.preventDefault()
    },
    onMouseMove (e) {
      if (!this.dragMove) {
        return false
      }

      let mX = this.curPos.ox + (e.clientX - this.curPos.x) * this.$parent.$refs.canvas.clientWidth / this.$parent.$refs.canvas.getBoundingClientRect().width
      let mY = this.curPos.oy + (e.clientY - this.curPos.y) * this.$parent.$refs.canvas.clientHeight / this.$parent.$refs.canvas.getBoundingClientRect().height

      this.el.style.left = `${Math.round(mX)}px`
      this.el.style.top = `${Math.round(mY)}px`
      // console.log('[onMouseMove] ', e.clientX, e.clientY)

      e.preventDefault()
    },
    onMouseUp () {
      if (this.dragMove) {
        this.dragMove = false
      }
    }
  }
}
</script>


<style lang="scss" scoped>
.workspace-block {
  position: absolute;
  user-select: none;
  padding: 5px 20px;
  border: 1px solid rgb(54, 138, 255);
  background: #0083ff;
  text-align: center;
  border-radius: 1px;
  box-shadow: 0 1px 3px rgba(0,0,0,.12);
  left: 0;
  top: 0;
  cursor: default;
  transform: translate(9880.5px, 9983.5px);
}
</style>
