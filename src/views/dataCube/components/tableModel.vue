<template>
  <el-table v-loading="loading" highlight-current-row border :data="dataList">
    <el-table-column type="index" label="序号" fixed="left" align="center" width="50" />
    <el-table-column
      v-for="(item, index) in dataModelDto.tableFields"
      :key="item.dataItemInfo.itemEn + index"
      :prop="item.functionType ? item.functionFieldAlias : `${item.nodeId}_${item.dataItemInfo.itemEn}`"
      align="center"
      :label="item.fieldLabel"
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
    }
  }
};
</script>
