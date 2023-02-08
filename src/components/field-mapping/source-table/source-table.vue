<template>
  <div class="source-table">
    <div class="table-title">
      <div
        v-for="item in tableColumns"
        :key="item.key"
        class="column-item"
        :style="{width: item.width, 'text-align': item.align }"
      >
        {{item.title}}
      </div>
    </div>

    <draggable class="table-content" v-model="sourceTableData">
      <div
        v-for="(row, index) in sourceTableData"
        :key="index"
        :class="['row', { active: currentRelation.source && row.key === currentRelation.source.key }]"
        :data-key="row.key"
        @mouseenter="handleActive(row.key)"
        @mouseleave="handleActive(null)"
      >
        <div
          class="column-item"
          v-for="item in tableColumns"
          :key="item.key"
          :style="{ width: item.width, 'text-align': item.align }"
        >
          <template v-if="item.custom">
            <slot name="column" :row="row" :index="index" :column="item.key"></slot>
          </template>
          <template v-else>
            <div :title="row[item.key]">{{row[item.key]}}</div>
          </template>
        </div>

        <div :class="['row-icon', 'source-row-icon',  row.iconShow, { visible: drawing && row.key === sourceTarget.key}]"></div>
      </div>
    </draggable>
  </div>
</template>

<script>
  import draggable from 'vuedraggable'
  export default {
    name: 'source-table',
    components: {
      draggable
    },
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
      drawing: {
        type: Boolean,
        default: false
      },
      sourceTarget: {
        type: Object,
        default: () => {}
      },
      currentRelation: {
        type: Object,
        default: () => {
          return {};
        }
      },
    },
    computed: {
      sourceTableData: {
        get () {
          return this.tableData
        },
        set (val) {
          this.$emit('update:tableData', val)
        }
      }
    },
    methods: {
      handleActive(key) {
        this.$emit('changeActive', key, 'source');
      }
    }
  }
</script>

<style lang="scss" scoped>
.source-table {
  min-width: 208px;
  position: relative;
  z-index: 3;

  .table-title {
    display: flex;
    padding-right: 8px;
    height: 36px;
    line-height: 36px;
    background-color: #f0f0f0;

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

      &:hover {
        background-color: #eefbff;
        .row-icon {
          visibility: visible !important;
        }
      }

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

      .row-icon {
        &.hidden {
          visibility: hidden;
        }
        &.visible {
          visibility: visible;
        }
        visibility: hidden;
        position: absolute;
        box-sizing: border-box;
        top: calc(50% - 7px);
        width: 14px;
        right: -7px;
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