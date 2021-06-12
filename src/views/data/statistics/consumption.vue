<template>
  <div>
    <div v-show="showSearch" class="app-container app-container--search">
      <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="90px">
        <el-form-item label="公司名称" prop="companyName">
          <el-input
            v-model="queryParams.companyName"
            placeholder="请输入公司名称"
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

      <MoreRefactorTable :loading="loading" :summary="summary" :data="consumptionList" :table-columns-config="tableColumnsConfig" :morelist="morelist" :summary-method="getSummaries">
        <!-- <template #driverType="{row}">
          <span>{{ selectDictLabel(driverTypeOptions, row.driverType) }}</span>
        </template> -->
        <!-- <template #updateTime="{row}">
          <span>{{ parseTime(row.updateTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template> -->
      </MoreRefactorTable>

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList(1)"
      />

      <!-- <el-row type="flex" :gutter="10" class="g-statistics-bg">
        <el-col :span="1">
          <img src="../../../../src/assets/images/icon/total.png" alt="">
        </el-col>
        <el-col :span="2">
          <div class="g-statistics-tag">期初余额：</div>
          <div class="g-statistics-num">1416195.86</div>
        </el-col>
        <el-col :span="2">
          <div class="g-statistics-tag">本期收入：</div>
          <div class="g-statistics-num">100</div>
        </el-col>
        <el-col :span="2">
          <div class="g-statistics-tag">清分支出：</div>
          <div class="g-statistics-num">100</div>
        </el-col>
        <el-col :span="2">
          <div class="g-statistics-tag">本期提现：</div>
          <div class="g-statistics-num">100</div>
        </el-col>
        <el-col :span="2">
          <div class="g-statistics-tag">期末余额：</div>
          <div class="g-statistics-num">100</div>
        </el-col>
      </el-row> -->

    </div>
  </div>
</template>

<script>
import { listConsumptionApi, listConsumption, countConsumption } from '@/api/data/statistics';
// import tableColumnsConfig from './config';

export default {
  name: 'Consumption',
  components: {
  },
  data() {
    return {
      tableColumnsConfig: [],
      api: listConsumptionApi,
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 客户消费明细表格数据
      consumptionList: [],
      // 客户消费统计
      consumptionCount: {},
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
      summary: true,
      morelist: []
    };
  },
  created() {
    this.tableHeaderConfig(this.tableColumnsConfig, listConsumptionApi, { });
    // console.log(this.tableColumnsConfig);
    this.morelist = [{
      label: '本期客户消费',
      children: [{
        label: '运费',
        prop: 'freightAmount',
        width: '100'
      }, {
        label: '已开票运费',
        prop: 'freightInvoiceAmount',
        width: '100'
      }, {
        label: '未开票运费',
        prop: 'freightUnbilledAmount',
        width: '100'
      }, {
        label: '服务费',
        prop: 'serviceAmount',
        width: '100'
      }, {
        label: '已开票服务费',
        prop: 'serviceInvoiceAmount',
        width: '100'
      }, {
        label: '未开票服务费',
        prop: 'serviceUnbilledAmount',
        width: '100'
      }, {
        label: '消费合计',
        prop: 'transferAmount',
        width: '100'
      }]
    }];
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
          case 'balanceAmount':
            sums[index] = this.consumptionCount.balanceStatisticsCount;
            break;
          case 'closingBalance':
            sums[index] = this.consumptionCount.closingBalanceCount;
            break;
          case 'paidAmount':
            sums[index] = this.consumptionCount.currentRechargeCount;
            break;
          case 'freightAmount':
            sums[index] = this.consumptionCount.freightCount;
            break;
          case 'freightInvoiceAmount':
            sums[index] = this.consumptionCount.freightInvoicedCount;
            break;
          case 'freightUnbilledAmount':
            sums[index] = this.consumptionCount.freightNotInvoicedCount;
            break;
          case 'rechargeNet':
            sums[index] = this.consumptionCount.netRechargeCount;
            break;
          case 'serviceAmount':
            sums[index] = this.consumptionCount.serviceChargeCount;
            break;
          case 'serviceInvoiceAmount':
            sums[index] = this.consumptionCount.serviceChargeInvoicedCount;
            break;
          case 'serviceUnbilledAmount':
            sums[index] = this.consumptionCount.serviceChargeNotInvoicedCount;
            break;
          case 'transferAmount':
            sums[index] = this.consumptionCount.totalConsumptionCount;
            break;
          case 'drawMoney':
            sums[index] = this.consumptionCount.withdrawalAmountCount;
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
    /** 查询客户消费明细列表 */
    getList(e) {
      this.loading = true;
      // 查询列表
      listConsumption(this.queryParams).then(response => {
        console.log(response);
        this.consumptionList = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
      // 查询列表合计
      if (this.queryParams.companyName || this.queryParams.shipmentPhone || this.queryParams.beginTime) {
        this.queryParams.haveCondition = true;
      } else {
        this.queryParams.haveCondition = false;
      }
      if (e !== 1) {
        countConsumption(this.queryParams).then(response => {
          console.log(response);
          this.consumptionCount = response.data;
        });
      }
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
      this.download('/transportation/customerCountSearch/shipmentMoneyCountExport', { ...this.queryParams }, `客户消费统计_${new Date().getTime()}.xlsx`);
    }
  }
};
</script>
