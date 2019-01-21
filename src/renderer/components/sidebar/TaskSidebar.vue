<template>
  <div class="task-sidebar-wrap">
    <div class="task-sidebar">
      <div class="header">
        <div class="title">TASK</div>
        <div class="create-btn"><i class="zmdi zmdi-plus"></i></div>
      </div>
      <div class="task-list">
        <div class="inner">
          <div class="task-item" v-for="(item, key) in tasks" :key="key" :class="{'active': (key === 0)}">
            <div class="info">
              <div class="icon"><i class="zmdi" :class="[`zmdi-${item.icon}`]"></i></div>
              <div class="name">{{ item.name }}</div>
            </div>
            <div class="btn-group">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'task-sidebar',
  data () {
    return {
      tasks: [{ name: '探索', icon: 'home' }, { name: 'TESTING', icon: 'portable-wifi' }]
    }
  }
}
</script>

<style lang="scss" scoped>
.task-sidebar-wrap {
  position: fixed;
  top: 65px;
  left: 1px;
}

.task-sidebar {
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
        background-color: hsla(0,0%,100%,.1);
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
      transition: background .2s ease-in-out, box-shadow .2s ease-in-out;

      &:hover, &.active {
        background-color: #2c313a;
      }

      .info {
        display: flex;
        flex: 1px;
        flex-direction: row;
        align-items: center;
        color: #FFF;
        padding: 7px 15px;

        .icon {
          flex-basis: 30px;
        }

        .name {
          flex: 1;
          font-size: 14px;
          font-family: 'Microsoft YaHei Light';
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

