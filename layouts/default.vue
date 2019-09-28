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
    <Updater />
  </div>
</template>

<script lang="ts">
import $ from 'jquery'
import { ipcRenderer } from 'electron'
import { Vue, Component } from 'nuxt-property-decorator'
import Header from '../components/Header.vue'
import LaunchPad from '../components/LaunchPad.vue'
import SidebarLayer from '../components/Layers/SidebarLayer.vue'
import NotifyLayer from '../components/Layers/NotifyLayer.vue'
import DialogLayer from '../components/Layers/DialogLayer.vue'
import Updater from '../components/Updater.vue'
import Tab from '~/core/models/Tab'
import TaskModel from '~/core/models/Task'
import AppData from '~/core/AppData'
import Utils from '~/core/Utils'

@Component({
  components: { Header, LaunchPad, SidebarLayer, NotifyLayer, DialogLayer, Updater }
})
export default class extends Vue {
  appData: AppData = new AppData()

  created () {
    (window as any).$ = $;
    (window as any).AppWidget = Utils;
    (window as any).$app = this
    Vue.prototype.$appData = this.appData

    // 打开 开发者工具
    $(document).keydown((e) => {
      if (e.altKey && e.keyCode === 123) {
        ipcRenderer.send('open-dev-tools')
      }
    })
  }

  mounted () {
  }
}
</script>
