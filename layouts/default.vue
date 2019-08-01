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
import { Vue, Component } from 'nuxt-property-decorator'
import Header from '../components/base/Header.vue'
import NavSidebar from '../components/base/NavSidebar.vue'
import SidebarLayer from '../components/base/Sidebars/_SidebarLayer.vue'

@Component({
  components: { Header, NavSidebar, SidebarLayer }
})
export default class extends Vue {}
</script>
