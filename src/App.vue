<template>
  <div id="app">
    <div style="width: 800px">
      <field-mapping :options="options">
        <template #source-column="slotScope">
          <div v-if="slotScope.data.column === 'desc'">
            自定义描述：{{slotScope.data.row.desc}}
          </div>
          <div v-if="slotScope.data.column === 'operate'" type="text" size="mini" @click="handleCheckDetail(slotScope.data.row)">查看详情</div>
        </template>
      </field-mapping>
    </div>
  </div>
</template>

<script>
import FieldMapping from './components/field-mapping/field-mapping.vue'
export default {
  name: 'App',
  components: {
    FieldMapping
  },
  data() {
    const sourceData = new Array(7).fill().map((item, idx) => ({
        name: `field${idx + 1}`,
        type: 'string',
        key: `field${idx + 1}`,
        desc: `这是表字段field${idx + 1}`,
        operate: `测试${idx}`
      }));
    const targetData = new Array(11).fill().map((item, idx) => ({
        name: `field${idx + 4}`,
        type: 'string',
        key: `field${idx + 4}`
      }));
    const relation = [{
      source: {
        name: "field1",
        key: "field1"
      },
      target: {
        name: "field5",
        key: "field5"
      }
    }, {
      source: {
        name: "field2",
        key: "field2"
      },
      target: {
        name: "field6",
        key: "field6"
      }
    }, {
      source: {
        name: "field3",
        key: "field3"
      },
      target: {
        name: "field4",
        key: "field4"
      }
    }];
    const sourceCols = [
      { title: '源表字段', key: 'name', width: '80px' },
      { title: '类型', key: 'type', width: '100px' },
      { title: '描述', key: 'desc', width: '150px', custom: true },
      { title: '操作', key: 'operate', width: '80px', align: 'center', custom: true }, 
    ];
    const targetCols = [
      { title: '目标表字段', key: 'name', width: '50%' },
      { title: '类型', key: 'type', width: '50%' }
    ];

    return {
      options: {
        source: {
          data: sourceData,
          columns: sourceCols,
        },
        target: {
          data: targetData,
          onChange: (data) => {
            this.setState({
              targetData: data
            });
          },
          columns: targetCols,
        },
        relation,
      }
    }
  },
  methods: {
    handleCheckDetail(row) {
      console.log('row: ', row);
    }
  }
}
</script>

<style>
</style>
