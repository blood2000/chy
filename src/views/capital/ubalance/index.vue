<template>
  <!-- 平台用户余额 -->
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="平台角色" prop="roleName">
        <el-select v-model="queryParams.roleName" placeholder="请选择平台角色" clearable filterable size="small">
          <el-option
            v-for="dict in roleOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="企业名称" prop="orgName">
        <el-input
          v-model="queryParams.orgName"
          placeholder="请输入企业名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户姓名" prop="nickName">
        <el-input
          v-model="queryParams.nickName"
          placeholder="请输入用户姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号码" prop="phonenumber">
        <el-input
          v-model="queryParams.phonenumber"
          placeholder="请输入手机号码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="余额区间">
        <el-input-number
          v-model="queryParams.minAmount"
          controls-position="right"
          :precision="2"
          placeholder="最小值"
          :step="1"
          :min="0"
          :max="100"
          clearable
          size="small"
        />
        至
        <el-input-number
          v-model="queryParams.maxAmount"
          controls-position="right"
          :precision="2"
          placeholder="最大值"
          :step="1"
          :min="0"
          :max="100"
          clearable
          size="small"
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
      <el-table-column label="平台角色" align="center" prop="roleName" />
      <el-table-column label="企业名称" align="center" prop="orgName" />
      <el-table-column label="姓名" align="center" prop="nickName" />
      <el-table-column label="电话" align="center" prop="phonenumber" />
      <el-table-column label="账号金额" align="center" prop="amount" />
      <el-table-column label="保证金" align="center" prop="freezeAmount" />
      <el-table-column label="最近金额变动时间" align="center" prop="updateTime">
        <template slot-scope="scope">
          {{ parseTime(scope.row.updateTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="180" fixed="right">
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
  name: 'Ubalance',
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
      roleOptions: [
        { dictLabel: '货主', dictValue: 0 },
        { dictLabel: '调度者', dictValue: 1 },
        { dictLabel: '司机', dictValue: 2 }
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        isAsc: 'asc',
        orderByColumn: 'nickName'
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
        this.dataList = response.data.rows;
        this.total = response.data.total;
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
