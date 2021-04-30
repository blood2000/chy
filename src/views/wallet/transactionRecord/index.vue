<template>
  <!-- 交易记录(冻结&付款) -->
  <div>
    <div v-show="showSearch" class="app-container app-container--search">
      <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="80px">
        <el-form-item label="交易日期">
          <el-date-picker
            v-model="queryParams.updateTimeBegin"
            clearable
            type="date"
            size="small"
            value-format="yyyy-MM-dd"
            placeholder="请选择"
          />
          至
          <el-date-picker
            v-model="queryParams.updateTimeEnd"
            clearable
            type="date"
            size="small"
            value-format="yyyy-MM-dd"
            placeholder="请选择"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button type="primary" plain icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="g-radio-group">
      <el-radio-group v-model="activeName" size="small" @change="handleClick">
        <el-radio-button label="近三月" />
        <el-radio-button label="近半年" />
        <el-radio-button label="近一年" />
      </el-radio-group>
    </div>
    <div class="app-container">
      <el-row :gutter="10" class="mb8">
        <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
      </el-row>

      <el-tabs v-model="activeTab" @tab-click="handleTabClick">
        <el-tab-pane label="冻结记录" name="dj" />
        <el-tab-pane label="付款记录" name="fk" />
      </el-tabs>

      <el-table v-loading="loading" stripe border :data="dataList">
        <el-table-column label="运单号" align="center" prop="waybillNo" width="150" />
        <el-table-column label="装货地" align="center" prop="" width="150" />
        <el-table-column label="卸货地" align="center" prop="" width="150" />
        <el-table-column label="货物类型" align="center" prop="" />
        <el-table-column label="承运司机" align="center" prop="payeeName" />
        <el-table-column label="承运车辆" align="center" prop="licenseNumber" />
        <el-table-column label="所属调度者" align="center" prop="teamName" width="150" />
        <el-table-column label="交易类型" align="center" prop="" />
        <el-table-column label="单价（元）" align="center" prop="" />
        <el-table-column label="重量（吨）" align="center" prop="" />
        <el-table-column label="总额（元）" align="center" prop="amount" />
        <el-table-column label="操作时间" align="center" prop="payTime" width="180" />
      </el-table>

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
import { getUserInfo } from '@/utils/auth';
import { payRecordlist } from '@/api/capital/payrecord';
import { getTimeRange } from '@/utils/timeRange';

export default {
  name: 'TransactionRecord',
  data() {
    return {
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
        pageSize: 10,
        updateTimeBegin: undefined,
        updateTimeEnd: undefined
      },
      activeName: '近三月'
    };
  },
  created() {
    this.handleClick();
  },
  methods: {
    handleTabClick() {
      // console.log(this.activeTab);
    },
    /** 查询列表 */
    getList() {
      this.loading = true;
      const { user = {}} = getUserInfo() || {};
      const { userCode } = user;
      payRecordlist(Object.assign({}, this.queryParams, { userCode: userCode })).then(response => {
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
      this.queryParams.updateTimeBegin = undefined;
      this.queryParams.updateTimeEnd = undefined;
      this.resetForm('queryForm');
      this.queryParams.pageNum = 1;
      this.handleClick();
    },
    handleClick() {
      let t = 0;
      if (this.activeName === '近三月') {
        t = 3;
      } else if (this.activeName === '近半年') {
        t = 6;
      } else if (this.activeName === '近一年') {
        t = 12;
      }
      const { start, end } = getTimeRange(t);
      this.queryParams.updateTimeBegin = start;
      this.queryParams.updateTimeEnd = end;
      this.getList();
    }
  }
};
</script>
