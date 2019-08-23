import Marked from 'marked'
import TaskModel from '~/core/models/Task'
import Header from '~/components/Header.vue'
import LaunchPad from '~/components/LaunchPad.vue'
import NotifyLayer from '~/components/Layers/NotifyLayer.vue'
import DialogLayer from '~/components/Layers/DialogLayer.vue'
import HeaderTabBox from '~/components/HeaderTabBox.vue'
import AppData from '~/core/AppData'
import Downloads from '~/components/Layers/SidebarItems/Downloads.vue'
import Settings from '~/components/Layers/SidebarItems/Settings.vue'
import Updater from '~/components/Updater.vue'

declare module 'vue/types/vue' {
  interface Vue {
    $header: Header
    $launchPad: LaunchPad
    $notify: NotifyLayer
    $dialog: DialogLayer
    $tabBox: HeaderTabBox
    $appData: AppData
    $downloads: Downloads
    $settings: Settings
    $updater: Updater

    marked: (src: string, callback: (error: any, parseResult: string) => void) => string
  }
}
