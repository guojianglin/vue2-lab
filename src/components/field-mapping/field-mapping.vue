<template>
  <div class="field-mapping">
    <source-table ref="sourceTable" :tableColumns="options.source.columns" :tableData="options.source.data">
      <template #column="slotScope">
        <slot name="source-column" :data="slotScope"></slot>
      </template>
    </source-table>
    <target-table ref="targetTable" :tableColumns="options.target.columns" :tableData="options.target.data">
      <template #column="slotScope">
        <slot name="target-column" :data="slotScope"></slot>
      </template>
    </target-table>
    <draw-arrow></draw-arrow>
  </div>
</template>

<script>
  import SourceTable from './source-table/source-table.vue';
  import TargetTable from './target-table/target-table.vue';
  import DrawArrow from './draw-arrow/draw-arrow.vue';
  export default {
    name: 'vue-field-mapping',
    props: {
      options: {
        type: Object,
        default: () => {
          return {
            source: {
              data: [],
              columns: [],
            },
            target: {
              data: [],
              columns: [],
            },
            relation: [],
          }
        }
      }
    },
    components: {
      SourceTable,
      TargetTable,
      DrawArrow
    },
    data() {
      return {
        relation: []
      }
    },
    computed: {
      sourceTableRef() {
        return this.$refs.sourceTable; 
      },
      targetTableRef() {
        return this.$refs.targetTable;
      }
    },
    watch: {
      'options.relation': {
        handler: function (val) {
          this.$nextTick(() => {
            this.relation = val;
            console.log('this.relation: ', this.relation);
          });
        },
        deep: true,
        immediate: true
      }
    }
  }
</script>

<style lang="scss" scoped>
.field-mapping {
  display: flex;
  color: #666;
  justify-content: space-between;
  position: relative;
  font-size: 14px;
}
</style>