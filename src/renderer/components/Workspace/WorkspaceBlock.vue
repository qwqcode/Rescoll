<template>
  <div class="workspace-block" ref="block">
    233
  </div>
</template>

<script>
const PlainDraggable = window.PlainDraggable

export default {
  name: 'workspace-block',
  data () {
    return {
    }
  },
  mounted () {
    this.el = this.$refs.block

    this.draggable = new PlainDraggable(this.el, { containment: this.$parent.$refs.canvas })
    this.draggable.autoScroll = this.$parent.$refs.canvasWrap // 拖动到边界自动滚动
  },
  destroyed () {
  },
  methods: {
  }
}
</script>


<style lang="scss" scoped>
.workspace-block {
  position: absolute;
  user-select: none;
  width: 100px;
  height: 20px;
  background: rgb(76, 151, 255);
  text-align: center;
  border-radius: 3px;
  left: 0;
  top: 0;
}
</style>
