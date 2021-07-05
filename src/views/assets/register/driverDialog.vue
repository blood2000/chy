<template>
  <el-dialog class="i-add" title="新增司机" :visible="visible" width="800px" append-to-body :close-on-click-modal="false" @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="154px">
        <el-form-item label="手机号" prop="telphone">
            <el-input v-model="form.telphone" placeholder="请输入手机号" disabled  class="width90" clearable />
        </el-form-item>
      <el-form-item label="司机类别" prop="driverType">
        <el-select v-model="form.driverType" class="width90">
          <el-option
            v-for="dict in driverTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="parseInt(dict.dictValue)"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="form.driverType == 2"
        label="所属调度"
        prop="teamCode"
        :rules="[
          { required: true, message: '所属调度不能为空', trigger: ['change', 'blur'] },
        ]"
      >
        <el-select
          v-model="form.teamCode"
          v-el-select-loadmore="loadmore"
          filterable
          remote
          reserve-keyword
          placeholder="请输入调度名称搜索"
          :remote-method="teamRemoteMethod"
          :loading="loading"
          clearable
          class="width90"
        >
          <el-option
            v-for="item in teamOptions"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
      </el-form-item>
        <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" placeholder="支持自动识别" class="width90" clearable />
        </el-form-item>
     <!-- <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password" :placeholder="form.id?'密码未修改可不填写':'请输入密码'" class="width59 mr3" clearable />
        <span class="g-color-blue">(初始密码为{{ initialPassword }})</span>
      </el-form-item>-->
      <el-form-item label="身份证号" prop="identificationNumber">
        <el-input v-model="form.identificationNumber" placeholder="支持自动识别" class="width90" clearable />
      </el-form-item>
      <el-form-item prop="identificationEndTime">
        <label slot="label"><span style="color: #ff4949">* </span>身份证有效期</label>
        <el-date-picker
          v-model="form.identificationBeginTime"
          clearable
          class="width27"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="支持自动识别"
        />
        至
        <el-date-picker
          v-model="form.identificationEndTime"
          clearable
          class="width27 mr3"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="支持自动识别"
          :disabled="!!form.identificationEffective"
        />
        <el-checkbox v-model="form.identificationEffective">长期有效</el-checkbox>
      </el-form-item>
      <!-- 选择省/市/区 -->
      <!-- <province-city-county
        ref="ChooseArea"
        :visible="visible"
        :disabled="disable"
        :prop-province-code="form.provinceCode"
        :prop-city-code="form.cityCode"
        :prop-county-code="form.countyCode"
        :label-width="'154px'"
        @refresh="(data) => {
          form.provinceCode = data.provinceCode;
          form.cityCode = data.cityCode;
          form.countyCode = data.countyCode;
        }"
      />-->
      <el-form-item label="所在区域" prop="homeAddress">
        <el-input v-model="form.homeAddress" placeholder="支持自动识别" class="width90" clearable />
      </el-form-item>
      <el-form-item label="驾驶证号" prop="driverLicense">
        <el-input v-model="form.driverLicense" placeholder="支持自动识别" class="width90" clearable />
      </el-form-item>
      <el-form-item label="驾驶证发证机关" prop="issuingOrganizations">
        <el-input v-model="form.issuingOrganizations" placeholder="支持自动识别" class="width90" clearable />
      </el-form-item>
      <el-form-item prop="validPeriodTo">
        <label slot="label"><span style="color: #ff4949">* </span>驾驶证有效期</label>
        <el-date-picker
          v-model="form.validPeriodFrom"
          clearable
          class="width27"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="支持自动识别"
        />
        至
        <el-date-picker
          v-model="form.validPeriodTo"
          clearable
          class="width27 mr3"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="支持自动识别"
          :disabled="!!form.validPeriodAlways"
        />
        <el-checkbox v-model="form.validPeriodAlways">长期有效</el-checkbox>
      </el-form-item>
      <el-form-item label="驾驶证类型" prop="driverLicenseType">
        <el-select v-model="form.driverLicenseType" class="width90" placeholder="支持自动识别" filterable clearable>
          <el-option
            v-for="dict in driverLicenseTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <!-- ================================================================= -->
      <el-form-item v-show="form.driverType===2" label="工作单位" prop="workCompany">
        <el-input v-model="form.workCompany" placeholder="请输入工作单位" class="width90" clearable />
      </el-form-item>
      <el-form-item label="道路运输经营许可证" prop="transportPermitNo">
        <el-input v-model="form.transportPermitNo" placeholder="请输入道路运输经营许可证" class="width90" clearable />
      </el-form-item>
      <el-form-item label="从业资格证" prop="workLicense">
        <el-input v-model="form.workLicense" placeholder="请输入从业资格证" class="width90" clearable />
      </el-form-item>
      <el-form-item label="从业证到期日期" prop="workLicenseDueDate">
        <el-date-picker
          v-model="form.workLicenseDueDate"
          clearable
          class="width90"
          placeholder="请选择从业证到期日期"
          type="date"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>
      <el-form-item label="从业证办理省份名称" prop="workLicenseProvinceCode">
        <el-select
          v-model="form.workLicenseProvinceCode"
          filterable
          clearable
          class="width90"
        >
          <el-option
            v-for="dict in provinceCodeOptions"
            :key="dict.provinceCode"
            :label="dict.provinceName"
            :value="dict.provinceCode"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="营业执照号" prop="businessLicenseImgNo">
        <el-input v-model="form.businessLicenseImgNo" placeholder="请输入营业执照号" class="width90" clearable />
      </el-form-item> -->
      <!-- <el-form-item label="是否上传人员信用信息" prop="isReportPerson">
        <el-select v-model="form.isReportPerson" class="width90" clearable filterable>
          <el-option
            v-for="dict in isOption"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="form.isReportPerson === 1" label="上传人员信用信息时间" prop="isReportPersonDate">
        <el-date-picker
          v-model="form.isReportPersonDate"
          clearable
          class="width90"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择上传人员信用信息时间"
        />
      </el-form-item> -->
      <!-- <el-form-item label="是否上传企业" prop="isReportEnterprise">
        <el-select v-model="form.isReportEnterprise" class="width90" clearable filterable>
          <el-option
            v-for="dict in isOption"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="parseInt(dict.dictValue)"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="form.isReportEnterprise === 1" label="上传企业" prop="isReportEnterpriseDate">
        <el-date-picker
          v-model="form.isReportEnterpriseDate"
          clearable
          class="width90"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择上传企业时间"
        />
      </el-form-item> -->
      <el-form-item label="是否冻结" prop="isFreeze">
        <el-select
          v-model="form.isFreeze"
          clearable
          filterable
          class="width90"
        >
          <el-option
            v-for="dict in isFreezoneOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-row>
          <el-col :span="7" class="mb">
            <p class="upload-image-label">驾驶证</p>
            <upload-image v-model="form.driverLicenseImage" image-type="driver-license" icon-type="driver" @fillForm="fillForm" />
          </el-col>
          <el-col v-show="form.driverType===1" :span="7" class="mb">
            <p class="upload-image-label">行驶证</p>
            <upload-image v-model="form.driverOtherLicenseImage"  image-type="vehicle-license" side="front" icon-type="vehicle" @fillForm="fillForm" />
          </el-col>
          <el-col v-show="form.driverType===1" :span="7" class="mb">
            <p class="upload-image-label">行驶证副页</p>
            <upload-image v-model="form.driverOtherLicenseBackImage"  image-type="vehicle-license" side="back" icon-type="vehicle_back" @fillForm="fillForm" />
          </el-col>
          <el-col :span="7" class="mb">
            <p class="upload-image-label">身份证(人像面)</p>
            <upload-image v-model="form.identificationImage"  image-type="id-card" side="front" icon-type="idcard" @fillForm="fillForm" />
          </el-col>
          <el-col :span="7" class="mb">
            <p class="upload-image-label">身份证(国徽面)</p>
            <upload-image v-model="form.identificationBackImage"  image-type="id-card" side="back" icon-type="idcard_back" @fillForm="fillForm" />
          </el-col>
          <el-col v-show="form.driverType===1" :span="7" class="mb">
            <p class="upload-image-label">道路运输许可证</p>
            <upload-image v-model="form.transportPermitImage"  icon-type="transport" />
          </el-col>
          <el-col v-show="form.driverType===1" :span="7">
            <p class="upload-image-label">车头正面照</p>
            <upload-image v-model="vehicleForm.vehicleImage"  icon-type="vehicle_head" />
          </el-col>
          <el-col :span="7">
            <p class="upload-image-label">司机照片</p>
            <upload-image v-model="form.peopleImage"  icon-type="driver_head" />
          </el-col>
          <el-col :span="7">
            <p class="upload-image-label">从业资格证</p>
            <upload-image v-model="form.workLicenseImage"  icon-type="work" />
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>

    <!--
      新增独立司机的时候, 必须且仅能绑定一辆车, 可以绑定已经存在的车(未被其他司机绑定)并修改, 也可以绑定不存在的车(等于新增一辆车)
      修改独立司机的时候, 可以修改他名下车辆的信息, 不能新增/删除车辆(在管理页新增/删除)
    -->
    <el-form ref="vehicleForm" :model="vehicleForm" :rules="vehicleRules" label-width="154px">
      <template v-if="form.driverType == 1">
        <el-form-item label="车牌号" prop="licenseNumber" :rules="[{ required: true, message: '车牌号不能为空', trigger: ['change', 'blur'] }]">
          <!-- 新增车辆 -->
          <el-input v-if="addVehicleType === 0" v-model="vehicleForm.licenseNumber"  placeholder="支持自动识别" class="width70" clearable />
          <!-- 选择已有车辆 -->
          <el-select
            v-else
            v-model="vehicleForm.licenseNumber"
            v-el-select-loadmore="VehicleLoadmore"
            filterable
            clearable
            remote
            reserve-keyword
            placeholder="通过车牌号码进行查询"
            class="width70"
            :remote-method="vehicleRemoteMethod"
            :loading="vehicleLoading"
            @change="vehicleChange"
          >
            <el-option
              v-for="item in vehicleOptions"
              :key="item.code"
              :label="item.licenseNumber"
              :value="item.code"
            />
          </el-select>
          <!-- 切换按钮 -->
          <el-button type="text" style="width: 20%;text-decoration: underline;" @click="changeAddVehicleType">{{ addVehicleType === 0 ? '选择已有车辆' : '手动添加车辆' }}</el-button>
        </el-form-item>
      </template>
      <template v-if="form.driverType == 1">
        <el-form-item label="车辆归属类型" prop="vehicleAscriptionType">
          <el-select v-model="vehicleForm.vehicleAscriptionType" placeholder="支持自动识别" class="width90" filterable clearable >
            <el-option
              v-for="dict in vehicleAscriptionTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="parseInt(dict.dictValue)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="车辆类型" prop="vehicleTypeCode">
          <el-select v-model="vehicleForm.vehicleTypeCode" placeholder="支持自动识别" class="width90" clearable filterable >
            <el-option
              v-for="dict in vehicleTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="车辆识别码" prop="chassisNumber" :rules="[{ required: true, message: '车辆识别码不能为空', trigger: 'blur' }]">
          <el-input v-model="vehicleForm.chassisNumber" placeholder="支持自动识别" class="width90" clearable />
        </el-form-item>
        <el-form-item label="车牌颜色" prop="vehicleLicenseColorCode">
          <el-select v-model="vehicleForm.vehicleLicenseColorCode" class="width90" filterable clearable >
            <el-option
              v-for="dict in licenseColorOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="车身颜色" prop="vehicleColorCode">
          <el-select v-model="vehicleForm.vehicleColorCode" class="width90" filterable clearable >
            <el-option
              v-for="dict in carBodyColorOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="车辆能源类型" prop="vehicleEnergyType">
          <el-select v-model="vehicleForm.vehicleEnergyType" class="width90" filterable clearable >
            <el-option
              v-for="dict in energyTypesOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="车长" prop="vehicleLength">
          <el-select v-model="vehicleForm.vehicleLength" placeholder="请选择车长" class="width90" clearable filterable >
            <el-option
              v-for="dict in vehicleLengthOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="车宽" prop="vehicleWidth">
          <el-select v-model="vehicleForm.vehicleWidth" placeholder="请选择车宽" class="width90" clearable filterable >
            <el-option
              v-for="dict in vehicleWidthOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="车高" prop="vehicleHeight">
          <el-select v-model="vehicleForm.vehicleHeight" placeholder="请选择车高" class="width90" clearable filterable >
            <el-option
              v-for="dict in vehicleHeightOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="车辆总重量" prop="vehicleTotalWeight" :rules="[{ required: true, message: '车辆总重量不能为空', trigger: 'blur' }]">
          <el-input-number v-model="vehicleForm.vehicleTotalWeight" :controls="false" :min="0" :max="1000000" placeholder="请输入车辆总重量" class="width90 unit-item" clearable />
          <span class="unit-span g-color-gray">吨</span>
        </el-form-item>
        <el-form-item label="车辆可载重量" prop="vehicleLoadWeight" :rules="[{ required: true, message: '车辆可载重量不能为空', trigger: 'blur' }]">
          <el-input-number v-model="vehicleForm.vehicleLoadWeight" :controls="false" :min="0" :max="1000000" placeholder="请输入车辆可载重量" class="width90 unit-item" clearable />
          <span class="unit-span g-color-gray">吨</span>
        </el-form-item>
        <!-- <el-form-item label="车辆可载平方" prop="vehicleLoadVolume">
          <el-input v-model="vehicleForm.vehicleLoadVolume" placeholder="请输入车辆可载平方" class="width90 unit-item" clearable :disabled="disable" />
          <span class="unit-span g-color-gray">m²</span>
        </el-form-item> -->
        <el-form-item label="车辆可载立方" prop="vehicleRemainingLoadVolume">
          <el-input v-model="vehicleForm.vehicleRemainingLoadVolume" placeholder="请输入车辆可载立方" class="width90 unit-item" clearable />
          <span class="unit-span g-color-gray">m³</span>
        </el-form-item>
        <!-- <el-form-item label="发动机号" prop="engineNumber">
          <el-input v-model="vehicleForm.engineNumber" placeholder="支持自动识别" class="width90" clearable :disabled="disable" />
        </el-form-item>
        <el-form-item label="底盘号" prop="vehicleChassisNumber">
          <el-input v-model="vehicleForm.vehicleChassisNumber" placeholder="请输入底盘号" class="width90" clearable :disabled="disable" />
        </el-form-item>
        <el-form-item label="功率" prop="vehiclePower">
          <el-input v-model="vehicleForm.vehiclePower" placeholder="请输入功率" class="width90" clearable :disabled="disable" />
        </el-form-item> -->
        <el-form-item label="轴数" prop="axesNumber">
          <el-select v-model="vehicleForm.axesNumber" placeholder="请选择轴数" class="width90" clearable filterable >
            <el-option
              v-for="dict in axisTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="年审时间" prop="annualVerificationDate">
          <el-date-picker
            v-model="vehicleForm.annualVerificationDate"
            clearable
            type="date"
            value-format="yyyy-MM-dd"
            class="width90"
            placeholder="选择年审时间"
            :disabled="disable"
          />
        </el-form-item>
        <el-form-item label="运输介子" prop="transportMeson">
          <el-input v-model="vehicleForm.transportMeson" placeholder="请输入运输介子" class="width90" clearable :disabled="disable" />
        </el-form-item> -->
      </template>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="buttonLoading" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { registerDriver } from '@/api/assets/registerUser';
import { listInfo } from '@/api/assets/team';
import { listInfo as vehicleListInfo } from '@/api/assets/vehicle';
import UploadImage from '@/components/UploadImage/index';
import { praseBooleanToNum, praseNumToBoolean } from '@/utils/ddc';

export default {
  components: {
    UploadImage
  },
  props: {
    data: Object,
    open: Boolean
  },
  data() {
    return {
      buttonLoading: false,
      authButtonLoading: false,
      // 初始密码
      initialPassword: 'abcd1234@',
      // 司机类别字典
      driverTypeOptions: [
        { dictLabel: '零散司机', dictValue: 1 },
        { dictLabel: '雇佣司机', dictValue: 2 }
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
      // 省编码字典
      provinceCodeOptions: [],
      // 驾驶证类型字典
      driverLicenseTypeOptions: [],
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
  	  // 车辆归属类型字典
  	  vehicleAscriptionTypeOptions: [
  	    { dictLabel: '自有', dictValue: 0 },
  	    { dictLabel: '加盟', dictValue: 1 }
  	  ],
      // 车队列表
      loading: false,
      teamOptions: [],
      // 表单参数
      form: {},
      vehicleForm: {},
      // 表单校验
      rules: {
        driverType: [
          { required: true, message: '司机类型不能为空', trigger: ['blur', 'change']  }
        ],
        name: [
          { required: true, message: '姓名不能为空', trigger: ['blur', 'change'] },
          { validator: this.formValidate.name, trigger: ['blur', 'change'] }
        ],
        telphone: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { validator: this.formValidate.telphone, trigger: 'blur' }
        ],
        identificationNumber: [
          { required: true, message: '身份证号不能为空', trigger: ['blur', 'change'] },
          { validator: this.formValidate.idCard, trigger: ['blur', 'change'] }
        ],
        identificationEndTime: [
          { validator: (rules, value, callback) => this.formValidate.idCardValidate(rules, value, callback, this.form.identificationBeginTime, this.form.identificationEffective), trigger: ['change', 'blur'] },
          { validator: (rules, value, callback) => this.formValidate.isExpired(rules, value, callback, this.form.identificationEffective), trigger: ['change', 'blur'] }
        ],
        issuingOrganizations: [
          { required: true, message: '驾驶证发证机关不能为空', trigger: ['blur', 'change'] }
        ],
        validPeriodTo: [
          { validator: (rules, value, callback) => this.formValidate.idCardValidate(rules, value, callback, this.form.validPeriodFrom, this.form.validPeriodAlways, '驾驶证'), trigger: ['change', 'blur'] },
          { validator: (rules, value, callback) => this.formValidate.isExpired(rules, value, callback, this.form.validPeriodAlways), trigger: ['change', 'blur'] }
        ],
        /*  workCompany: [
          { required: true, message: '工作单位不能为空', trigger: 'blur' }
        ],*/
        transportPermitNo: [
          { required: true, message: '道路运输经营许可证不能为空', trigger: 'blur' }
        ],
        password: [
          { validator: this.formValidate.passWord, trigger: 'blur' }
        ]
      },
      vehicleRules: {
        licenseNumber: [
          // { validator: this.formValidate.plateNo, trigger: ['blur', 'change'] }
        ]
      },
      // 远程搜索调度者分页
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null
      },
      // 一个司机绑定多个车辆list
      vehicleInfoList: [],
      currentIndex: 0,
      // 选择车辆
      vehicleLoading: false,
      vehicleOptions: [],
      vehicleQueryParams: {
        pageNum: 1,
        pageSize: 10,
        licenseNumber: null
      },
      // 添加车辆方式
      addVehicleType: 0 // 0input  1select
    };
  },
  computed: {
    visible: {
      get() {
        this.setForm();
        return this.open;
      },
      set(v) {
        this.$emit('update:open', v);
      }
    }
  },
  created() {
    this.getDictsOptions();
  },
  methods: {
    /** 查询字典 */
    getDictsOptions() {
      // 驾驶证类型
      this.getDicts('driver_license_type').then(response => {
        this.driverLicenseTypeOptions = response.data;
      });
      // 车牌类型
      /* this.getDicts('licensePlateType').then(response => {
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
    /** 提交按钮 */
    submitForm: function() {
      // const flag = this.$refs.ChooseArea.submit();
      const flag = true;
      this.$refs['form'].validate(valid => {
        if (valid && flag) {
          this.$refs['vehicleForm'].validate(valid => {
            if (valid) {
              this.buttonLoading = true;
              const driver = { ...this.form };
              driver.identificationEffective = praseBooleanToNum(driver.identificationEffective);
              driver.validPeriodAlways = praseBooleanToNum(driver.validPeriodAlways);

              if (driver.driverType === 1) {
                driver.vehicleInfo = { ...this.vehicleForm };
              } else {
                driver.vehicleInfo = null;
              }
              registerDriver(driver).then(response => {
                this.buttonLoading = false;
                this.$message('新增成功，请至 司机管理 审核');
                this.close();
                this.$emit('refresh');
              }).catch(() => {
                this.buttonLoading = false;
              });
            } else {
              this.msgWarning('填写的信息不完整或有误，请核对后重新提交');
            }
          });
        } else {
          this.msgWarning('填写的信息不完整或有误，请核对后重新提交');
        }
      });
    },
    /** 取消按钮 */
    cancel() {
      this.close();
      this.reset();
    },
    // 关闭弹窗
    close() {
      this.$emit('update:open', false);
    },
    // 表单重置
    reset() {
      this.buttonLoading = false;
      this.vehicleInfoList = [];
      this.currentIndex = 0;
      this.addVehicleType = 0;
      this.form = {
        userCode: null,
        driverType: 1,
        teamCode: null,
        branchCode: null,
        provinceCode: null,
        cityCode: null,
        countyCode: null,
        password: null,
        name: null,
        telphone: null,
        fixedPhone: null,
        workCompany: null,
        driverCity: null,
        homeAddress: null,
        identificationNumber: null,
        identificationBeginTime: null,
        identificationEndTime: null,
        identificationEffective: null,
        driverLicense: null,
        validPeriodFrom: null,
        validPeriodTo: null,
        driverLicenseType: null,
        workLicense: null,
        workLicenseDueDate: null,
        businessLicenseImgNo: null,
        // isReportPerson: null,
        // isReportPersonDate: null,
        issuingOrganizations: null,
        // isReportEnterprise: null,
        // isReportEnterpriseDate: null,
        workLicenseProvinceCode: null,
        workLicenseProvinceName: null,
        authStatus: 0,
        isFreeze: null,
        createCode: null,
        createTime: null,
        updateCode: null,
        updateTime: null,
        isDel: null,
        transportPermitNo: null,
        validPeriodAlways: null,
        driverLicenseImage: null,
        driverOtherLicenseImage: null,
        driverOtherLicenseBackImage: null,
        identificationImage: null,
        identificationBackImage: null,
        transportPermitImage: null,
        peopleImage: null,
        workLicenseImage: null
      };
      this.resetForm('form');
      this.resetVehicle();
    },
    resetVehicle() {
      this.vehicleForm = {
        id: null,
        code: null,
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
        // vehicleLoadVolume: null,
        vehicleRemainingLoadVolume: null,
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
        delFlag: null,
        vehicleImage: null,
        licenseNumber: null
      };
      this.resetForm('vehicleForm');
    },
    // 表单赋值
    setForm() {
      this.form.userCode = this.data.userCode;
      // this.form.name = this.data.nickName;
      this.form.telphone = this.data.phonenumber;
      this.form.driverType = 1;
    },
    // 远程搜索
    teamRemoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        this.queryParams.name = query;
        this.queryParams.pageNum = 1;
        this.teamOptions = [];
        this.getTeamList();
      } else {
        this.teamOptions = [];
      }
    },
    // 查询调度者列表
    getTeamList() {
      listInfo(this.queryParams).then(response => {
        this.loading = false;
        this.teamOptions = [...this.teamOptions, ...response.rows];
      });
    },
    // 远程搜索列表触底事件
    loadmore() {
      this.queryParams.pageNum++;
      this.getTeamList();
    },
    // 图片识别后回填
    fillForm(type, data, side) {
      switch (type) {
        // 身份证
        case 'id-card':
          if (side === 'front') {
            if (data.name) {
              this.$set(this.form, 'name', data.name);
            } else {
              this.$set(this.form, 'name', '');
            }
            if (data.number) {
              this.$set(this.form, 'identificationNumber', data.number);
            } else {
              this.$set(this.form, 'identificationNumber', '');
            }
            if (data.address) {
              this.$set(this.form, 'homeAddress', data.address);
            } else {
              this.$set(this.form, 'homeAddress', '');
            }
          }
          if (side === 'back') {
            if (data.valid_from) {
              this.$set(this.form, 'identificationBeginTime', data.valid_from);
            } else {
              this.$set(this.form, 'identificationBeginTime', '');
            }
            if (data.valid_to) {
              if (data.valid_to === '长期') {
                this.$set(this.form, 'identificationEffective', true);
              } else if (data.valid_to !== '') {
                if (data.valid_to.startsWith('9999')) {
                  this.$set(this.form, 'identificationEffective', true);
                } else {
                  this.$set(this.form, 'identificationEndTime', data.valid_to);
                }
              }
            } else {
              this.$set(this.form, 'identificationEffective', false);
              this.$set(this.form, 'identificationBeginTime', '');
            }
          }
          break;
        // 驾驶证
        case 'driver-license':
          if (data.number) {
            this.$set(this.form, 'driverLicense', data.number);
          } else {
            this.$set(this.form, 'driverLicense', '');
          }
          if (data.issuing_authority) {
            this.$set(this.form, 'issuingOrganizations', data.issuing_authority);
          } else {
            this.$set(this.form, 'issuingOrganizations', '');
          }
          if (data.valid_from) {
            this.$set(this.form, 'validPeriodFrom', data.valid_from);
          } else {
            this.$set(this.form, 'validPeriodFrom', '');
          }
          if (data.valid_to) {
            if (data.valid_to === '长期') {
              this.$set(this.form, 'validPeriodAlways', true);
            } else if (data.valid_to !== '') {
              this.$set(this.form, 'validPeriodTo', data.valid_to);
            }
          } else {
            this.$set(this.form, 'validPeriodAlways', false);
            this.$set(this.form, 'validPeriodTo', '');
          }
          if (data.class) {
            this.$set(this.form, 'driverLicenseType', data.class);
          } else {
            this.$set(this.form, 'driverLicenseType', '');
          }
          break;
        // 行驶证
        case 'vehicle-license':
          // 正面
          if (side === 'front') {
            // 车牌号
            if (data.number) {
              this.$set(this.vehicleForm, 'licenseNumber', data.number);
            } else {
              this.$set(this.vehicleForm, 'licenseNumber', '');
            }
            // 车辆类型 vehicleTypeCode
            if (data.vehicle_type) {
              // 车辆类型
              this.$set(this.vehicleForm, 'vehicleTypeCode', this.getVehicleTypeKey(data.vehicle_type));
            } else {
              this.$set(this.vehicleForm, 'vehicleTypeCode', '');
            }
            // 车辆识别码 chassisNumber
            if (data.vin) {
              this.$set(this.vehicleForm, 'chassisNumber', data.vin);
            } else {
              this.$set(this.vehicleForm, 'chassisNumber', '');
            }
            // 发动机号 engineNumber
            if (data.engine_no) {
              this.$set(this.vehicleForm, 'engineNumber', data.engine_no);
            } else {
              this.$set(this.vehicleForm, 'engineNumber', '');
            }
            // vehicleAscriptionType
            if (data.name) {
              if (data.name === this.form.name) { // 相同自有
                this.$set(this.vehicleForm, 'vehicleAscriptionType', 0);
              } else {
                this.$set(this.vehicleForm, 'vehicleAscriptionType', 1);
              }
            }
          }
          // 副业
          if (side === 'back') {
            // 车辆总重量 vehicleTotalWeight
            if (data.gross_mass) {
              var num = data.gross_mass.indexOf('kg');
              var value = data.gross_mass.substr(0, num);
              this.$set(this.vehicleForm, 'vehicleTotalWeight', parseInt(value) / 1000);
            } else {
              this.$set(this.vehicleForm, 'vehicleTotalWeight', '0');
            }
            // 车辆可载重量 vehicleLoadWeight
            if (data.unladen_mass) {
              num = data.unladen_mass.indexOf('kg');
              value = data.unladen_mass.substr(0, num);
              this.$set(this.vehicleForm, 'vehicleLoadWeight', parseInt(value) / 1000);
            }
          }
          // 车牌颜色 vehicleLicenseColorCode
          // 车辆能源类型 vehicleEnergyType
          // 车身颜色 vehicleColorCode
          break;
        default:
          break;
      }
    },
    // 根据车牌类型的value值获取对应的key
    getVehicleTypeKey(value) {
      let key = null;
      this.vehicleTypeOptions.forEach(el => {
        if (value === el.dictLabel) {
          key = el.dictValue;
        }
      });
      return key || '';
    },
    // 选中车辆回显
    changeVehicle(licenseNumber) {
      const vehicleInfo = this.vehicleInfoList.filter((el, index) => {
        if (licenseNumber === el.licenseNumber) {
          this.currentIndex = index;
          return true;
        }
      })[0];
      this.vehicleForm = { ...vehicleInfo };
    },
    // 修改车辆保存
    saveVehicle() {
      this.vehicleInfoList[this.currentIndex] = { ...this.vehicleForm };
    },
    // 查询车辆列表
    getVehicleList() {
      vehicleListInfo(this.vehicleQueryParams).then((response) => {
        this.vehicleLoading = false;
        this.vehicleOptions = [...this.vehicleOptions, ...response.rows];
      });
    },
    // 车辆远程搜索
    vehicleRemoteMethod(query) {
      if (query !== '') {
        this.vehicleLoading = true;
        this.vehicleQueryParams.licenseNumber = query;
        this.vehicleQueryParams.pageNum = 1;
        this.vehicleOptions = [];
        this.getVehicleList();
      } else {
        this.vehicleOptions = [];
      }
    },
    // 选择车辆远程搜索列表触底事件
    VehicleLoadmore() {
      this.vehicleQueryParams.pageNum++;
      this.getVehicleList();
    },
    // 获取选中的车辆回填
    vehicleChange(code) {
      if (!code || code === '') {
        this.resetVehicle();
        return;
      }
      this.vehicleOptions.forEach(el => {
        if (el.code === code) {
          this.vehicleForm = { ...el };
        }
      });
    },
    // 切换添加车辆方式
    changeAddVehicleType() {
      if (this.addVehicleType === 0) {
        this.addVehicleType = 1;
      } else {
        this.addVehicleType = 0;
      }
      this.resetVehicle();
    }
  }
};
</script>

<style scoped lang="scss">
.mr3{
  margin-right: 3%;
}
.mb{
  margin-bottom: 22px;
}
.width90{
  width: 90%;
}
.width70{
  width: 70%;
}
.width27{
  width: 27%;
}
.width59{
  width: 59%;
}
/* 计数器样式 */
.el-input-number ::v-deep.el-input__inner{
  text-align: left;
}
/* 上传图片文字样式 */
.upload-image-label{
  margin: 0;
  line-height: 24px;
}

.unit-item{
  ::v-deep .el-input__inner{
    padding-right: 50px;
  }
  ::v-deep .el-input__suffix{
    right: 30px !important;
  }
}
.unit-span{
  position: absolute;
  right: 75px;
  top: 0;
}
</style>
