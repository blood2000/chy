<template>
  <!-- 提现申请 -->
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true" label-width="100px">
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
      <el-form-item label="申请人" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入申请人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="收款人姓名" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入收款人姓名"
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
      <el-form-item label="银行卡号" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入银行卡号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="车牌号" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入车牌号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="转账结果" prop="name">
        <el-select v-model="queryParams.name" placeholder="请选择" clearable filterable size="small">
          <el-option
            v-for="dict in resultOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="转账日期" prop="name">
        <el-date-picker
          v-model="queryParams.name"
          clearable
          type="date"
          size="small"
          style="width: 130px"
          value-format="yyyy-MM-dd"
          placeholder="请选择"
        />
        至
        <el-date-picker
          v-model="queryParams.name"
          clearable
          type="date"
          size="small"
          style="width: 130px"
          value-format="yyyy-MM-dd"
          placeholder="请选择"
        />
      </el-form-item>
      <el-form-item label="申请日期" prop="name">
        <el-date-picker
          v-model="queryParams.name"
          clearable
          type="date"
          size="small"
          style="width: 130px"
          value-format="yyyy-MM-dd"
          placeholder="请选择"
        />
        至
        <el-date-picker
          v-model="queryParams.name"
          clearable
          type="date"
          size="small"
          style="width: 130px"
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
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
        >导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          icon="el-icon-upload2"
          size="mini"
          :disabled="multiple"
          @click="handleImport"
        >网商批量提现</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-download"
          size="mini"
          :disabled="multiple"
          @click="handleRefreshStatus"
        >更新网商提现状态</el-button>
      </el-col>
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>

    <el-table v-loading="loading" :data="withdrawalList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" fixed="left" />
      <el-table-column label="序号" type="index" min-width="5%" />
      <el-table-column label="申请状态" align="center" prop="" />
      <el-table-column label="支付批次号" align="center" prop="" />
      <el-table-column label="申请人" align="center" prop="" />
      <el-table-column label="平台角色" align="center" prop="" :formatter="roleFormat" />
      <el-table-column label="车牌号" align="center" prop="" />
      <el-table-column label="手机号" align="center" prop="" />
      <el-table-column label="银行名称" align="center" prop="" />
      <el-table-column label="收款人姓名" align="center" prop="" />
      <el-table-column label="卡号" align="center" prop="" />
      <el-table-column label="金额" align="center" prop="" />
      <el-table-column label="预留手机号" align="center" prop="" />
      <el-table-column label="申请时间" align="center" prop="">
        <template slot-scope="scope">
          {{ parseTime(scope.row.time) }}
        </template>
      </el-table-column>
      <el-table-column label="转账时间" align="center" prop="">
        <template slot-scope="scope">
          {{ parseTime(scope.row.time) }}
        </template>
      </el-table-column>
      <el-table-column label="失败原因" align="center" prop="" />
      <el-table-column label="备注" align="center" prop="" />
      <el-table-column label="转账渠道" align="center" prop="" />
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
import { getWithDrawalList } from '@/api/capital/withdrawal';

export default {
  name: 'Withdrawal',
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表格数据
      withdrawalList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 平台角色字典
      roleOptions: [],
      // 转帐结果字典
      resultOptions: [],
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
      getWithDrawalList(this.queryParams).then(response => {
        this.withdrawalList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 平台角色字典翻译
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
    /** 导出按钮操作 */
    handleExport() {
      // this.download('assets/driver/export', {}, `driver_${new Date().getTime()}.xlsx`, 'application/json');
    },
    /** 网商批量提现 */
    handleImport() {

    },
    /** 更新网商提现状态 */
    handleRefreshStatus() {

    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    }
  }
};
</script>
