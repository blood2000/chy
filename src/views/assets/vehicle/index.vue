<template>
  <div>
    <div v-show="showSearch" class="app-container app-container--search">
      <el-form
        ref="queryForm"
        :model="queryParams"
        :inline="true"
        label-width="68px"
      >
        <el-form-item label="车牌号" prop="licenseNumber">
          <el-input
            v-model="queryParams.licenseNumber"
            placeholder="请输入车牌号"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="车辆类型" prop="vehicleTypeCode">
          <el-select v-model="queryParams.vehicleTypeCode" placeholder="请选择车辆类型" clearable filterable>
            <el-option
              v-for="dict in vehicleTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="归属类型" prop="vehicleAscriptionType">
          <el-select
            v-model="queryParams.vehicleAscriptionType"
            placeholder="请选择车辆归属类型"
            filterable
            clearable
            size="small"
          >
            <el-option
              v-for="dict in vehicleAscriptionTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item> -->
        <!-- <el-form-item label="能源类型" prop="vehicleEnergyType">
          <el-select
            v-model="queryParams.vehicleEnergyType"
            placeholder="请选择车辆能源类型"
            filterable
            clearable
            size="small"
          >
            <el-option
              v-for="dict in energyTypesOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item label="审核状态" prop="authStatus">
          <el-select
            v-model="queryParams.authStatus"
            placeholder="请选择审核状态"
            filterable
            clearable
            size="small"
          >
            <el-option
              v-for="dict in authStatusOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否冻结" prop="isFreeze">
          <el-select
            v-model="queryParams.isFreeze"
            placeholder="请选择是否冻结"
            clearable
            filterable
            size="small"
          >
            <el-option
              v-for="dict in isFreezeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="年审时间">
          <el-date-picker
            v-model="queryParams.annualVerificationBeginDate"
            clearable
            size="small"
            style="width: 130px"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择"
          />
          至
          <el-date-picker
            v-model="queryParams.annualVerificationEndDate"
            clearable
            size="small"
            style="width: 130px"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择"
          />
        </el-form-item> -->
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="handleQuery"
          >搜索</el-button>
          <el-button
            type="primary"
            plain
            icon="el-icon-refresh"
            size="mini"
            @click="resetQuery"
          >重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="app-container">
      <el-row v-show="!teamCode && !driverCode" :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            v-hasPermi="['assets:vehicle:add']"
            type="primary"
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd('add')"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            v-hasPermi="['assets:vehicle:edit']"
            type="success"
            icon="el-icon-edit"
            size="mini"
            :disabled="single"
            @click="handleDetail({}, 'edit')"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            v-hasPermi="['assets:vehicle:remove']"
            type="danger"
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDelete"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            v-hasPermi="['assets:vehicle:export']"
            type="warning"
            icon="el-icon-download"
            size="mini"
            :loading="exportLoading"
            @click="handleExport"
          >导出</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            v-hasPermi="['assets:vehicle:report']"
            type="warning"
            icon="el-icon-upload2"
            size="mini"
            :disabled="reportCodes.length == 0"
            @click="batchReportVehicle"
          >车辆批量上报</el-button>
        </el-col>
        <el-col :span="1.5" class="fr">
          <tablec-cascader v-model="tableColumnsConfig" :lcokey="api" />
        </el-col>
        <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
      </el-row>
      <!-- 新增司机或调度者的名下车辆 -->
      <el-row v-if="teamCode || driverCode" :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            v-hasPermi="teamCode?['assets:vehicle:team:add']:['assets:vehicle:driver:add']"
            type="primary"
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd('bind')"
          >添加车辆</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            v-hasPermi="teamCode?['assets:team:vehicle:del']:['assets:driver:vehicle:del']"
            type="danger"
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDelBind"
          >解除绑定</el-button>
        </el-col>
      </el-row>

      <RefactorTable :loading="loading" :data="vehicleList" :table-columns-config="tableColumnsConfig" @selection-change="handleSelectionChange">
        <!-- 车牌类型 -->
        <!--<template #classificationCode="{row}">
          <span>{{ selectDictLabel( licensePlateTypeOptions, row.classificationCode ) }}</span>
        </template>-->
        <template #isReport="{row}">
          <span>{{ selectDictLabel(isOption, row.isReport) }}</span>
        </template>
        <!-- 车牌颜色 -->
        <template #vehicleLicenseColorCode="{row}">
          <span>{{ selectDictLabel( licenseColorOptions, row.vehicleLicenseColorCode ) }}</span>
        </template>
        <!-- 车身颜色 -->
        <template #vehicleColorCode="{row}">
          <span>{{ selectDictLabel( carBodyColorOptions, row.vehicleColorCode ) }}</span>
        </template>
        <!-- 车辆类型 -->
        <template #vehicleTypeCode="{row}">
          <span>{{ selectDictLabel(vehicleTypeOptions, row.vehicleTypeCode) }}</span>
        </template>
        <!-- 能源类型 -->
        <template #vehicleEnergyType="{row}">
          <span>{{ selectDictLabel(energyTypesOptions, row.vehicleEnergyType) }}</span>
        </template>
        <!-- 车长 -->
        <template #vehicleLength="{row}">
          <span>{{ selectDictLabel(vehicleLengthOptions, row.vehicleLength) }}</span>
        </template>
        <!-- 车宽 -->
        <template #vehicleWidth="{row}">
          <span>{{ selectDictLabel(vehicleWidthOptions, row.vehicleWidth) }}</span>
        </template>
        <!-- 车高 -->
        <template #vehicleHeight="{row}">
          <span>{{ selectDictLabel(vehicleHeightOptions, row.vehicleHeight) }}</span>
        </template>
        <!-- 轴数 -->
        <template #axesNumber="{row}">
          <span>{{ selectDictLabel(axisTypeOptions, row.axesNumber) }}</span>
        </template>
        <!-- 车辆归属类型 -->
        <template #vehicleAscriptionType="{row}">
          <span>{{ selectDictLabel( vehicleAscriptionTypeOptions, row.vehicleAscriptionType ) }}</span>
        </template>
        <!-- 是否冻结 -->
        <template #isFreeze="{row}">
          <span>{{ selectDictLabel( isFreezeOptions, row.isFreeze ) }}</span>
        </template>
        <template #annualVerificationDate="{row}">
          <span>{{ parseTime(row.annualVerificationDate, '{y}-{m}-{d}') }}</span>
        </template>
        <template #createTime="{row}">
          <span>{{ parseTime(row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
        <template #updateTime="{row}">
          <span>{{ parseTime(row.updateTime, '{y}-{m}-{d}') }}</span>
        </template>
        <template #authStatus="{row}">
          <i v-show="row.authStatus === 0" class="g-icon-none mr5" />
          <i v-show="row.authStatus === 1" class="g-icon-deal-blue mr5" />
          <i v-show="row.authStatus === 2" class="el-icon-error g-color-error mr5" />
          <i v-show="row.authStatus === 3" class="el-icon-success g-color-success mr5" />
          <span>{{ selectDictLabel(authStatusOptions, row.authStatus) }}</span>
        </template>
        <template #edit="{row}">
          <el-button
            v-show="!teamCode && !driverCode"
            v-hasPermi="['assets:vehicle:get']"
            size="mini"
            type="text"
            @click="handleManage(row)"
          >管理</el-button>
          <el-button
            v-show="teamCode || driverCode"
            v-hasPermi="teamCode?['assets:team:vehicle:del']:['assets:driver:vehicle:del']"
            size="mini"
            type="text"
            @click="handleDelBind(row)"
          >解除绑定</el-button>
          <el-button
            size="mini"
            type="text"
            @click="handleDetail(row, 'detail')"
          >详情</el-button>
          <template v-if="!teamCode && !driverCode">
            <el-button
              v-hasPermi="['assets:vehicle:edit']"
              size="mini"
              type="text"
              @click="handleDetail(row, 'edit')"
            >修改</el-button>
            <TableDropdown>
              <el-dropdown-item>
                <el-button
                  v-show="row.authStatus != 3"
                  size="mini"
                  type="text"
                  @click="handleDetail(row, 'review')"
                >审核</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button
                  v-show="row.isReport === 0"
                  v-hasPermi="['assets:vehicle:report']"
                  size="mini"
                  type="text"
                  @click="reportVehicle(row)"
                >上报</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button
                  v-hasPermi="['assets:vehicle:remove']"
                  size="mini"
                  type="text"
                  @click="handleDelete(row)"
                >删除</el-button>
              </el-dropdown-item>
            </TableDropdown>
          </template>
        </template>
      </RefactorTable>

      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />

      <!-- 新增/修改/详情 对话框 -->
      <vehicle-dialog
        ref="VehicleDialog"
        :title="title"
        :open.sync="open"
        :disable="formDisable"
        :team-code="teamCode"
        :driver-code="driverCode"
        @refresh="getList"
      />
      <!-- 管理归属司机/归属调度 对话框 -->
      <manage-dialog ref="ManageDialog" :open.sync="manageDialogOpen" :vehicle-code="vehicleCode" />
    </div>
  </div>
</template>

<script>
import { listVehicleApi, listInfo, getInfo, delInfo, delDriverCar, delTeamCar } from '@/api/assets/vehicle';
import { waybillReportVehicleByCode } from '@/api/data/report';
import VehicleDialog from './vehicleDialog';
import ManageDialog from './manageDialog';

export default {
  name: 'Vehicle',
  components: {
    VehicleDialog,
    ManageDialog
  },
  props: {
    teamCode: {
      type: String,
      default: null
    },
    driverCode: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      tableColumnsConfig: [],
      api: listVehicleApi,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      vehicleNames: [],
      codes: [],
      reportCodes: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 车辆表格数据
      vehicleList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      manageDialogOpen: false,
      // 车牌类型字典
      licensePlateTypeOptions: [],
      // 车牌颜色字典
      licenseColorOptions: [],
      // 车身颜色字典
      carBodyColorOptions: [],
      // 车辆类型字典
  	  vehicleTypeOptions: [],
      // 能源类型字典
  	  energyTypesOptions: [],
  	  // 车长字典
  	  vehicleLengthOptions: [],
  	  // 车宽字典
  	  vehicleWidthOptions: [],
  	  // 车高字典
  	  vehicleHeightOptions: [],
  	  // 轴数字典
  	  axisTypeOptions: [],
      // 是否
      isOption: [
        { dictLabel: '否', dictValue: 0 },
        { dictLabel: '是', dictValue: 1 }
      ],
      // 车辆归属类型字典
      vehicleAscriptionTypeOptions: [
        { dictLabel: '自有', dictValue: '0' },
        { dictLabel: '加盟', dictValue: '1' }
      ],
      // 审核状态字典
      authStatusOptions: [
        { dictLabel: '未审核', dictValue: '0' },
        { dictLabel: '审核中', dictValue: '1' },
        { dictLabel: '审核未通过', dictValue: '2' },
        { dictLabel: '审核通过', dictValue: '3' }
      ],
      // 是否冻结字典
      isFreezeOptions: [
        { dictLabel: '正常', dictValue: '0' },
        { dictLabel: '冻结', dictValue: '1' }
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        isAsc: 'desc',
        orderByColumn: 'create_time',
        licenseNumber: undefined,
        vehicleOwnerCode: undefined,
        vehicleAscriptionType: undefined,
        vehicleEnergyType: undefined,
        annualVerificationBeginDate: undefined,
        annualVerificationEndDate: undefined,
        authStatus: undefined,
        isFreeze: undefined,
        vehicleTypeCode: undefined
      },
      // 表单是否禁用
      formDisable: false,
      // 车辆code
      vehicleCode: null,
      // 导出
      exportLoading: false
    };
  },
  created() {
    this.tableHeaderConfig(this.tableColumnsConfig, listVehicleApi, {
      prop: 'edit',
      isShow: true,
      label: '操作',
      width: 180,
      fixed: 'left'
    });
    this.getDictsList();
    if (!this.teamCode && !this.driverCode) {
      // 如果这个页面是以组件形式展示在调度者管理弹窗或司机管理弹窗里面，则这里不加载列表
      this.getList();
    }
  },
  methods: {
    /** 查询字典 */
    getDictsList() {
      // 车牌类型
    /*  this.getDicts('licensePlateType').then(response => {
        this.licensePlateTypeOptions = response.data;
      });*/
      // 车牌颜色
      this.getDicts('licenseColor').then(response => {
        this.licenseColorOptions = response.data;
      });
      // 车身颜色
      this.getDicts('CarBodyColor').then(response => {
        this.carBodyColorOptions = response.data;
      });
      // 车辆类型
      this.getDicts('vehicleClassification').then(response => {
        this.vehicleTypeOptions = response.data;
      });
      // 能源类型
      this.getDicts('energyTypes').then(response => {
        this.energyTypesOptions = response.data;
      });
      // 车长
      this.getDicts('vehicleLength').then(response => {
        this.vehicleLengthOptions = response.data;
      });
      // 车宽
      this.getDicts('vehicleWidth').then(response => {
        this.vehicleWidthOptions = response.data;
      });
      // 车高
      this.getDicts('vehicleHeight').then(response => {
        this.vehicleHeightOptions = response.data;
      });
      // 轴数
      this.getDicts('axis_type').then(response => {
        this.axisTypeOptions = response.data;
      });
    },
    /** 查询车辆列表 */
    getList() {
      this.loading = true;
      listInfo(this.queryParams).then((response) => {
        this.vehicleList = response.rows;
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
      if (this.driverCode) {
        this.queryParams.driverCode = this.driverCode;
      }
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.annualVerificationBeginDate = undefined;
      this.queryParams.annualVerificationEndDate = undefined;
      this.resetForm('queryForm');
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.vehicleNames = selection.map((item) => item.licenseNumber);
      this.codes = selection.map((item) => item.code);
      this.reportCodes = [];
      selection.map(item => {
        if (item.isReport === 0) {
          this.reportCodes.push(item.code);
        }
      });
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd(flag) {
      this.$refs.VehicleDialog.reset();
      this.open = true;
      switch (flag) {
        case 'add':
          this.title = '新增';
          break;
        case 'bind':
          this.title = '添加车辆';// 调度者/司机绑定车辆
          break;
        default:
          break;
      }
      this.formDisable = false;
    },
    /** 修改/详情/审核按钮操作 */
    handleDetail(row, flag) {
      this.$refs.VehicleDialog.reset();
      const id = row.id || this.ids;
      getInfo(id).then((response) => {
        this.$refs.VehicleDialog.setForm(response.data);
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
              this.$refs.VehicleDialog.authRead();
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
      const vehicleNames = row.licenseNumber || this.vehicleNames;
      this.$confirm('是否确认删除车牌号为"' + vehicleNames + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delInfo(ids);
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
      this.download('assets/vehicle/export', params, `车辆信息_${new Date().getTime()}.xlsx`).then(() => {
        this.exportLoading = false;
      });
    },
    /** 管理按钮操作 */
    handleManage(row) {
      this.vehicleCode = row.code;
      this.manageDialogOpen = true;
    },
    /** 解除司机/调度者与车辆的关联 */
    handleDelBind(row) {
      const _this = this;
      const codes = row.code || this.codes.join(',');
      const vehicleNames = row.licenseNumber || this.vehicleNames;
      this.$confirm('是否确认与车牌号为"' + vehicleNames + '"的车辆解除绑定?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        if (_this.driverCode) {
          return delDriverCar({
            driverCode: _this.driverCode,
            vehicleCodes: codes
          });
        } else if (_this.teamCode) {
          return delTeamCar({
            teamCode: _this.teamCode,
            vehicleCodes: codes
          });
        }
      }).then(() => {
        this.getList();
        this.msgSuccess('操作成功');
      });
    },
    batchReportVehicle(row) {
      var codes = this.reportCodes;
      if (row.isReport === 0) {
        codes = row.code || this.reportCodes;
      }
      if (codes.length === 0) {
        this.msgWarning('请选择未上报的车辆');
        return;
      }
      codes.forEach(code => {
        waybillReportVehicleByCode(code).then(response => {
          if (response.code === 200) {
            this.msgSuccess('上报成功');
          } else {
            this.msgWarning('上报失败');
          }
        });
      });
    },
    // 上报
    reportVehicle(row) {
      if (row.code) {
        waybillReportVehicleByCode(row.code).then(response => {
          if (response.code === 200) {
            this.msgSuccess('上报成功');
          } else {
            this.msgError(response.data);
          }
        }).catch(() => {
          this.msgError('上报失败');
        });
      } else {
        this.msgWarning('请选择要上报的车辆');
      }
    }
  }
};
</script>
