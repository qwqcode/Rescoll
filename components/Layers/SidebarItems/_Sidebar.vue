<template>
  <transition name="slide">
    <div v-if="$store.state.ui.sidebar === name" ref="sidebar" class="sidebar">
      <!-- Header -->
      <div class="header">
        <div class="left">
          {{ title }}
        </div>
        <div class="right">
          <span class="close-btn" @click="close"><i class="zmdi zmdi-close" /></span>
        </div>
      </div>
      <!-- Content -->
      <div class="content">
        <slot />
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component
export default class Sidebar extends Vue {
  @Prop({ required: true, type: String }) title!: string
  @Prop({ required: true, type: String }) name!: string

  close () {
    this.$store.commit('ui/setSidebar', null)
  }
}
</script>

<style lang="scss" scoped>
.slide-enter-active, .slide-leave-active {
  transition: transform 0.45s cubic-bezier(0.23, 1, 0.32, 1) 0ms;
}

.slide-enter, .slide-leave-to {
  transform: translate(370px) !important;
}

.sidebar {
  position: fixed;
  z-index: 998;
  width: 360px;
  top: 65px;
  height: calc(100vh - 65px);
  right: 0;
  color: rgba(0, 0, 0, 0.87);
  background: #fff;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.16), 0 3px 10px rgba(0, 0, 0, 0.23);
  border-radius: 0;
  padding: 0;
  transform: translate(0);

  $header-height: 50px;

  .header {
    background-color: #008eff;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.12);
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: $header-height;
    padding: 0 15px 0 20px;

    & > * {
      display: flex;
      font-size: 16px;
      color: #fff;
    }

    .close-btn {
      background-color: transparent;
      color: #fff;
      cursor: pointer;
      width: 25px;
      height: 25px;
      line-height: 25px;
      text-align: center;
      border-radius: 3px;
      transition: background 0.15s ease;

      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
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
