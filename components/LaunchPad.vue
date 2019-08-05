<template>
  <div v-if="isShow" class="launch-pad">
    <div class="logo">
      <img width="390" height="70" src="~/assets/img/logo.svg" draggable="false">
    </div>
    <div class="coller-box">
      <div class="categories">
        <div class="item active">
          电商采集
        </div>
        <div class="item">
          调试
        </div>
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
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component
export default class LaunchPad extends Vue {
  isShow: boolean = true
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
  background-color: #191b20;
  display: flex;
  flex-direction: column;
  align-items:center;
  justify-content:center;

  .logo {
    margin-bottom: 60px;
  }

  .coller-box {
    background: rgba(40, 44, 52, 0.506);
    padding: 18px 25px 20px 25px;
    box-shadow: 0 1px 6px rgba(0,0,0,.12), 0 1px 4px rgba(0,0,0,.12);
    border-radius: 2px;
    width: 75%;

    .categories {
      display: flex;
      flex-direction: row;
      font-size: 13px;

      & > .item {
        color: #2588f3;
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

      & > .inner {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        flex-flow: row wrap;
        align-content: flex-end;
      }

      .item {
        border-radius: 3px;
        display: flex;
        flex-wrap: wrap;
        align-items:center;
        justify-content:center;
        width: 100px;
        height: 100px;
        cursor: pointer;
        margin-bottom: 18px;
        padding: 11px;
        text-align: center;

        &:hover {
          color: #2588f3;
          background-color: rgba(37, 137, 243, 0.205);

          .name {
            color: #2588f3;
          }
        }

        .icon {
          color: #2588f3;
          width: 100%;
          font-size: 30px;
        }

        .name {
          font-size: 13px;
          color: #75838a;
        }
      }
    }
  }
}
</style>
