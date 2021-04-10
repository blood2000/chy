<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true" label-width="100px">
      <el-form-item label="司机类别" prop="driverType">
        <el-select v-model="queryParams.driverType" placeholder="请选择司机类别" filterable clearable size="small" class="input-width">
          <el-option
            v-for="dict in driverTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="司机姓名" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入司机姓名"
          clearable
          size="small"
          class="input-width"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号/账号" prop="telphone">
        <el-input
          v-model="queryParams.telphone"
          placeholder="请输入手机号/账号"
          clearable
          size="small"
          class="input-width"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="车牌号" prop="licenseNumber">
        <el-input
          v-model="queryParams.licenseNumber"
          placeholder="请输入车牌号"
          clearable
          size="small"
          class="input-width"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属调度" prop="teamCode">
        <el-select
          v-model="queryParams.teamCode"
          v-el-select-loadmore="loadmore"
          filterable
          remote
          reserve-keyword
          placeholder="请输入调度名称"
          :remote-method="teamRemoteMethod"
          :loading="teamLoading"
          clearable
          class="input-width"
          size="small"
        >
          <el-option
            v-for="item in teamOptions"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="身份证号" prop="identificationNumber">
        <el-input
          v-model="queryParams.identificationNumber"
          placeholder="请输入身份证号"
          clearable
          size="small"
          class="input-width"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="驾驶证类型" prop="driverLicenseType">
        <el-select v-model="queryParams.driverLicenseType" filterable clearable size="small" class="input-width">
          <el-option
            v-for="dict in driverLicenseTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="审核状态" prop="authStatus">
        <el-select v-model="queryParams.authStatus" placeholder="请选择审核状态" filterable clearable size="small" class="input-width">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="处理状态" prop="applyStatus">
        <el-select v-model="queryParams.applyStatus" placeholder="请选择状态" filterable clearable size="small" class="input-width">
          <el-option
            v-for="dict in applyStatusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['assets:driver:add']"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['assets:driver:remove']"
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >批量删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['assets:driver:export']"
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
        >导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['assets:driver:import']"
          type="info"
          icon="el-icon-upload2"
          size="mini"
          @click="handleImportDriver"
        >司机批量导入</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['assets:driver:report']"
          type="warning"
          icon="el-icon-upload2"
          size="mini"
        >司机车辆信息上报</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['assets:driver:down']"
          type="success"
          icon="el-icon-download"
          size="mini"
          @click="handleImportTemplateDriver"
        >下载模板</el-button>
      </el-col>
      <el-col :span="1.5" class="fr">
        <tablec-cascader v-model="tableColumnsConfig" :lcokey="api" />
      </el-col>
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>

    <RefactorTable :loading="loading" :data="driverList" :table-columns-config="tableColumnsConfig" @selection-change="handleSelectionChange">
      <template #driverType="{row}">
        <span>{{ selectDictLabel(driverTypeOptions, row.driverType) }}</span>
      </template>
      <template #authStatus="{row}">
        <span v-show="row.authStatus === 0" class="g-color-gray">未审核</span>
        <span v-show="row.authStatus === 1" class="g-color-blue">审核中</span>
        <span v-show="row.authStatus === 2" class="g-color-error">审核未通过</span>
        <span v-show="row.authStatus === 3" class="g-color-success">审核通过</span>
      </template>
      <template v-if="teamCode" #agreementNo="{row}">
        <el-button type="text no-padding" @click="downloadAgreement(row)">{{ row.agreementNo }}</el-button>
      </template>
      <template #validPeriodFrom="{row}">
        <span>{{ parseTime(row.validPeriodFrom, '{y}-{m}-{d}') }}</span>
      </template>
      <template #validPeriodTo="{row}">
        <span>{{ parseTime(row.validPeriodTo, '{y}-{m}-{d}') }}</span>
      </template>
      <template #driverLicenseType="{row}">
        <span>{{ selectDictLabel(driverLicenseTypeOptions, row.driverLicenseType) }}</span>
      </template>
      <template #workLicenseDueDate="{row}">
        <span>{{ parseTime(row.workLicenseDueDate, '{y}-{m}-{d}') }}</span>
      </template>
      <template #isReportPerson="{row}">
        <span>{{ selectDictLabel(isOption, row.isReportPerson) }}</span>
      </template>
      <template #isReportEnterprise="{row}">
        <span>{{ selectDictLabel(isOption, row.isReportEnterprise) }}</span>
      </template>
      <template #isFreeze="{row}">
        <span>{{ selectDictLabel(isFreezoneOptions, row.isFreeze) }}</span>
      </template>
      <template #createTime="{row}">
        <span>{{ parseTime(row.createTime, '{y}-{m}-{d}') }}</span>
      </template>
      <template #updateTime="{row}">
        <span>{{ parseTime(row.updateTime, '{y}-{m}-{d}') }}</span>
      </template>
      <template #isReportPersonDate="{row}">
        <span>{{ parseTime(row.isReportPersonDate, '{y}-{m}-{d}') }}</span>
      </template>
      <template #edit="{row}">
        <el-button
          v-hasPermi="['assets:driver:manage']"
          size="mini"
          type="text"
          icon="el-icon-setting"
          @click="handleManage(row)"
        >管理</el-button>
        <el-button
          v-hasPermi="['assets:driver:get']"
          size="mini"
          type="text"
          icon="el-icon-document"
          @click="handleDetail(row, 'detail')"
        >详情</el-button>
        <el-button
          v-hasPermi="['assets:config:edit']"
          size="mini"
          type="text"
          icon="el-icon-edit"
          @click="handleDetail(row, 'edit')"
        >修改</el-button>
        <el-button
          v-show="row.authStatus === 0 || row.authStatus === 1"
          v-hasPermi="['assets:driver:examine']"
          size="mini"
          type="text"
          icon="el-icon-document-checked"
          @click="handleDetail(row, 'review')"
        >审核</el-button>
        <el-button
          v-hasPermi="['assets:driver:join']"
          size="mini"
          type="text"
          icon="el-icon-document-add"
          @click="handleAddTeam(row)"
        >加入调度</el-button>
        <el-button
          v-show="row.apply"
          size="mini"
          type="text"
          icon="el-icon-document-checked"
          @click="handleDeal(row)"
        >处理邀请</el-button>
        <el-button
          v-hasPermi="['assets:driver:remove']"
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

    <!-- 新增/修改/详情 对话框 -->
    <driver-dialog ref="DriverDialog" :title="title" :open.sync="open" :disable="formDisable" @refresh="getList" />
    <!-- 批量导入 对话框 -->
    <import-dialog ref="ImportDialog" :title="title" :open.sync="openImport" @refresh="getList" />
    <!-- 管理车辆 对话框 -->
    <manage-dialog ref="ManageDialog" :open.sync="manageDialogOpen" :driver-code="driverCode" />
    <!-- 协议 对话框 -->
    <agreement-dialog ref="agreementDialog" :open.sync="agreementDialogOpen" :agreement-html="agreementHtml" />
    <!-- 加入调度 对话框 -->
    <add-team-dialog :open.sync="addTeamDialogOpen" :driver-code="driverCode" />
    <!-- 处理邀请 对话框 -->
    <apply-team-dialog :open.sync="applyTeamDialogOpen" :driver-code="driverCode" @refresh="getList" />
  </div>
</template>

<script>
import { listDriverApi, listDriver, getDriver, delDriver, getAgreementWord } from '@/api/assets/driver';
import { listInfo } from '@/api/assets/team';
import DriverDialog from './driverDialog';
import ImportDialog from './importDialog';
import ManageDialog from './manageDialog';
import AgreementDialog from './agreementDialog';
import AddTeamDialog from './addTeamDialog';
import applyTeamDialog from './applyTeamDialog';

export default {
  name: 'Driver',
  components: {
    DriverDialog,
    ImportDialog,
    ManageDialog,
    AgreementDialog,
    AddTeamDialog,
    applyTeamDialog
  },
  props: {
    teamCode: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      tableColumnsConfig: [],
      api: listDriverApi,
      // 司机类别字典
      driverTypeOptions: [
        { dictLabel: '独立司机', dictValue: 1 },
        { dictLabel: '聘用司机', dictValue: 2 }
      ],
      // 审核状态字典
      statusOptions: [
        { dictLabel: '未审核', dictValue: 0 },
        { dictLabel: '审核中', dictValue: 1 },
        { dictLabel: '审核未通过', dictValue: 2 },
        { dictLabel: '审核通过', dictValue: 3 }
      ],
      // 处理状态字典
      applyStatusOptions: [
        { dictLabel: '未处理', dictValue: 0 },
        { dictLabel: '已加入', dictValue: 1 },
        { dictLabel: '已拒绝', dictValue: 2 }
      ],
      // 是否冻结字典
      isFreezoneOptions: [
        { dictLabel: '正常', dictValue: 0 },
        { dictLabel: '冻结', dictValue: 1 }
      ],
      // 是否
      isOption: [
        { dictLabel: '否', dictValue: 0 },
        { dictLabel: '是', dictValue: 1 }
      ],
      // 网点编码字典
      branchCodeOptions: [],
      // 驾驶证类型字典
      driverLicenseTypeOptions: [],
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
      // 参数表格数据
      driverList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      openImport: false,
      manageDialogOpen: false,
      agreementDialogOpen: false,
      addTeamDialogOpen: false,
      applyTeamDialogOpen: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        driverType: undefined,
        name: undefined,
        telphone: undefined,
        identificationNumber: undefined,
        authStatus: undefined,
        licenseNumber: undefined,
        driverLicenseType: undefined,
        teamCode: undefined,
        applyStatus: undefined
      },
      // 表单是否禁用
      formDisable: false,
      // 司机code
      driverCode: null,
      // 下载的协议号内容
      agreementHtml: '',
      // 车队列表
      teamLoading: false,
      teamOptions: [],
      // 远程搜索调度者分页
      teamParams: {
        pageNum: 1,
        pageSize: 10,
        name: null
      }
    };
  },
  created() {
    this.tableHeaderConfig(this.tableColumnsConfig, listDriverApi, {
      prop: 'edit',
      isShow: true,
      label: '操作',
      width: 240,
      fixed: 'right'
    });
    this.getDictsOptions();
    if (!this.teamCode) {
      // 如果这个页面是以组件形式展示在调度者管理弹窗里面，则这里不加载列表
      this.getList();
    }
  },
  methods: {
    /** 查询字典 */
    getDictsOptions() {
      // 驾驶证类型
      this.getDicts('driver_license_type').then(response => {
        this.driverLicenseTypeOptions = response.data;
      });
    },
    // 司机城市名称字典翻译
    driverCityFormat(row, column) {
      return this.selectDictLabel(this.driverCityOptions, row.driverCity);
    },
    // 从业资格证办理省份名称字典翻译
    workLicenseProvinceNameFormat(row, column) {
      return this.selectDictLabel(this.workLicenseProvinceNameOptions, row.workLicenseProvinceName);
    },
    // 审核状态字典翻译
    authStatusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.authStatus);
    },
    /** 查询参数列表 */
    getList() {
      this.loading = true;
      listDriver(this.queryParams).then(response => {
        this.driverList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      if (this.teamCode) {
        this.queryParams.teamCode = this.teamCode;
      }
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm');
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.$refs.DriverDialog.reset();
      this.open = true;
      this.title = '新增';
      this.formDisable = false;
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 编辑/详情按钮操作 */
    handleDetail(row, flag) {
      this.$refs.DriverDialog.reset();
      const id = row.id || this.ids;
      getDriver(id).then(response => {
        this.$refs.DriverDialog.setForm(response.data);
        this.open = true;
        if (flag === 'detail') {
          this.title = '详情';
        } else if (flag === 'edit') {
          this.title = '编辑';
        } else if (flag === 'review') {
          this.title = '审核';
          if (row.authStatus === 0) {
            this.$refs.DriverDialog.authRead({ id: row.id });
          }
        }
        this.formDisable = flag !== 'edit';
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除编号为"' + ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delDriver(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess('删除成功');
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('assets/driver/export', {}, `driver_${new Date().getTime()}.xlsx`, 'application/json');
    },
    /** 批量导入按钮操作 */
    handleImportDriver() {
      this.openImport = true;
      this.title = '司机批量导入';
    },
    /** 下载模板 */
    handleImportTemplateDriver() {
      this.download('assets/driver/importTemplate', {}, `driver_template_${new Date().getTime()}.xlsx`);
    },
    /** 管理按钮操作 */
    handleManage(row) {
      this.driverCode = row.code;
      this.manageDialogOpen = true;
    },
    /** 下载协议 */
    downloadAgreement(row) {
      getAgreementWord({
        driverCode: row.code,
        teamCode: this.teamCode
      }).then(response => {
        this.agreementHtml = response.data;
        this.agreementDialogOpen = true;
      });
    },
    // 远程搜索
    teamRemoteMethod(query) {
      if (query !== '') {
        this.teamLoading = true;
        this.teamParams.name = query;
        this.teamParams.pageNum = 1;
        this.teamOptions = [];
        this.getTeamList();
      } else {
        this.teamOptions = [];
      }
    },
    // 查询调度者列表
    getTeamList() {
      listInfo(this.teamParams).then(response => {
        this.teamLoading = false;
        this.teamOptions = [...this.teamOptions, ...response.rows];
      });
    },
    // 远程搜索列表触底事件
    loadmore() {
      this.teamParams.pageNum++;
      this.getTeamList();
    },
    // 申请加入调度
    handleAddTeam(row) {
      this.driverCode = row.code;
      this.addTeamDialogOpen = true;
    },
    // 处理邀请
    handleDeal(row) {
      this.driverCode = row.code;
      this.applyTeamDialogOpen = true;
    }
  }
};
</script>

<style scoped>
.input-width{
  width: 240px;
}
</style>
