import TaskModel from '~/core/models/Task'
import LaunchPad from '~/components/LaunchPad.vue'
import NotifyLayer from '~/components/Layers/NotifyLayer.vue'
import DialogLayer from '~/components/Layers/DialogLayer.vue'
import HeaderTabBox from '~/components/HeaderTabBox.vue'
import AppData from '~/core/AppData'

declare module 'vue/types/vue' {
  interface Vue {
    $launchPad: LaunchPad
    $notify: NotifyLayer
    $dialog: DialogLayer
    $tabBox: HeaderTabBox
    $appData: AppData
  }
}
