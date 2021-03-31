<template>
  <!-- 平台用户余额 -->
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="平台角色" prop="name">
        <el-select v-model="queryParams.name" placeholder="请选择平台角色" clearable filterable size="small">
          <el-option
            v-for="dict in roleOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="企业名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入企业名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户姓名" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入用户姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号码" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入手机号码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="余额区间" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="最小值"
          clearable
          size="small"
          style="width: 96px"
          @keyup.enter.native="handleQuery"
        />
        至
        <el-input
          v-model="queryParams.name"
          placeholder="最大值"
          clearable
          size="small"
          style="width: 96px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>

    <el-table v-loading="loading" :data="dataList">
      <el-table-column label="序号" type="index" min-width="5%" />
      <el-table-column label="平台角色" align="center" prop="" :formatter="roleFormat" />
      <el-table-column label="企业名称" align="center" prop="" />
      <el-table-column label="姓名" align="center" prop="" />
      <el-table-column label="电话" align="center" prop="" />
      <el-table-column label="账号金额" align="center" prop="" />
      <el-table-column label="保证金" align="center" prop="" />
      <el-table-column label="最近金额变动时间" align="center" prop="time">
        <template slot-scope="scope">
          {{ parseTime(scope.row.time) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-coin"
            @click="handleBalance(scope.row)"
          >网商余额</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleDetail(scope.row)"
          >明细</el-button>
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

    <!-- 变动明细 对话框 -->
    <change-detail-dialog :open.sync="detailOpen" :title="title" />
    <!-- 查询网商余额 对话框 -->
    <check-balance-dialog :open.sync="balanceOpen" :title="title" />
  </div>
</template>

<script>
import { balanceList } from '@/api/capital/ubalance';
import ChangeDetailDialog from '../components/changeDetailDialog';
import CheckBalanceDialog from '../components/checkBalanceDialog';

export default {
  components: {
    ChangeDetailDialog,
    CheckBalanceDialog
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表格数据
      dataList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      balanceOpen: false,
      detailOpen: false,
      // 平台角色字典
      roleOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      balanceList(this.queryParams).then(response => {
        this.dataList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 平台角色字典翻译 */
    roleFormat(row, column) {
      return this.selectDictLabel(this.roleOptions, row.status);
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
    /** 网商余额按钮 */
    handleBalance(row) {
      this.title = '查询网商余额';
      this.balanceOpen = true;
    },
    /** 明细按钮 */
    handleDetail(row) {
      this.title = '明细';
      this.detailOpen = true;
    }
  }
};
</script>
