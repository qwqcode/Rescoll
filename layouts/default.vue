<template>
  <div class="app-main">
    <Header />
    <NavSidebar />
    <div class="app-page-wrap">
      <nuxt />
    </div>
    <SidebarLayer />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Header from '../components/frame/Header.vue'
import NavSidebar from '../components/frame/NavSidebar.vue'
import SidebarLayer from '../components/frame/SidebarLayer.vue'

@Component({
  components: { Header, NavSidebar, SidebarLayer }
})
export default class extends Vue {}
</script>
