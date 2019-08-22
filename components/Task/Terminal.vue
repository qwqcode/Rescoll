<template>
  <div class="terminal">
    <div v-for="(line, i) in task.terminal.lines" :key="i" class="line" :data-level="line.level">
      <span v-if="!!line.level" class="tag">[{{ { I: '消息', S: '成功', W: '警告', E: '错误' }[line.level] }}]</span>
      <span class="text" v-html="line.text" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'nuxt-property-decorator'
import Task from '~/core/models/Task'

@Component
export default class Terminal extends Vue {
  @Prop({ required: true })
  task!: Task

  @Watch('task.terminal.lines')
  onLinesChanged () {
    this.keepBottom()
  }

  @Watch('task.isInProgress')
  onIsInProgressChanged () {
    this.keepBottom()
  }

  mounted () {
    this.keepBottom()
  }

  /** 保持置于底部 */
  keepBottom () {
    this.$el.scrollTop = this.$el.scrollHeight
  }
}
</script>

<style lang="scss" scoped>
.terminal {
  background: #161d29;
  padding: 30px 35px;
  @extend %app-content;

  /deep/ .line {
    display: block;
    overflow: hidden;
    position: relative;
    display: block;
    animation: fadeIn .3s;
    color: #cacaca;
    margin-bottom: 8px;
    font-size: 16px;

    & > * {
      display: inline;
    }

    & > .tag {
      margin-right: 7px;
    }

    & > .text {
      word-break: break-all;

      a {
        text-decoration: none;
        color: hsla(0,0%,100%,.9);

        &:hover {
          color: #fff
        }
      }
    }

    &[data-level=I] {
      color: #38a5ff
    }

    &[data-level=S] {
      color: #32f388
    }

    &[data-level=W] {
      color: #ffc761
    }

    &[data-level=E] {
    color: #ff4545
    }
  }
}
</style>
