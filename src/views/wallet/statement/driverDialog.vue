<template>
  <el-dialog
    :visible="visible"
    width="1200px"
    title="现金详情"
    append-to-body
    @close="cancel"
  >
    <!-- <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="100px">
      <el-form-item label="批次号" prop="batchNo">
        <el-input
          v-model="queryParams.batchNo"
          placeholder="请输入搜索条件"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button type="primary" plain icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form> -->

    <el-table v-loading="loading" :data="infoList" highlight-current-row border>
      <el-table-column label="序号" align="center" fixed="left" type="index" min-width="5%" />
      <el-table-column label="支付批次号" align="center" prop="bizNo" width="160" />
      <el-table-column label="运单号" align="center" prop="waybillNo" width="160" />
      <el-table-column label="司机姓名" align="center" prop="driverName" />
      <el-table-column label="司机电话" align="center" prop="driverPhone" />
      <el-table-column label="金额" align="center" prop="deliveryCashFee">
        <template slot-scope="scope">
          <span>{{ floor(scope.row.deliveryCashFee) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="留存运费" align="center" prop="fee">
        <template slot-scope="scope">
          <span>{{ floor(scope.row.fee) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="打款结果" align="center" prop="responseStatus">
        <template slot-scope="scope">
          <span v-if="scope.row.responseStatus === 0">处理中</span>
          <span v-if="scope.row.responseStatus === 1">成功</span>
          <span v-if="scope.row.responseStatus === 2">失败</span>
          <span v-if="scope.row.responseStatus === 3">异常</span>
        </template>
      </el-table-column>
      <el-table-column label="到账时间" align="center" prop="finishDate" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.finishDate) }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </el-dialog>
</template>

<script>
import { getBatchStatementDetail } from '@/api/wallet/wallet';
export default {
  props: {
    open: Boolean,
    batchNo: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 遮罩层
      loading: false,
      // 选中数组
      ids: [],
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        batchNo: null
      },
      // 字典
      nameOptions: [],
      // 列表
      infoList: []
    };
  },
  computed: {
    visible: {
      get() {
        return this.open;
      },
      set(v) {
        this.$emit('update:open', v);
      }
    }
  },
  watch: {
    open(val) {
      if (val) {
        this.queryParams.batchNo = this.batchNo;
        this.getList();
      }
    }
  },
  methods: {
    getList() {
      this.loading = true;
      getBatchStatementDetail(this.queryParams).then(response => {
        this.loading = false;
        this.infoList = response.rows;
        this.total = response.total;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.reset();
      this.handleQuery();
    },
    // 表单重置
    reset() {
      this.resetForm('queryForm');
    },
    // 取消按钮
    cancel() {
      this.close();
      this.reset();
    },
    // 关闭弹窗
    close() {
      this.$emit('update:open', false);
    }
  }
};
</script>
