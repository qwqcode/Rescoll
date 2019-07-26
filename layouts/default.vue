<template>
  <div class="app-main">
    <ControlBox></ControlBox>
    <TabBar></TabBar>
    <NavSidebar></NavSidebar>
    <div class="app-page-wrap">
      <nuxt />
    </div>
    <SidebarLayer></SidebarLayer>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import ControlBox from '../components/frame/ControlBox.vue'
import TabBar from '../components/frame/TabBar.vue'
import NavSidebar from '../components/frame/NavSidebar.vue'
import SidebarLayer from '../components/frame/SidebarLayer.vue'

@Component({
  components: { ControlBox, TabBar, NavSidebar, SidebarLayer }
})
export default class extends Vue {}
</script>
