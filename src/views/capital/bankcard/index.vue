<template>
  <div>
    <!-- 用户银行卡 -->
    <div v-show="showSearch" class="app-container app-container--search">
      <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
        <el-form-item label="开户姓名" prop="name">
          <el-input
            v-model.trim="queryParams.name"
            placeholder="请输入姓名"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="开户电话" prop="mobile">
          <el-input
            v-model.trim="queryParams.mobile"
            placeholder="请输入开户电话"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="车牌号" prop="licenseNumber">
          <el-input
            v-model.trim="queryParams.licenseNumber"
            placeholder="请输入车牌号"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="开户银行" prop="bankName">
          <el-select
            v-model="queryParams.bankName"
            placeholder="请选择开户银行"
            filterable
            clearable
            size="small"
          >
            <el-option
              v-for="dict in bankOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictLabel"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="银行账户" prop="account">
          <el-input
            v-model.trim="queryParams.account"
            placeholder="请输入银行账户"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="用户姓名" prop="userName">
          <el-input
            v-model.trim="queryParams.userName"
            placeholder="请输入用户姓名"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="用户电话" prop="userPhone">
          <el-input
            v-model.trim="queryParams.userPhone"
            placeholder="请输入用户电话"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="用户角色" prop="roleName">
          <el-select v-model="queryParams.roleName" placeholder="请选择用户角色" clearable filterable size="small">
            <el-option
              v-for="dict in roleOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
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
            type="primary"
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
          >人工添加银行卡</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-download"
            size="mini"
            :loading="exportLoading"
            @click="handleExport"
          >导出</el-button>
        </el-col>
        <el-col :span="1.5" class="fr">
          <tablec-cascader v-model="tableColumnsConfig" :lcokey="api" />
        </el-col>
        <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
      </el-row>

      <RefactorTable :loading="loading" :data="dataList" :table-columns-config="tableColumnsConfig">
        <template #isDefault="{row}">
          <i v-if="row.isDefault === 1" class="el-icon-success g-color-blue" />
          <i v-else class="el-icon-error g-color-gray" />
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
        <template #province="{row}">
          <span>{{ selectProvinceLabel(provinceOptions, row.province) }}</span>
        </template>
        <template #city="{row}">
          <span>{{ selectCityLabel(cityOptions, row.city) }}</span>
        </template>
        <template #edit="{row}">
          <el-button
            size="mini"
            type="text"
            @click="handleUpdate(row, 'detail')"
          >详情</el-button>
          <el-button
            size="mini"
            type="text"
            @click="handleUpdate(row, 'edit')"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
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
    </div>

    <!-- 新增/编辑/详情 对话框 -->
    <bank-dialog ref="bankDialogRef" :open.sync="open" :title="title" :disable="disable" @refresh="getList" />
  </div>
</template>

<script>
import { getProvinceList, getCityList } from '@/api/system/area';
import { bankListApi, banklist, getBankDetail, delBank } from '@/api/capital/bankcard';
import BankDialog from './bankDialog';

export default {
  name: 'Bankcard',
  components: {
    BankDialog
  },
  data() {
    return {
      tableColumnsConfig: [],
      api: bankListApi,
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
      // 平台角色字典
      roleOptions: [
        { dictLabel: '货主', dictValue: 0 },
        { dictLabel: '调度者', dictValue: 1 },
        { dictLabel: '司机', dictValue: 2 }
      ],
      // 开户银行字典
      bankOptions: [],
      provinceOptions: [],
      cityOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        mobile: undefined,
        licenseNumber: undefined,
        bankName: undefined,
        account: undefined,
        userName: undefined,
        userPhone: undefined,
        roleName: undefined
      },
      exportLoading: false
    };
  },
  created() {
    this.tableHeaderConfig(this.tableColumnsConfig, bankListApi, {
      prop: 'edit',
      isShow: true,
      label: '操作',
      width: 140,
      fixed: 'left'
    });
    this.getDictsOptions();
    this.getProvinceList();
    this.getCityList();
    this.getList();
  },
  methods: {
    /** 查询字典 */
    getDictsOptions() {
      this.getDicts('bank').then(response => {
        this.bankOptions = response.data;
      });
    },
    getProvinceList() {
      getProvinceList().then((response) => {
        this.provinceOptions = response.rows;
      });
    },
    getCityList() {
      getCityList().then((response) => {
        this.cityOptions = response.rows;
      });
    },
    /** 查询列表 */
    getList() {
      this.loading = true;
      const params = { ...this.queryParams };
      if (params.licenseNumber) {
        params.licenseNumber = params.licenseNumber.toUpperCase();
      }
      banklist(params).then(response => {
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
      getBankDetail(row.id).then(response => {
        this.$refs.bankDialogRef.setForm(response.data);
        switch (type) {
          case 'detail':
            this.disable = true;
            this.title = '查看银行卡信息';
            break;
          case 'edit':
            this.disable = false;
            this.title = '编辑银行卡信息';
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
      this.exportLoading = true;
      const params = Object.assign({}, this.queryParams);
      params.pageSize = undefined;
      params.pageNum = undefined;
      this.download('/payment/bankCard/export', params, `用户银行卡`).then(() => {
        this.exportLoading = false;
      });
    }
  }
};
</script>
