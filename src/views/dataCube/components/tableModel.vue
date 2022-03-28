<template>
  <el-table v-loading="loading" highlight-current-row border :data="dataList" :height="setHeight ? 88 : null">
    <el-table-column type="index" label="序号" fixed="left" align="center" width="50" />
    <el-table-column
      v-for="(item, index) in dataModelDto.tableFields"
      :key="item.dataItemInfo.itemEn + index"
      :prop="item.functionType ? item.functionFieldAlias : `${item.nodeId}_${item.dataItemInfo.itemEn}`"
      align="center"
      :label="item.fieldLabel"
      :formatter="(row, column, cellValue, index) => moneyFormatter(row, column, cellValue, index, item)"
    />
  </el-table>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    dataList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    dataModelDto: {
      type: Object,
      default: () => {
        return {
          queryFields: [],
          tableFields: [],
          page: {
            pageNum: 1,
            pageSize: 10
          }
        };
      }
    },
    setHeight: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    moneyFormatter(row, column, cellValue, index, item) {
      if (item.dataItemInfo.itemType === 'money') {
        return this.money(cellValue);
      } else {
        return cellValue;
      }
    }
  }
};
</script>
