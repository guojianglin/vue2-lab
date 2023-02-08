<template>
  <div class="field-mapping" ref="fieldMapping">
    <source-table
      ref="sourceTable"
      :tableColumns="options.source.columns"
      :tableData.sync="source"
      :drawing="drawing"
      :sourceTarget="sourceTarget"
      :currentRelation="currentRelation"
      @changeActive="changeActive"
    >
      <template #column="slotScope">
        <slot name="source-column" :data="slotScope"></slot>
      </template>
    </source-table>

    <target-table
      ref="targetTable"
      :tableColumns="options.target.columns"
      :tableData.sync="target"
      :drawing="drawing"
      :currentRelation="currentRelation"
      @changeActive="changeActive"
    >
      <template #column="slotScope">
        <slot name="target-column" :data="slotScope"></slot>
      </template>
    </target-table>

    <draw-arrow
      :relation="relation"
      :sourceData="source"
      :targetData="target"
      :currentRelation="currentRelation"
      @changeDrawing="changeDrawing"
      @changeSourceTarget="changeSourceTarget"
      @changeRelation="changeRelation"
    ></draw-arrow>
  </div>
</template>

<script>
  import SourceTable from './source-table/source-table.vue';
  import TargetTable from './target-table/target-table.vue';
  import DrawArrow from './draw-arrow/draw-arrow.vue';
  import { getOffset, deepCopy } from './utils.js';
  export default {
    name: 'field-mapping',
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
        relation: [],
        source: [],
        target: [],
        drawing: false,
        sourceTarget: {},
        currentRelation: {},
      }
    },
    watch: {
      'options.relation': {
        handler: function (val) {
          if (!val.length) return;
          this.$nextTick(() => {
            this.updateRelation();
          });
        },
      },
      'options.source.data': {
        handler: function (val) {
          if (!val.length) return;
          this.updateSource(val);
        },
        immediate: true,
      },
      'options.target.data': {
        handler: function (val) {
          if (!val.length) return;
          this.updateTarget(val);
        },
        immediate: true,
      },
      source: {
        handler: function (val) {
          if (!val.length) return;
          this.updateRelation();
        },
      },
      target: {
        handler: function (val) {
          if (!val.length) return;
          this.updateRelation();
        },
      },
      relation: {
        handler: function () {
          this.updateIconStatus()
        },
      },
    },
    methods: {
      changeActive (key, tableType) {
        // 根据key找到 currentRelation
        if (!this.relation.length) return;
        const relation = this.relation.find(item => item[tableType].key === key);
        if (relation) {
          this.currentRelation = relation;
        } else {
          this.currentRelation = {};
        }
      },
      changeDrawing(bool) {
        this.drawing = bool;
      },
      changeSourceTarget (val) {
        this.sourceTarget = val;
      },
      changeRelation(relation) {
        this.updateRelation(relation)
      },
      updateIconStatus () {
        const relationArr = this.relation;
        this.source.forEach(item => {
          item.iconShow = 'hidden';
          for (let index = 0; index < relationArr.length; index++) {
            const element = relationArr[index];
            if (element.source.key === item.key) {
              item.iconShow = 'visible';
              break;
            }            
          }
        });
        this.target.forEach(item => {
          item.iconShow = 'hidden';
          for (let index = 0; index < relationArr.length; index++) {
            const element = relationArr[index];
            if (element.target.key === item.key) {
              item.iconShow = 'visible';
              break;
            }            
          }
        });
      },
      updateSource (data) {
        this.source = data.map(item => {
          let iconShow = 'hidden';
          const relationArr = this.relation.length ? this.relation : this.options.relation;
          for (let index = 0; index < relationArr.length; index++) {
            const element = relationArr[index];
            if (element.source.key === item.key) {
              iconShow = 'visible';
              break;
            }            
          }
          return {
            ...item,
            iconShow,
          }
        });
      },
      updateTarget (data) {
        this.target = data.map(item => {
          let iconShow = 'hidden';
          const relationArr = this.relation.length ? this.relation : this.options.relation;
          for (let index = 0; index < relationArr.length; index++) {
            const element = relationArr[index];
            if (element.target.key === item.key) {
              iconShow = 'visible';
              break;
            }            
          }
          return {
            ...item,
            iconShow,
          }
        });
      },
      updateRelation(relation) {
        const baseXY = getOffset(this.$refs.fieldMapping);
        // options 数据 兜底
        const sourceData = this.source.length ? this.source : this.options.source.data;
        const targetData = this.target.length ? this.target : this.options.target.data;
        const relationData = this.relation.length ? this.relation : this.options.relation;
        // 有relation参数时，优先用relation参数
        this.relation = deepCopy(relation ? relation: relationData).map(item => {
          let sourceNum;
          let targetNum;
          
          const sourceEle = this.$refs.sourceTable.$el.querySelector('.table-content');
          const targetEle = this.$refs.targetTable.$el.querySelector('.table-content');
          const sourceName = item.source.key;
          const targetName = item.target.key;
          sourceData.forEach((n, i) => {
            if (n.key === sourceName) {
              sourceNum = i;
            }
          });
          targetData.forEach((n, i) => {
            if (n.key === targetName) {
              targetNum = i;
            }
          });
          if(typeof sourceNum === 'undefined' || typeof targetNum === 'undefined') {
            return null;
          }
          const sourcePoint = sourceEle.querySelectorAll('.row')[sourceNum] && sourceEle.querySelectorAll('.row')[sourceNum].querySelector('.row-icon');
          const targetPoint = targetEle.querySelectorAll('.row')[targetNum] && targetEle.querySelectorAll('.row')[targetNum].querySelector('.row-icon');
          item.source.x = getOffset(sourcePoint).left - baseXY.left + 6;
          item.source.y = getOffset(sourcePoint).top - baseXY.top + 6;
          item.target.x = getOffset(targetPoint).left - baseXY.left + 3;
          item.target.y = getOffset(targetPoint).top - baseXY.top + 6;
          return item;
        })
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.updateRelation();
      });
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
<style>
body.user-select-none {
  -moz-user-select:none;
  -webkit-user-select:none;
  -ms-user-select:none;
  user-select:none;
}
* {
  box-sizing: border-box;
}
</style>