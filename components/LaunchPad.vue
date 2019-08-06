<template>
  <transition name="fade">
    <div v-if="isShow || $tabBox.count() <= 0" class="launch-pad" style="animation-duration: 0.15s">
      <div class="logo">
        <img width="360" height="70" src="~/assets/img/logo.svg" draggable="false">
      </div>
      <div class="coller-box">
        <div class="categories">
          <div class="item active">
            电商采集
          </div>
          <div class="item">
            调试
          </div>
          <nuxt-link to="/">HOME - </nuxt-link>
          <nuxt-link to="/task">TEST TASK</nuxt-link>
        </div>
        <div class="collers">
          <div class="inner">
            <div class="item">
              <div class="icon">
                <i class="zmdi zmdi-image-alt" />
              </div>
              <div class="name">
                详情页图片
              </div>
            </div>
            <div class="item">
              <div class="icon">
                <i class="zmdi zmdi-tv-play" />
              </div>
              <div class="name">
                详情页视频
              </div>
            </div>
            <div class="item">
              <div class="icon">
                <i class="zmdi zmdi-accounts-list" />
              </div>
              <div class="name">
                卖家 ID
              </div>
            </div>
            <div class="item">
              <div class="icon">
                <i class="zmdi zmdi-swap-alt" />
              </div>
              <div class="name">
                天猫供销平台分销商一键邀请
              </div>
            </div>
            <div class="item">
              <div class="icon">
                <i class="zmdi zmdi-swap-alt" />
              </div>
              <div class="name">
                天猫供销平台分销商一键撤回
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'nuxt-property-decorator'

@Component
export default class LaunchPad extends Vue {
  isShow: boolean = true

  created () {
    Vue.prototype.$launchPad = this
  }

  show () {
    this.isShow = true
  }

  hide () {
    this.isShow = false
  }

  toggle () {
    this.isShow = !this.isShow
  }

  /* @Watch('$tabBox.tabList.length')
  onTabListLengthChange () {
    this.isShow = true
  } */
}
</script>

<style lang="scss" scoped>
.launch-pad {
  @extend %app-content;
  z-index: 100;
  position: fixed;
  top: 0;
  left: 1px;
  width: calc(100% - 2px);
  background-color: rgba(25, 27, 31, 0.95);
  display: flex;
  flex-direction: column;
  align-items:center;
  justify-content:center;

  .logo {
    margin-bottom: 60px;
  }

  .coller-box {
    padding: 18px 25px 20px 25px;
    border-radius: 2px;
    width: 75%;

    .categories {
      display: flex;
      flex-direction: row;
      font-size: 12px;

      & > .item {
        color: rgba(198, 212, 223, 0.788);
        cursor: pointer;
        padding: 10px 0;
        margin-left: 15px;
        &:not(:last-child) {
          margin-right: 15px;
        }

        &.active, &:hover {
          border-bottom: 2px solid #2588f3;
        }
      }
    }

    .collers {
      margin-top: 20px;
      overflow-y: auto;
      height: calc(100vh - 430px);
      padding: 10px 0;

      &::-webkit-scrollbar {
        width: 3px;
      }

      &::-webkit-scrollbar-thumb {
        background: rgba(197, 197, 197, 0.205);
      }

      & > .inner {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        flex-flow: row wrap;
        align-content: flex-end;
      }

      .item {
        display: flex;
        flex-wrap: wrap;
        align-items:center;
        justify-content:center;
        width: 100px;
        height: 100px;
        cursor: pointer;
        margin-bottom: 18px;
        margin-right: 18px;
        padding: 11px;
        text-align: center;
        border-radius: 2px;
        transition: background-color 0.15s ease, box-shadow 0.8s ease;

        &:hover {
          background-color: rgba(0, 80, 165, 0.205);
          box-shadow: inset 0 0 20px -10px rgba(0, 174, 255, 0.507), 0 0 5px rgba(0, 0, 0, 0.185);

          .icon {
            text-shadow: 0 0 30px #00adff;
          }

          .name {
            color: #2588f3;
            text-shadow: 0 0 30px #00adff;
          }
        }

        .icon {
          color: #2588f3;
          width: 100%;
          font-size: 30px;
        }

        .name {
          font-size: 12px;
          transition: color 0.15s ease;
          color: rgba(198, 212, 223, 0.788);
        }
      }
    }
  }
}
</style>
