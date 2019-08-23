<template>
  <transition name="fade">
    <div v-show="isShow || $tabBox.count() <= 0" class="launch-pad" style="animation-duration: 0.15s">
      <div class="logo">
        <img width="360" height="70" src="~/assets/img/logo.svg" draggable="false">
      </div>
      <div class="launcher">
        <div class="coller-box">
          <div class="grp">
            <div
              v-for="(grp, i) in collerGrpList"
              :key="i"
              class="item"
              :class="{ 'active': i === curtGrp }"
              @click="() => { curtGrp = i; }"
            >
              {{ grp.label }}
            </div>
          </div>
          <div v-if="!!collerGrpList[curtGrp]" class="collers">
            <div class="inner">
              <div
                v-for="(coller, i) in collerGrpList[curtGrp].collers"
                :key="i"
                class="item"
                :class="{ 'active': i === curtColler }"
                @click="() => { changeColler(i) }"
              >
                <div class="name">
                  {{ coller.label }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="launch-form-box">
          <div id="LaunchForm" class="launch-form" />
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import $ from 'jquery'
import { Vue, Component, Watch } from 'nuxt-property-decorator'
import { Base64 } from 'js-base64'
import { html } from 'common-tags'
import Form from '~/core/launcher/Form'
import InputValidators from '~/core/launcher/InputValidators'
import Task from '~/core/models/Task'
import Tab from '~/core/models/Tab'

@Component
export default class LaunchPad extends Vue {
  isShow: boolean = true
  form: Form = new Form(this)

  curtGrp: number = 0
  curtColler: number = 0

  get collerGrpList () {
    return this.$appData.collerGrpList
  }

  created () {
    /** @deprecated 旧接口 */
    (window as any).TaskGen = this;
    (window as any).Task = this;
    (window as any).InputValidators = InputValidators
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

  newSpiderType (name: string, label: string) {
    this.collerGrpList.push({ name, label, collers: [] })
  }

  newSpider (grpName: string, name: string, label: string, genFormFunc: Function) {
    const grp = this.collerGrpList.find(o => o.name === grpName)
    if (!grp) { throw new TypeError('找不到该 grp：' + grpName) }

    grp.collers.push({ name, label, genForm: genFormFunc })
  }

  loadSpiderList () {
    // 打开第一项
    this.changeColler(0)
  }

  clearCollerGrpList () {
    this.$appData.collerGrpList = []
    $('#LaunchForm').html('') // 清除当前表单
  }

  /* @Watch('$tabBox.tabList.length')
  onTabListLengthChange () {
    this.isShow = true
  } */

  changeColler (collerIndex: number) {
    const grp = this.collerGrpList[this.curtGrp]
    const coller = grp.collers[collerIndex]
    const formDom: JQuery<HTMLElement> = $('#LaunchForm') as JQuery<HTMLElement>

    // 清除当前表单
    formDom.html('')
    this.form.curtInputs = {}

    // 执行表单创建
    if (coller.genForm !== undefined) {
      coller.genForm(this.form)
    }

    // 提交按钮
    $(html`<div class="form-btns"><button class="submit-btn" type="submit">执行任务</button></div>`)
      .appendTo(formDom)
      .click(() => {
        if (!this.form.formCheck()) { return false }

        // console.log('FormSubmitData', formDom.find(':input').serializeArray())
        this.createTask(coller.label, grp.name + '.' + coller.name, formDom.find(':input').serializeArray())

        return false
      })

    this.curtColler = collerIndex
  }

  /** 创建任务 */
  createTask (label: string, collerType: string, parms: object) {
    const id = new Date().getTime().toString()

    // 实例化 Task
    const task = new Task(id, label, collerType, parms)
    task.headerTab = new Tab('TASK_' + id, task.title, '/task/' + id)
    task.headerTab.onClosing = () => {
      // 结束任务
      if (task.isInProgress) {
        this.$dialog.open('是否中止任务？', `任务 “${task.title}” 正在执行中...`, ['中止并删除任务', () => {
          this.abortTask(task)
        }], ['取消', () => { }])
        return false
      }

      this.removeTask(task)
      return true
    }
    this.$appData.taskList.push(task)
    this.$tabBox.push(task.headerTab)
    this.$tabBox.linkTo(task.headerTab)

    try {
      (window as any).TaskController.createTask(id, collerType, label, JSON.stringify(parms)).then((callback: any) => {
        // ... 结束加载
      })
    } catch (e) {
      this.$notify.error('创建任务失败')
      throw e
    }

    return task
  }

  /** 删除任务 */
  removeTask (task: Task) {
    const taskList = this.$appData.taskList
    taskList.splice(taskList.indexOf(task), 1)
  }

  /** 中止任务 */
  abortTask (task: Task) {
    const taskList = this.$appData.taskList
    if (!taskList.includes(task)) { throw new TypeError('任务不存在') }

    if (!task.isInProgress) {
      // 若任务已执行完毕，直接删除
      if (task.headerTab) { this.$tabBox.remove(task.headerTab) }
      this.removeTask(task)
      return
    }

    try {
      (window as any).TaskController.abortTask(task.id).then((isSuccess: boolean) => {
        if (isSuccess) {
          if (task.headerTab) { this.$tabBox.remove(task.headerTab) }
          this.removeTask(task)
        } else {
          this.$notify.error('任务中止失败')
        }
      })
    } catch (e) {
      this.$notify.error('任务中止失败')
      throw e
    }
  }

  /**
   * Terminal 写日志
   * @deprecated 旧接口
   */
  log (taskId: string, text: string, level?: string, timeStamp?: string, textIsBase64?: boolean) {
    const task = this.$appData.taskList.find(o => o.id === taskId)
    if (!task) { throw new TypeError(`未找到任务 ${taskId}`) }

    if (typeof textIsBase64 === 'boolean' && textIsBase64 === true) {
      text = Base64.decode(text)
    }

    task.terminal.lines.push({ text, level })
    window.console.log(`[TaskTerminal][${taskId}][${level}][${new Date().toLocaleString()}] ${text}`)
  }

  /**
   * 获取 Task
   * @deprecated 旧接口
   */
  get (id: string) {
    return this.$appData.taskList.find(o => o.id === id)
  }
}
</script>

<style lang="scss" scoped>
.launch-pad {
  @extend %app-content;
  z-index: 100;
  position: fixed;
  top: 0;
  left: 0;
  width: calc(100%);
  background-color: rgba(25, 27, 31, 0.95);

  .logo {
    text-align: center;
    margin-top: 60px;
    margin-bottom: 40px;
    place-content: center;
  }

  .launcher {
    padding: 18px 25px 20px 25px;
    width: 92%;
    min-height: 420px;
    margin: 0 auto;
    display: flex;
    flex-direction: row;

    %launcherBlock {
      background-color: #21252b;
      box-shadow: 0 1px 6px rgba(0,0,0,.12), 0 1px 4px rgba(0,0,0,.12);
    }

    $defaultColor: #75838a;
    $activeColor: #2588f3;
    $gutterSize: 14px;

    .coller-box {
      flex-basis: 250px;

      .grp {
        @extend %launcherBlock;
        padding: 0 7px;
        display: flex;
        flex-direction: row;
        font-size: 12px;
        border-radius: 2px;

        & > .item {
          color: $defaultColor;
          cursor: pointer;
          padding: 10px 0;
          margin-left: 10px;
          border-bottom: 2px solid transparent;

          &:not(:last-child) {
            margin-right: 10px;
          }

          &.active, &:hover {
            border-bottom: 2px solid $activeColor;
          }
        }
      }

      .collers {
        @extend %launcherBlock;
        padding: 7px 0;
        margin-top: $gutterSize;

        .item {
          font-size: 14px;
          position: relative;
          display: block;
          cursor: pointer;
          padding: 10px 20px;
          transition: all .2s ease-in-out;
          background: transparent;
          color: $defaultColor;
          text-align: center;
          border-left: 2px solid transparent;
          &:not(:last-child) {
            margin-bottom: 10px;
          }
          &.active {
            color: $activeColor;
            border-left: 2px solid #2d4558;
          }
          &:hover {
            color: $activeColor;
          }
        }
      }
    }

    .launch-form-box {
      @extend %launcherBlock;
      flex: 1;
      margin-left: $gutterSize;
      padding: 30px;
      height: fit-content;
    }
  }
}

.launch-form /deep/ {
  label {
    display: inline-block;
    margin-bottom: 8px;
    color: #75838a;
  }

  .form-group {
    margin-bottom: 18px;
    position: relative;
    overflow: hidden;
  }

  .form-control {
    padding: 5px 14px;
    width: 100%;
    border: 1px solid rgba(177, 177, 177, 0.1);
    font-size: 14px;
    line-height: 1.42857143;
    transition: all .2s ease-in-out;
    color: #2588f3;
    background: transparent;
    resize: none;

    &::-webkit-input-placeholder {
      color: #737984;
      transition: color .2s ease-in-out;
    }
    &.has-error {
      color: #EF5350;
      background: rgb(80, 49, 49);
    }
    &:focus {
      outline: none;
      border: 1px solid #4285f4;
      background-color: rgba(0, 119, 255, 0.06);
      &::-webkit-input-placeholder {
        color: #FFF;
      }
    }
  }

  textarea.form-control {
    padding: 13px 17px;
    height: 240px;
    overflow-x: hidden;
  }

  .form-btns {
    display: block;
    overflow: hidden;
    margin-top: 25px;
  }

  .submit-btn {
    display: inline-block;
    padding: 7px 50px;
    border: none;
    color: #3492de;
    background: rgb(50, 54, 60);
    outline: none;
    font-size: 13.3333px;
    cursor: pointer;
    transition: all .2s ease-in-out;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.42857143;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    user-select: none;
    background-image: none;

    &:hover, &:active {
      color: #2fc798;
    }
  }

}
</style>
