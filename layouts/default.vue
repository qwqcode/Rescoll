<template>
  <div>
    <ControlBox></ControlBox>
    <TabBar></TabBar>
    <SideBar></SideBar>
    <nuxt />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import ControlBox from '../components/frame/ControlBox.vue'
import TabBar from '../components/frame/TabBar.vue'
import SideBar from '../components/frame/SideBar.vue'

@Component({
  components: { ControlBox, TabBar, SideBar }
})
export default class extends Vue {}
</script>
