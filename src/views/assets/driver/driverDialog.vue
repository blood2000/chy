<template>
  <el-dialog :title="title" :visible="visible" width="800px" append-to-body @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" :disabled="disable" label-width="140px">
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
      <el-form-item v-if="form.driverType == 2" label="所属调度" prop="teamCode" :required="form.driverType===2">
        <el-select
          v-model="form.teamCode"
          filterable
          remote
          reserve-keyword
          placeholder="请输入调度名称"
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
      <el-form-item label="手机号/账号" prop="telphone">
        <el-input v-model="form.telphone" placeholder="请输入手机号/账号" class="width90" clearable />
      </el-form-item>
      <!-- <el-form-item label="联系人固话" prop="fixedPhone">
        <el-input v-model="form.fixedPhone" placeholder="请输入固话" class="width90" clearable />
      </el-form-item> -->
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password" placeholder="请输入密码" class="width59 mr3" clearable />
        <span class="g-color-blue">(初始密码为{{ initialPassword }})</span>
      </el-form-item>
      <el-form-item label="身份证号" prop="identificationNumber">
        <el-input v-model="form.identificationNumber" placeholder="支持自动识别" class="width90" clearable />
      </el-form-item>
      <el-form-item label="身份证有效期" prop="identificationEndTime">
        <el-date-picker
          v-model="form.identificationBeginTime"
          clearable
          class="width28"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择"
        />
        至
        <el-date-picker
          v-model="form.identificationEndTime"
          clearable
          class="width28 mr3"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择"
        />
        <el-checkbox v-model="form.identificationEffective">长期有效</el-checkbox>
      </el-form-item>
      <!-- 选择省/市/区 -->
      <province-city-county
        ref="ChooseArea"
        :visible="visible"
        :disabled="disable"
        :prop-province-code="form.provinceCode"
        :prop-city-code="form.cityCode"
        :prop-county-code="form.countyCode"
        @refresh="(data) => {
          form.provinceCode = data.provinceCode;
          form.cityCode = data.cityCode;
          form.countyCode = data.countyCode;
        }"
      />
      <el-form-item label="详细地址" prop="homeAddress">
        <el-input v-model="form.homeAddress" placeholder="支持自动识别" class="width90" clearable />
      </el-form-item>
      <!-- <el-form-item label="司机城市名称" prop="driverCity">
        <el-input v-model="form.driverCity" placeholder="请输入司机城市名称" class="width90" clearable />
      </el-form-item> -->
      <el-form-item label="驾驶证号" prop="driverLicense">
        <el-input v-model="form.driverLicense" placeholder="支持自动识别" class="width90" clearable />
      </el-form-item>
      <el-form-item label="驾驶证发证机关" prop="issuingOrganizations">
        <el-input v-model="form.issuingOrganizations" placeholder="支持自动识别" class="width90" clearable />
      </el-form-item>
      <el-form-item label="驾驶证有效期" prop="validPeriodTo">
        <el-date-picker
          v-model="form.validPeriodFrom"
          clearable
          class="width28"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="支持自动识别"
        />
        至
        <el-date-picker
          v-model="form.validPeriodTo"
          clearable
          class="width28 mr3"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="支持自动识别"
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
      <el-form-item label="工作单位" prop="workCompany">
        <el-input v-model="form.workCompany" placeholder="请输入工作单位" class="width90" clearable />
      </el-form-item>
      <el-form-item label="道路运输经营许可证号" prop="transportPermitNo">
        <el-input v-model="form.transportPermitNo" placeholder="请输入道路运输经营许可证号" class="width90" clearable />
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
      <el-form-item label="营业执照号" prop="businessLicenseImgNo">
        <el-input v-model="form.businessLicenseImgNo" placeholder="请输入营业执照号" class="width90" clearable />
      </el-form-item>
      <el-form-item label="是否上传人员信用信息" prop="isReportPerson">
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
      </el-form-item>
      <el-form-item label="是否上传企业" prop="isReportEnterprise">
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
      </el-form-item>
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
            <upload-image v-model="form.driverLicenseImage" :disabled="disable" />
          </el-col>
          <el-col v-show="form.driverType===1" :span="7" class="mb">
            <p class="upload-image-label">行驶证</p>
            <upload-image v-model="form.driverOtherLicenseImage" :disabled="disable" />
          </el-col>
          <el-col v-show="form.driverType===1" :span="7" class="mb">
            <p class="upload-image-label">行驶证副页</p>
            <upload-image v-model="form.driverOtherLicenseBackImage" :disabled="disable" />
          </el-col>
          <el-col :span="7" class="mb">
            <p class="upload-image-label">身份证正面照</p>
            <upload-image v-model="form.identificationImage" :disabled="disable" />
          </el-col>
          <el-col :span="7" class="mb">
            <p class="upload-image-label">身份证反面照</p>
            <upload-image v-model="form.identificationBackImage" :disabled="disable" />
          </el-col>
          <el-col v-show="form.driverType===1" :span="7" class="mb">
            <p class="upload-image-label">道路运输许可证</p>
            <upload-image v-model="form.transportPermitImage" :disabled="disable" />
          </el-col>
          <el-col v-show="form.driverType===1" :span="7">
            <p class="upload-image-label">车头正面照</p>
            <upload-image v-model="vehicleForm.vehicleImage" :disabled="disable" />
          </el-col>
          <el-col :span="7">
            <p class="upload-image-label">司机照片</p>
            <upload-image v-model="form.peopleImage" :disabled="disable" />
          </el-col>
          <el-col :span="7">
            <p class="upload-image-label">从业资格证</p>
            <upload-image v-model="form.workLicenseImage" :disabled="disable" />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="车牌号" prop="licenseNumber">
        <el-input v-model="form.licenseNumber" placeholder="请输入车牌号" class="width90" clearable />
      </el-form-item>
    </el-form>

    <el-form ref="vehicleForm" :model="vehicleForm" :rules="vehicleRules" :disabled="disable" label-width="140px">
      <el-form-item label="车牌颜色" prop="vehicleLicenseColorCode">
        <el-select v-model="vehicleForm.vehicleLicenseColorCode" class="width90" filterable clearable>
          <el-option
            v-for="dict in vehicleLicenseColorCodeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="parseInt(dict.dictValue)"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="车牌类型" prop="classificationCode">
        <el-select v-model="vehicleForm.classificationCode" class="width90" filterable clearable>
          <el-option
            v-for="dict in classificationCodeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="parseInt(dict.dictValue)"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="车身颜色" prop="vehicleColorCode">
        <el-select v-model="vehicleForm.vehicleColorCode" class="width90" filterable clearable>
          <el-option
            v-for="dict in vehicleColorCodeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="parseInt(dict.dictValue)"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="车辆归属类型" prop="vehicleAscriptionType">
        <el-select v-model="vehicleForm.vehicleAscriptionType" class="width90" filterable clearable>
          <el-option
            v-for="dict in vehicleAscriptionTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="parseInt(dict.dictValue)"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="车辆能源类型" prop="vehicleEnergyType">
        <el-select v-model="vehicleForm.vehicleEnergyType" class="width90" filterable clearable>
          <el-option
            v-for="dict in vehicleEnergyTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="车长" prop="vehicleLength">
        <el-input v-model="vehicleForm.vehicleLength" placeholder="请输入车长" class="width90" clearable />
      </el-form-item>
      <el-form-item label="车宽" prop="vehicleWidth">
        <el-input v-model="vehicleForm.vehicleWidth" placeholder="请输入车宽" class="width90" clearable />
      </el-form-item>
      <el-form-item label="车高" prop="vehicleHeight">
        <el-input v-model="vehicleForm.vehicleHeight" placeholder="请输入车高" class="width90" clearable />
      </el-form-item>
      <el-form-item label="车辆总重量" prop="vehicleTotalWeight">
        <el-input v-model="vehicleForm.vehicleTotalWeight" placeholder="请输入车辆总重量" class="width90" clearable />
      </el-form-item>
      <el-form-item label="车辆可载重量" prop="vehicleLoadWeight">
        <el-input v-model="vehicleForm.vehicleLoadWeight" placeholder="请输入车辆可载重量" class="width90" clearable />
      </el-form-item>
      <el-form-item label="车辆可载平方" prop="vehicleLoadVolume">
        <el-input v-model="vehicleForm.vehicleLoadVolume" placeholder="请输入车辆可载平方" class="width90" clearable />
      </el-form-item>
      <el-form-item label="车辆可载立方" prop="vehicleRemainingLoadVolume">
        <el-input v-model="vehicleForm.vehicleRemainingLoadVolume" placeholder="请输入车辆可载立方" class="width90" clearable />
      </el-form-item>
      <el-form-item label="车身自重" prop="selfRespect">
        <el-input v-model="vehicleForm.selfRespect" placeholder="请输入车身自重" class="width90" clearable />
      </el-form-item>
      <el-form-item label="车架号" prop="chassisNumber">
        <el-input v-model="vehicleForm.chassisNumber" placeholder="请输入车架号" class="width90" clearable />
      </el-form-item>
      <el-form-item label="发动机号" prop="engineNumber">
        <el-input v-model="vehicleForm.engineNumber" placeholder="请输入发动机号" class="width90" clearable />
      </el-form-item>
      <el-form-item label="底盘号" prop="vehicleChassisNumber">
        <el-input v-model="vehicleForm.vehicleChassisNumber" placeholder="请输入底盘号" class="width90" clearable />
      </el-form-item>
      <el-form-item label="功率" prop="vehiclePower">
        <el-input v-model="vehicleForm.vehiclePower" placeholder="请输入功率" class="width90" clearable />
      </el-form-item>
      <el-form-item label="轴数" prop="axesNumber">
        <el-input v-model="vehicleForm.axesNumber" placeholder="请输入轴数" class="width90" clearable />
      </el-form-item>
      <el-form-item label="年审时间" prop="annualVerificationDate">
        <el-date-picker
          v-model="vehicleForm.annualVerificationDate"
          clearable
          type="date"
          value-format="yyyy-MM-dd"
          class="width90"
          placeholder="选择年审时间"
        />
      </el-form-item>
      <el-form-item label="运输介子" prop="transportMeson">
        <el-input v-model="vehicleForm.transportMeson" placeholder="请输入运输介子" class="width90" clearable />
      </el-form-item>
    </el-form>

    <div v-if="title === '新增' || title === '编辑'" slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
    <div v-if="title === '审核'" slot="footer" class="dialog-footer">
      <el-button type="primary" @click="reviewForm(3)">审核通过</el-button>
      <el-button type="danger" @click="reviewForm(2)">审核不通过</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addDriver, updateDriver, authRead, examine } from '@/api/assets/driver';
import { getProvinceList } from '@/api/system/area';
import { listInfo } from '@/api/assets/team';
import UploadImage from '@/components/UploadImage/index';
import ProvinceCityCounty from '@/components/ProvinceCityCounty';

export default {
  components: {
    UploadImage,
    ProvinceCityCounty
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    open: Boolean,
    disable: Boolean
  },
  data() {
    return {
      // 初始密码
      initialPassword: 'abcd1234@',
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
      // 省编码字典
      provinceCodeOptions: [],
      // 驾驶证类型字典
      driverLicenseTypeOptions: [],
      // 车辆归属类型字典
      vehicleAscriptionTypeOptions: [
        { dictLabel: '自有', dictValue: 0 },
        { dictLabel: '加盟', dictValue: 1 }
      ],
      // 车牌类型代码字典
      classificationCodeOptions: [],
      // 车牌颜色代码字典
      vehicleLicenseColorCodeOptions: [],
      // 车身颜色代码字典
      vehicleColorCodeOptions: [],
      // 车辆能源类型字典
      vehicleEnergyTypeOptions: [],
      // 车队列表
      loading: false,
      teamOptions: [],
      // 表单参数
      form: {},
      vehicleForm: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: '姓名不能为空', trigger: 'blur' },
          { validator: this.formValidate.name, trigger: 'blur' }
        ],
        telphone: [
          { required: true, message: '手机号/账号不能为空', trigger: 'blur' },
          { validator: this.formValidate.telphone, trigger: 'blur' }
        ],
        identificationNumber: [
          { required: true, message: '身份证号不能为空', trigger: 'blur' },
          { validator: this.formValidate.idCard, trigger: 'blur' }
        ],
        identificationEndTime: [
          { required: true, message: '身份证有效期不能为空', trigger: 'blur' },
          { validator: this.formValidate.isExpired }
        ],
        issuingOrganizations: [
          { required: true, message: '驾驶证发证机关不能为空', trigger: 'blur' }
        ],
        validPeriodTo: [
          { required: true, message: '驾驶证有效期不能为空', trigger: 'blur' },
          { validator: this.formValidate.isExpired }
        ],
        workCompany: [
          { required: true, message: '工作单位不能为空', trigger: 'blur' }
        ],
        transportPermitNo: [
          { required: true, message: '道路运输经营许可证号不能为空', trigger: 'blur' }
        ],
        licenseNumber: [
          { validator: this.formValidate.plateNo, trigger: 'blur' }
        ]
      },
      vehicleRules: {
        vehicleTotalWeight: [
          { required: true, message: '车辆总重量不能为空', trigger: 'blur' }
        ],
        vehicleLoadWeight: [
          { required: true, message: '车辆可载重量不能为空', trigger: 'blur' }
        ],
        chassisNumber: [
          { required: true, message: '车架号不能为空', trigger: 'blur' }
        ]
      }
    };
  },
  computed: {
    visible: {
      get() {
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
      // 车辆能源类型
      this.getDicts('energyTypes').then(response => {
        this.vehicleEnergyTypeOptions = response.data;
      });
      // 省
      getProvinceList().then((response) => {
        this.provinceCodeOptions = response.rows;
      });
      // 驾驶证类型
      this.getDicts('driver_license_type').then(response => {
        this.driverLicenseTypeOptions = response.data;
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      const flag = this.$refs.ChooseArea.submit();
      this.$refs['form'].validate(valid => {
        if (valid && flag) {
          this.$refs['vehicleForm'].validate(valid => {
            if (valid) {
              const driver = this.form;
              driver.vehicleInfo = this.vehicleForm;
              if (driver.identificationEffective) {
                driver.identificationEffective = 1;
              } else {
                driver.identificationEffective = 0;
              }
              if (driver.validPeriodAlways) {
                driver.validPeriodAlways = 1;
              } else {
                driver.validPeriodAlways = 0;
              }
              // 类型不为独立司机的时候，相关字段不能传
              if (this.form.driverType !== 1) {
                this.form.driverOtherLicenseImage = null;
                this.form.driverOtherLicenseBackImage = null;
                this.form.transportPermitImage = null;
                this.vehicleForm.vehicleImage = null;
              }
              if (this.form.id !== undefined) {
                updateDriver(driver).then(response => {
                  this.msgSuccess('修改成功');
                  this.close();
                  this.$emit('refresh');
                });
              } else {
                addDriver(driver).then(response => {
                  this.msgSuccess('新增成功');
                  this.close();
                  this.$emit('refresh');
                });
              }
            } else {
              this.msgWarning('必填项不能为空');
            }
          });
        } else {
          this.msgWarning('必填项不能为空');
        }
      });
    },
    /** 已读 */
    authRead(data) {
      if (data.identificationEffective) {
        data.identificationEffective = 1;
      } else {
        data.identificationEffective = 0;
      }
      if (data.validPeriodAlways) {
        data.validPeriodAlways = 1;
      } else {
        data.validPeriodAlways = 0;
      }
      authRead(data).then(response => {
        this.$emit('refresh');
      });
    },
    /** 审核通过/未通过按钮 */
    reviewForm(key) {
      this.form.authStatus = key;
      if (this.form.identificationEffective) {
        this.form.identificationEffective = 1;
      } else {
        this.form.identificationEffective = 0;
      }
      if (this.form.validPeriodAlways) {
        this.form.validPeriodAlways = 1;
      } else {
        this.form.validPeriodAlways = 0;
      }
      examine(this.form).then(response => {
        this.msgSuccess('操作成功');
        this.close();
        this.$emit('refresh');
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
      this.form = {
        id: null,
        code: null,
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
        isReportPerson: null,
        isReportPersonDate: null,
        issuingOrganizations: null,
        isReportEnterprise: null,
        isReportEnterpriseDate: null,
        workLicenseProvinceCode: null,
        workLicenseProvinceName: null,
        authStatus: 0,
        isFreeze: null,
        createCode: null,
        createTime: null,
        updateCode: null,
        updateTime: null,
        isDel: null,
        licenseNumber: null,
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
        delFlag: null,
        vehicleImage: null
      };
      this.resetForm('form');
      this.resetForm('vehicleForm');
    },
    // 表单赋值
    setForm(data) {
      this.form = data;
      this.vehicleForm = data.vehicleInfo || {};
      if (this.form.identificationEffective) {
        this.form.identificationEffective = true;
      } else {
        this.form.identificationEffective = false;
      }
      if (this.form.validPeriodAlways) {
        this.form.validPeriodAlways = true;
      } else {
        this.form.validPeriodAlways = false;
      }
    },
    // 查询车队列表
    teamRemoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        listInfo({ name: query }).then(response => {
          this.loading = false;
          this.teamOptions = response.rows;
        });
      } else {
        this.teamOptions = [];
      }
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
.width28{
  width: 28%;
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
/* label溢出... */
.el-form-item ::v-deep.el-form-item__label{
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
