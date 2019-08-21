<template>
  <transition name="fade">
    <div v-if="dialogList.length > 0" class="dialogs-layer show" style="animation-duration: 0.2s">
      <transition-group name="fade">
        <div v-for="dialog in dialogList" :key="dialog.id" class="dialog" style="animation-duration: 0.2s">
          <div class="inner">
            <div class="header">
              <span class="title">{{ dialog.title }}</span>
              <span v-if="!dialog.yesBtn && !dialog.noBtn" class="close-btn" @click="removeDialog(dialog)"><i class="zmdi zmdi-close" /></span>
            </div>
            <div class="content" v-html="dialog.content" />
            <div v-if="!!dialog.yesBtn || !!dialog.yesBtn" class="bottom">
              <span v-if="!!dialog.yesBtn" class="confirm-btn" @click="onClickBtn(dialog, dialog.yesBtn)">{{ dialog.yesBtn[0] || '确认' }}</span>
              <span v-if="!!dialog.noBtn" class="confirm-btn" @click="onClickBtn(dialog, dialog.noBtn)">{{ dialog.noBtn[0] || '取消' }}</span>
            </div>
          </div>
        </div>
      </transition-group>
    </div>
  </transition>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

interface DialogItem {
  id: string,
  title: string,
  content: string,
  yesBtn?: [string, (() => void|boolean)?],
  noBtn?: [string, (() => void|boolean)?]
}

@Component
export default class DialogLayer extends Vue {
  dialogList: DialogItem[] = []

  created () {
    Vue.prototype.$dialog = this
  }

  public open (title: string, content: string, yesBtn?: [string, (() => void|boolean)?], noBtn?: [string, (() => void|boolean)?]) {
    this.dialogList.push({
      id: new Date().getTime().toString(),
      title,
      content,
      yesBtn,
      noBtn
    })
  }

  removeDialog (dialog: DialogItem) {
    this.dialogList.splice(this.dialogList.indexOf(dialog), 1)
  }

  onClickBtn (dialog: DialogItem, btn?: [string, (() => void|boolean)?]) {
    if (!btn || !btn[1]) {
      this.removeDialog(dialog)
      return
    }

    const result = btn[1]()
    if (result === undefined || result === false) {
      this.removeDialog(dialog)
    }
  }
}
</script>

<style lang="scss" scoped>
.dialogs-layer {
  @extend %app-layer;
  display: flex;
  z-index: 1000;
  background-color: rgba(21, 101, 192, 0.11);

  .dialog {
    position: absolute;
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-items: center;

    & > .inner {
      position: relative;
      display: flex;
      flex-direction: column;
      width: 430px;
      padding: 15px 0;
      border-radius: 2px;
      background-color: #fff;
      box-shadow: 1px 1px 50px rgba(0, 0, 0, 0.3);
      margin: 0 auto;
    }

    &.dialog-large > .inner {
      width: 90vw;
      .content {
        max-height: 65vh;
      }
    }

    .header {
      display: flex;
      position: relative;
      justify-content: space-between;
      padding: 0 30px 0 30px;
      border-bottom: 0 solid #f6f6f6;
      font-size: 16px;
      color: #333;
      height: 25px;
      overflow: hidden;
      margin: 10px 0 15px 0;

      .title {
        flex: 1;
        height: 100%;
      }

      .close-btn {
        flex-basis: 25px;
        width: 25px;
        height: 100%;
        line-height: 100%;
        text-align: center;
        cursor: pointer;
        font-size: 20px;
        transition: color 0.15s ease;

        &:hover {
          color: #03A9F4;
        }

        & > i {
          line-height: 25px;
        }
      }
    }

    .content {
      position: relative;
      flex: 1 1 auto;
      padding: 10px 30px 10px 30px;
      font-size: 13px;
      font-weight: 400;
      line-height: 1.5;
      color: #707070;
      overflow-x: hidden;
      overflow-y: auto;
      max-height: 150px;
      word-break: break-all;
    }

    .bottom {
      display: flex;
      padding: 15px 25px 0 25px;
      justify-content: flex-end;
      align-items: center;
      color: #575757;
    }

    .confirm-btn {
      display: inline-block;
      color: #008eff;
      font-weight: 500;
      cursor: pointer;
      border: 0;
      text-align: center;
      border-radius: 2px;
      padding: 6px 13px;
      font-size: 13px;

      &:hover {
        background-color: #f6f6f6;
      }

      &:not(first-child) {
        margin-left: 5px;
      }
    }
  }
}
</style>
