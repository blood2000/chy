<template>
  <div>
    <div v-show="showSearch" class="app-container app-container--search">
      <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="90px">
        <el-form-item label="客户名称" prop="driverName">
          <el-input
            v-model="queryParams.driverName"
            placeholder="请输入客户名称"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="手机号码" prop="driverPhone">
          <el-input
            v-model="queryParams.driverPhone"
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
        @pagination="getList"
      />
    </div>
  </div>
</template>

<script>
import { listConsumptionApi, listConsumption } from '@/api/data/statistics';
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
      queryTime: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        companyName: null,
        shipmentPhone: null,
        beginTime: null,
        endTime: null
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
        prop: 'freightAmount'
      }, {
        label: '服务费',
        prop: 'serviceAmount'
      }, {
        label: '运费',
        children: [{
          label: '已开票',
          prop: 'freightInvoiceAmount'
        }, {
          label: '未开票',
          prop: 'freightUnbilledAmount'
        }]
      }, {
        label: '服务费',
        children: [{
          label: '已开票',
          prop: 'serviceInvoiceAmount'
        }, {
          label: '未开票',
          prop: 'serviceUnbilledAmount'
        }]
      }, {
        label: '消费合计',
        prop: 'transferAmount'
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
          case 'freightAmount':
            sums[index] = '100元';
            break;
          case 'freightInvoiceAmount':
            sums[index] = '200元';
            break;
          case 'freightUnbilledAmount':
            sums[index] = '120元';
            break;
          case 'serviceAmount':
            sums[index] = '130元';
            break;
          case 'serviceInvoiceAmount':
            sums[index] = '400元';
            break;
          case 'serviceUnbilledAmount':
            sums[index] = '500元';
            break;
          case 'waybillCount':
            sums[index] = '600元';
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
    getList() {
      this.loading = true;
      listConsumption(this.queryParams).then(response => {
        this.consumptionList = response.data;
        this.total = response.data.length;
        this.loading = false;
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
    // 导出
    handleExport() {
      this.download('/transportation/invoice/listWayBill', { ...this.queryParams }, `askfor_${new Date().getTime()}.xlsx`);
    }
  }
};
</script>
