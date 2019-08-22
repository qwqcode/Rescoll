<template>
  <Sidebar name="downloads" title="下载内容">
    <div class="downloads">
      <div class="dl-task-list">
        <!-- e.g. data-status="Downloading" -->
        <div v-for="dlTask in dlTaskList" :key="dlTask.id" class="item" :data-status="DlStatus[dlTask.status]">
          <div class="header">
            <span class="title" @click="dlTask.status === DlStatus.Done ? launchFile(dlTask) : null">{{ dlTask.title || dlTask.id }}</span>
            <a class="url" :href="dlTask.url" target="_blank">{{ dlTask.url }}</a>
          </div>
          <div v-if="dlTask.descInProgress !== ''" class="desc">
            {{ dlTask.descInProgress }}
          </div>
          <div v-if="dlTask.isInProgress" class="progress" :class="{ 'indeterminate': !dlTask.hasPercentage }">
            <div class="progress-bar" :style="{ width: !!dlTask.hasPercentage ? dlTask.percentage : '' }" />
          </div>
          <div class="action-bar">
            <!-- 正在下载 -->
            <template v-if="dlTask.status === DlStatus.Downloading">
              <span @click="takeAction(dlTask, DlAction.Pause)">暂停</span>
              <span @click="takeAction(dlTask, DlAction.Cancel)">取消</span>
            </template>
            <!-- 暂停 -->
            <template v-if="dlTask.status === DlStatus.Pause">
              <span @click="takeAction(dlTask, DlAction.Resume)">恢复</span>
              <span @click="takeAction(dlTask, DlAction.Cancel)">取消</span>
            </template>
            <!-- 下载完成 -->
            <template v-if="dlTask.status === DlStatus.Done">
              <span @click="showInExplorer(dlTask)">在文件夹中显示</span>
            </template>
            <!-- 下载失败 -->
            <template v-if="dlTask.status === DlStatus.Fail || dlTask.status == DlStatus.Cancelled">
              <span @click="takeAction(dlTask, DlAction.Restart)">重试下载</span>
            </template>
          </div>
          <div class="remove-btn" title="从列表中移除" @click="removeBtnClick(dlTask)">
            <i class="zmdi zmdi-close" />
          </div>
        </div>
      </div>
      <div v-if="count() <= 0" class="empty-dl-list">
        <div class="illustration" />
        <div class="text">
          暂无内容
        </div>
      </div>
    </div>
  </Sidebar>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator'
import Sidebar from './_Sidebar.vue'
import DlTask from '~/core/models/DlTask'
import { DlStatus, DlAction } from '~/core/models/DlEnums'
import Utils from '~/core/Utils'

interface BackendCallObj {
  key: string
  fullPath: string
  downloadUrl: string

  totalBytes: number
  receivedBytes: number
  currentSpeed: number

  status: DlStatus
}

@Component({
  components: { Sidebar }
})
export default class Settings extends Vue {
  dlTaskList: DlTask[] = []

  DlStatus = DlStatus
  DlAction = DlAction

  readonly LocalStorageName = 'AppDownloads'

  created () {
    Vue.prototype.$downloads = this;
    (window as any).Downloads = this

    this.restoreLocal();

    // 下载文件
    (window as any).window.downloadFile = (url: string) => {
      this.downloadURL(url)
    }

    // 保存本地文件
    (window as any).window.saveLocalFile = (path: string) => {
      const key = 'LocalFile_' + new Date().getTime().toString()
      this.push(new DlTask(key, Utils.extractFilename(path), undefined, undefined, DlStatus.Downloading));
      (window as any).AppAction.saveLocalFile(path, key)
    }
  }

  mounted () {
  }

  get (dlTaskId: string) {
    return this.dlTaskList.find(o => o.id === dlTaskId)
  }

  push (dlTask: DlTask) {
    this.dlTaskList.unshift(dlTask) // 头部插入
    this.setAppHeaderDownloadsNum(this.inProgressNum)
  }

  @Watch('dlTaskList')
  onDlTaskListChanged () {
    this.saveLocal()
  }

  /** 下载列表持久化保存 */
  saveLocal () {
    localStorage.setItem(this.LocalStorageName, JSON.stringify(this.dlTaskList))
  }

  /** 从 localStorage 中恢复下载列表 */
  restoreLocal () {
    const rawData = localStorage.getItem(this.LocalStorageName)
    if (!rawData) { return }
    const obj = JSON.parse(rawData)
    if (!Array.isArray(obj)) { return }

    const newList: DlTask[] = []
    obj.forEach((item) => {
      const dlTask = Object.assign(new (DlTask as any)(), item)
      if (dlTask.isInProgress) { dlTask.status = DlStatus.Cancelled }
      newList.push(dlTask)
    })

    this.dlTaskList = newList
  }

  /** 清空下载列表 */
  clearAll () {
    if (this.inProgressNum > 0) {
      throw new TypeError('下载任务执行时，无法清空下载列表')
    }

    this.dlTaskList = []
  }

  removeBtnClick (dlTask: DlTask) {
    /**
     * TODO 曲线救国.....
     * 解决：当点击 removeBtn 时，由于执行 this.remove 会先删除 item 的 DOM，导致触发 outclick 事件（隐藏 sidebar）
     */
    window.setTimeout(() => {
      this.remove(dlTask)
    }, 80)
  }

  remove (dlTask: DlTask) {
    const index = this.dlTaskList.indexOf(dlTask)
    if (index <= -1) { throw new TypeError('dlTask Not found') }
    if (dlTask.isInProgress) {
      this.takeAction(dlTask, DlAction.Cancel)
    }
    this.dlTaskList.splice(index, 1)
  }

  count () {
    return this.dlTaskList.length
  }

  /** 正在执行的任务数 */
  get inProgressNum () {
    return this.dlTaskList.filter(o => o.isInProgress).length
  }

  /** 设置 header 下载按钮角标 */
  setAppHeaderDownloadsNum (num: number) {
    this.$header.downloadsNum = num
  }

  /** 下载任务执行操作 */
  takeAction (dlTask: DlTask, action: DlAction) {
    if (action === DlAction.Restart) {
      // 重试下载
      if (dlTask.url) {
        this.downloadURL(dlTask.url)
        this.removeBtnClick(dlTask)
      }
      return
    }
    (window as any).CrDownloadsCallBack.downloadingTaskAction(dlTask.id, action)
  }

  /** 文件在资源管理器中显示 */
  showInExplorer (dlTask: DlTask) {
    (window as any).CrDownloadsCallBack.fileShowInExplorer(dlTask.localPath).then((isSuccess: boolean) => {
      if (!isSuccess) {
        // 若文件打开失败
        dlTask.status = DlStatus.Cancelled
      }
    })
  }

  /** 启动文件 */
  public launchFile (dlTask: DlTask) {
    if (dlTask.status !== DlStatus.Done) { return }

    (window as any).CrDownloadsCallBack.fileLaunch(dlTask.localPath).then((isSuccess: boolean) => {
      if (!isSuccess) {
        dlTask.status = DlStatus.Cancelled
      }
    })
  }

  /** URL 在系统默认浏览器中打开 */
  openUrl (dlTask: DlTask) {
    (window as any).CrDownloadsCallBack.urlOpenInDefaultBrowser(dlTask.url)
  }

  /** 下载 URL */
  downloadURL (url: string) {
    (window as any).AppAction.downloadUrl(url)
  }

  addTask ({ key, fullPath, downloadUrl, totalBytes }: BackendCallObj) {
    if (this.get(key)) { throw new TypeError(`${key} 下载任务已存在，无需再新建`) }

    const dlTask = new DlTask(key, Utils.extractFilename(downloadUrl), downloadUrl)
    dlTask.sizeTotal = totalBytes
    this.push(dlTask)
  }

  updateTask ({ key, receivedBytes, currentSpeed, status, fullPath, downloadUrl }: BackendCallObj) {
    const dlTask = this.get(key)
    if (!dlTask) { throw new TypeError(`${key} 下载任务不存在，或许已被删除`) }

    this.$set(dlTask, 'sizeReceived', receivedBytes)
    this.$set(dlTask, 'speed', currentSpeed)
    this.$set(dlTask, 'status', status)

    if (!!fullPath && dlTask.localPath !== fullPath) {
      this.$set(dlTask, 'localPath', fullPath)
      this.$set(dlTask, 'title', Utils.extractFilename(fullPath))
    }

    if (!!downloadUrl && dlTask.url !== downloadUrl) {
      this.$set(dlTask, 'url', downloadUrl)
    }
  }
}
</script>

<style lang="scss" scoped>
.downloads {
  height: 100%;
}

.dl-task-list {
  & > .item {
    position: relative;
    padding: 10px 10px;
    border-bottom: 1px solid #efefef;

    &[data-status="Done"] .header .title {
      cursor: pointer;
    }

    &[data-status="Pause"] .progress .progress-bar {
      background-color: #b7b7b7;
    }

    &[data-status="Fail"] {
      .header .title {
        color: #f95c57;
      }

      .progress {
        .progress-bar {
          background: #f95c57;
        }

        &.indeterminate .progress-bar {
          width: 100% !important;
          animation: none;
        }
      }
    }

    &[data-status="Cancelled"] {
      .header .title {
        color: rgba(19, 19, 19, 0.6);
        text-decoration: line-through;
      }
    }

    .header {
      margin-bottom: 10px;

      .title {
        color: #008eff;
        display: block;
        font-size: 16px;
        margin-bottom: 6px;
        word-wrap: break-word;
        word-break: normal;
      }

      .url {
        display: block;
        cursor: pointer;
        font-size: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: rgba(27, 27, 27, 0.6);
      }
    }

    .desc {
      margin-top: 5px;
      margin-bottom: 5px;
      font-size: 12px;
      color: #717171;
    }

    .progress {
      background-color: #e2e2e2;
      position: relative;
      height: 2px;

      &.indeterminate {
        overflow: hidden;

        @keyframes progress-bar-indeterminate {
          0% {
            left: -35%;
            right: 100%;
          }

          60% {
            left: 100%;
            right: -90%;
          }

          100% {
            left: 100%;
            right: -90%;
          }
        }

        .progress-bar {
          animation: progress-bar-indeterminate 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;
          transition: all 0.2s linear;
          will-change: left, right;
          width: 30% !important;
        }
      }

      .progress-bar {
        position: absolute;
        width: 0;
        max-width: 100%;
        height: 100%;
        text-align: right;
        background-color: #008eff;
        transition: all 0.3s;
        text-align: right;
      }
    }

    .action-bar {
      margin-top: 5px;

      & > span {
        color: #008eff;
        cursor: pointer;

        &:not(:last-child) {
          margin-right: 10px;
        }

        &:hover {
        }
      }
    }

    .remove-btn {
      position: absolute;
      right: 0;
      top: 0;
      font-size: 16px;
      line-height: 30px;
      width: 30px;
      height: 30px;
      cursor: pointer;
      text-align: center;

      & > i {
        color: #93adb9;
      }
    }
  }
}

.empty-dl-list {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .illustration {
    background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMzciIGhlaWdodD0iMjg5Ij48cGF0aCBkPSJNMTYyLjYzMiA3Ny4wMTFjMy4zMS01LjczNSAxMC42NTYtNy42OTMgMTYuMzc5LTQuMzg5bDUxLjk3OCAzMC4wMWM1LjczNSAzLjMxIDcuNjkzIDEwLjY1NiA0LjM4OSAxNi4zNzlsLTMwLjAxIDUxLjk3OGMtMy4zMSA1LjczNS0xMC42NTYgNy42OTMtMTYuMzc5IDQuMzg5bC01MS45NzgtMzAuMDFjLTUuNzM1LTMuMzEtNy42OTMtMTAuNjU2LTQuMzg5LTE2LjM3OWwzMC4wMS01MS45Nzh6bTMuNzIzIDQ0Ljg4NWwzLjA4IDE3Ljk5OCAyNC42NjktMTAuMDYgNC4xODYgMzQuNzQ4LTU2LjU4LTMyLjY2NyAyNC42NDUtMTAuMDJ6bS0xMDMuMjMtNy4zMTZMNS40NCAxNDUuMjUyYy00LjUzMiAyLjQxLTYuMjY5IDguMDktMy44NTkgMTIuNjIzbDMwLjY3MiA1Ny42ODZjMi40MSA0LjUzMiA4LjA5IDYuMjY5IDEyLjYyMyAzLjg1OWw1Ny42ODYtMzAuNjcyYzQuNTMyLTIuNDEgNi4yNjktOC4wOSAzLjg1OS0xMi42MjNMNzUuNzQ4IDExOC40NGMtMi40MS00LjUzMi04LjA5LTYuMjY5LTEyLjYyMy0zLjg1OXptLTE1LjUyIDg2LjRjLTIuNjIzIDEuMzk1LTUuOTEuMzktNy4zMDQtMi4yMzNsLTEwLjE0LTE5LjA3MWMtNi45OTMtMTMuMTUyLTEuOTg4LTI5LjUyMyAxMS4xNjMtMzYuNTE2IDEzLjE1Mi02Ljk5MiAyOS41MjMtMS45ODcgMzYuNTE2IDExLjE2NGwxMC4xNCAxOS4wNzJjMS4zOTUgMi42MjIuMzkgNS45MDktMi4yMzMgNy4zMDNsLTExLjEyNSA1LjkxNS04LjQ1LTE1Ljg5MyA3Ljk0Ni00LjIyNS00LjIyNS03Ljk0NmMtNC42NjktOC43ODEtMTUuNTYzLTEyLjExMi0yNC4zNDMtNy40NDMtOC43ODEgNC42NjktMTIuMTEyIDE1LjU2My03LjQ0MyAyNC4zNDNsNC4yMjUgNy45NDcgNy45NDctNC4yMjUgOC40NSAxNS44OTMtMTEuMTI1IDUuOTE1ek02OS4zMTEuMTQ1Yy00LjY3MS0uODI0LTkuMTA4IDIuMjMyLTkuOTEgNi43ODJMNDcuNjkgNzMuMWMtLjgwMyA0LjU1IDIuMzIgOC45MzkgNi45OTIgOS43NjJsNTEuMDA3IDguOTk0YzQuNjcxLjgyNCA5LjE1LTIuMjI1IDkuOTUyLTYuNzc1bDguNzUyLTQ5LjYzNC0yMS4xMDYtMjkuMzFMNjkuMzExLjE0NXptMjQuNzA0IDM0LjgxOWw0LjE2OC0yMy42MzYgMTkuNDY4IDI3LjgwMy0yMy42MzYtNC4xNjd6bTc0LjYzIDE3NS4zOTNsMTEuOTg4IDE2LjE2My0xMS44MTcgMi4wODQtMTEuOTktMTYuMTY0LTguODYyIDEuNTYzIDExLjk4OCAxNi4xNjQtMTEuODE3IDIuMDg0LTExLjk5LTE2LjE2NC04Ljg2MiAxLjU2MyAxMS45ODkgMTYuMTY0LTExLjgxOCAyLjA4My0xMS45OS0xNi4xNjMtMi45NTQuNTJjLTUuMTQuOTA3LTguMTQ3IDUuMzc4LTcuMyAxMC40MjdsOC44NTYgNTAuMjI1Yy44ODkgNS4wNCA1LjI4NiA4LjIwNyAxMC40MjYgNy4zbDY0Ljk5OC0xMS40NmM1LjE0LS45MDcgOC4xODktNS4zODYgNy4zLTEwLjQyN2wtMTAuNDE5LTU5LjA4OC0xNy43MjYgMy4xMjZ6IiBmaWxsPSIjOUFBMEE2IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48L3N2Zz4=) no-repeat center center;
    background-size: contain;
    width: 192px;
    height: 110px;
    margin-bottom: 32px;
  }

  .text {
    text-align: center;
    color: #6e6e6e;
  }
}
</style>
