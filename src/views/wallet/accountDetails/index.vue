<template>
  <!-- 账户明细 -->
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true" label-width="80px">
      <el-form-item label="交易类型" prop="name">
        <el-select v-model="queryParams.name" placeholder="请选择交易类型" clearable filterable size="small">
          <el-option
            v-for="dict in typeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="交易日期">
        <el-date-picker
          v-model="queryParams.name"
          clearable
          type="datetime"
          size="small"
          value-format="yyyy-MM-dd"
          placeholder="请选择"
        />
        至
        <el-date-picker
          v-model="queryParams.name"
          clearable
          type="datetime"
          size="small"
          value-format="yyyy-MM-dd"
          placeholder="请选择"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-button type="text">近三月</el-button>
      <el-button type="text">近半年</el-button>
      <el-button type="text">近一年</el-button>
      <el-col :span="1.5" class="fr">
        <tablec-cascader v-model="tableColumnsConfig" :lcokey="api" />
      </el-col>
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>

    <!-- <RefactorTable :loading="loading" :data="dataList" :table-columns-config="tableColumnsConfig">
      <template #updateTime="{row}">
        <span>{{ parseTime(row.updateTime) }}</span>
      </template>
    </RefactorTable> -->
    <el-table v-loading="loading" :data="dataList">
      <el-table-column label="平台角色" align="center" prop="" />
      <el-table-column label="操作员" align="center" prop="" />
      <el-table-column label="手机号" align="center" prop="" />
      <el-table-column label="收支类型" align="center" prop="" />
      <el-table-column label="支付类型" align="center" prop="" />
      <el-table-column label="交易类型" align="center" prop="" />
      <el-table-column label="变动金额（元）" align="center" prop="">
        <span class="g-color-blue" />
      </el-table-column>
      <el-table-column label="账户余额（元）" align="center" prop="" />
      <el-table-column label="备注" align="center" prop="" />
      <el-table-column label="变动时间" align="center" prop="" />
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { balanceListApi, balanceList } from '@/api/capital/ubalance';

export default {
  name: 'AccountDetails',
  data() {
    return {
      tableColumnsConfig: [],
      api: balanceListApi,
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表格数据
      dataList: [],
      // 交易类型字典
      typeOptions: [
        { dictLabel: '全部', dictValue: 0 }
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10
      }
    };
  },
  created() {
    this.tableHeaderConfig(this.tableColumnsConfig, balanceListApi);
    this.getList();
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      balanceList(this.queryParams).then(response => {
        this.dataList = response.data.rows;
        this.total = response.data.total;
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
    }
  }
};
</script>
