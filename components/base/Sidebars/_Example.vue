<template>
  <Sidebar name="example" title="实例" :class="{ 'show': $store.state.ui.sidebar === 'example' }">
    <div class="example">
      SidebarBody
    </div>
  </Sidebar>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import Sidebar from './_Sidebar.vue'

@Component({
  components: { Sidebar }
})
export default class Settings extends Vue {
  created () {
  }

  mounted () {
  }
}
</script>

<style lang="scss" scoped>
.example {
  color: deepskyblue;
}
</style>
