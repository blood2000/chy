<template>
  <div class="statement-index">
    <div v-show="showSearch" ref="searchBox" class="app-container app-container--search">
      <el-form
        ref="queryForm"
        :model="queryParams"
        :inline="true"
      >
        <el-form-item
          label="批次号"
          prop="batchNo"
        >
          <el-input
            v-model.trim="queryParams.batchNo"
            placeholder="请输入批次号"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="handleQuery"
          >
            搜索
          </el-button>
          <el-button
            type="primary"
            plain
            icon="el-icon-refresh"
            size="mini"
            @click="resetQuery"
          >
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="app-container">
      <el-row
        :gutter="10"
        class="mb8"
      >
        <right-toolbar
          :show-search.sync="showSearch"
          @queryTable="getList"
        />
      </el-row>

      <el-table v-loading="loading" highlight-current-row border :data="infoList">
        <el-table-column label="序号" align="center" fixed="left" type="index" min-width="5%" />
        <el-table-column label="批次号" align="center" prop="batchNo" />
        <el-table-column label="项目" align="center" prop="projectName" />
        <el-table-column label="渣土场" align="center" prop="ztcName" />
        <!-- <el-table-column label="货主" align="center" prop="adminName" /> -->
        <el-table-column label="调度者" align="center" prop="teamName" />
        <el-table-column label="总金额" align="center" prop="shipperRealPay" />
        <el-table-column label="打款时间" align="center" prop="updateTime">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="left" prop="edit" width="160">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleDetail(scope.row)"
            >运单详情</el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleDriver(scope.row)"
            >现金详情</el-button>
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
    </div>

    <!-- 运单详情 对话框 -->
    <!-- <detail-dialog ref="DetailDialog" :current-id="currentId" :title="title" :open.sync="open" :disable="formDisable" @refresh="getList" /> -->
    <el-dialog class="i-adjust" title="运单详情" :visible.sync="openStatementsInfo" width="1200px" append-to-body>
      <StatementsInfo v-if="openStatementsInfo" :print-data="a_dataList" />
    </el-dialog>
    <!-- 现金详情 对话框 -->
    <driver-dialog ref="DriverDialog" :open.sync="driverOpen" :batch-no="batchNo" />

  </div>
</template>

<script>
import { getBatchStatementList } from '@/api/wallet/wallet';
// 运单详情弹窗
// import DetailDialog from '@/views/waybill/components/detailDialog';
import DriverDialog from './driverDialog';
import StatementsInfo from '@/components/MuckProject/components/StatementsInfo';
export default {
  name: 'Statement',
  components: {
    // DetailDialog,
    DriverDialog,
    StatementsInfo
  },
  data() {
    return {
      // 遮罩层
      loading: false,
      // 选中数组
      ids: [],
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表格数据
      infoList: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        batchNo: null
      },
      // 运输单详情弹窗
      currentId: null,
      title: '',
      open: false,
      formDisable: false,
      // 司机弹窗
      batchNo: null,
      driverOpen: false,
      // 运单详情
      openStatementsInfo: false,
      a_dataList: null
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      getBatchStatementList(this.queryParams).then(response => {
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
      this.resetForm('queryForm');
      this.handleQuery();
    },
    handleDriver(row) {
      this.batchNo = row.batchNo;
      this.driverOpen = true;
    },
    handleDetail(row) {
      // this.$refs.DetailDialog.reset();
      // this.currentId = row.wayBillCode;
      // this.open = true;
      // this.title = '运输单信息';
      // this.formDisable = true;
      this.a_dataList = { batchNo: row.batchNo };
      this.openStatementsInfo = true;
    }
  }
};
</script>
