<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
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
      <!-- <el-form-item label="车辆归属类型 0.自有 1.加盟" prop="vehicleAscriptionType">
        <el-select v-model="queryParams.vehicleAscriptionType" placeholder="请选择车辆归属类型 0.自有 1.加盟" clearable size="small">
          <el-option
            v-for="dict in vehicleAscriptionTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item> -->
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
        <el-select v-model="queryParams.vehicleEnergyType" placeholder="请选择车辆能源类型" clearable size="small">
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
      <el-form-item label="可载重量" prop="vehicleLoadWeight">
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
      </el-form-item>
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
        <el-date-picker clearable size="small" style="width: 215px"
          v-model="queryParams.annualVerificationDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择年审时间">
        </el-date-picker>
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
        <el-select v-model="queryParams.authStatus" placeholder="请选择审核状态(0.未审核.1审核中2审核未通过3审核通过)" clearable size="small">
          <el-option
            v-for="dict in authStatusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否冻结" prop="isFreeze">
        <el-input
          v-model="queryParams.isFreeze"
          placeholder="请输入是否冻结(0正常1冻结)"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
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
          v-hasPermi="['system:info:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:info:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:info:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:info:export']"
        >导出</el-button>
      </el-col>
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="infoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编码" align="center" prop="code" :formatter="codeFormat" />
      <el-table-column label="名称" align="center" prop="licenseNumber" :formatter="licenseNumberFormat" />
      <el-table-column label="车主编码" align="center" prop="vehicleOwnerCode" :formatter="vehicleOwnerCodeFormat" />
      <el-table-column label="车辆归属类型" align="center" prop="vehicleAscriptionType" :formatter="vehicleAscriptionTypeFormat" width="130"/>
      <el-table-column label="车牌类型代码" align="center" prop="classificationCode" :formatter="classificationCodeFormat" width="130"/>
      <el-table-column label="车牌颜色代码" align="center" prop="vehicleLicenseColorCode" :formatter="vehicleLicenseColorCodeFormat" width="130"/>
      <el-table-column label="车身颜色代码" align="center" prop="vehicleColorCode" :formatter="vehicleColorCodeFormat" width="130"/>
      <el-table-column label="车身颜色代码" align="center" prop="vehicleTypeCode" :formatter="vehicleTypeCodeFormat" width="130"/>
      <el-table-column label="车辆能源类型" align="center" prop="vehicleEnergyType" :formatter="vehicleEnergyTypeFormat" width="130"/>
      <el-table-column label="车长代码" align="center" prop="vehicleLength" :formatter="vehicleLengthFormat" />
      <el-table-column label="车宽代码" align="center" prop="vehicleWidth" :formatter="vehicleWidthFormat" />
      <el-table-column label="车高代码" align="center" prop="vehicleHeight" :formatter="vehicleHeightFormat" />
      <el-table-column label="车辆总重量" align="center" prop="vehicleTotalWeight" :formatter="vehicleTotalWeightFormat" width="130"/>
      <el-table-column label="车辆可载重量" align="center" prop="vehicleLoadWeight" :formatter="vehicleLoadWeightFormat" width="130"/>
      <el-table-column label="车辆可载平方" align="center" prop="vehicleLoadVolume" :formatter="vehicleLoadVolumeFormat" width="130"/>
      <el-table-column label="车辆可载立方" align="center" prop="vehicleRemainingLoadVolume" :formatter="vehicleRemainingLoadVolumeFormat" width="130"/>
      <el-table-column label="车身自重" align="center" prop="selfRespect" :formatter="selfRespectFormat" />
      <el-table-column label="车架号" align="center" prop="chassisNumber" :formatter="chassisNumberFormat" />
      <el-table-column label="发动机号" align="center" prop="engineNumber" :formatter="engineNumberFormat" />
      <el-table-column label="底盘号" align="center" prop="vehicleChassisNumber" :formatter="vehicleChassisNumberFormat" />
      <el-table-column label="功率" align="center" prop="vehiclePower" :formatter="vehiclePowerFormat" />
      <el-table-column label="轴数" align="center" prop="axesNumber" :formatter="axesNumberFormat" />
      <el-table-column label="年审时间" align="center" prop="annualVerificationDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.annualVerificationDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="运输介子" align="center" prop="transportMeson" :formatter="transportMesonFormat" />
      <el-table-column label="审核状态" align="center" prop="authStatus" :formatter="authStatusFormat" />
      <el-table-column label="是否冻结" align="center" prop="isFreeze" :formatter="isFreezeFormat" />
      <el-table-column label="创建人" align="center" prop="createCode" :formatter="createCodeFormat" />
      <el-table-column label="更新人" align="center" prop="updateCode" :formatter="updateCodeFormat" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:info:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:info:remove']"
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

    <!-- 添加或修改【请填写功能名称】对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="主键" prop="id">
          <el-input v-model="form.id" placeholder="请输入主键" />
        </el-form-item>
        <el-form-item label="编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入编码" />
        </el-form-item>
        <el-form-item label="名称" prop="licenseNumber">
          <el-input v-model="form.licenseNumber" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="车主编码" prop="vehicleOwnerCode">
          <el-input v-model="form.vehicleOwnerCode" placeholder="请输入车主编码" />
        </el-form-item>
        <el-form-item label="车辆归属类型 0.自有 1.加盟" prop="vehicleAscriptionType">
          <el-select v-model="form.vehicleAscriptionType" placeholder="请选择车辆归属类型 0.自有 1.加盟">
            <el-option
              v-for="dict in vehicleAscriptionTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="parseInt(dict.dictValue)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车牌类型代码" prop="classificationCode">
          <el-input v-model="form.classificationCode" placeholder="请输入车牌类型代码" />
        </el-form-item>
        <el-form-item label="车牌颜色代码" prop="vehicleLicenseColorCode">
          <el-input v-model="form.vehicleLicenseColorCode" placeholder="请输入车牌颜色代码" />
        </el-form-item>
        <el-form-item label="车身颜色代码" prop="vehicleColorCode">
          <el-input v-model="form.vehicleColorCode" placeholder="请输入车身颜色代码" />
        </el-form-item>
        <el-form-item label="车身颜色代码" prop="vehicleTypeCode">
          <el-input v-model="form.vehicleTypeCode" placeholder="请输入车身颜色代码" />
        </el-form-item>
        <el-form-item label="车辆能源类型" prop="vehicleEnergyType">
          <el-select v-model="form.vehicleEnergyType" placeholder="请选择车辆能源类型">
            <el-option
              v-for="dict in vehicleEnergyTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="parseInt(dict.dictValue)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车长代码" prop="vehicleLength">
          <el-input v-model="form.vehicleLength" placeholder="请输入车长代码" />
        </el-form-item>
        <el-form-item label="车宽代码" prop="vehicleWidth">
          <el-input v-model="form.vehicleWidth" placeholder="请输入车宽代码" />
        </el-form-item>
        <el-form-item label="车高代码" prop="vehicleHeight">
          <el-input v-model="form.vehicleHeight" placeholder="请输入车高代码" />
        </el-form-item>
        <el-form-item label="车辆总重量" prop="vehicleTotalWeight">
          <el-input v-model="form.vehicleTotalWeight" placeholder="请输入车辆总重量" />
        </el-form-item>
        <el-form-item label="车辆可载重量" prop="vehicleLoadWeight">
          <el-input v-model="form.vehicleLoadWeight" placeholder="请输入车辆可载重量" />
        </el-form-item>
        <el-form-item label="车辆可载平方" prop="vehicleLoadVolume">
          <el-input v-model="form.vehicleLoadVolume" placeholder="请输入车辆可载平方" />
        </el-form-item>
        <el-form-item label="车辆可载立方" prop="vehicleRemainingLoadVolume">
          <el-input v-model="form.vehicleRemainingLoadVolume" placeholder="请输入车辆可载立方" />
        </el-form-item>
        <el-form-item label="车身自重" prop="selfRespect">
          <el-input v-model="form.selfRespect" placeholder="请输入车身自重" />
        </el-form-item>
        <el-form-item label="车架号" prop="chassisNumber">
          <el-input v-model="form.chassisNumber" placeholder="请输入车架号" />
        </el-form-item>
        <el-form-item label="发动机号" prop="engineNumber">
          <el-input v-model="form.engineNumber" placeholder="请输入发动机号" />
        </el-form-item>
        <el-form-item label="底盘号" prop="vehicleChassisNumber">
          <el-input v-model="form.vehicleChassisNumber" placeholder="请输入底盘号" />
        </el-form-item>
        <el-form-item label="功率" prop="vehiclePower">
          <el-input v-model="form.vehiclePower" placeholder="请输入功率" />
        </el-form-item>
        <el-form-item label="轴数" prop="axesNumber">
          <el-input v-model="form.axesNumber" placeholder="请输入轴数" />
        </el-form-item>
        <el-form-item label="年审时间" prop="annualVerificationDate">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.annualVerificationDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择年审时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="运输介子" prop="transportMeson">
          <el-input v-model="form.transportMeson" placeholder="请输入运输介子" />
        </el-form-item>
        <el-form-item label="审核状态(0.未审核.1审核中2审核未通过3审核通过)">
          <el-radio-group v-model="form.authStatus">
            <el-radio
              v-for="dict in authStatusOptions"
              :key="dict.dictValue"
              :label="parseInt(dict.dictValue)"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否冻结(0正常1冻结)" prop="isFreeze">
          <el-input v-model="form.isFreeze" placeholder="请输入是否冻结(0正常1冻结)" />
        </el-form-item>
        <el-form-item label="创建人" prop="createCode">
          <el-input v-model="form.createCode" placeholder="请输入创建人" />
        </el-form-item>
        <el-form-item label="更新人" prop="updateCode">
          <el-input v-model="form.updateCode" placeholder="请输入更新人" />
        </el-form-item>
        <el-form-item label="是否删除(0正常1删除)" prop="delFlag">
          <el-input v-model="form.delFlag" placeholder="请输入是否删除(0正常1删除)" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listInfo, getInfo, delInfo, addInfo, updateInfo } from "@/api/assets/vehicle";

export default {
  name: "Info",
  components: {
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
      // 【请填写功能名称】表格数据
      infoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 主键字典
      idOptions: [],
      // 编码字典
      codeOptions: [],
      // 名称字典
      licenseNumberOptions: [],
      // 车主编码字典
      vehicleOwnerCodeOptions: [],
      // 车辆归属类型 0.自有 1.加盟字典
      vehicleAscriptionTypeOptions: [],
      // 车牌类型代码字典
      classificationCodeOptions: [],
      // 车牌颜色代码字典
      vehicleLicenseColorCodeOptions: [],
      // 车身颜色代码字典
      vehicleColorCodeOptions: [],
      // 车身颜色代码字典
      vehicleTypeCodeOptions: [],
      // 车辆能源类型字典
      vehicleEnergyTypeOptions: [],
      // 车长代码字典
      vehicleLengthOptions: [],
      // 车宽代码字典
      vehicleWidthOptions: [],
      // 车高代码字典
      vehicleHeightOptions: [],
      // 车辆总重量字典
      vehicleTotalWeightOptions: [],
      // 车辆可载重量字典
      vehicleLoadWeightOptions: [],
      // 车辆可载平方字典
      vehicleLoadVolumeOptions: [],
      // 车辆可载立方字典
      vehicleRemainingLoadVolumeOptions: [],
      // 车身自重字典
      selfRespectOptions: [],
      // 车架号字典
      chassisNumberOptions: [],
      // 发动机号字典
      engineNumberOptions: [],
      // 底盘号字典
      vehicleChassisNumberOptions: [],
      // 功率字典
      vehiclePowerOptions: [],
      // 轴数字典
      axesNumberOptions: [],
      // 年审时间字典
      annualVerificationDateOptions: [],
      // 运输介子字典
      transportMesonOptions: [],
      // 审核状态(0.未审核.1审核中2审核未通过3审核通过)字典
      authStatusOptions: [],
      // 是否冻结(0正常1冻结)字典
      isFreezeOptions: [],
      // 创建人字典
      createCodeOptions: [],
      // 创建时间字典
      createTimeOptions: [],
      // 更新人字典
      updateCodeOptions: [],
      // 更新时间字典
      updateTimeOptions: [],
      // 是否删除(0正常1删除)字典
      delFlagOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        code: null,
        licenseNumber: null,
        vehicleOwnerCode: null,
        vehicleAscriptionType: null,
        classificationCode: null,
        vehicleLicenseColorCode: null,
        vehicleColorCode: null,
        vehicleTypeCode: null,
        vehicleEnergyType: null,
        vehicleLength: null,
        vehicleWidth: null,
        vehicleHeight: null,
        vehicleTotalWeight: null,
        vehicleLoadWeight: null,
        vehicleLoadVolume: null,
        vehicleRemainingLoadVolume: null,
        selfRespect: null,
        chassisNumber: null,
        engineNumber: null,
        vehicleChassisNumber: null,
        vehiclePower: null,
        axesNumber: null,
        annualVerificationDate: null,
        transportMeson: null,
        authStatus: null,
        isFreeze: null,
        createCode: null,
        updateCode: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("${column.dictType}").then(response => {
      this.idOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.codeOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.licenseNumberOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.vehicleOwnerCodeOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.vehicleAscriptionTypeOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.classificationCodeOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.vehicleLicenseColorCodeOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.vehicleColorCodeOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.vehicleTypeCodeOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.vehicleEnergyTypeOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.vehicleLengthOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.vehicleWidthOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.vehicleHeightOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.vehicleTotalWeightOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.vehicleLoadWeightOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.vehicleLoadVolumeOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.vehicleRemainingLoadVolumeOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.selfRespectOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.chassisNumberOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.engineNumberOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.vehicleChassisNumberOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.vehiclePowerOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.axesNumberOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.annualVerificationDateOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.transportMesonOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.authStatusOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.isFreezeOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.createCodeOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.createTimeOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.updateCodeOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.updateTimeOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.delFlagOptions = response.data;
    });
  },
  methods: {
    /** 查询【请填写功能名称】列表 */
    getList() {
      this.loading = true;
      listInfo(this.queryParams).then(response => {
        this.infoList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 主键字典翻译
    idFormat(row, column) {
      return this.selectDictLabel(this.idOptions, row.id);
    },
    // 编码字典翻译
    codeFormat(row, column) {
      return this.selectDictLabel(this.codeOptions, row.code);
    },
    // 名称字典翻译
    licenseNumberFormat(row, column) {
      return this.selectDictLabel(this.licenseNumberOptions, row.licenseNumber);
    },
    // 车主编码字典翻译
    vehicleOwnerCodeFormat(row, column) {
      return this.selectDictLabel(this.vehicleOwnerCodeOptions, row.vehicleOwnerCode);
    },
    // 车辆归属类型 0.自有 1.加盟字典翻译
    vehicleAscriptionTypeFormat(row, column) {
      return this.selectDictLabel(this.vehicleAscriptionTypeOptions, row.vehicleAscriptionType);
    },
    // 车牌类型代码字典翻译
    classificationCodeFormat(row, column) {
      return this.selectDictLabel(this.classificationCodeOptions, row.classificationCode);
    },
    // 车牌颜色代码字典翻译
    vehicleLicenseColorCodeFormat(row, column) {
      return this.selectDictLabel(this.vehicleLicenseColorCodeOptions, row.vehicleLicenseColorCode);
    },
    // 车身颜色代码字典翻译
    vehicleColorCodeFormat(row, column) {
      return this.selectDictLabel(this.vehicleColorCodeOptions, row.vehicleColorCode);
    },
    // 车身颜色代码字典翻译
    vehicleTypeCodeFormat(row, column) {
      return this.selectDictLabel(this.vehicleTypeCodeOptions, row.vehicleTypeCode);
    },
    // 车辆能源类型字典翻译
    vehicleEnergyTypeFormat(row, column) {
      return this.selectDictLabel(this.vehicleEnergyTypeOptions, row.vehicleEnergyType);
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
      return this.selectDictLabel(this.vehicleTotalWeightOptions, row.vehicleTotalWeight);
    },
    // 车辆可载重量字典翻译
    vehicleLoadWeightFormat(row, column) {
      return this.selectDictLabel(this.vehicleLoadWeightOptions, row.vehicleLoadWeight);
    },
    // 车辆可载平方字典翻译
    vehicleLoadVolumeFormat(row, column) {
      return this.selectDictLabel(this.vehicleLoadVolumeOptions, row.vehicleLoadVolume);
    },
    // 车辆可载立方字典翻译
    vehicleRemainingLoadVolumeFormat(row, column) {
      return this.selectDictLabel(this.vehicleRemainingLoadVolumeOptions, row.vehicleRemainingLoadVolume);
    },
    // 车身自重字典翻译
    selfRespectFormat(row, column) {
      return this.selectDictLabel(this.selfRespectOptions, row.selfRespect);
    },
    // 车架号字典翻译
    chassisNumberFormat(row, column) {
      return this.selectDictLabel(this.chassisNumberOptions, row.chassisNumber);
    },
    // 发动机号字典翻译
    engineNumberFormat(row, column) {
      return this.selectDictLabel(this.engineNumberOptions, row.engineNumber);
    },
    // 底盘号字典翻译
    vehicleChassisNumberFormat(row, column) {
      return this.selectDictLabel(this.vehicleChassisNumberOptions, row.vehicleChassisNumber);
    },
    // 功率字典翻译
    vehiclePowerFormat(row, column) {
      return this.selectDictLabel(this.vehiclePowerOptions, row.vehiclePower);
    },
    // 轴数字典翻译
    axesNumberFormat(row, column) {
      return this.selectDictLabel(this.axesNumberOptions, row.axesNumber);
    },
    // 年审时间字典翻译
    annualVerificationDateFormat(row, column) {
      return this.selectDictLabel(this.annualVerificationDateOptions, row.annualVerificationDate);
    },
    // 运输介子字典翻译
    transportMesonFormat(row, column) {
      return this.selectDictLabel(this.transportMesonOptions, row.transportMeson);
    },
    // 审核状态(0.未审核.1审核中2审核未通过3审核通过)字典翻译
    authStatusFormat(row, column) {
      return this.selectDictLabel(this.authStatusOptions, row.authStatus);
    },
    // 是否冻结(0正常1冻结)字典翻译
    isFreezeFormat(row, column) {
      return this.selectDictLabel(this.isFreezeOptions, row.isFreeze);
    },
    // 创建人字典翻译
    createCodeFormat(row, column) {
      return this.selectDictLabel(this.createCodeOptions, row.createCode);
    },
    // 创建时间字典翻译
    createTimeFormat(row, column) {
      return this.selectDictLabel(this.createTimeOptions, row.createTime);
    },
    // 更新人字典翻译
    updateCodeFormat(row, column) {
      return this.selectDictLabel(this.updateCodeOptions, row.updateCode);
    },
    // 更新时间字典翻译
    updateTimeFormat(row, column) {
      return this.selectDictLabel(this.updateTimeOptions, row.updateTime);
    },
    // 是否删除(0正常1删除)字典翻译
    delFlagFormat(row, column) {
      return this.selectDictLabel(this.delFlagOptions, row.delFlag);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        code: null,
        licenseNumber: null,
        vehicleOwnerCode: null,
        vehicleAscriptionType: null,
        classificationCode: null,
        vehicleLicenseColorCode: null,
        vehicleColorCode: null,
        vehicleTypeCode: null,
        vehicleEnergyType: null,
        vehicleLength: null,
        vehicleWidth: null,
        vehicleHeight: null,
        vehicleTotalWeight: null,
        vehicleLoadWeight: null,
        vehicleLoadVolume: null,
        vehicleRemainingLoadVolume: null,
        selfRespect: null,
        chassisNumber: null,
        engineNumber: null,
        vehicleChassisNumber: null,
        vehiclePower: null,
        axesNumber: null,
        annualVerificationDate: null,
        transportMeson: null,
        authStatus: 0,
        isFreeze: null,
        createCode: null,
        createTime: null,
        updateCode: null,
        updateTime: null,
        delFlag: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加【请填写功能名称】";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getInfo(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改【请填写功能名称】";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateInfo(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addInfo(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除【请填写功能名称】编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delInfo(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/info/export', {
        ...this.queryParams
      }, `system_info.xlsx`)
    }
  }
};
</script>