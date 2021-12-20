<template>
  <div>
    <div v-show="showSearch" class="app-container app-container--search">
      <el-form
        ref="queryForm"
        :model="queryParams"
        :inline="true"
        label-width="90px"
      >
        <el-form-item label="客户名称" prop="companyName">
          <el-input
            v-model.trim="queryParams.companyName"
            placeholder="请输入客户名称"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="手机号码" prop="shipmentPhone">
          <el-input
            v-model.trim="queryParams.shipmentPhone"
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
            unlink-panels
            :picker-options="pickerOptions"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 228px"
            @change="datechoose"
          />
        </el-form-item>
        <el-form-item label="团队" prop="marketId">
          <el-select
            v-model="queryParams.marketId"
            placeholder="请选择团队"
            clearable
            filterable
            size="small"
            style="width: 228px"
          >
            <el-option
              v-for="(dict, index) in marketIdOptions"
              :key="index"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="业务员" prop="userCode">
          <el-select
            v-model="queryParams.userCode"
            placeholder="请选择业务员"
            clearable
            filterable
            size="small"
            style="width: 228px"
          >
            <el-option
              v-for="(dict, index) in userCodeOptions"
              :key="index"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="授信情况" prop="credit">
          <el-select
            v-model="queryParams.credit"
            placeholder="请选择授信情况"
            clearable
            filterable
            size="small"
            style="width: 228px"
          >
            <el-option
              v-for="dict in creditOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="授信余额" prop="creditBalanceCondition">
          <el-select
            v-model="queryParams.creditBalanceCondition"
            placeholder="条件"
            clearable
            filterable
            size="small"
            style="width: 80px"
          >
            <el-option
              v-for="dict in creditBalanceConditionOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
          <el-input
            v-model.trim="queryParams.creditBalance"
            placeholder="授信余额（元）"
            clearable
            size="small"
            style="width: 138px;margin-left:10px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="handleQuery"
          >搜索</el-button>
          <el-button
            type="primary"
            plain
            icon="el-icon-refresh"
            size="mini"
            @click="resetQuery"
          >重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="app-container">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            v-hasPermi="['data:platform:export']"
            type="primary"
            icon="el-icon-download"
            size="mini"
            :loading="loadingExport"
            @click="handleExport"
          >导出</el-button>
        </el-col>
        <el-col :span="1.5" style="float: right">
          <tablec-cascader v-model="tableColumnsConfig" :lcokey="api" />
        </el-col>
        <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
      </el-row>

      <RefactorTable
        :loading="loading"
        :summary="summary"
        :data="customerList"
        :table-columns-config="tableColumnsConfig"
        :summary-method="getSummaries"
        :height="height"
        @sort-change="handleSortChange"
      ><!-- @selection-change="handleSelectionChange" -->
        <template #accConfirmedServiceFee="{row}">
          <span>{{ floor(row.accConfirmedServiceFee) }}</span>
        </template>
        <template #arrearsAmount="{row}">
          <span>{{ floor(row.arrearsAmount) }}</span>
        </template>
        <template #closingBalance="{row}">
          <span>{{ floor(row.closingBalance) }}</span>
        </template>
        <template #confirmFreight="{row}">
          <span>{{ floor(row.confirmFreight) }}</span>
        </template>
        <template #conformService="{row}">
          <span>{{ floor(row.conformService) }}</span>
        </template>
        <template #creditAmount="{row}">
          <span>{{ floor(row.creditAmount) }}</span>
        </template>
        <template #creditBalance="{row}">
          <span>{{ floor(row.creditBalance) }}</span>
        </template>
        <template #cumConfirmedFreight="{row}">
          <span>{{ floor(row.cumConfirmedFreight) }}</span>
        </template>
        <template #cumEstimatedFreight="{row}">
          <span>{{ floor(row.cumEstimatedFreight) }}</span>
        </template>
        <template #cumEstimatedService="{row}">
          <span>{{ floor(row.cumEstimatedService) }}</span>
        </template>
        <template #dailyFreight="{row}">
          <span>{{ floor(row.dailyFreight) }}</span>
        </template>
        <template #dailyServiceCharge="{row}">
          <span>{{ floor(row.dailyServiceCharge) }}</span>
        </template>
        <template #deliveryCount="{row}">
          <span>{{ floor(row.deliveryCount, 3) }}</span>
        </template>
        <template #deliveryCountDay="{row}">
          <span>{{ floor(row.deliveryCountDay, 3) }}</span>
        </template>
        <template #drawMoney="{row}">
          <span>{{ floor(row.drawMoney) }}</span>
        </template>
        <template #freightAmount="{row}">
          <span>{{ floor(row.freightAmount) }}</span>
        </template>
        <template #freightInvoiceAmount="{row}">
          <span>{{ floor(row.freightInvoiceAmount) }}</span>
        </template>
        <template #monthDailyFreight="{row}">
          <span>{{ floor(row.monthDailyFreight) }}</span>
        </template>
        <template #monthDailyServiceCharge="{row}">
          <span>{{ floor(row.monthDailyServiceCharge) }}</span>
        </template>
        <template #monthDeliveryCount="{row}">
          <span>{{ floor(row.monthDeliveryCount, 3) }}</span>
        </template>
        <template #monthFreightInvoiceAmount="{row}">
          <span>{{ floor(row.monthFreightInvoiceAmount) }}</span>
        </template>
        <template #paidAmount="{row}">
          <span>{{ floor(row.paidAmount) }}</span>
        </template>
        <template #prepaidFreight="{row}">
          <span>{{ floor(row.prepaidFreight) }}</span>
        </template>
        <template #prepaidService="{row}">
          <span>{{ floor(row.prepaidService) }}</span>
        </template>
        <template #serviceAmount="{row}">
          <span>{{ floor(row.serviceAmount) }}</span>
        </template>
        <template #period="{row}">
          <span class="detail" @click="popDetail( row)">详情</span>
        </template>
      </RefactorTable>

      <el-dialog title="欠款详情" :visible.sync="dialogTableVisible">
        <el-table :data="detailData" show-summary>
          <el-table-column prop="monthStr" label="月份" width="auto" />
          <el-table-column prop="arrears" label="欠款金额" width="auto">
            <template slot-scope="scope">
              {{ scope.row.arrears.toFixed(2) }}
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>

      <pagination
        v-show="total > 0"
        :total="total"
        :page-sizes="[10, 50, 100, 300]"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList(1)"
      />
    </div>
  </div>
</template>

<script>
import {
  teamDetailReportListApi,
  teamDetailReportList,
  teamDetailReportCount,
  market,
  user,
  getArrearsList
} from '@/api/data/statistics';
// import tableColumnsConfig from './config';
import { pickerOptions } from '@/utils/dateRange';

export default {
  name: 'Platform',
  components: {},
  data() {
    return {
      pickerOptions,
      tableColumnsConfig: [],
      detailData: [],
      dialogTableVisible: false,
      api: teamDetailReportListApi,
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
        haveCondition: false,
        marketId: null,
        userCode: null,
        credit: null,
        creditBalanceCondition: null,
        creditBalance: null,
        order: null,
        prop: null
      },
      height: undefined,
      // 合计
      summary: true,
      loadingExport: false,
      marketIdOptions: [],
      userCodeOptions: [],
      creditOptions: [
        { 'dictLabel': '未授信', 'dictValue': '1' },
        { 'dictLabel': '已授信', 'dictValue': '2' }
      ],
      creditBalanceConditionOptions: [
        { 'dictLabel': '大于', 'dictValue': '1' },
        { 'dictLabel': '等于', 'dictValue': '2' },
        { 'dictLabel': '小于', 'dictValue': '3' }
      ]
    };
  },
  created() {
    this.tableHeaderConfig(this.tableColumnsConfig, teamDetailReportListApi, {});
    this.getList();
    this.getMarket();
    this.getUser();
  },
  methods: {
    // 排序事件
    handleSortChange(val) {
      this.queryParams.order = val.order;
      this.queryParams.prop = val.prop;
      this.getList();
    },
    getMarket() {
      market().then(response => {
        this.marketIdOptions = response.data.map(res => {
          return { dictLabel: res.market, dictValue: res.id };
        });
      });
    },
    getUser() {
      user().then(response => {
        // console.log(response.data);
        this.userCodeOptions = response.data.map(res => {
          return { dictLabel: res.userName, dictValue: res.userCode };
        });
      });
    },
    // 表尾合计行
    getSummaries(param) {
      // console.log(param);
      const { columns, data } = param;
      console.log(data);
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        switch (column.property) {
          case 'paidAmount':
            sums[index] = this.floor(this.customerCount.paidAmountCount);
            break;
          case 'drawMoney':
            sums[index] = this.floor(this.customerCount.drawMoneyCount);
            break;
          case 'closingBalance':
            sums[index] = this.floor(this.customerCount.closingBalanceCount);
            break;
          case 'deliveryCountDay':
            sums[index] = this.floor(this.customerCount.deliveryCountDayCount, 3);
            break;
          case 'prepaidFreight':
            sums[index] = this.floor(this.customerCount.prepaidFreightCount);
            break;
          case 'confirmFreight':
            sums[index] = this.floor(this.customerCount.confirmFreightCount);
            break;
          case 'dailyFreight':
            sums[index] = this.floor(this.customerCount.dailyFreightCount);
            break;
          case 'prepaidService':
            sums[index] = this.floor(this.customerCount.prepaidServiceCount);
            break;
          case 'conformService':
            sums[index] = this.floor(this.customerCount.conformServiceCount);
            break;
          case 'dailyServiceCharge':
            sums[index] = this.floor(this.customerCount.dailyServiceChargeCount);
            break;
          case 'deliveryCount':
            sums[index] = this.floor(this.customerCount.deliveryCountCount, 3);
            break;
          case 'cumEstimatedFreight':
            sums[index] = this.floor(this.customerCount.cumEstimatedFreightCount);
            break;
          case 'cumConfirmedFreight':
            sums[index] = this.floor(this.customerCount.cumConfirmedFreightCount);
            break;
          case 'freightAmount':
            sums[index] = this.floor(this.customerCount.freightAmountCount);
            break;
          case 'cumEstimatedService':
            sums[index] = this.floor(this.customerCount.cumEstimatedServiceCount);
            break;
          case 'accConfirmedServiceFee':
            sums[index] = this.floor(this.customerCount.accConfirmedServiceFeeCount);
            break;
          case 'serviceAmount':
            sums[index] = this.floor(this.customerCount.serviceAmountCount);
            break;
          case 'arrearsAmount':
            sums[index] = this.floor(this.customerCount.arrearsAmountCount);
            break;
          case 'monthFreightInvoiceAmount':
            sums[index] = this.floor(this.customerCount.monthFreightInvoiceAmountCount);
            break;
          case 'freightInvoiceAmount':
            sums[index] = this.floor(this.customerCount.freightInvoiceAmountCount);
            break;
          case 'waybillCount':
            sums[index] = this.customerCount.waybillCountCount;
            break;
          case 'driverCount':
            sums[index] = this.customerCount.driverCountCount;
            break;
          case 'creditBalance':
            sums[index] = this.floor(this.customerCount.creditBalanceCount);
            break;
          case 'creditAmount':
            sums[index] = this.floor(this.customerCount.creditAmountCount);
            break;
          case 'monthDeliveryCount':
            sums[index] = this.floor(this.customerCount.monthDeliveryCountCount, 3);
            break;
          case 'monthDailyFreight':
            sums[index] = this.floor(this.customerCount.monthDailyFreightCount);
            break;
          case 'monthDailyServiceCharge':
            sums[index] = this.floor(this.customerCount.monthDailyServiceChargeCount);
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
    getList(e) {
      this.loading = true;
      teamDetailReportList(this.queryParams).then((response) => {
        // console.log(response);
        this.customerList = response.data.list;
        this.total = response.data.total;
        this.height = 550;
        this.loading = false;
      });
      // 查询列表合计
      if (this.queryParams.companyName || this.queryParams.shipmentPhone || this.queryParams.beginTime) {
        this.queryParams.haveCondition = true;
      } else {
        this.queryParams.haveCondition = false;
      }
      if (e !== 1) {
        teamDetailReportCount(this.queryParams).then((response) => {
          // console.log(response);
          this.customerCount = response.data;
          // let tempStr = '';
          // Object.keys(this.customerCount).forEach((i) => {
          //   const s = i.substr(0, i.length - 5);
          //   const temp = `case '${s}':
          //     sums[index] = this.customerCount.${i};
          //   break;`;
          //   tempStr += temp;
          // });
          // console.log(tempStr);
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
      this.queryParams.creditBalance = null;
      this.handleQuery();
    },
    // 导出
    handleExport() {
      this.loadingExport = true;
      this.download(
        '/transportation/platformDataSummary/teamDetailReportExport',
        { ...this.queryParams },
        `平台统计报表`
      ).then(res => {
        this.loadingExport = false;
      });
    },
    // 详情弹窗
    popDetail(item) {
      // el
      this.dialogTableVisible = true;
      const queryParams = { companyCode: item.companyCode, endTime: item.creditEndTime };
      getArrearsList(queryParams).then((response) => {
        console.log(response);
        this.detailData = response.data;
        // this.customerCount = response.data;
        // let tempStr = '';
        // Object.keys(this.customerCount).forEach((i) => {
        //   const s = i.substr(0, i.length - 5);
        //   const temp = `case '${s}':
        //     sums[index] = this.customerCount.${i};
        //   break;`;
        //   tempStr += temp;
        // });
        // console.log(tempStr);
      });
    }
  }
};
</script>
<style>
.detail{
  color:#409EFF !important
}
</style>
