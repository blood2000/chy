<template>
  <div>
    <div v-show="showSearch" class="app-container app-container--search">
      <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="90px">
        <el-form-item label="货主" prop="searchValue">
          <el-input
            v-model.trim="queryParams.searchValue"
            placeholder="企业名称/货主姓名/手机号"
            clearable
            size="small"
            style="width: 272px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <!-- <el-form-item label="是否核算" prop="isAccount">
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
      </el-form-item> -->
        <el-form-item label="票制类别" prop="ticketType">
          <el-select v-model="queryParams.ticketType" placeholder="请选择票制类别" filterable clearable size="small" style="width: 272px">
            <el-option
              v-for="dict in ticketTypeOptions"
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
        <!-- <el-form-item label="企业名称" prop="companyName">
          <el-input
            v-model="queryParams.companyName"
            placeholder="请输入企业名称"
            clearable
            size="small"
            style="width: 272px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item> -->
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
        <!-- <el-form-item label="所属网点" prop="branchCode">
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
      </el-form-item> -->
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
        <el-form-item label="账号状态" prop="status">
          <el-select
            v-model="queryParams.status"
            filterable
            clearable
            size="small"
            style="width: 272px"
          >
            <el-option
              v-for="dict in userStatusOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="授信情况" prop="creditStatus">
          <el-select
            v-model="queryParams.creditStatus"
            filterable
            clearable
            size="small"
            style="width: 272px"
          >
            <el-option
              v-for="dict in creditOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="授信保护期">
          <el-date-picker
            v-model="queryParams.creditTimeBegin"
            clearable
            size="small"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width: 184px"
            placeholder="请选择"
          /> -
          <el-date-picker
            v-model="queryParams.creditTimeEnd"
            clearable
            size="small"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width: 184px"
            placeholder="请选择"
          />
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
            :loading="exportLoading"
            @click="handleExport"
          >导出</el-button>
        </el-col>
        <el-col :span="1.5" class="fr">
          <tablec-cascader v-model="tableColumnsConfig" :lcokey="api" />
        </el-col>
        <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
      </el-row>

      <RefactorTable :loading="loading" :data="shipmentList" :table-columns-config="tableColumnsConfig" :height="height" @selection-change="handleSelectionChange">
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
        <!-- 授信金额 -->
        <template #creditAmount="{row}">
          <span>{{ floor(row.creditAmount) }}</span>
        </template>
        <!-- 授信开始时间 -->
        <template #creditStartTime="{row}">
          <span>{{ parseTime(row.creditStartTime) }}</span>
        </template>
        <!-- 授信结束时间 -->
        <template #creditEndTime="{row}">
          <span>{{ parseTime(row.creditEndTime) }}</span>
        </template>
        <template #createTime="{row}">
          <span>{{ parseTime(row.createTime) }}</span>
        </template>
        <template #updateTime="{row}">
          <span>{{ parseTime(row.updateTime, '{y}-{m}-{d}') }}</span>
        </template>
        <template #authTime="{row}">
          <span>{{ parseTime(row.authTime, '{y}-{m}-{d}') }}</span>
        </template>
        <template #authStatus="{row}">
          <i v-show="row.authStatus === 0" class="g-icon-none mr5" />
          <i v-show="row.authStatus === 1" class="g-icon-deal-blue mr5" />
          <i v-show="row.authStatus === 2" class="el-icon-error g-color-error mr5" />
          <i v-show="row.authStatus === 3" class="el-icon-success g-color-success mr5" />
          <span>{{ selectDictLabel(statusOptions, row.authStatus) }}</span>
        </template>
        <template #status="{row}">
          <i v-show="row.status === '1' || row.status === '3'" class="el-icon-error g-color-error mr5" />
          <i v-show="row.status === '0'" class="el-icon-success g-color-success mr5" />
          <span>{{ selectDictLabel(userStatusOptions, row.status) }}</span>
        </template>
        <template #edit="{row}">
          <el-button
            v-if="row.authStatus != 3"
            v-hasPermi="['assets:shipment:examine']"
            size="mini"
            type="text"
            @click="handleDetail(row, 'review')"
          >审核</el-button>
          <el-button
            v-hasPermi="['assets:shipment:manage']"
            size="mini"
            type="text"
            @click="handleManage(row)"
          >管理</el-button>
          <el-button
            v-hasPermi="['assets:shipment:edit']"
            size="mini"
            type="text"
            @click="handleDetail(row, 'edit')"
          >修改</el-button>
          <el-button
            v-if="row.authStatus == 3"
            v-hasPermi="['assets:shipment:query']"
            size="mini"
            type="text"
            @click="handleDetail(row, 'detail')"
          >详情</el-button>
          <TableDropdown>
            <el-dropdown-item>
              <el-button
                v-if="row.authStatus != 3"
                v-hasPermi="['assets:shipment:query']"
                size="mini"
                type="text"
                @click="handleDetail(row, 'detail')"
              >详情</el-button>
            </el-dropdown-item>
              <el-button
                      style="width: 105px"
                      v-if="(!row.cmbcAccount || row.cmbcAccount == '') && row.authStatus === 3"
                      size="mini"
                      type="text"
                      @click="handleCreateCmbcWallet(row)"
              >创建民生账号</el-button>
            <el-dropdown-item>
              <el-button
                v-hasPermi="['assets:shipment:examine']"
                size="mini"
                type="text"
                @click="roleAssignment(row)"
              >角色分配</el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button
                size="mini"
                type="text"
                :style="row.status == '0'?'color:red':'color:green'"
                @click="updateStatus(row)"
              >{{ row.status == '0'?'冻结':'启用' }}</el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button
                v-hasPermi="['assets:shipment:remove']"
                size="mini"
                type="text"
                @click="handleDelete(row)"
              >删除</el-button>
            </el-dropdown-item>
          </TableDropdown>
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
      <manage-dialog ref="ManageDialog" :shipper-type="shipperType" :open.sync="manageDialogOpen" :shipment-code="shipmentCode" :company-code="companyCode" :user-code="userCode" />
      <!--  分配角色-->
      <role-assignment-dialog ref="RoleAssignmentDialog" :open.sync="roleAssignmentDialogOpen" :user-id="userId" :admin-name="adminName" :shipment-code="shipmentCode" :company-code="companyCode" :user-code="userCode" />
    </div>
  </div>
</template>

<script>
import { listShipmentApi, listShipment, getShipment, delShipment, createWallet } from '@/api/assets/shipment';
import { updateUserStatusByUserCode } from '@/api/system/user';
import { getBranchList } from '@/api/system/branch';
import ShipmentDialog from './shipmentDialog';
import ManageDialog from './manageDialog.vue';
import RoleAssignmentDialog from './roleAssignmentDialog.vue';
export default {
  name: 'Shipment',
  components: {
    ShipmentDialog,
    ManageDialog,
    RoleAssignmentDialog
  },
  data() {
    return {
      tableColumnsConfig: [],
      api: listShipmentApi,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      adminNames: [],
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
      roleAssignmentDialogOpen: false,
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
      userStatusOptions: [
        { dictLabel: '启用', dictValue: '0' },
        { dictLabel: '禁用', dictValue: '1' },
        { dictLabel: '冻结', dictValue: '3' }
      ],
      creditOptions: [
        { dictLabel: '已授信', dictValue: 1 },
        { dictLabel: '未授信', dictValue: 2 }
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
        isAsc: 'desc',
        orderByColumn: 'create_time',
        searchValue: undefined,
        // isAccount: undefined,
        // accountType: undefined,
        ticketType: undefined,
        authStatus: undefined,
        shipperType: undefined,
        companyName: undefined,
        telphone: undefined,
        authTimeBegin: undefined,
        authTimeEnd: undefined,
        createTimeBegin: undefined,
        createTimeEnd: undefined,
        branchCode: undefined,
        status: undefined,
        creditStatus: undefined,
        creditTimeBegin: undefined,
        creditTimeEnd: undefined
      },
      height: undefined,
      // 表单详情
      form: {},
      // 表单是否禁用
      formDisable: false,
      // 货主管理
      shipmentCode: null,
      companyCode: null,
      userCode: null,
      adminName: null,
      userId: null,
      shipperType: null,
      // 导出
      exportLoading: false
    };
  },
  computed: {
    routeName() {
      return this.$store.state.settings.quickEntryName;
    }
  },
  watch: {
    routeName: {
      handler: function(val) {
        if (val === 'Shipment') {
          this.resetQueryForm();
          this.queryParams.authStatus = JSON.parse(this.$route.query.data).authStatus;
          this.handleQuery();
        }
      },
      deep: true
    }
  },
  created() {
    this.tableHeaderConfig(this.tableColumnsConfig, listShipmentApi, {
      prop: 'edit',
      isShow: true,
      label: '操作',
      width: 180,
      fixed: 'left'
    });
    this.getDictsOptions();

    const routeData = this.$route.query.data;
    if (routeData) {
      this.queryParams.authStatus = JSON.parse(routeData).authStatus;
    }

    this.getList();
  },
  methods: {
    /** 查询字典 */
    getDictsOptions() {
      // // 核算规则
      // this.getDicts('balance_rule').then((response) => {
      //   this.accountTypeOptions = response.data;
      // });
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
      this.$store.dispatch('settings/changeQuick', null);
      listShipment(this.queryParams).then(response => {
        this.shipmentList = response.rows;
        this.total = response.total;
        this.height = 560;
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
      this.resetQueryForm();
      this.handleQuery();
    },
    resetQueryForm() {
      this.queryParams.authTimeBegin = undefined;
      this.queryParams.authTimeEnd = undefined;
      this.queryParams.createTimeBegin = undefined;
      this.queryParams.createTimeEnd = undefined;
      this.queryParams.creditTimeBegin = undefined;
      this.queryParams.creditTimeEnd = undefined;
      this.resetForm('queryForm');
      this.queryParams.authStatus = undefined;
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.adminNames = selection.map(item => item.adminName);
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
    /** 修改/详情/审核按钮操作 */
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
      const adminNames = row.adminName || this.adminNames;
      this.$confirm('是否确认删除货主姓名为"' + adminNames + '"，以及以下的所有员工的数据项?', '警告', {
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
      this.exportLoading = true;
      const params = Object.assign({}, this.queryParams);
      params.pageSize = undefined;
      params.pageNum = undefined;
      this.download('assets/shipment/export', params, `货主信息`).then(() => {
        this.exportLoading = false;
      });
    },
    /** 管理按钮操作 */
    handleManage(row) {
      this.shipmentCode = row.code;
      this.companyCode = row.companyCode;
      this.userCode = row.adminCode;
      this.shipperType = row.shipperType;
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
    },
    // 分配角色
    roleAssignment(row) {
      this.shipmentCode = row.code;
      this.companyCode = row.companyCode;
      this.userCode = row.adminCode;
      this.adminName = row.adminName;
      this.userId = row.userId;
      this.roleAssignmentDialogOpen = true;
    },
    // 解/禁用用户
    updateStatus(row) {
      var status = '0';
      if (row.status === '0') {
        status = '3';// 冻结
      } else if (row.status === '1' || row.status === '3') {
        status = '0';
      }
      this.$confirm('是否确认' + (status === '0' ? '启用' : '冻结') + '货主"' + (row.adminName || row.telphone) + '"的账号?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return updateUserStatusByUserCode(row.adminCode, status);
      }).then(() => {
        this.getList();
        this.msgSuccess(status === '0' ? '启用成功' : '冻结成功');
      });
    },
    // 创建民生账号
    handleCreateCmbcWallet(row) {
      this.$confirm('是否确认创建"' + row.adminName + '"的民生账号?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        createWallet({ code: row.code, channel: 'CMBCRegisterHandler' }).then(response => {
          if (response.code === 200) {
            this.msgSuccess('操作成功');
            this.getList();
          } else {
            this.msgError(response.msg);
          }
        });
      });
    }
  }
};
</script>
