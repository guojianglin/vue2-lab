<template>
  <div class="target-table">
    <div class="table-title">
      <div class="column-item" v-for="item in tableColumns" :key="item.key" :style="{width: item.width, 'text-align': item.align }">{{item.title}}</div>
    </div>

    <div class="table-content">
      <div class="row" v-for="(row, index) in tableData" :key="index">
        <div class="column-item" v-for="item in tableColumns" :key="item.key" :style="{width: item.width, 'text-align': item.align }">
          <template v-if="item.custom">
            <slot name="column" :row="row" :index="index" :column="item.key"></slot>
          </template>
          <template v-else>
            {{row[item.key]}}
          </template>
        </div>
        <div class="row-icon"></div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'target-table',
    props: {
      tableData: {
        type: Array,
        default: () => {
          return [];
        }
      },
      tableColumns: {
        type: Array,
        default: () => {
          return [];
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
.target-table {
  min-width: 208px;
  position: relative;
  z-index: 3;

  .table-title {
    display: flex;
    padding-right: 8px;
    height: 36px;
    line-height: 36px;
    background-color: #fcfcfc;
    border-bottom: 1px dashed #dddddd;

    &.active {
      background-color: #eefbff;
    }

    .column-item {
      padding-left: 20px;
      width: 100px;
      height: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .table-content {
    .row {
      display: flex;
      padding-right: 8px;
      height: 36px;
      line-height: 36px;
      background-color: #fcfcfc;
      border-bottom: 1px dashed #dddddd;
      position: relative;

      .column-item {
        padding-left: 20px;
        width: 100px;
        height: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .row-icon {
        visibility: hidden;
        position: absolute;
        box-sizing: border-box;
        top: calc(50% - 7px);
        width: 14px;
        left: -7px;
        height: 14px;
        border-radius: 14px;
        background-color: #FFF;
        padding: 4px;
        box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.2);
        cursor: crosshair;
        &:before {
          content: '';
          display: inline-block;
          position: absolute;
          top: 4px;
          background-color: #33B5D4;
          width: 6px;
          height: 6px;
          border-radius: 6px;
          box-shadow: 0px 0.5px 1.5px rgba(0, 0, 0, 0.22) inset;
        }
      }
    }

  }
}
</style>