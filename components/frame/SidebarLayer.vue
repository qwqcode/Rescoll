<template>
  <div class="sidebar-layer show">
    <Settings />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Settings from './sidebar/Settings.vue'

@Component({
  components: { Settings }
})
export default class SidebarLayer extends Vue {}
</script>

<style lang="scss" scoped>
.sidebar-layer {
  @extend %app-layer;
}
</style>
