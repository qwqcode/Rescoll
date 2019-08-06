import TaskModel from '~/core/models/Task'
import LaunchPad from '~/components/LaunchPad.vue'
import NotifyLayer from '~/components/Layers/NotifyLayer.vue'
import DialogLayer from '~/components/Layers/DialogLayer.vue'
import HeaderTabBox from '~/components/HeaderTabBox.vue'

declare module 'vue/types/vue' {
  interface Vue {
    $taskList: TaskModel[]
    $launchPad: LaunchPad
    $notify: NotifyLayer
    $dialog: DialogLayer
    $tabBox: HeaderTabBox
  }
}
