<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="货主姓名" prop="adminName">
        <el-input
          v-model="queryParams.adminName"
          placeholder="请输入货主姓名"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="电话号码" prop="telphone">
        <el-input
          v-model="queryParams.telphone"
          placeholder="请输入电话号码"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否核算" prop="isAccount">
        <el-select v-model="queryParams.isAccount" placeholder="请选择核算方式" clearable size="small" style="width: 240px">
          <el-option
            v-for="dict in isOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="核算方式" prop="accountType">
        <el-select v-model="queryParams.accountType" placeholder="请选择核算方式" clearable size="small" style="width: 240px">
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
          clearable
          size="small"
          style="width: 240px"
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
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="货主类别" prop="shipperType">
        <el-select
          v-model="queryParams.shipperType"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in typeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="审核时间">
        <el-date-picker
          v-model="queryParams.beginTime"
          clearable
          size="small"
          type="date"
          value-format="yyyy-MM-dd"
          style="width: 152px"
          placeholder="请选择"
        /> -
        <el-date-picker
          v-model="queryParams.endTime"
          clearable
          size="small"
          type="date"
          value-format="yyyy-MM-dd"
          style="width: 152px"
          placeholder="请选择"
        />
      </el-form-item>
      <el-form-item label="注册时间">
        <el-date-picker
          v-model="queryParams.beginTime"
          clearable
          size="small"
          type="date"
          value-format="yyyy-MM-dd"
          style="width: 152px"
          placeholder="请选择"
        /> -
        <el-date-picker
          v-model="queryParams.endTime"
          clearable
          size="small"
          type="date"
          value-format="yyyy-MM-dd"
          style="width: 152px"
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
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>

    <el-table v-loading="loading" :data="shipmentList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" fixed="left" />
      <el-table-column label="货主姓名" align="center" prop="adminName" />
      <el-table-column label="审核状态" align="center" prop="authStatus" sortable width="100">
        <template slot-scope="scope">
          <span v-show="scope.row.authStatus === 0" class="g-color-gray">未审核</span>
          <span v-show="scope.row.authStatus === 1" class="g-color-blue">审核中</span>
          <span v-show="scope.row.authStatus === 2" class="g-color-error">审核未通过</span>
          <span v-show="scope.row.authStatus === 3" class="g-color-success">审核通过</span>
        </template>
      </el-table-column>
      <el-table-column label="公司名称" align="center" prop="companyName" sortable />
      <el-table-column label="货主类别" align="center" prop="shipperType" :formatter="shipperTypeFormat" />
      <el-table-column label="电话号码" align="center" prop="telphone" sortable />
      <!-- <el-table-column label="货主身份证" align="center" prop="identificationNumber" />
      <el-table-column label="营业执照号" align="center" prop="businessLicenseNo" />
      <el-table-column label="统一社会信用代码代码" align="center" prop="organizationCodeNo" />
      <el-table-column label="法人身份证" align="center" prop="artificialIdentificationNumber" /> -->
      <el-table-column label="是否冻结" align="center" prop="isFreezone" :formatter="isFreezoneFormat" />
      <el-table-column label="票制类别" align="center" prop="ticketType" :formatter="ticketTypeFormat" />
      <el-table-column label="服务费比例" align="center" prop="serviceRatio" />
      <el-table-column label="是否独立核算" align="center" prop="isAccount" :formatter="isAccountFormat" />
      <el-table-column label="货源是否审核" align="center" prop="supplyIsAuth" :formatter="supplyIsAuthFormat" />
      <el-table-column label="是否预付运费" align="center" prop="isPrepaid" :formatter="isPrepaidFormat" />
      <el-table-column label="授信金额" align="center" prop="creditAmount" />
      <!-- <el-table-column label="省" align="center" prop="provinceCode" :formatter="provinceCodeFormat" />
      <el-table-column label="市" align="center" prop="cityCode" :formatter="cityCodeFormat" />
      <el-table-column label="县/区" align="center" prop="countyCode" :formatter="countyCodeFormat" />
      <el-table-column label="是否抹零" align="center" prop="isWipe" :formatter="isWipeFormat" />
      <el-table-column label="详细地址" align="center" prop="area" />
      <el-table-column label="核算方式" align="center" prop="accountType" :formatter="accountTypeFormat" />
      <el-table-column label="抹零方式" align="center" prop="wipeType" :formatter="wipeTypeFormat" />
      <el-table-column label="是否月结" align="center" prop="isMonthly" :formatter="isMonthlyFormat" />
      <el-table-column label="是否开启合理路耗" align="center" prop="isConsumption" :formatter="isConsumptionFormat" />
      <el-table-column label="路耗单位" align="center" prop="consumptionUnit" :formatter="consumptionUnitFormat" />
      <el-table-column label="路耗最小值" align="center" prop="consumptionMin" />
      <el-table-column label="路耗最大值" align="center" prop="consumptionMax" />
      <el-table-column label="调度费点数" align="center" prop="dispatchPoints" />
      <el-table-column label="创建人" align="center" prop="createCode" />
      <el-table-column label="修改人" align="center" prop="updateCode" /> -->
      <el-table-column label="审核时间" align="center" prop="authTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(new Date(scope.row.authTime), '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right" width="180">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleDEtail(scope.row, 'detail')"
          >详情</el-button>
          <el-button
            v-hasPermi="['assets:shipment:edit']"
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
            v-hasPermi="['assets:shipment:remove']"
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

    <!-- 新增/修改/详情/审核 对话框 -->
    <shipment-dialog ref="ShipmentDialog" :title="title" :open.sync="open" :disable="formDisable" @refresh="getList" />
  </div>
</template>

<script>
import { listShipment, getShipment, delShipment } from '@/api/assets/shipment';
import ShipmentDialog from './shipmentDialog';

export default {
  name: 'Shipment',
  components: {
    ShipmentDialog
  },
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
      // 参数表格数据
      shipmentList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
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
        beginTime: undefined,
        endTime: undefined
      },
      // 表单详情
      form: {},
      // 表单是否禁用
      formDisable: false
    };
  },
  created() {
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
    // 货主类别字典翻译
    shipperTypeFormat(row) {
      return this.selectDictLabel(this.typeOptions, row.shipperType);
    },
    // 审核状态字典翻译
    authStatusFormat(row) {
      return this.selectDictLabel(this.statusOptions, row.authStatus);
    },
    // 是否冻结字典翻译
    isFreezoneFormat(row) {
      return this.selectDictLabel(this.isFreezoneOptions, row.isFreezone);
    },
    // 票制类别字典翻译
    ticketTypeFormat(row) {
      return this.selectDictLabel(this.ticketTypeOptions, row.ticketType);
    },
    // 货源是否审核字典翻译
    supplyIsAuthFormat(row, column) {
      return this.selectDictLabel(this.isOptions, row.supplyIsAuth);
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
    // 是否核算字典翻译
    isAccountFormat(row, column) {
      return this.selectDictLabel(this.isOptions, row.isAccount);
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
    // 是否预付运费字典翻译
    isPrepaidFormat(row, column) {
      return this.selectDictLabel(this.isOptions, row.isPrepaid);
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
    },
    /** 重置按钮操作 */
    resetQuery() {
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
    handleDEtail(row, flag) {
      this.$refs.ShipmentDialog.reset();
      const id = row.id;
      getShipment(id).then(response => {
        this.$refs.ShipmentDialog.setForm(response.data);
        this.open = true;
        if (flag === 'detail') {
          this.title = '详情';
        } else if (flag === 'edit') {
          this.title = '编辑';
        } else if (flag === 'review') {
          this.title = '审核';
          if (row.authStatus === 0) {
            this.$refs.ShipmentDialog.authRead(response.data);
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
        return delShipment(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess('删除成功');
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('assets/shipment/export', {}, `shipment_${new Date().getTime()}.xlsx`, 'application/json');
    }
  }
};
</script>
