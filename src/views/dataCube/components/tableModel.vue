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
    <el-table-column v-if="isJumpTo" label="操作" fixed="right" align="center" width="100">
      <template slot-scope="scope">
        <el-button
          size="mini"
          type="text"
          @click="handleJumpModel(scope.row)"
        >详情</el-button>
      </template>
    </el-table-column>
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
    },
    isJumpTo: {
      type: Number,
      default: 0
    },
    dataModelJumpToVo: {
      type: Object,
      default: () => {
        return {
          jumpToModelId: null,
          modelId: null,
          jumpToOperateParams: []
        };
      }
    }
  },
  methods: {
    moneyFormatter(row, column, cellValue, index, item) {
      if (item.dataItemInfo.itemType === 'money') {
        return this.money(cellValue);
      } else {
        return cellValue;
      }
    },
    // 跳转模型
    handleJumpModel(row) {
      const query = {};
      this.dataModelJumpToVo.jumpToOperateParams.forEach(el => {
        query[el.targetParam] = row[el.sourceParam];
      });
      this.$router.push({
        name: 'DataGeneralTable/' + this.dataModelJumpToVo.jumpToModelId,
        query: query
      });
    }
  }
};
</script>
