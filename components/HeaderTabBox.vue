<template>
  <div ref="tabBox" class="tab-box" @mousewheel="tabBoxMouseWheel">
    <div class="tab-grp fixed">
      <div v-if="$tabBox.count() > 0" class="tab" :class="{ 'active': $launchPad.isShow }" @click="$launchPad.toggle()">
        <div class="add-btn">
          <i class="zmdi zmdi-view-carousel" />
        </div>
      </div>
    </div>
    <transition-group name="tab-transition" tag="div" class="tab-grp">
      <div v-for="tab in tabList" :key="tab.name" class="tab" :class="{ 'active': tab.isActive }" style="animation-duration: 0.2s">
        <div class="name" @click="linkTo(tab)">
          {{ tab.label }}
        </div>
        <div class="close-btn" @click="closeTab(tab)">
          <i class="zmdi zmdi-close" />
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script lang="ts">
import $ from 'jquery'
import { Vue, Component, Watch } from 'nuxt-property-decorator'
import Tab from '~/core/models/Tab'
import Task from '~/core/models/Task'

@Component
export default class HeaderTabBox extends Vue {
  created () {
    Vue.prototype.$tabBox = this
  }

  get tabList () {
    return this.$appData.tabList
  }

  @Watch('tabList')
  onTabListChanged () {
    window.setTimeout(() => {
      const tabBox = $(this.$refs.tabBox)
      tabBox.scrollLeft((tabBox.outerWidth() || 0))
    }, 201)
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
    const tabIndex = this.tabList.indexOf(tab)
    if (tabIndex <= -1) {
      throw new TypeError('tab Not found')
    }

    // 退回到一个存在的 Tab
    if (tab.isActive) {
      const nxtTab = [
        this.tabList[tabIndex + 1], // 后一个 tab
        this.tabList[tabIndex - 1] // 前一个 tab
      ].find(o => o !== undefined)
      if (nxtTab) {
        this.linkTo(nxtTab)
      } else {
        this.$router.replace('/')
      }
    }

    this.tabList.splice(tabIndex, 1)
  }

  count () {
    return this.tabList.length
  }

  @Watch('$route.path')
  onRoutePathChanged (path: string) {
    const tab = this.tabList.find(o => o.location === path)
    if (tab) {
      this.setActive(tab)
    }
  }

  setActive (targetTab: Tab) {
    this.tabList.forEach((tabItem) => {
      tabItem.isActive = tabItem === targetTab
    })
  }

  linkTo (tab: Tab) {
    this.$launchPad.hide()
    this.$router.replace(tab.location)
  }

  closeTab (tab: Tab) {
    const result = tab.onClosing !== undefined ? tab.onClosing() : undefined
    if (typeof result === 'boolean' && result === false) {
      return // 阻止 closeTab 关闭
    }
    this.remove(tab)
  }
}
</script>

<style lang="scss" scoped>
$height: 35px;
$hover-bg: hsla(0, 0%, 100%, 0.1);
$activeBg: #0d47a1;

.tab-box {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: row;
  margin-top: 2px;
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

  .tab-grp {
    display: flex;
    flex-direction: row;

    &:first-child {
      padding-left: $height;
    }

    &.fixed .tab {
      background: #1565c0;
      position: fixed;
      left: 0;
      top: 30px;
      width: 45px;
      height: $height;
      min-width: $height;

      &:hover, &.active {
        background: #1651aa;
      }

      & > .add-btn {
        width: 100%;
        text-align: center;
        font-size: 12px;
      }
    }
  }

  .tab-transition-enter, .tab-transition-leave-to {
    opacity: 0;
    transform: translateY(30px);
  }

  .tab-transition-leave-active {
    position: absolute;
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
    transition: background 0.15s ease, transform .3s;

    &.active {
      background-color: $activeBg;
    }

    &:hover:not(.active) {
      background-color: $hover-bg;
    }

    &:not(:last-child) {
      margin-right: 1px;
    }

    & > * {
      height: $height;
      line-height: $height;
    }

    & > .name {
      flex: 1;
      padding-left: 14px;
    }

    & > .close-btn {
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
  }
}
</style>
