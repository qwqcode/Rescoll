<template>
  <div class="terminal">
    <div class="line">
      This is Test Terminal
    </div>
    <div class="line" data-level="S">
      <span class="tag">[成功]</span>
      <span class="text">
        This is Test Terminal. This is Test Terminal. This is Test Terminal. This is Test Terminal.This is Test Terminal. This is Test Terminal. This is Test Terminal. This is Test Terminal.This is Test Terminal. This is Test Terminal. This is Test Terminal. This is Test Terminal.
      </span>
    </div>
    <div class="line" data-level="E">
      <span class="tag">[错误]</span>
      <span class="text">
        This is Test Terminal
      </span>
    </div>
    <div class="line" data-level="W">
      <span class="tag">[警告]</span><span class="text">
        This is Test Terminal
      </span>
    </div>
    <div class="line" data-level="I">
      <span class="tag">[消息]</span><span class="text">
        This is Test Terminal
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

export default class Terminal extends Vue {}
</script>

<style lang="scss" scoped>
.terminal {
  .line {
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
