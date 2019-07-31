<template>
  <div class="sidebar">
    <!-- Header -->
    <div class="header">
      <div class="left">
        {{ title }}
      </div>
      <div class="right">
        <span class="close-btn"><i class="zmdi zmdi-close" /></span>
      </div>
    </div>
    <!-- Content -->
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class Sidebar extends Vue {
  @Prop({ required: true, type: String }) title!: string
}
</script>

<style lang="scss" scoped>
.sidebar {
  position: fixed;
  z-index: 998;
  width: 360px;
  top: 65px;
  height: calc(100vh - 65px);
  right: 0;
  color: rgba(0, 0, 0, 0.87);
  background: #fff;
  transition: transform 0.45s cubic-bezier(0.23, 1, 0.32, 1) 0ms;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.16), 0 3px 10px rgba(0, 0, 0, 0.23);
  border-radius: 0;
  padding: 0;
  transform: translate(370px);

  &.show {
    transform: translate(0) !important;
  }

  $header-height: 50px;

  .header {
    background-color: #2196f3;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.12);
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: $header-height;
    padding: 0 15px;

    & > * {
      display: flex;
      font-size: 16px;
      color: #fff;
    }

    .close-btn {
      background: transparent;
      border: none;
      padding: 0;
      margin: 0;
      color: #fff;
      cursor: pointer;
      width: 25px;
      height: 25px;
      outline: none;
    }
  }

  .content {
    overflow-x: hidden;
    overflow-y: auto;
    width: 100%;
    height: calc(100% - #{$header-height});
  }
}
</style>
