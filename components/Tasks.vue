<template>
  <div class="tasks">
    <TaskItem v-for="task in taskList" :key="task.id" :task="task" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import TaskItem from './TaskItem.vue'
import TaskModel from '~/core/models/Task'

@Component({ components: { TaskItem } })
export default class Tasks extends Vue {
  taskList: TaskModel[] = []
}
</script>

<style lang="scss" scoped>

</style>
