<template>
  <div class="app-main">
    <Header />
    <div class="app-page-wrap">
      <nuxt />
    </div>
    <LaunchPad />
    <SidebarLayer />
    <NotifyLayer />
    <DialogLayer />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import Header from '../components/Header.vue'
import LaunchPad from '../components/LaunchPad.vue'
import SidebarLayer from '../components/Layers/SidebarLayer.vue'
import NotifyLayer from '../components/Layers/NotifyLayer.vue'
import DialogLayer from '../components/Layers/DialogLayer.vue'
import Tab from '~/core/models/Tab'

@Component({
  components: { Header, LaunchPad, SidebarLayer, NotifyLayer, DialogLayer }
})
export default class extends Vue {
  mounted () {
    this.$tabBox.push(new Tab('233', ''))
  }
}
</script>
