<template>
  <!-- 用户银行卡 -->
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="操作用户" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入操作用户"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户电话" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入用户电话"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入姓名"
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
      <el-form-item label="手机号" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入手机号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="开户银行" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入开户银行"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="银行账户" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入银行账户"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
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
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >人工添加银行卡</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
        >导出</el-button>
      </el-col>
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>

    <el-table v-loading="loading" :data="dataList">
      <el-table-column label="序号" type="index" min-width="5%" />
      <el-table-column label="平台角色" align="center" prop="" :formatter="roleFormat" />
      <el-table-column label="默认" align="center" prop="" />
      <el-table-column label="用户" align="center" prop="" />
      <el-table-column label="车牌号" align="center" prop="" />
      <el-table-column label="用户电话" align="center" prop="" />
      <el-table-column label="姓名" align="center" prop="" />
      <el-table-column label="银行绑定手机号" align="center" prop="" />
      <el-table-column label="开户银行" align="center" prop="" />
      <el-table-column label="银行账户" align="center" prop="" />
      <el-table-column label="用户类型" align="center" prop="" />
      <el-table-column label="网点" align="center" prop="" />
      <el-table-column label="开户城市" align="center" prop="" />
      <el-table-column label="创建时间" align="center" prop="time">
        <template slot-scope="scope">
          {{ parseTime(scope.row.time) }}
        </template>
      </el-table-column>
      <el-table-column label="修改时间" align="center" prop="time">
        <template slot-scope="scope">
          {{ parseTime(scope.row.time) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleUpdate(scope.row, 'detail')"
          >详情</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row, 'edit')"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
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
import { banklist, delBank, getBankDetail } from '@/api/capital/bankcard';

export default {
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
      open: false,
      // 状态字典
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
      banklist(this.queryParams).then(response => {
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
    /** 新增按钮操作 */
    handleAdd() {
      this.$refs.BankDialog.reset();
      this.open = true;
      this.title = '新增银行卡';
    },
    /** 修改按钮操作 */
    handleUpdate(row, type) {
      this.$refs.BankDialog.reset();
      const id = row.id;
      getBankDetail(id).then(response => {
        this.$refs.BankDialog.setForm(response.data);
        switch (type) {
          case 'detail':
            this.title = '编辑银行卡信息';
            break;
          case 'edit':
            this.title = '查看银行卡信息';
            break;
        }
        this.open = true;
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id;
      this.$confirm(`删除【${row.name}】将使其信息不存在，确认是否删除？`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delBank(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess('删除成功');
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      // this.download('assets/driver/export', {}, `driver_${new Date().getTime()}.xlsx`, 'application/json');
    }
  }
};
</script>
