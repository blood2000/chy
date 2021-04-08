<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true" label-width="100px">
      <el-form-item label="货主姓名" prop="adminName">
        <el-input
          v-model="queryParams.adminName"
          placeholder="请输入货主姓名"
          clearable
          size="small"
          style="width: 272px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号/账号" prop="telphone">
        <el-input
          v-model="queryParams.telphone"
          placeholder="请输入手机号/账号"
          clearable
          size="small"
          style="width: 272px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否核算" prop="isAccount">
        <el-select v-model="queryParams.isAccount" placeholder="请选择核算方式" filterable clearable size="small" style="width: 272px">
          <el-option
            v-for="dict in isOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="核算方式" prop="accountType">
        <el-select v-model="queryParams.accountType" placeholder="请选择核算方式" filterable clearable size="small" style="width: 272px">
          <el-option
            v-for="dict in accountTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="审核状态" prop="authStatus">
        <el-select
          v-model="queryParams.authStatus"
          filterable
          clearable
          size="small"
          style="width: 272px"
        >
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="公司名称" prop="companyName">
        <el-input
          v-model="queryParams.companyName"
          placeholder="请输入公司名称"
          clearable
          size="small"
          style="width: 272px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="货主类别" prop="shipperType">
        <el-select
          v-model="queryParams.shipperType"
          filterable
          clearable
          size="small"
          style="width: 272px"
        >
          <el-option
            v-for="dict in typeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="所属网点" prop="branchCode">
        <el-select
          v-model="queryParams.branchCode"
          filterable
          remote
          reserve-keyword
          placeholder="请输入网点"
          style="width: 272px"
          size="small"
          :remote-method="getBranchOptions"
          :loading="loading"
        >
          <el-option
            v-for="item in branchOptions"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="审核时间">
        <el-date-picker
          v-model="queryParams.authTimeBegin"
          clearable
          size="small"
          type="date"
          value-format="yyyy-MM-dd"
          style="width: 130px"
          placeholder="请选择"
        /> -
        <el-date-picker
          v-model="queryParams.authTimeEnd"
          clearable
          size="small"
          type="date"
          value-format="yyyy-MM-dd"
          style="width: 130px"
          placeholder="请选择"
        />
      </el-form-item>
      <el-form-item label="注册时间">
        <el-date-picker
          v-model="queryParams.createTimeBegin"
          clearable
          size="small"
          type="date"
          value-format="yyyy-MM-dd"
          style="width: 130px"
          placeholder="请选择"
        /> -
        <el-date-picker
          v-model="queryParams.createTimeEnd"
          clearable
          size="small"
          type="date"
          value-format="yyyy-MM-dd"
          style="width: 130px"
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
          v-hasPermi="['assets:shipment:add']"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['assets:shipment:remove']"
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >批量删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['assets:shipment:export']"
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

    <RefactorTable :loading="loading" :data="shipmentList" :table-columns-config="tableColumnsConfig" @selection-change="handleSelectionChange">
      <template #shipperType="{row}">
        <span>{{ selectDictLabel(typeOptions, row.shipperType) }}</span>
      </template>
      <template #isFreezone="{row}">
        <span>{{ selectDictLabel(isFreezoneOptions, row.isFreezone) }}</span>
      </template>
      <template #ticketType="{row}">
        <span>{{ selectDictLabel(ticketTypeOptions, row.ticketType) }}</span>
      </template>
      <template #isAccount="{row}">
        <span>{{ selectDictLabel(isOptions, row.isAccount) }}</span>
      </template>
      <template #supplyIsAuth="{row}">
        <span>{{ selectDictLabel(isOptions, row.supplyIsAuth) }}</span>
      </template>
      <template #isPrepaid="{row}">
        <span>{{ selectDictLabel(isOptions, row.isPrepaid) }}</span>
      </template>
      <template #createTime="{row}">
        <span>{{ parseTime(row.createTime, '{y}-{m}-{d}') }}</span>
      </template>
      <template #updateTime="{row}">
        <span>{{ parseTime(row.updateTime, '{y}-{m}-{d}') }}</span>
      </template>
      <template #authTime="{row}">
        <span>{{ parseTime(row.authTime, '{y}-{m}-{d}') }}</span>
      </template>
      <template #authStatus="{row}">
        <span v-show="row.authStatus === 0" class="g-color-gray">未审核</span>
        <span v-show="row.authStatus === 1" class="g-color-blue">审核中</span>
        <span v-show="row.authStatus === 2" class="g-color-error">审核未通过</span>
        <span v-show="row.authStatus === 3" class="g-color-success">审核通过</span>
      </template>
      <template #edit="{row}">
        <el-button
          size="mini"
          type="text"
          icon="el-icon-setting"
          @click="handleManage(row)"
        >管理</el-button>
        <el-button
          size="mini"
          type="text"
          icon="el-icon-document"
          @click="handleDetail(row, 'detail')"
        >详情</el-button>
        <el-button
          v-hasPermi="['assets:shipment:edit']"
          size="mini"
          type="text"
          icon="el-icon-edit"
          @click="handleDetail(row, 'edit')"
        >修改</el-button>
        <el-button
          v-show="row.authStatus === 0 || row.authStatus === 1"
          size="mini"
          type="text"
          icon="el-icon-document-checked"
          @click="handleDetail(row, 'review')"
        >审核</el-button>
        <el-button
          v-hasPermi="['assets:shipment:remove']"
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

    <!-- 新增/修改/详情/审核 对话框 -->
    <shipment-dialog ref="ShipmentDialog" :title="title" :open.sync="open" :disable="formDisable" @refresh="getList" />
    <!-- 管理 对话框 -->
    <manage-dialog ref="ManageDialog" :open.sync="manageDialogOpen" :shipment-code="shipmentCode" :company-code="companyCode" />
  </div>
</template>

<script>
import { listShipmentApi, listShipment, getShipment, delShipment } from '@/api/assets/shipment';
import { getBranchList } from '@/api/system/branch';
import ShipmentDialog from './shipmentDialog';
import ManageDialog from './manageDialog.vue';

export default {
  name: 'Shipment',
  components: {
    ShipmentDialog,
    ManageDialog
  },
  data() {
    return {
      tableColumnsConfig: [],
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
      shipmentList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      manageDialogOpen: false,
      // 货主类型数据字典
      typeOptions: [
        { dictLabel: '发货人', dictValue: 0 },
        { dictLabel: '发货企业', dictValue: 1 }
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
      // 是否字典
      isOptions: [
        { dictLabel: '否', dictValue: 0 },
        { dictLabel: '是', dictValue: 1 }
      ],
      // 网点字典
      branchOptions: [],
      // 票制类别字典
      ticketTypeOptions: [],
      // 省编码字典
      provinceCodeOptions: [],
      // 市编码字典翻译
      cityCodeOptions: [],
      // 县/区编码字典翻译
      countyCodeOptions: [],
      // 核算方式字典
      accountTypeOptions: [],
      // 抹零方式字典
      wipeTypeOptions: [],
      // 路耗单位字典
      consumptionUnitOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        adminName: undefined,
        isAccount: undefined,
        accountType: undefined,
        authStatus: undefined,
        companyName: undefined,
        telphone: undefined,
        authTimeBegin: undefined,
        authTimeEnd: undefined,
        createTimeBegin: undefined,
        createTimeEnd: undefined,
        branchCode: undefined
      },
      // 表单详情
      form: {},
      // 表单是否禁用
      formDisable: false,
      // 货主管理
      shipmentCode: null,
      companyCode: null
    };
  },
  created() {
    this.tableHeaderConfig(this.tableColumnsConfig, listShipmentApi, {
      prop: 'edit',
      isShow: true,
      label: '操作',
      width: 280,
      fixed: 'right'
    });
    this.getDictsOptions();
    this.getList();
  },
  methods: {
    /** 查询字典 */
    getDictsOptions() {
      // 核算规则
      this.getDicts('balance_rule').then((response) => {
        this.accountTypeOptions = response.data;
      });
      // 票制类别
      this.getDicts('assets_ticket_type').then((response) => {
        this.ticketTypeOptions = response.data;
      });
      // 合理路耗计量单位
      this.getDicts('consumption_unit').then((response) => {
        this.consumptionUnitOptions = response.data;
      });
      // 抹零方式
      this.getDicts('wipe_type').then((response) => {
        this.wipeTypeOptions = response.data;
      });
    },
    /** 查询参数列表 */
    getList() {
      this.loading = true;
      listShipment(this.queryParams).then(response => {
        this.shipmentList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 审核状态字典翻译
    authStatusFormat(row) {
      return this.selectDictLabel(this.statusOptions, row.authStatus);
    },
    // 省编码字典翻译
    provinceCodeFormat(row, column) {
      return this.selectDictLabel(this.provinceCodeOptions, row.provinceCode);
    },
    // 市编码字典翻译
    cityCodeFormat(row, column) {
      return this.selectDictLabel(this.cityCodeOptions, row.cityCode);
    },
    // 县/区编码字典翻译
    countyCodeFormat(row, column) {
      return this.selectDictLabel(this.countyCodeOptions, row.countyCode);
    },
    // 核算方式字典翻译
    accountTypeFormat(row, column) {
      return this.selectDictLabel(this.accountTypeOptions, row.accountType);
    },
    // 是否抹零字典翻译
    isWipeFormat(row, column) {
      return this.selectDictLabel(this.isOptions, row.isWipe);
    },
    // 抹零方式字典翻译
    wipeTypeFormat(row, column) {
      return this.selectDictLabel(this.wipeTypeOptions, row.wipeType);
    },
    // 是否月结字典翻译
    isMonthlyFormat(row, column) {
      return this.selectDictLabel(this.isOptions, row.isMonthly);
    },
    // 是否开启合理路耗字典翻译
    isConsumptionFormat(row, column) {
      return this.selectDictLabel(this.isOptions, row.isConsumption);
    },
    // 路耗单位字典翻译
    consumptionUnitFormat(row, column) {
      return this.selectDictLabel(this.consumptionUnitOptions, row.consumptionUnit);
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
      console.log(this.tableColumnsConfig);
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.authTimeBegin = undefined;
      this.queryParams.authTimeEnd = undefined;
      this.queryParams.createTimeBegin = undefined;
      this.queryParams.createTimeEnd = undefined;
      this.resetForm('queryForm');
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.$refs.ShipmentDialog.reset();
      this.open = true;
      this.title = '新增';
      this.formDisable = false;
    },
    /** 修改/详情按钮操作 */
    handleDetail(row, flag) {
      this.$refs.ShipmentDialog.reset();
      const id = row.id;
      getShipment(id).then(response => {
        this.$refs.ShipmentDialog.setForm(response.data);
        this.open = true;
        switch (flag) {
          case 'detail':
            this.title = '详情';
            break;
          case 'edit':
            this.title = '编辑';
            break;
          case 'review':
            this.title = '审核';
            if (row.authStatus === 0) {
              this.$refs.ShipmentDialog.authRead(response.data);
            }
            break;
          default:
            break;
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
        return delShipment(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess('删除成功');
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('assets/shipment/export', {}, `shipment_${new Date().getTime()}.xlsx`, 'application/json');
    },
    /** 管理按钮操作 */
    handleManage(row) {
      this.shipmentCode = row.code;
      this.companyCode = row.companyCode;
      this.manageDialogOpen = true;
    },
    /** 查询网点列表 */
    getBranchOptions(query) {
      if (query !== '') {
        this.loading = true;
        getBranchList({
          name: query
        }).then(response => {
          this.loading = false;
          this.branchOptions = response.data;
        });
      } else {
        this.branchOptions = [];
      }
    }
  }
};
</script>
