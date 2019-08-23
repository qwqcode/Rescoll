<template>
  <div v-if="!!task" class="task-wrap">
    <Terminal :task="task" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import Tab from '~/core/models/Tab'
import Task from '~/core/models/Task'
import Terminal from '~/components/Task/Terminal.vue'

@Component({ components: { Terminal } })
export default class extends Vue {
  taskId?: string
  task?: Task

  created () {
    this.taskId = this.$route.params.id
    const task = this.$appData.taskList.find(o => o.id === this.taskId)
    if (!task) {
      this.$router.replace('/')
      return
    }
    this.task = task
  }

  mounted () {
    this.$launchPad.hide()
  }
}
</script>

<style lang="scss" scoped>
.task-wrap {}
</style>
