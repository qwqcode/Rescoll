<template>
  <Sidebar name="settings" title="设置">
    <div class="settings">
      <div v-for="(grp, i) in list" :key="i" class="setting-grp">
        <h2 class="grp-title">
          {{ grp.label }}
        </h2>
        <div v-for="(item, o) in grp.items" :key="o" class="item" :class="`${item.type}-type`">
          <div v-if="item.type === 'btn'" @click="!!item.opts.clickEvt ? item.opts.clickEvt() : null">
            {{ item.opts.label }}
          </div>

          <div v-else-if="item.type === 'toggle-btn'" @click="onToggleClick(item)">
            <div class="left-text">
              {{ item.opts.label }}
            </div>
            <div class="toggle" :class="{ 'turn-on': item.opts.value }">
              <div class="toggle-bar" />
              <div class="toggle-circle" />
            </div>
          </div>

          <div v-else-if="item.type === 'double-line'">
            <span class="label">{{ item.opts.label }}</span>
            <span class="value" v-html="item.opts.value" />
          </div>
        </div>
      </div>
    </div>
  </Sidebar>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator'
import Sidebar from './_Sidebar.vue'
import Utils from '~/core/Utils'

@Component({
  components: { Sidebar }
})
export default class Settings extends Vue {
  list: SettingGrp[] = []

  created () {
    Vue.prototype.$settings = this
  }

  readonly LocalStorageName = 'AppSetting'

  get (key: string): any {
    const data = JSON.parse(localStorage.getItem(this.LocalStorageName) || '{}')
    return data.hasOwnProperty(key) ? data[key] : null
  }

  set (key: string, val: any): void {
    const data = JSON.parse(localStorage.getItem(this.LocalStorageName) || '{}')
    data[key] = val
    localStorage.setItem(this.LocalStorageName, JSON.stringify(data))
  }

  @Watch('$store.state.ui.sidebar')
  onSidebarChanged (sidebar: string) {
    if (sidebar !== 'settings') { return }

    this.$el.scrollTop = 0
    this.list = [] // 清空

    this.newGrp('download', '下载内容', [
      this.btn('下载列表清空', () => {
        if (this.$downloads.inProgressNum > 0) {
          this.$notify.warning('下载任务正在进行，无法清空')
          return
        }

        this.$downloads.clearAll()
        this.$notify.success('下载列表已清空')
      })
    ])

    this.newGrp('internet', '网络配置', [
      this.toggleBtn(
        '采集请求跟随 IE 代理配置',
        async (value: boolean) => {
          try {
            await (window as any).AppAction._utilsReqIeProxy(value)
            this.set('ReqIeProxy', value)
          } catch {
            console.error('AppAction._utilsReqIeProxy 调用失败')
            return false
          }
        },
        !!this.get('ReqIeProxy')
      )
    ])

    this.newGrp('maintenance', '维护', [
      this.btn('日志文件清理', () => {
        (window as any).AppAction.logFileClear().then(() => {
          this.$notify.success('日志文件已清理')
        })
      }),
      this.btn('检查更新', () => {
        this.$updater.open()
        this.$store.commit('ui/setSidebar', null)
      })
    ])

    this.newGrp('about', '关于', [
      this.doubleLine(
        '主程序版本号',
        this.$appData.appVersion
      ),
      this.doubleLine(
        '作者',
        '<a href="https://github.com/qwqcode" target="_blank">qwqcode</a>'
      ),
      this.doubleLine('联系', '1149527164@qq.com'),
      this.doubleLine(
        '博客',
        '<a href="https://qwqaq.com" target="_blank">qwqaq.com</a>'
      ),
      this.doubleLine(
        'GitHub',
        '<a href="https://github.com/qwqcode/Nacollector" target="_blank">qwqcode/Nacollector</a>'
      ),
      this.doubleLine(
        '反馈问题',
        '<a href="https://github.com/qwqcode/Nacollector/issues" target="_blank">GitHub issue</a>'
      ),
      this.doubleLine(
        '',
        '<a href="https://raw.githubusercontent.com/qwqcode/Nacollector/master/LICENSE" target="_blank">您使用 Nacollector 即视为您已阅读并同意本《Nacollector 用户使用许可协议》的约束</a>'
      ),
      this.doubleLine(
        '',
        `<a href="https://github.com/qwqcode/Nacollector" target="_blank">Nacollector</a> Copyright (C) ${new Date().getFullYear()} <a href="https://qwqaq.com" target="_blank">qwqaq.com</a>`
      )
    ])
  }

  newGrp (name: string, label: string, items: SettingItem[]) {
    this.list.push({ name, label, items })
  }

  btn (label: string, clickEvt: Function): SettingItem {
    return {
      type: 'btn',
      opts: { label, clickEvt }
    }
  }

  toggleBtn (
    label: string,
    clickEvt: (afterValue: boolean) => boolean|void|Promise<boolean|undefined>,
    defaultVal?: boolean
  ): SettingItem {
    defaultVal = typeof defaultVal === 'undefined' ? false : defaultVal

    return {
      type: 'toggle-btn',
      opts: { label, clickEvt, value: defaultVal }
    }
  }

  async onToggleClick (item: SettingItem) {
    if (typeof item.opts.value !== 'boolean') {
      throw new TypeError('onToggleClick(): item.opts.value 必须为 boolean 类型')
    }
    if (typeof item.opts.clickEvt === 'function') {
      const result = await item.opts.clickEvt(!item.opts.value)
      if (result === undefined || result === true) {
        item.opts.value = !item.opts.value
      }
    }
  }

  doubleLine (label: string, value: string): SettingItem {
    return {
      type: 'double-line',
      opts: { label, value }
    }
  }
}

interface SettingGrp {
  name: string
  label: string
  items: SettingItem[]
}

interface SettingItem {
  type: 'btn' | 'toggle-btn' | 'double-line'
  opts: any
}
</script>

<style lang="scss" scoped>
.settings {
  .setting-grp {
    .grp-title {
      color: #008eff;
      font-size: 13px;
      font-weight: 500;
      margin: 20px 0 5px;
      line-height: 1;
      padding: 0 20px;
    }

    .item {
      display: flex;
      align-items: center;
      min-height: 56px;
      padding: 0;
      font-size: 15px;

      &:not(:last-child) {
        border-bottom: 1px solid hsla(0, 0%, 78%, 0.3);
      }
    }

    .item.btn-type > div,
    .item.toggle-btn-type > div {
      color: #212121;
      width: 100%;
      cursor: pointer;
      transition: all 0.45s cubic-bezier(0.23, 1, 0.32, 1) 0ms;
      outline: none;
      padding: 0 20px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .item.toggle-btn-type > div {
      .left-text {
        float: left;
        position: relative;
        display: block;
        width: calc(100% - 46px);
      }

      .toggle {
        float: left;
        position: relative;
        display: block;
        width: 36px;
        margin-right: 0;
        margin-left: 8px;
        padding: 4px 0 6px 2px;
        transition: all 0.45s cubic-bezier(0.23, 1, 0.32, 1) 0ms;
        &.turn-on {
          .toggle-bar {
            background-color: rgba(33, 150, 243, 0.5);
          }

          .toggle-circle {
            background-color: #008eff;
            margin-left: 20px;
          }
        }

        .toggle-bar {
          transition: all 0.45s cubic-bezier(0.23, 1, 0.32, 1) 0ms;
          width: 100%;
          height: 14px;
          border-radius: 30px;
          background-color: #bdbdbd;
        }

        .toggle-circle {
          background-color: #f5f5f5;
          transition: all 0.45s cubic-bezier(0.23, 1, 0.32, 1) 0ms;
          box-shadow: 0 1px 6px rgba(0, 0, 0, 0.12),
            0 1px 4px rgba(0, 0, 0, 0.12);
          border-radius: 50%;
          position: absolute;
          top: 1px;
          left: 0;
          width: 20px;
          height: 20px;
          line-height: 24px;
        }
      }
    }

    .item.double-line-type > div {
      overflow: hidden;
      padding: 0 20px;

      .label {
        display: block;
        color: #212121;
        margin-bottom: 1px;
        font-size: 13px;
      }

      .value {
        display: block;
        color: #757575;
        font-size: 13px;

        /deep/ a {
          color: #757575;
          text-decoration: none;
        }
      }
    }
  }
}
</style>
