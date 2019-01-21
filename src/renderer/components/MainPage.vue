<template>
  <div class="main-page-wrap">
    <title-bar></title-bar>
    <action-bar></action-bar>
    <task-sidebar></task-sidebar>
    <div class="main-page">
233
    </div>
  </div>
</template>

<script>
import TitleBar from './top/TitleBar'
import ActionBar from './top/ActionBar'
import TaskSidebar from './sidebar/TaskSidebar'

export default {
  name: 'main-page',
  components: { TitleBar, ActionBar, TaskSidebar }
}
</script>
