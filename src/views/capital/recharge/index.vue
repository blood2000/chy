<template>
  <!-- 充值记录 -->
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
      <el-form-item label="用户名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入用户名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入手机号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="收支类型" prop="name">
        <el-select v-model="queryParams.name" placeholder="请选择收支类型" clearable filterable size="small">
          <el-option
            v-for="dict in incomeTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="支付类型" prop="name">
        <el-select v-model="queryParams.name" placeholder="请选择支付类型" clearable filterable size="small">
          <el-option
            v-for="dict in payTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="消费项目" prop="name">
        <el-select v-model="queryParams.name" placeholder="请选择消费项目" clearable filterable size="small">
          <el-option
            v-for="dict in consumeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="变动日期" prop="name">
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
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>

    <el-table v-loading="loading" :data="rechargeList">
      <el-table-column label="序号" type="index" min-width="5%" />
      <el-table-column label="平台角色" align="center" prop="" :formatter="roleFormat" />
      <el-table-column label="姓名" align="center" prop="" />
      <el-table-column label="手机号" align="center" prop="" />
      <el-table-column label="角色" align="center" prop="" />
      <el-table-column label="收支类型" align="center" prop="" />
      <el-table-column label="支付类型" align="center" prop="" />
      <el-table-column label="消费项目" align="center" prop="" />
      <el-table-column label="变动金额" align="center" prop="" />
      <el-table-column label="变动金额" align="center" prop="" />
      <el-table-column label="备注" align="center" prop="" />
      <el-table-column label="操作人" align="center" prop="" />
      <el-table-column label="变动时间" align="center" prop="time">
        <template slot-scope="scope">
          {{ parseTime(scope.row.time) }}
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

  </div>
</template>

<script>
import { rechargelist } from '@/api/capital/recharge';

export default {
  name: 'Recharge',
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表格数据
      rechargeList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 收支类型字典
      incomeTypeOptions: [],
      // 支付类型字典
      payTypeOptions: [],
      // 消费项目字典
      consumeOptions: [],
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
      rechargelist(this.queryParams).then(response => {
        this.rechargeList = response.rows;
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
    }
  }
};
</script>
