<template>
  <transition name="fade">
    <div v-if="isShow" class="updater-layer show" style="animation-duration: 0.2s">
      <div class="updater">
        <div class="inner">
          <div class="header">
            <span class="title">Nacollector 版本管理器</span>
            <span v-if="!isUpdating" class="close-btn" @click="close()"><i class="zmdi zmdi-close" /></span>
          </div>

          <div v-if="isLoading" class="loading">
            <div class="loading-icon" /> 数据获取中...
          </div>

          <div v-if="!isLoading && !!updaterData && !updateResult.type" class="body">

            <div v-if="!isUpdating" class="action-bar">
              <span v-if="isNeedUpdate" class="update-btn" @click="startUpdate()"><i class="zmdi zmdi-cloud-upload" /> 一键更新</span>
              <span class="desc-text">{{ isNeedUpdate ? '待更新模块：' + needUpdateModules.flatMap(o => o.name).join(', ') : '所有模块已是最新版本' }}</span>
            </div>
            <div v-else class="action-bar">
              <span v-if="isUpdating" class="update-progress-bar"><span :style="{ width: (updatingProgress.percentage || '0') + '%' }" /></span>
              <span class="desc-text" v-html="updatingProgress.desc || '正在准备更新...'" />
            </div>

            <div class="scrollable-area">
              <div class="update-note">
                <div class="title">
                  发行说明
                </div>
                <div class="content" :inner-html.prop="updateNote | marked" />
              </div>

              <div class="module-list">
                <div v-for="(module, i) in updaterData.modules" :key="i" class="module-item">
                  <div class="icon">
                    <i :class="`zmdi ${moduleIconDict[module.name] || 'zmdi-puzzle-piece'}`" />
                  </div>
                  <div class="info">
                    <div class="name">
                      {{ module.name }}
                    </div>
                    <div class="desc">
                      <span>本地: {{ localModuleVersionList[module.name] || '未知' }}</span>
                      <span :class="{ 'marked-text': checkIsModuleNeedUpdate(module) }">远程: {{ module.version || '未知' }}</span>
                      <span :class="{ 'marked-text': checkIsModuleNeedUpdate(module) }">大小: {{ module.size || '未知' }}</span>
                    </div>
                    <div class="badge-box">
                      <span v-if="checkIsModuleNeedUpdate(module)" class="badge need">待更新</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="!!updateResult.type" :class="`update-result type-${updateResult.type}`">
            <div class="icon">
              <i :class="`zmdi zmdi-${{success: 'check', error: 'alert-triangle'}[updateResult.type]}`" />
            </div>
            <div class="status">
              {{ {success: '升级成功', error: '升级失败'}[updateResult.type] }}
            </div>
            <div class="desc" v-html="updateResult.text" />
          </div>

        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import $ from 'jquery'
import { Component, Vue, Watch } from 'nuxt-property-decorator'
import Tab from '~/core/models/Tab'
import UpdaterData, { ModuleItem } from '~/core/interfaces/UpdaterData'

@Component({})
export default class Updater extends Vue {
  isShow = false
  isLoading = false

  readonly moduleIconDict = {
    Nacollector: 'zmdi-picture-in-picture',
    NacollectorSpiders: 'zmdi-cloud-box',
    NacollectorUpdater: 'zmdi-arrow-merge'
  }

  /** 本地模块版本数据 */
  localModuleVersionList: { [moduleName: string]: string } = {}

  /** 远程版本更新数据 */
  updaterData?: UpdaterData

  isUpdating = false
  updatingProgress: {
    percentage?: number,
    desc?: string
  } = {}
  updateResult: {
    type?: 'success'|'error',
    text?: string
  } = {}

  @Watch('isShow')
  onIsShowChanged (isShow: boolean) {
    if (!isShow) {
      // 当关闭时重置数据
      this.isLoading = false
      this.isUpdating = false
      this.updatingProgress = {}
      this.updateResult = {}
    }
  }

  created () {
    (window as any).AppUpdate = {
      panel: this
    }

    Vue.prototype.$updater = this

    // 检测更新
    this.refreshUpdaterData(() => {
      if (this.isNeedUpdate) {
        this.isShow = true
      }
    })
  }

  /** 刷新模块版本号列表 */
  async refreshLocalModuleVersionList () {
    try {
      this.localModuleVersionList = await (window as any).UpdateAction.getAllModuleVersion()
    } catch {
      throw new TypeError('模块版本号列表刷新失败')
    }
    this.$appData.appVersion = this.localModuleVersionList.Nacollector || ''
  }

  /** 获取更新数据 */
  async refreshUpdaterData (onFinish?: () => void) {
    await this.refreshLocalModuleVersionList()

    this.updaterData = undefined
    this.isLoading = true

    let updateParms
    try {
      updateParms = JSON.parse(await (window as any).UpdateAction.getUpdateParms())
    } catch {
      throw new TypeError('UpdateParms 获取失败')
    }

    await $.ajax({
      type: 'GET',
      url: updateParms.updateCheckUrl,
      data: {
        token: updateParms.updateCheckToken,
        time: new Date().getTime() // 防缓存
      },
      dataType: 'json',
      beforeSend: () => {},
      success: (remoteData) => {
        this.isLoading = false
        this.updaterData = remoteData
        if (onFinish) { onFinish() }
      },
      error: () => {
        this.isLoading = false
        if (onFinish) { onFinish() }
        this.$notify.error('更新数据获取失败')
        throw new TypeError('更新数据获取失败')
      }
    })
  }

  get isNeedUpdate () {
    return this.needUpdateModules.length > 0
  }

  /** 需要更新的模块 */
  get needUpdateModules () {
    if (!this.updaterData) { return [] }

    const localVersionList = this.localModuleVersionList
    const remoteModuleList = this.updaterData.modules

    // 版本号检测
    const needUpdateModules = remoteModuleList.filter((module) => {
      return (
        !localVersionList.hasOwnProperty(module.name) || // 新的模块
        this.isHigherVersion(localVersionList[module.name], module.version) // 更高版本
      )
    })

    return needUpdateModules
  }

  checkIsModuleNeedUpdate (module: ModuleItem) {
    return this.needUpdateModules.flatMap(o => o.name).includes(module.name)
  }

  /**
   * 比较版本号
   * @param localV 本地版本号
   * @param remoteV 远程版本号
   * @param equalCondition 版本号相等时也返回 true
   */
  isHigherVersion (localV: string, remoteV: string, equalCondition: boolean = false): boolean {
    if (localV === '') { localV = '0.0.0.0' }

    let pos = 0
    let diff = 0

    try {
      const localArr = localV.split('.')
      const remoteArr = remoteV.split('.')

      const minL = Math.min(localArr.length, remoteArr.length)

      while (pos < minL) {
        diff = parseInt(remoteArr[pos]) - parseInt(localArr[pos])
        if (diff !== 0) {
          break
        }
        pos++
      }

      /* if (diff > 0) {
        console.log('新版本')
      } else if (diff == 0) {
        console.log('稳定版')
      } else {
        console.log('旧版本')
      } */
    } catch {
      throw new TypeError(`版本号错误，无法比较 localV: ${localV}, remoteV: ${remoteV}`)
    }

    return !equalCondition ? (diff > 0) : (diff >= 0)
  }

  get updateNote () {
    if (!this.updaterData) { return '' }

    const releaseNotes = this.updaterData.release_notes
    let updateNote = ''
    for (const version in releaseNotes) {
      if (this.isHigherVersion(this.localModuleVersionList.Nacollector, version, true)) {
        updateNote += `#### ${version}\n${releaseNotes[version]}\n\n`
      }
    }
    return updateNote
  }

  setProgress (percentage: number, desc: string = '') {
    this.updatingProgress.percentage = percentage
    this.updatingProgress.desc = desc
  }

  setSuccess (text: string) {
    this.updateResult.type = 'success'
    this.updateResult.text = text
    this.isUpdating = false

    // 清空 CollerList 等待新数据
    if (this.needUpdateModules.find(o => o.name === 'NacollectorSpiders')) {
      this.$launchPad.clearCollerGrpList()
    }
  }

  setError (text: string) {
    this.updateResult.type = 'error'
    this.updateResult.text = text
    this.isUpdating = false
  }

  async startUpdate () {
    if (this.isUpdating) { throw new TypeError('已开始升级，无需重复调用 startUpdate') }
    if (!this.updaterData) { throw new TypeError('updaterData is undefined') }
    if (!this.isNeedUpdate) { throw new TypeError('no need to update') }

    this.isUpdating = true

    await (window as any).UpdateAction.startUpdateWork(JSON.stringify(this.needUpdateModules))
  }

  open () {
    this.isShow = true
    this.refreshUpdaterData()
  }

  close () {
    this.isShow = false
  }
}
</script>

<style lang="scss" scoped>
$contentMinHeight: calc(100vh - 215px);

* {
  transition: width 0.2s;
}

.updater-layer {
  z-index: 999;
  background-color: rgba(21, 101, 192, 0.11);
  @extend %app-layer;
}

.updater {
  padding: 25px;
  overflow: hidden;
  @extend %app-content;
}

.inner {
  position: relative;
  line-height: 1.5;
  color: #707070;
  padding: 25px 30px;
  border-radius: 2px;
  background-color: #fff;
  box-shadow: 1px 1px 50px rgba(0,0,0,.3);
  min-height: 100%;
}

.header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 21px;

  .title {
    flex: 1;
    font-size: 19px;
  }

  .close-btn {
    flex-basis: 25px;
    width: 25px;
    height: 100%;
    line-height: 100%;
    text-align: center;
    cursor: pointer;
    font-size: 20px;

    &:hover {
      color: #03a9f4;
    }
  }
}

.action-bar {
  height: 40px;
  overflow: hidden;

  & > span {
    display: inline-block;
  }

  .update-btn {
    margin-left: 10px;
    margin-right: 10px;
    border: 0;
    color: #FFF;
    background: #2588f3;
    font-weight: 500;
    cursor: pointer;
    text-align: center;
    border-radius: 2px;
    padding: 6px 13px;

    &:hover {
      background: #32c787;
    }

    & > i {
      margin-right: 5px;
    }
  }

  .update-progress-bar {
    display: block;
    width: 100%;
    height: 4px;
    margin-top: 8px;
    margin-bottom: 5px;
    border-radius: 50px;
    overflow: hidden;
    background: #f6f6f6;

    & > span {
      display: block;
      width: 0%;
      height: 100%;
      transition: width 0.2s linear;
      background: #2196f3;
    }
  }

  .desc-text {
    margin-left: 10px;
    vertical-align: sub;
    font-size: 12px;
  }
}

.scrollable-area {
  margin-top: 25px;
  height: calc(100vh - 157px - 125px);
  overflow-y: auto;
}

.update-note {
  padding: 0 10px;

  & > .title {
    font-size: 20px;
    margin-bottom: 4px;
    font-weight: bold;
  }
}

.module-list {
  margin-top: 10px;
  margin-bottom: 10px;
}

.module-item {
  position: relative;
  display: flex;
  flex-direction: row;
  padding: 10px 5px;
  border-radius: 3px;

  &:not(:last-child) {
    margin-bottom: 5px;
  }

  &:hover {
    background-color: #f6f6f6;
  }

  .icon {
    margin-left: 10px;
    flex-basis: 40px;
    height: 40px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;

    i {
      color: #2196f3;
      font-size: 25px;
    }
  }

  .info {
    flex: 1;
    padding-left: 10px;

    .name {
      font-weight: bold;
      color: #2196f3;
      font-size: 16px;
      margin-bottom: 3px;
    }

    .desc {
      & > span {
        display: inline-block;

        &:not(:last-child) {
          margin-right: 5px;
        }
      }
    }

    .marked-text {
      color: #2196f3;
      font-weight: bold;
    }

    .badge-box {
      display: block;
      margin-top: 2px;

      .badge {
        font-size: 12px;
        padding: 0px 10px;
        border-radius: 2px;
        display: inline-block;

        &:not(:last-child) {
          margin-right: 5px;
        }

        &.need {
          color: #fff;
          background: #32c787;
        }

        &.no-need {
          display: none;
        }
      }
    }
  }
}

.update-result {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: $contentMinHeight;
  padding: 20px;

  &.type-success .icon,
  &.type-success .status {
    color: #32c787;;
  }

  &.type-error .icon,
  &.type-error .status {
    color: #ff5652;
  }

  .icon {
    display: flex;
    font-size: 5em;
  }

  .status {
    display: flex;
    font-size: 1.5em;
    font-weight: bold;
  }

  .desc {
    display: flex;
    margin-top: 35px;
    font-size: 1em;
    text-align: center;
  }
}

.loading {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: $contentMinHeight;

  .loading-icon {
    margin-right: 15px;
  }
}

.loading-icon {
  border-radius: 100%;
  margin: 0;
  border: 1px solid #43aee2;
  border-bottom-color: transparent;
  height: 15px;
  width: 15px;
  background: 0 0 !important;
  display: inline-block;
  animation: loading-icon-rotate .75s 0s linear infinite;
  vertical-align: middle;
}

@keyframes loading-icon-rotate {
  0% { transform: rotate(0) }
  50% { transform: rotate(180deg) }
  100% { transform: rotate(360deg) }
}
</style>
