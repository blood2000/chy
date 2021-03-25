<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true" label-width="74px">
      <el-form-item label="司机类别" prop="driverType">
        <el-select v-model="queryParams.driverType" placeholder="请选择司机类别" clearable size="small" style="width: 240px">
          <el-option
            v-for="dict in driverTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="名字" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入名字"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机" prop="telphone">
        <el-input
          v-model="queryParams.telphone"
          placeholder="请输入手机"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="固话" prop="fixedPhone">
        <el-input
          v-model="queryParams.fixedPhone"
          placeholder="请输入固话"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="身份证号" prop="identificationNumber">
        <el-input
          v-model="queryParams.identificationNumber"
          placeholder="请输入身份证号"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="审核状态" prop="authStatus">
        <el-select v-model="queryParams.authStatus" placeholder="请选择审核状态" clearable size="small" style="width: 240px">
          <el-option
            v-for="dict in statusOptions"
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
          v-hasPermi="['system:driver:add']"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >批量删除</el-button>
      </el-col>
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
          @click="handleImportDriver"
        >司机批量导入</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-upload2"
          size="mini"
        >司机车辆信息上报</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-download"
          size="mini"
          @click="handleImportTemplateDriver"
        >下载模板</el-button>
      </el-col>
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>

    <el-table v-loading="loading" :data="driverList" type="expand" @selection-change="handleSelectionChange" @expand-change="handleExpand">
      <el-table-column type="selection" width="55" align="center" fixed="left" />
      <!-- <el-table-column type="expand" /> -->
      <el-table-column label="司机类别" align="center" prop="driverType" :formatter="driverTypeFormat" />
      <el-table-column label="名字" align="center" prop="name" />
      <el-table-column label="审核状态" align="center" prop="authStatus" sortable width="100">
        <template slot-scope="scope">
          <span v-show="scope.row.authStatus === 0" class="g-color-gray">未审核</span>
          <span v-show="scope.row.authStatus === 1" class="g-color-blue">审核中</span>
          <span v-show="scope.row.authStatus === 2" class="g-color-error">审核未通过</span>
          <span v-show="scope.row.authStatus === 3" class="g-color-success">审核通过</span>
        </template>
      </el-table-column>
      <el-table-column v-if="teamCode" label="协议号" align="center" prop="agreementNo">
        <template slot-scope="scope">
          <el-button type="text no-padding" @click="downloadAgreement(scope.row)">{{ scope.row.agreementNo }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="手机" align="center" prop="telphone" />
      <el-table-column label="固话" align="center" prop="fixedPhone" />
      <el-table-column label="工作单位" align="center" prop="workCompany" />
      <el-table-column label="司机城市名称" align="center" prop="driverCity" />
      <el-table-column label="地址" align="center" prop="homeAddress" />
      <el-table-column label="身份证号" align="center" prop="identificationNumber" />
      <el-table-column label="驾驶证" align="center" prop="driverLicense" />
      <el-table-column label="驾驶证有效期自" align="center" prop="validPeriodFrom" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.validPeriodFrom, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="驾驶证有效期至" align="center" prop="validPeriodTo" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.validPeriodTo, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="驾驶证类型" align="center" prop="driverLicenseType" />
      <el-table-column label="上岗证" align="center" prop="workLicense" />
      <el-table-column label="从业资格证到期日期" align="center" prop="workLicenseDueDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.workLicenseDueDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="营业执照号" align="center" prop="businessLicenseImgNo" />
      <el-table-column label="是否上传人员信用信息" align="center" prop="isReportPerson" :formatter="isReportPersonFormat" />
      <el-table-column label="驾驶证发证机关" align="center" prop="issuingOrganizations" />
      <el-table-column label="是否上传企业" align="center" prop="isReportEnterprise" :formatter="isReportEnterpriseFormat" />
      <el-table-column label="从业资格证办理省份名称" align="center" prop="workLicenseProvinceName" />
      <el-table-column label="是否冻结" align="center" prop="isFreeze" :formatter="isFreezeFormat" />
      <el-table-column label="创建人" align="center" prop="createCode" />
      <el-table-column label="修改人" align="center" prop="updateCode" />
      <el-table-column label="创建时间" align="center" prop="createTime" sortable width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right" width="180">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-setting"
            @click="handleManage(scope.row)"
          >管理</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleDEtail(scope.row)"
          >详情</el-button>
          <el-button
            v-hasPermi="['system:config:edit']"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleDEtail(scope.row, 'edit')"
          >修改</el-button>
          <el-button
            v-show="scope.row.authStatus === 0 || scope.row.authStatus === 1"
            size="mini"
            type="text"
            icon="el-icon-document-checked"
            @click="handleDEtail(scope.row, 'review')"
          >审核</el-button>
          <el-button
            v-hasPermi="['system:config:remove']"
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

    <!-- 新增/修改/详情 对话框 -->
    <driver-dialog ref="DriverDialog" :title="title" :open.sync="open" :disable="formDisable" @refresh="getList" />
    <!-- 批量导入 对话框 -->
    <import-dialog ref="ImportDialog" :title="title" :open.sync="openImport" @refresh="getList" />
    <!-- 管理车辆 对话框 -->
    <manage-dialog ref="ManageDialog" :open.sync="manageDialogOpen" :driver-code="driverCode" />
    <!-- 协议 对话框 -->
    <agreement-dialog ref="agreementDialog" :open.sync="agreementDialogOpen" :agreement-html="agreementHtml" />
  </div>
</template>

<script>
import { listDriver, getDriver, delDriver, getAgreementWord } from '@/api/assets/driver';
import DriverDialog from './driverDialog';
import ImportDialog from './importDialog';
import ManageDialog from './manageDialog';
import AgreementDialog from './agreementDialog';

export default {
  name: 'Driver',
  components: {
    DriverDialog,
    ImportDialog,
    ManageDialog,
    AgreementDialog
  },
  props: {
    teamCode: {
      type: String,
      default: null
    }
  },
  data() {
    return {
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
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        driverType: undefined,
        name: undefined,
        telphone: undefined,
        fixedPhone: undefined,
        identificationNumber: undefined,
        authStatus: undefined
      },
      // 表单是否禁用
      formDisable: false,
      // 司机code
      driverCode: null,
      // 下载的协议号内容
      agreementHtml: ''
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 司机类别字典翻译
    driverTypeFormat(row, column) {
      return this.selectDictLabel(this.driverTypeOptions, row.driverType);
    },
    // 司机城市名称字典翻译
    driverCityFormat(row, column) {
      return this.selectDictLabel(this.driverCityOptions, row.driverCity);
    },
    // 驾驶证类型字典翻译
    driverLicenseTypeFormat(row, column) {
      return this.selectDictLabel(this.driverLicenseTypeOptions, row.driverLicenseType);
    },
    // 从业资格证办理省份名称字典翻译
    workLicenseProvinceNameFormat(row, column) {
      return this.selectDictLabel(this.workLicenseProvinceNameOptions, row.workLicenseProvinceName);
    },
    // 审核状态字典翻译
    authStatusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.authStatus);
    },
    // 是否冻结字典翻译
    isFreezeFormat(row, column) {
      return this.selectDictLabel(this.isFreezoneOptions, row.isFreeze);
    },
    // 是否上传人员信用信息字典翻译
    isReportPersonFormat(row, column) {
      return this.selectDictLabel(this.isOption, row.isReportPerson);
    },
    // 是否上传企业字典翻译
    isReportEnterpriseFormat(row, column) {
      return this.selectDictLabel(this.isOption, row.isReportEnterprise);
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
    handleDEtail(row, flag) {
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
    /** 展开车辆列表 */
    handleExpand(row) {
      console.log(row);
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
    }
  }
};
</script>
