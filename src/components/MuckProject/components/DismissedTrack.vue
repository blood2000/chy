<template>
  <el-popover
    placement="right"
    trigger="click"
    @show="()=>{ !gridData.length && getList()}"
  >
    <div>
      <div class="mb20 mt20 b f20">
        运单轨迹列表
      </div>
      <el-table v-loading="loading" :data="gridData" :height="300" :row-class-name="tableRowClassName">
        <el-table-column sortable width="200" property="operateTime" label="日期">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.operateTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="200" property="opName" label="操作人" />
        <el-table-column align="center" width="200" property="operateContent" label="动作" />
        <el-table-column align="center" width="200" property="operateType" label="是否被驳回">
          <template slot-scope="scope">
            <span>{{ scope.row.operateType === 1? '否':'是' }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="200" property="remark" label="备注">
          <template slot-scope="scope">
            <span>{{ scope.row.remark || '-' }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column width="150" property="oldStatus" label="驳回前状态">
          <template slot-scope="scope">
            <span>{{ selectDictLabel(statusOptions, scope.row.oldStatus) }}</span>
          </template>
        </el-table-column> -->
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>
    <span slot="reference" class="shou g-color-success">{{ batchNo }}</span>
  </el-popover>
</template>

<script>
import { rejectList, rejectListApi } from '@/api/finance/reject';
export default {
  name: 'DismissedTrack',
  props: {
    batchNo: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tableColumnsConfig: [],
      loading: false,
      // 查询参数
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        operate_type: undefined,
        batchNo: undefined
      },

      gridData: [],

      statusOptions: [
        { dictLabel: '核验驳回', dictValue: -1 },
        { dictLabel: '已核算', dictValue: 0 },
        { dictLabel: '已核验', dictValue: 1 },
        { dictLabel: '已索票', dictValue: 2 },
        { dictLabel: '已开票', dictValue: 3 },
        { dictLabel: '已打款', dictValue: 4 }
      ]
    };
  },

  methods: {
    init() {
      this.tableHeaderConfig(this.tableColumnsConfig, rejectListApi);
      this.getList();
    },
    /** 查询发票驳回列表 */
    getList() {
      this.loading = true;
      this.queryParams.batchNo = this.batchNo;
      rejectList(this.queryParams).then(response => {
        this.gridData = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.operateType === 0) {
        return 'dismissedTrack-warning-row';
      }
      return '';
    }
  }

};
</script>

<style>
.el-table .dismissedTrack-warning-row {
  background: #fab6b6;
}

</style>
