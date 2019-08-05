import NotifyLayer from '~/components/Layers/NotifyLayer.vue'
import DialogLayer from '~/components/Layers/DialogLayer.vue'
import HeaderTabBox from '~/components/HeaderTabBox.vue'

declare module 'vue/types/vue' {
  interface Vue {
    $notify: NotifyLayer
    $dialog: DialogLayer
    $tabBox: HeaderTabBox
  }
}
