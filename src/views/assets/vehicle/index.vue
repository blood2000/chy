<template>
  <div class="app-container">
    <el-form
      v-show="showSearch"
      ref="queryForm"
      :model="queryParams"
      :inline="true"
      label-width="68px"
    >
      <!-- <el-form-item label="编码" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="名称" prop="licenseNumber">
        <el-input
          v-model="queryParams.licenseNumber"
          placeholder="请输入名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="车主编码" prop="vehicleOwnerCode">
        <el-input
          v-model="queryParams.vehicleOwnerCode"
          placeholder="请输入车主编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="归属类型" prop="vehicleAscriptionType">
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
      </el-form-item>
      <!-- <el-form-item label="车牌类型代码" prop="classificationCode">
        <el-input
          v-model="queryParams.classificationCode"
          placeholder="请输入车牌类型代码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <!-- <el-form-item label="车牌颜色代码" prop="vehicleLicenseColorCode">
        <el-input
          v-model="queryParams.vehicleLicenseColorCode"
          placeholder="请输入车牌颜色代码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <!-- <el-form-item label="车身颜色代码" prop="vehicleColorCode">
        <el-input
          v-model="queryParams.vehicleColorCode"
          placeholder="请输入车身颜色代码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <!-- <el-form-item label="车身颜色代码" prop="vehicleTypeCode">
        <el-input
          v-model="queryParams.vehicleTypeCode"
          placeholder="请输入车身颜色代码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="能源类型" prop="vehicleEnergyType">
        <el-select
          v-model="queryParams.vehicleEnergyType"
          placeholder="请选择车辆能源类型"
          filterable
          clearable
          size="small"
        >
          <el-option
            v-for="dict in vehicleEnergyTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="车长代码" prop="vehicleLength">
        <el-input
          v-model="queryParams.vehicleLength"
          placeholder="请输入车长代码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <!-- <el-form-item label="车宽代码" prop="vehicleWidth">
        <el-input
          v-model="queryParams.vehicleWidth"
          placeholder="请输入车宽代码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <!-- <el-form-item label="车高代码" prop="vehicleHeight">
        <el-input
          v-model="queryParams.vehicleHeight"
          placeholder="请输入车高代码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <!-- <el-form-item label="车辆总重量" prop="vehicleTotalWeight">
        <el-input
          v-model="queryParams.vehicleTotalWeight"
          placeholder="请输入车辆总重量"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <!-- <el-form-item label="可载重量" prop="vehicleLoadWeight">
        <el-input
          v-model="queryParams.vehicleLoadWeight"
          placeholder="请输入车辆可载重量"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="可载平方" prop="vehicleLoadVolume">
        <el-input
          v-model="queryParams.vehicleLoadVolume"
          placeholder="请输入车辆可载平方"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="可载立方" prop="vehicleRemainingLoadVolume">
        <el-input
          v-model="queryParams.vehicleRemainingLoadVolume"
          placeholder="请输入车辆可载立方"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <!-- <el-form-item label="车身自重" prop="selfRespect">
        <el-input
          v-model="queryParams.selfRespect"
          placeholder="请输入车身自重"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <!-- <el-form-item label="车架号" prop="chassisNumber">
        <el-input
          v-model="queryParams.chassisNumber"
          placeholder="请输入车架号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <!-- <el-form-item label="发动机号" prop="engineNumber">
        <el-input
          v-model="queryParams.engineNumber"
          placeholder="请输入发动机号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <!-- <el-form-item label="底盘号" prop="vehicleChassisNumber">
        <el-input
          v-model="queryParams.vehicleChassisNumber"
          placeholder="请输入底盘号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <!-- <el-form-item label="功率" prop="vehiclePower">
        <el-input
          v-model="queryParams.vehiclePower"
          placeholder="请输入功率"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <!-- <el-form-item label="轴数" prop="axesNumber">
        <el-input
          v-model="queryParams.axesNumber"
          placeholder="请输入轴数"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="年审时间" prop="annualVerificationDate">
        <el-date-picker
          v-model="queryParams.annualVerificationDate"
          clearable
          size="small"
          style="width: 215px"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择年审时间"
        />
      </el-form-item>
      <!-- <el-form-item label="运输介子" prop="transportMeson">
        <el-input
          v-model="queryParams.transportMeson"
          placeholder="请输入运输介子"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
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
      <el-form-item>
        <el-button
          type="cyan"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
        >搜索</el-button>
        <el-button
          icon="el-icon-refresh"
          size="mini"
          @click="resetQuery"
        >重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['assets:vehicle:add']"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['assets:vehicle:edit']"
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
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
          @click="handleExport"
        >导出</el-button>
      </el-col>
      <el-col :span="1.5" class="fr">
        <tablec-cascader v-model="tableColumnsConfig" />
      </el-col>
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>

    <RefactorTable :loading="loading" :data="vehicleList" :table-columns-config="tableColumnsConfig" @selection-change="handleSelectionChange">
      <template #vehicleAscriptionType="{row}">
        <span>{{ selectDictLabel( vehicleAscriptionTypeOptions, row.vehicleAscriptionType ) }}</span>
      </template>
      <template #vehicleTypeCode="{row}">
        <span>{{ selectDictLabel(vehicleTypeOptions, row.vehicleTypeCode) }}</span>
      </template>
      <template #vehicleEnergyType="{row}">
        <span>{{ selectDictLabel(vehicleEnergyTypeOptions, row.vehicleEnergyType) }}</span>
      </template>
      <template #annualVerificationDate="{row}">
        <span>{{ parseTime(row.annualVerificationDate, '{y}-{m}-{d}') }}</span>
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
          icon="el-icon-document"
          @click="handleDEtail(row)"
        >详情</el-button>
        <el-button
          v-hasPermi="['assets:vehicle:edit']"
          size="mini"
          type="text"
          icon="el-icon-edit"
          @click="handleUpdate(row)"
        >修改</el-button>
        <el-button
          v-hasPermi="['assets:vehicle:remove']"
          size="mini"
          type="text"
          icon="el-icon-delete"
          @click="handleDelete(row)"
        >删除</el-button>
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
      @refresh="getList"
    />
  </div>
</template>

<script>
import { listInfo, getInfo, delInfo } from '@/api/assets/vehicle';
import VehicleDialog from './vehicleDialog';
import tableColumnsConfig from './config.js';

export default {
  name: 'Vehicle',
  components: {
    VehicleDialog
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
      tableColumnsConfig,
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
      // 车辆表格数据
      vehicleList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 车辆类型字典
      vehicleTypeOptions: [],
      // 车辆能源类型字典
      vehicleEnergyTypeOptions: [],
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
        licenseNumber: undefined,
        vehicleOwnerCode: undefined,
        vehicleAscriptionType: undefined,
        vehicleEnergyType: undefined,
        annualVerificationDate: undefined,
        authStatus: undefined,
        isFreeze: undefined
      },
      // 表单是否禁用
      formDisable: false
    };
  },
  created() {
    this.tableHeaderConfig();
    this.getList();
    this.getDicts('energyTypes').then((response) => {
      this.vehicleEnergyTypeOptions = response.data;
    });
    this.getDicts('vehicleType').then((response) => {
      this.vehicleTypeOptions = response.data;
    });
  },
  methods: {
    /** 配置表头 */
    tableHeaderConfig() {
      this.tableColumnsConfig = this.getLocalStorage(this.$route.name) || this.tableColumnsConfig;
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
      this.resetForm('queryForm');
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.$refs.VehicleDialog.reset();
      this.open = true;
      this.title = '添加车辆';
      this.formDisable = false;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.$refs.VehicleDialog.reset();
      const id = row.id || this.ids;
      getInfo(id).then((response) => {
        this.$refs.VehicleDialog.setForm(response.data);
        this.open = true;
        this.title = '修改车辆';
        this.formDisable = false;
      });
    },
    /** 详情按钮操作 */
    handleDEtail(row) {
      this.$refs.VehicleDialog.reset();
      const id = row.id || this.ids;
      getInfo(id).then((response) => {
        this.$refs.VehicleDialog.setForm(response.data);
        this.open = true;
        this.title = '详情';
        this.formDisable = true;
      });
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除车辆编号为"' + ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function() {
          return delInfo(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess('删除成功');
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        'assets/vehicle/export',
        {
          ...this.queryParams
        },
        `vehicle_${new Date().getTime()}.xlsx`
      );
    }
  }
};
</script>
