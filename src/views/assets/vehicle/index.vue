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
          placeholder="请选择车辆归属类型 0.自有 1.加盟"
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
      <!-- <el-form-item label="创建人" prop="createCode">
        <el-input
          v-model="queryParams.createCode"
          placeholder="请输入创建人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="更新人" prop="updateCode">
        <el-input
          v-model="queryParams.updateCode"
          placeholder="请输入更新人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
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
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>
    <el-table
      v-loading="loading"
      :data="vehicleList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" fixed="left" />
      <!-- <el-table-column label="编码" align="center" prop="code" /> -->
      <el-table-column
        label="名称"
        align="center"
        prop="licenseNumber"
        width="130"
        sortable
      />
      <el-table-column
        label="车主编码"
        align="center"
        prop="vehicleOwnerCode"
        width="130"
        sortable
      />
      <el-table-column
        label="车辆归属类型"
        align="center"
        prop="vehicleAscriptionType"
        :formatter="vehicleAscriptionTypeFormat"
        width="130"
      />
      <el-table-column
        label="车牌类型代码"
        align="center"
        prop="classificationCode"
        width="130"
        sortable
      />
      <el-table-column
        label="车牌颜色代码"
        align="center"
        prop="vehicleLicenseColorCode"
        width="130"
      />
      <el-table-column
        label="车身颜色代码"
        align="center"
        prop="vehicleColorCode"
        width="130"
      />
      <el-table-column
        label="车辆类型代码"
        align="center"
        prop="vehicleTypeCode"
        width="130"
        :formatter="vehicleTypeCodeFormat"
      />
      <el-table-column
        label="车辆能源类型"
        align="center"
        prop="vehicleEnergyType"
        width="130"
        :formatter="vehicleEnergyTypeFormat"
      />
      <el-table-column
        label="车长代码"
        align="center"
        prop="vehicleLength"
        width="130"
        sortable
        :formatter="vehicleLengthFormat"
      />
      <el-table-column
        label="车宽代码"
        align="center"
        prop="vehicleWidth"
        :formatter="vehicleWidthFormat"
      />
      <el-table-column
        label="车高代码"
        align="center"
        prop="vehicleHeight"
        :formatter="vehicleHeightFormat"
      />
      <el-table-column
        label="车辆总重量"
        align="center"
        prop="vehicleTotalWeight"
        width="130"
        :formatter="vehicleTotalWeightFormat"
        sortable
      />
      <el-table-column
        label="车辆可载重量"
        align="center"
        prop="vehicleLoadWeight"
        width="130"
        :formatter="vehicleLoadWeightFormat"
        sortable
      />
      <el-table-column
        label="车辆可载平方"
        align="center"
        prop="vehicleLoadVolume"
        width="130"
      />
      <el-table-column
        label="车辆可载立方"
        align="center"
        prop="vehicleRemainingLoadVolume"
        :formatter="vehicleRemainingLoadVolumeFormat"
        width="130"
      />
      <el-table-column
        label="车身自重"
        align="center"
        prop="selfRespect"
        :formatter="selfRespectFormat"
      />
      <el-table-column label="车架号" align="center" prop="chassisNumber" />
      <el-table-column label="发动机号" align="center" prop="engineNumber" />
      <el-table-column
        label="底盘号"
        align="center"
        prop="vehicleChassisNumber"
      />
      <el-table-column label="功率" align="center" prop="vehiclePower" />
      <el-table-column
        label="轴数"
        align="center"
        prop="axesNumber"
        :formatter="axesNumberFormat"
      />
      <el-table-column
        label="年审时间"
        align="center"
        prop="annualVerificationDate"
        width="130"
        sortable
      >
        <template slot-scope="scope">
          <span>{{
            parseTime(new Date(scope.row.annualVerificationDate)).slice(0, 10)
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="运输介子" align="center" prop="transportMeson" />
      <el-table-column
        label="审核状态"
        align="center"
        prop="authStatus"
        :formatter="authStatusFormat"
      />
      <el-table-column
        label="是否冻结"
        align="center"
        prop="isFreeze"
        :formatter="isFreezeFormat"
      />
      <!-- <el-table-column label="创建人" align="center" prop="createCode" :formatter="createCodeFormat" />
      <el-table-column label="更新人" align="center" prop="updateCode" :formatter="updateCodeFormat" /> -->
      <el-table-column
        label="车头正面照"
        align="center"
        prop="vehicleImage"
        width="130"
      />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        fixed="right"
        width="180"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleDEtail(scope.row)"
          >详情</el-button>
          <el-button
            v-hasPermi="['assets:vehicle:edit']"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            v-hasPermi="['assets:vehicle:remove']"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

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

export default {
  name: 'Vehicle',
  components: {
    VehicleDialog
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
      // 车辆表格数据
      vehicleList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 车长代码字典
      vehicleLengthOptions: [],
      // 车宽代码字典
      vehicleWidthOptions: [],
      // 车高代码字典
      vehicleHeightOptions: [],
      // 轴数字典
      vehicleZhoushuOptions: [],
      // 立方代码字典
      vehicleCubeOptions: [],
      // 吨位代码字典
      vehicleTonnageOptions: [],
      // 车辆类型字典
      vehicleTypeOptions: [],
      // 车辆能源类型字典
      vehicleEnergyTypeOptions: [],
      // 车辆归属类型 0.自有 1.加盟字典
      vehicleAscriptionTypeOptions: [
        { dictLabel: '自有', dictValue: '0' },
        { dictLabel: '加盟', dictValue: '1' }
      ],
      // 审核状态(0.未审核.1审核中2审核未通过3审核通过)字典
      authStatusOptions: [
        { dictLabel: '未审核', dictValue: '0' },
        { dictLabel: '审核中', dictValue: '1' },
        { dictLabel: '审核未通过', dictValue: '2' },
        { dictLabel: '审核通过', dictValue: '3' }
      ],
      // 是否冻结(0正常1冻结)字典
      isFreezeOptions: [
        { dictLabel: '正常', dictValue: '0' },
        { dictLabel: '冻结', dictValue: '1' }
      ],
      // 是否删除(0正常1删除)字典
      delFlagOptions: [],
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
    this.getList();
    this.getDicts('energyTypes').then((response) => {
      this.vehicleEnergyTypeOptions = response.data;
    });
    this.getDicts('vehicleLength').then((response) => {
      this.vehicleLengthOptions = response.data;
    });
    this.getDicts('vehicleWidth').then((response) => {
      this.vehicleWidthOptions = response.data;
    });
    this.getDicts('vehicleHeight').then((response) => {
      this.vehicleHeightOptions = response.data;
    });
    this.getDicts('vehicleZhoushu').then((response) => {
      this.vehicleZhoushuOptions = response.data;
    });
    this.getDicts('vehicleCube').then((response) => {
      this.vehicleCubeOptions = response.data;
    });
    this.getDicts('vehicleType').then((response) => {
      this.vehicleTypeOptions = response.data;
    });
    this.getDicts('vehicleTonnage').then((response) => {
      this.vehicleTonnageOptions = response.data;
    });
  },
  methods: {
    /** 查询车辆列表 */
    getList() {
      this.loading = true;
      listInfo(this.queryParams).then((response) => {
        this.vehicleList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 车辆能源类型字典翻译
    vehicleEnergyTypeFormat(row, column) {
      return this.selectDictLabel(
        this.vehicleEnergyTypeOptions,
        row.vehicleEnergyType
      );
    },
    // 车辆归属类型 0.自有 1.加盟字典翻译
    vehicleAscriptionTypeFormat(row, column) {
      return this.selectDictLabel(
        this.vehicleAscriptionTypeOptions,
        row.vehicleAscriptionType
      );
    },
    // 车辆类型字典翻译
    vehicleTypeCodeFormat(row, column) {
      return this.selectDictLabel(this.vehicleTypeOptions, row.vehicleTypeCode);
    },
    // 车长代码字典翻译
    vehicleLengthFormat(row, column) {
      return this.selectDictLabel(this.vehicleLengthOptions, row.vehicleLength);
    },
    // 车宽代码字典翻译
    vehicleWidthFormat(row, column) {
      return this.selectDictLabel(this.vehicleWidthOptions, row.vehicleWidth);
    },
    // 车高代码字典翻译
    vehicleHeightFormat(row, column) {
      return this.selectDictLabel(this.vehicleHeightOptions, row.vehicleHeight);
    },
    // 车辆总重量字典翻译
    vehicleTotalWeightFormat(row, column) {
      return this.selectDictLabel(
        this.vehicleTonnageOptions,
        row.vehicleTotalWeight
      );
    },
    // 车辆可载重量字典翻译
    vehicleLoadWeightFormat(row, column) {
      return this.selectDictLabel(
        this.vehicleTonnageOptions,
        row.vehicleLoadWeight
      );
    },
    // 车辆自重字典翻译
    selfRespectFormat(row, column) {
      return this.selectDictLabel(this.vehicleTonnageOptions, row.selfRespect);
    },
    // 车辆可载立方字典翻译
    vehicleRemainingLoadVolumeFormat(row, column) {
      return this.selectDictLabel(
        this.vehicleCubeOptions,
        row.vehicleRemainingLoadVolume
      );
    },
    // 轴数字典翻译
    axesNumberFormat(row, column) {
      return this.selectDictLabel(this.vehicleZhoushuOptions, row.axesNumber);
    },
    // 审核状态(0.未审核.1审核中2审核未通过3审核通过)字典翻译
    authStatusFormat(row, column) {
      return this.selectDictLabel(this.authStatusOptions, row.authStatus);
    },
    // 是否冻结(0正常1冻结)字典翻译
    isFreezeFormat(row, column) {
      return this.selectDictLabel(this.isFreezeOptions, row.isFreeze);
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
