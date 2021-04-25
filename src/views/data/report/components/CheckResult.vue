<template>
  <div>
    <el-radio-group v-model="active" size="small" @change="handleActive">
      <el-radio-button v-for="(tab, index) in tabData" :key="index + tab.value" :class="!tab.isOk?'m_red': null" :label="tab.value">{{ tab.label }}</el-radio-button>
    </el-radio-group>


    <RefactorTable
      is-show-index
      :loading="loading"
      :data="list"
      :table-columns-config="tableColumnsConfig"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: '0',
      tabData: [
        {
          label: '驾驶员基本信息',
          value: '0',
          isOk: true
        },
        {
          label: '车辆基本信息',
          value: '1',
          isOk: true
        },
        {
          label: '运单信息',
          value: '2',
          isOk: true
        },
        {
          label: '装货位置',
          value: '3',
          isOk: true
        },
        {
          label: '卸货位置',
          value: '4',
          isOk: true
        },
        {
          label: '资金流水信息',
          value: '5',
          isOk: false
        }

      ],

      /* 表格 */
      loading: false,
      list: [],
      tableColumnsConfig: []
    };
  },

  methods: {
    handleActive() {}
  }
};
</script>

<style scoped>
.m_red /deep/ .el-radio-button__inner{
    color: red;
}
</style>
