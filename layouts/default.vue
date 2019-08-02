<template>
  <div class="app-main">
    <Header />
    <NavSidebar />
    <div class="app-page-wrap">
      <nuxt />
    </div>
    <SidebarLayer />
    <Notifications />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import Header from '../components/base/Header.vue'
import NavSidebar from '../components/base/NavSidebar.vue'
import SidebarLayer from '../components/base/Sidebars/_SidebarLayer.vue'
import Notifications from '../components/base/Notifications.vue'

@Component({
  components: { Header, NavSidebar, SidebarLayer, Notifications }
})
export default class extends Vue {
  mounted () {
  }
}
</script>
