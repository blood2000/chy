<template>
  <!-- 用户银行卡 -->
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="操作用户" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入操作用户"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户电话" prop="userPhone">
        <el-input
          v-model="queryParams.userPhone"
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
      <el-form-item label="车牌号" prop="licenseNumber">
        <el-input
          v-model="queryParams.licenseNumber"
          placeholder="请输入车牌号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input
          v-model="queryParams.mobile"
          placeholder="请输入手机号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="开户银行" prop="bankName">
        <el-input
          v-model="queryParams.bankName"
          placeholder="请输入开户银行"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="银行账户" prop="account">
        <el-input
          v-model="queryParams.account"
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
      <el-col :span="1.5" class="fr">
        <tablec-cascader v-model="tableColumnsConfig" />
      </el-col>
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>

    <RefactorTable :loading="loading" :data="dataList" :table-columns-config="tableColumnsConfig">
      <template #isDefault="{row}">
        <span>{{ selectDictLabel(isOptions, row.isDefault) }}</span>
      </template>
      <template #bankType="{row}">
        <span>{{ selectDictLabel(bankTypeOptions, row.bankType) }}</span>
      </template>
      <template #createTime="{row}">
        <span>{{ parseTime(row.createTime, '{y}-{m}-{d}') }}</span>
      </template>
      <template #updateTime="{row}">
        <span>{{ parseTime(row.updateTime, '{y}-{m}-{d}') }}</span>
      </template>
      <template #edit="{row}">
        <el-button
          size="mini"
          type="text"
          icon="el-icon-document"
          @click="handleUpdate(row, 'detail')"
        >详情</el-button>
        <el-button
          size="mini"
          type="text"
          icon="el-icon-edit"
          @click="handleUpdate(row, 'edit')"
        >修改</el-button>
        <el-button
          size="mini"
          type="text"
          icon="el-icon-delete"
          @click="handleDelete(row)"
        >删除</el-button>
      </template>
    </RefactorTable>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 新增/编辑/详情 对话框 -->
    <bank-dialog ref="bankDialogRef" :open.sync="open" :title="title" :disable="disable" @refresh="getList" />

  </div>
</template>

<script>
import { bankListApi, banklist, delBank } from '@/api/capital/bankcard';
import BankDialog from './bankDialog';

export default {
  name: 'Bankcard',
  components: {
    BankDialog
  },
  data() {
    return {
      tableColumnsConfig: [],
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
      // 弹出层是否禁用
      disable: false,
      // 用户类型字典
      bankTypeOptions: [
        { dictLabel: '个人账户', dictValue: 1 },
        { dictLabel: '企业账户', dictValue: 2 }
      ],
      // 是否默认字典
      isOptions: [
        { dictLabel: '否', dictValue: 0 },
        { dictLabel: '是', dictValue: 1 }
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        isAsc: 'asc',
        orderByColumn: 'name'
      }
    };
  },
  created() {
    this.tableHeaderConfig(this.tableColumnsConfig, bankListApi, {
      prop: 'edit',
      isShow: true,
      label: '操作',
      width: 200,
      fixed: 'right'
    });
    this.getList();
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      banklist(this.queryParams).then(response => {
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
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.$refs.bankDialogRef.reset();
      this.open = true;
      this.disable = false;
      this.title = '新增银行卡';
    },
    /** 修改按钮操作 */
    handleUpdate(row, type) {
      this.$refs.bankDialogRef.reset();
      // 这里需要调获取详情接口
      this.$refs.bankDialogRef.setForm({});
      switch (type) {
        case 'detail':
          this.disable = false;
          this.title = '查看银行卡信息';
          break;
        case 'edit':
          this.disable = true;
          this.title = '编辑银行卡信息';
          break;
      }
      this.open = true;
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
