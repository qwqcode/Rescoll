<template>
  <div class="sidebar-layer" :class="{ 'show': $store.state.ui.sidebar !== null }">
    <div ref="sidebars" class="sidebars">
      <Settings />
      <Downloads />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'nuxt-property-decorator'
import Settings from './SidebarItems/Settings.vue'
import Downloads from './SidebarItems/Downloads.vue'

@Component({
  components: { Settings, Downloads }
})
export default class SidebarLayer extends Vue {
  mounted () {
  }

  bindOutClickEvt (rawSidebarName: string) {
    window.setTimeout(() => {
      if (this.$store.state.ui.sidebar !== rawSidebarName) { return } // 若在前 130s 内 sidebar 的值发生改变，则阻止绑定，防卡死
      const elem = (this.$refs.sidebars as any)
      elem.onoutclick = () => {
        elem.onoutclick = null
        if (this.$store.state.ui.sidebar !== rawSidebarName) { return } // 若 sidebar 已发生改变，则无需再 set
        this.$store.commit('ui/setSidebar', null)
      }
    }, 130)
  }

  unbindOutClickEvt () {
    (this.$refs.sidebars as any).onoutclick = null
  }

  @Watch('$store.state.ui.sidebar')
  onSidebarNameChange (sidebarName: string|null) {
    if (sidebarName !== null) {
      this.bindOutClickEvt(sidebarName)
    } else {
      this.unbindOutClickEvt()
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebar-layer {
  @extend %app-layer;
}
</style>
