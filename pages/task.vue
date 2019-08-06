<template>
  <div class="task-wrap">
    <Terminal />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import Tab from '~/core/models/Tab'
import TaskModel from '~/core/models/Task'
import TaskBuilder from '~/components/Task/TaskBuilder.vue'
import Terminal from '~/components/Task/Terminal.vue'

@Component({ components: { TaskBuilder, Terminal } })
export default class extends Vue {
  mounted () {
    this.$launchPad.hide()
    this.$tabBox.push(new Tab('TEST', '/task'))
  }
}
</script>

<style lang="scss" scoped>
.task-wrap {}
</style>
