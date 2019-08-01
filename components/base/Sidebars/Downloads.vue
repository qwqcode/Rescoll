<template>
  <Sidebar name="downloads" title="下载内容">
    <div class="downloads">
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
.downloads {
  color: deepskyblue;
}
</style>
