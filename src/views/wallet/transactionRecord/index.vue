<template>
  <!-- 交易记录(冻结&付款) -->
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true" label-width="80px">
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

    <el-tabs v-model="activeTab" @tab-click="handleTabClick">
      <el-tab-pane label="冻结记录" name="dj" />
      <el-tab-pane label="付款记录" name="fk" />
    </el-tabs>

    <!-- <RefactorTable :loading="loading" :data="dataList" :table-columns-config="tableColumnsConfig">
      <template #updateTime="{row}">
        <span>{{ parseTime(row.updateTime) }}</span>
      </template>
    </RefactorTable> -->
    <el-table v-loading="loading" :data="dataList">
      <el-table-column label="运单号" align="center" prop="" />
      <el-table-column label="装货地" align="center" prop="" />
      <el-table-column label="卸货地" align="center" prop="" />
      <el-table-column label="货物类型" align="center" prop="" />
      <el-table-column label="承运司机" align="center" prop="" />
      <el-table-column label="承运车辆" align="center" prop="" />
      <el-table-column label="所属调度者" align="center" prop="" />
      <el-table-column label="交易类型" align="center" prop="" />
      <el-table-column label="单价（元）" align="center" prop="" />
      <el-table-column label="重量（吨）" align="center" prop="" />
      <el-table-column label="总额（元）" align="center" prop="" />
      <el-table-column label="操作时间" align="center" prop="" />
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
  name: 'TransactionRecord',
  data() {
    return {
      tableColumnsConfig: [],
      api: balanceListApi,
      // 选中tab
      activeTab: 'dj', // dj冻结 fk付款
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
    handleTabClick() {
      console.log(this.activeTab);
    },
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
