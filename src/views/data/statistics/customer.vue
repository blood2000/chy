<template>
  <div>
    <div v-show="showSearch" class="app-container app-container--search">
      <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="90px">
        <el-form-item label="客户名称" prop="companyName">
          <el-input
            v-model="queryParams.companyName"
            placeholder="请输入客户名称"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="手机号码" prop="shipmentPhone">
          <el-input
            v-model="queryParams.shipmentPhone"
            placeholder="请输入手机号码"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="查询日期" prop="queryTime">
          <el-date-picker
            v-model="queryTime"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 228px"
            @change="datechoose"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button type="primary" plain icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="app-container">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            v-hasPermi="['assets:vehicle:edit']"
            type="primary"
            icon="el-icon-upload2"
            size="mini"
            @click="handleExport"
          >导出</el-button>
        </el-col>
        <el-col :span="1.5" style="float: right;">
          <tablec-cascader v-model="tableColumnsConfig" :lcokey="api" />
        </el-col>
        <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
      </el-row>

      <RefactorTable :loading="loading" :summary="summary" :data="customerList" :table-columns-config="tableColumnsConfig" :summary-method="getSummaries"><!-- @selection-change="handleSelectionChange" -->
        <!-- <template #driverType="{row}">
          <span>{{ selectDictLabel(driverTypeOptions, row.driverType) }}</span>
        </template> -->
        <!-- <template #updateTime="{row}">
          <span>{{ parseTime(row.updateTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template> -->
      </RefactorTable>

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />

    </div>
  </div>
</template>

<script>
import { listCustomerApi, listCustomer, countCustomer } from '@/api/data/statistics';
// import tableColumnsConfig from './config';

export default {
  name: 'Customer',
  components: {
  },
  data() {
    return {
      tableColumnsConfig: [],
      api: listCustomerApi,
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 客服统计报表表格数据
      customerList: [],
      // 客服报表统计数据
      customerCount: {},
      queryTime: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        companyName: null,
        shipmentPhone: null,
        beginTime: null,
        endTime: null,
        haveCondition: false
      },
      // 合计
      summary: true
    };
  },
  created() {
    this.tableHeaderConfig(this.tableColumnsConfig, listCustomerApi, { });
    this.getList();
  },
  methods: {
    // 表尾合计行
    getSummaries(param) {
      // console.log(param);
      const { columns, data } = param;
      const sums = [];
      console.log(data);
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        switch (column.property) {
          case 'accConfirmedServiceFee':
            sums[index] = this.customerCount.accConfirmedServiceFeeCount;
            break;
          case 'closingBalance':
            sums[index] = this.customerCount.accountBalanceCount;
            break;
          case 'arrearsAmount':
            sums[index] = this.customerCount.arrearsAmountCount;
            break;
          case 'confirmFreight':
            sums[index] = this.customerCount.confirmFreightCount;
            break;
          case 'conformService':
            sums[index] = this.customerCount.conformServiceCount;
            break;
          case 'cumConfirmedFreight':
            sums[index] = this.customerCount.cumConfirmedFreightCount;
            break;
          case 'cumEstimatedFreight':
            sums[index] = this.customerCount.cumEstimatedFreightCount;
            break;
          case 'cumEstimatedService':
            sums[index] = this.customerCount.cumEstimatedServiceCount;
            break;
          case 'dailyFreight':
            sums[index] = this.customerCount.dailyFreightCount;
            break;
          case 'dayFreightInvoiceAmount':
            sums[index] = this.customerCount.dayFreightInvoiceAmountCount;
            break;
          case 'deliveryCount':
            sums[index] = this.customerCount.deliveryCountCount;
            break;
          case 'deliveryCountDay':
            sums[index] = this.customerCount.deliveryCountDayCount;
            break;
          case 'driverCount':
            sums[index] = this.customerCount.driverCountCount;
            break;
          case 'freightAmount':
            sums[index] = this.customerCount.freightAmountCount;
            break;
          case 'freightInvoiceAmount':
            sums[index] = this.customerCount.freightInvoiceAmountCount;
            break;
          case 'paidAmount':
            sums[index] = this.customerCount.paidAmountCount;
            break;
          case 'prepaidFreight':
            sums[index] = this.customerCount.prepaidFreightCount;
            break;
          case 'prepaidService':
            sums[index] = this.customerCount.prepaidServiceCount;
            break;
          case 'serviceAmount':
            sums[index] = this.customerCount.serviceAmountCount;
            break;
          case 'totalRefund':
            sums[index] = this.customerCount.totalRefundCount;
            break;
          case 'waybillCount':
            sums[index] = this.customerCount.waybillCountCount;
            break;
          default:
            break;
        }
      });
      // console.log(sums);
      return sums;
    },
    // 搜索时间选择
    datechoose(date) {
      if (date) {
        this.queryParams.beginTime = this.parseTime(date[0], '{y}-{m}-{d}');
        this.queryParams.endTime = this.parseTime(date[1], '{y}-{m}-{d}');
      } else {
        this.queryParams.beginTime = null;
        this.queryParams.endTime = null;
      }
    },
    /** 查询客服统计报表列表 */
    getList() {
      this.loading = true;
      listCustomer(this.queryParams).then(response => {
        console.log(response);
        this.customerList = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
      // 查询列表合计
      if (this.queryParams.companyName || this.queryParams.shipmentPhone || this.queryParams.beginTime) {
        this.queryParams.haveCondition = true;
      } else {
        this.queryParams.haveCondition = false;
      }
      countCustomer(this.queryParams).then(response => {
        console.log(response);
        this.customerCount = response.data;
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
      this.queryTime = [];
      this.queryParams.beginTime = null;
      this.queryParams.endTime = null;
      this.handleQuery();
    },
    // 导出
    handleExport() {
      this.download('/transportation/invoice/listWayBill', { ...this.queryParams }, `askfor_${new Date().getTime()}.xlsx`);
    }
  }
};
</script>
