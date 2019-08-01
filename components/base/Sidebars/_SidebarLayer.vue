<template>
  <div class="sidebar-layer" :class="{ 'show': $store.state.ui.sidebar !== null }">
    <Settings />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import Settings from './Settings.vue'

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
