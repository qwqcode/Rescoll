<template>
  <div class="sidebar-wrap">
    <div class="sidebar">
      <div class="header">
        <div class="title">TASK</div>
        <div class="create-btn"><i class="zmdi zmdi-plus"></i></div>
      </div>
      <div class="task-list">
        <div class="inner">
          <div
            v-for="(item, key) in tasks"
            :key="key"
            class="task-item"
            :class="{ active: key === 0 }"
          >
            <div class="info">
              <div class="icon">
                <i class="zmdi" :class="[`zmdi-${item.icon}`]"></i>
              </div>
              <div class="name">{{ item.name }}</div>
            </div>
            <div class="btn-group"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class SideBar extends Vue {
  tasks: { name: string; icon: string }[] = [
    { name: '探索', icon: 'home' },
    { name: 'TESTING', icon: 'portable-wifi' }
  ]
}
</script>

<style lang="scss" scoped>
.sidebar-wrap {
  position: fixed;
  top: 65px;
  left: 1px;
}

.sidebar {
  position: relative;
  width: 250px;
  height: calc(100vh - 65px - 1px);
  background-color: #21252b;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px;
  padding: 10px 0;

  .header {
    display: flex;
    height: 30px;
    padding: 0 0 0 15px;
    flex-direction: row;
    align-items: center;
    border-left: 2px solid rgba(93, 93, 93, 0.42);

    .title {
      font-family: 'SAOUI';
      flex: 1;
      font-size: 20px;
    }

    .create-btn {
      flex-basis: 35px;
      height: 30px;
      line-height: 30px;
      width: 35px;
      text-align: center;
      cursor: pointer;
      user-select: none;

      &:hover {
        background-color: hsla(0, 0%, 100%, 0.1);
      }
    }
  }

  .task-list {
    & > .inner {
      margin: 10px 0;
    }

    .task-item {
      display: flex;
      align-items: center;
      flex-direction: row;
      border-radius: 2px;
      cursor: pointer;
      transition: background 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

      &:hover,
      &.active {
        background-color: #2c313a;
      }

      .info {
        display: flex;
        flex: 1px;
        flex-direction: row;
        align-items: center;
        color: #fff;
        padding: 7px 15px;

        .icon {
          flex-basis: 30px;
        }

        .name {
          flex: 1;
          font-size: 14px;
        }
      }

      .btn-group {
        flex-basis: 40px;
        padding: 7px 15px;
      }
    }
  }
}
</style>
