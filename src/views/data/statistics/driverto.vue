<template>
  <div>
    <div v-show="showSearch" class="app-container app-container--search">
      <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="90px">
        <el-form-item label="承运方名称" prop="driverName">
          <el-input
            v-model.trim="queryParams.driverName"
            placeholder="请输入客户名称"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="手机号码" prop="driverPhone">
          <el-input
            v-model.trim="queryParams.driverPhone"
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
        <el-form-item label="角色" prop="driverType">
          <el-select
            v-model="queryParams.driverType"
            placeholder="请选择角色"
            clearable
            filterable
            size="small"
            style="width: 228px"
          >
            <el-option
              v-for="dict in driverTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属调度" prop="teamName">
          <el-input
            v-model.trim="queryParams.teamName"
            placeholder="请输入所属调度"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
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
            v-hasPermi="['data:driverto:export']"
            type="primary"
            icon="el-icon-download"
            size="mini"
            :loading="loadingExport"
            @click="handleExport"
          >导出</el-button>
        </el-col>
        <el-col :span="1.5" style="float: right;">
          <tablec-cascader v-model="tableColumnsConfig" :lcokey="api" />
        </el-col>
        <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
      </el-row>

      <RefactorTable :loading="loading" :data="drivertoList" :table-columns-config="tableColumnsConfig" :summary="summary" :summary-method="getSummaries"><!-- @selection-change="handleSelectionChange" -->
        <template #driverType="{row}">
          <span v-if="row.driverType === '1'" class="table-tag table-drivertag">
            <i class="g-icon-driver" />
            {{ selectDictLabel(driverTypeOptions, row.driverType) }}
          </span>
          <span v-if="row.driverType === '2'" class="table-tag">
            <i class="g-icon-teamdriver" />
            {{ selectDictLabel(driverTypeOptions, row.driverType) }}
          </span>
          <span v-if="row.driverType === '3'" class="table-tag table-teamtag">
            <i class="g-icon-team" />
            {{ selectDictLabel(driverTypeOptions, row.driverType) }}
          </span>
        </template>
        <template #balanceAmount="{row}">
          <span>{{ money(row.balanceAmount) }}</span>
        </template>
        <template #closingBalance="{row}">
          <span>{{ money(row.closingBalance) }}</span>
        </template>
        <template #issueIncome="{row}">
          <span>{{ money(row.issueIncome) }}</span>
        </template>
        <template #distributionPay="{row}">
          <span>{{ money(row.distributionPay) }}</span>
        </template>
        <template #issueWithdrawal="{row}">
          <span>{{ money(row.issueWithdrawal) }}</span>
        </template>
        <!-- <template #updateTime="{row}">
          <span>{{ parseTime(row.updateTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template> -->
      </RefactorTable>

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList(1)"
      />
    </div>
  </div>
</template>

<script>
import { listDrivertoApi, listDriverto, getDriverCount } from '@/api/data/statistics';
// import tableColumnsConfig from './config';
import { pickerOptions } from '@/utils/dateRange';
export default {
  name: 'Driverto',
  components: {
  },
  data() {
    return {
      pickerOptions,
      tableColumnsConfig: [],
      api: listDrivertoApi,
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 司机往来明细表格数据
      drivertoList: [],
      // 司机列表合计
      drivertoCount: {},
      // 司机类别  0独立司机，1聘用司机字典
      driverTypeOptions: [
        { 'dictLabel': '独立司机', 'dictValue': '1' },
        { 'dictLabel': '调度司机', 'dictValue': '2' },
        { 'dictLabel': '调度者', 'dictValue': '3' }
      ],
      queryTime: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        driverName: null,
        driverPhone: null,
        beginTime: null,
        endTime: null,
        driverType: null,
        teamName: null,
        haveCondition: false
      },
      // 调度者列表
      teamlist: [],
      teamQueryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null
      },
      teamloading: false,
      dataOver: false, // 是否请求完了
      summary: true,
      loadingExport: false
    };
  },
  created() {
    this.tableHeaderConfig(this.tableColumnsConfig, listDrivertoApi, { });
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
            sums[index] = this.money(this.drivertoCount.balanceStatisticsCount);
            break;
          case 'closingBalance':
            sums[index] = this.money(this.drivertoCount.closingBalanceCount);
            break;
          case 'issueIncome':
            sums[index] = this.money(this.drivertoCount.currentIncomeCount);
            break;
          case 'distributionPay':
            sums[index] = this.money(this.drivertoCount.sortingOutExpensesCount);
            break;
          case 'issueWithdrawal':
            sums[index] = this.money(this.drivertoCount.withdrawalCurrentPeriodCount);
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
    /** 查询司机往来明细列表 */
    getList(e) {
      this.loading = true;
      // 查询列表
      listDriverto(this.queryParams).then(response => {
        this.drivertoList = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
      // 查询合计
      if (this.queryParams.driverName || this.queryParams.driverPhone || this.queryParams.beginTime || this.queryParams.driverType || this.queryParams.teamName) {
        this.queryParams.haveCondition = true;
      } else {
        this.queryParams.haveCondition = false;
      }
      if (e !== 1) {
        getDriverCount(this.queryParams).then(response => {
          console.log(response);
          this.drivertoCount = response.data;
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
      this.loadingExport = true;
      this.download('/transportation/driverCountSearch/export', { ...this.queryParams }, `司机往来明细`).then(res => {
        this.loadingExport = false;
      });
    }
  }
};
</script>

<style scoped>
.table-tag{
  height: 24px;
  border-radius: 12px;
  background: #EAFDE1;
  color: #409EFF;
  padding: 2px 10px;
}
.table-drivertag{
  background: #FFFAEC;
  color: #67C23A;
}
.table-teamtag{
  background: #EBF4FD;
  color: #FFBB00;
}
</style>
