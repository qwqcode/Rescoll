<template>
  <div class="tab-box" @mousewheel="tabBoxMouseWheel">
    <div v-if="$tabBox.count() > 0" class="tab fixed" @click="$launchPad.toggle()">
      <div class="add-btn">
        <i class="zmdi zmdi-view-carousel" />
      </div>
    </div>
    <div v-for="(tab, i) in tabList" :key="i" class="tab" :class="{ 'active': tab.isActive }">
      <div class="name">
        {{ tab.name }}
      </div>
      <div class="close-btn">
        <i class="zmdi zmdi-close" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import Tab from '~/core/models/Tab'

@Component
export default class HeaderTabBox extends Vue {
  tabList: Tab[] = []

  created () {
    Vue.prototype.$tabBox = this
  }

  tabBoxMouseWheel (e: WheelEvent) {
    const delta = Math.max(-1, Math.min(1, -e.deltaY))
    const el = e.currentTarget as HTMLElement
    el.scrollLeft -= (delta * 40)
    e.preventDefault()
  }

  push (tab: Tab) {
    this.tabList.push(tab)
  }

  remove (tab: Tab) {
    if (this.tabList.indexOf(tab) <= -1) {
      throw new Error('tab Not found')
    }
    this.tabList.splice(this.tabList.indexOf(tab), 1)
  }

  count () {
    return this.tabList.length
  }
}
</script>

<style lang="scss" scoped>
$height: 35px;
$hover-bg: hsla(0, 0%, 100%, 0.1);
$bg: #21252b;

.tab-box {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: row;
  margin-top: 1px;
  padding-left: 10px;
  overflow: scroll !important;

  &::-webkit-scrollbar {
    height: 3px;
  }

  &::-webkit-scrollbar-corner {
    background: transparent;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.1);

    &:hover {
      background-color: rgba(255, 255, 255, 0.3);
    }
  }

  .tab {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: $height;
    width: 140px;
    min-width: fit-content;
    color: #FFF;
    white-space: nowrap;
    cursor: pointer;
    -webkit-app-region: no-drag;
    font-size: 12px;
    box-shadow: rgba(0, 0, 0, 0.12) 0px 6px 3px;
    transition: background 0.15s ease;

    &.active {
      background-color: #132b5a;
    }

    &:hover:not(.active) {
      background-color: $hover-bg;
    }

    &:not(:last-child) {
      margin-right: 1px;
    }

    & > .name {
      flex: 1;
      padding-left: 14px;
    }

    & > .close-btn {
      height: $height;
      line-height: $height;
      padding: 0 5px 0 5px;
      margin: 0 3px 0 0;
      justify-content: flex-end;

      & > i {
        transition: background 0.15s ease;
        border-radius: 100px;
        font-size: 14px;
        padding: 3px 6px;
      }

      &:hover > i {
        background-color: $hover-bg;
      }
    }

    &.fixed {
      width: $height;
      height: $height;
      min-width: $height;

      & > .add-btn {
        width: 100%;
        text-align: center;
        font-size: 12px;
      }
    }
  }
}
</style>
