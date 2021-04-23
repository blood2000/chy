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

      <RefactorTable :loading="loading" :data="consumptionList" :table-columns-config="tableColumnsConfig"><!-- @selection-change="handleSelectionChange" -->
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
        driverName: null,
        driverPhone: null,
        queryStartTime: null,
        queryEndTime: null
      }
    };
  },
  created() {
    this.tableHeaderConfig(this.tableColumnsConfig, listConsumptionApi, { });
    this.getList();
  },
  methods: {
    // 搜索时间选择
    datechoose(date) {
      if (date) {
        this.queryParams.queryStartTime = this.parseTime(date[0], '{y}-{m}-{d}');
        this.queryParams.queryEndTime = this.parseTime(date[1], '{y}-{m}-{d}');
      } else {
        this.queryParams.queryStartTime = null;
        this.queryParams.queryEndTime = null;
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
