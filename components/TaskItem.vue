<template>
  <div v-if="task !== undefined" class="tasks">
    {{ task.id }}
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import TaskModel from '~/core/models/Task'

@Component
export default class TaskItem extends Vue {
  @Prop({
    required: true
  }) task?: TaskModel
}
</script>

<style lang="scss" scoped>

</style>
