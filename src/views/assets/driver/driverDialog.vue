<template>
  <el-dialog :title="title" :visible="visible" width="800px" append-to-body @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" :disabled="disable" label-width="180px">
      <el-form-item label="司机类别" prop="driverType">
        <el-select v-model="form.driverType" size="small" class="width90">
          <el-option
            v-for="dict in driverTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="parseInt(dict.dictValue)"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="名字" prop="name">
        <el-input v-model="form.name" placeholder="支持自动识别" size="small" class="width90"/>
      </el-form-item>
      <el-form-item label="手机" prop="telphone">
        <el-input v-model="form.telphone" placeholder="请输入手机" size="small" class="width90"/>
      </el-form-item>
      <el-form-item label="固话" prop="fixedPhone">
        <el-input v-model="form.fixedPhone" placeholder="请输入固话" size="small" class="width90"/>
      </el-form-item>
      <el-form-item label="身份证号" prop="identificationNumber">
        <el-input v-model="form.identificationNumber" placeholder="支持自动识别" size="small" class="width90"/>
      </el-form-item>
      <el-form-item label="从业证到期日期" prop="workLicenseDueDate">
        <el-date-picker clearable size="small" class="width90"
          v-model="form.workLicenseDueDate"
          placeholder="请选择从业证到期日期"
          type="date"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="从业证办理省份名称" prop="workLicenseProvinceName">
        <el-select
          v-model="form.workLicenseProvinceName"
          clearable
          size="small"
          class="width90"
        >
          <el-option
            v-for="dict in provinceCodeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="司机城市名称" prop="driverCity">
        <el-input v-model="form.driverCity" placeholder="请输入司机城市名称" size="small" class="width90"/>
      </el-form-item>
      <el-form-item label="网点编码" prop="branchCode">
        <el-input v-model="form.branchCode" size="small" placeholder="请输入网点编码" class="width90"/>
      </el-form-item>
      <el-form-item label="所在区域" prop="provinceCode">
        <el-select
          v-model="form.provinceCode"
          clearable
          size="small"
          class="width28 mr3"
        >
          <el-option
            v-for="dict in provinceCodeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
        <el-select
          v-model="form.cityCode"
          clearable
          size="small"
          class="width28 mr3"
        >
          <el-option
            v-for="dict in cityCodeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
        <el-select
          v-model="form.countyCode"
          clearable
          size="small"
          class="width28"
        >
          <el-option
            v-for="dict in countyCodeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="详细地址" prop="homeAddress">
        <el-input v-model="form.homeAddress" placeholder="请输入详细地址" size="small" class="width90"/>
      </el-form-item>
      <el-form-item label="驾驶证类型" prop="driverLicenseType">
        <el-select v-model="form.driverLicenseType" size="small" class="width90">
          <el-option
            v-for="dict in driverLicenseTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="parseInt(dict.dictValue)"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="驾驶证号" prop="driverLicense">
        <el-input v-model="form.driverLicense" placeholder="支持自动识别" size="small" class="width90"/>
      </el-form-item>
      <el-form-item label="驾驶证发证机关" prop="issuingOrganizations">
        <el-input v-model="form.issuingOrganizations" size="small" placeholder="请输入驾驶证发证机关" class="width90"/>
      </el-form-item>
      <el-form-item label="驾驶证有效期自" prop="validPeriodFrom">
        <el-date-picker clearable size="small" class="width90"
          v-model="form.validPeriodFrom"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="支持自动识别">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="驾驶证有效期至" prop="validPeriodTo">
        <el-date-picker clearable size="small" class="width90"
          v-model="form.validPeriodTo"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="支持自动识别">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="工作单位" prop="workCompany">
        <el-input v-model="form.workCompany" placeholder="请输入工作单位" size="small" class="width90"/>
      </el-form-item>
      <el-form-item label="上岗证" prop="workLicense">
        <el-input v-model="form.workLicense" placeholder="请输入上岗证" size="small" class="width90"/>
      </el-form-item>
      <el-form-item label="营业执照号" prop="businessLicenseImgNo">
        <el-input v-model="form.businessLicenseImgNo" placeholder="请输入营业执照号" size="small" class="width90"/>
      </el-form-item>
      <el-form-item label="是否上传人员信用信息" prop="isReportPerson">
        <el-select v-model="form.isReportPerson" size="small" class="width90">
          <el-option
            v-for="dict in isOption"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="form.isReportPerson === 1" label="上传人员信用信息时间" prop="isReportPersonDate">
        <el-date-picker clearable size="small" class="width90"
          v-model="form.isReportPersonDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择上传人员信用信息时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="是否上传企业" prop="isReportEnterprise">
        <el-select v-model="form.isReportEnterprise" size="small" class="width90">
          <el-option
            v-for="dict in isOption"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="parseInt(dict.dictValue)"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="form.isReportEnterprise === 1" label="上传企业" prop="isReportEnterpriseDate">
        <el-date-picker clearable size="small" class="width90"
          v-model="form.isReportEnterpriseDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择上传企业时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="审核状态">
        <el-radio-group v-model="form.authStatus">
          <el-radio
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="parseInt(dict.dictValue)"
          >{{dict.dictLabel}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否冻结" prop="isFreeze">
        <el-select
          v-model="form.isFreeze"
          clearable
          size="small"
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
      <!-- <el-form-item label="结算方式" prop="driverSettlementType">
        <el-select
          v-model="form.driverSettlementType"
          clearable
          size="small"
          class="width90"
        >
          <el-option
            v-for="dict in settlementTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item> -->
      <!-- <el-form-item label="定位来源" prop="driverLocationSource">
        <el-select
          v-model="form.driverLocationSource"
          clearable
          size="small"
          class="width90"
        >
          <el-option
            v-for="dict in locationSourceOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item> -->
      <!-- <el-form-item>
        <el-row>
          <el-col :span="7" class="mb">
            <p class="upload-image-label">管理员身份证正面照</p>
            <upload-image :value="form.identificationImg"></upload-image>
          </el-col>
          <el-col :span="7" class="mb">
            <p class="upload-image-label">管理员身份证背面照</p>
            <upload-image :value="form.identificationBackImg"></upload-image>
          </el-col>
          <el-col :span="7" class="mb">
            <p class="upload-image-label">手持身份证照</p>
            <upload-image :value="form.identificationInhandImg"></upload-image>
          </el-col>
          <el-col :span="7">
            <p class="upload-image-label">营业执照照</p>
            <upload-image :value="form.businessLicenseImg"></upload-image>
          </el-col>
          <el-col :span="7">
            <p class="upload-image-label">法人身份证正面照</p>
            <upload-image :value="form.artificialIdentificationImg"></upload-image>
          </el-col>
        </el-row>
      </el-form-item> -->
      <el-form-item label="车牌号" prop="licenseNumber">
        <el-input v-model="form.licenseNumber" placeholder="请输入车牌号" size="small" class="width90"/>
      </el-form-item>
    </el-form>

    <el-form ref="vehicleForm" :model="vehicleForm" :rules="vehicleRules" :disabled="disable" label-width="180px">
      <el-form-item label="车辆归属类型" prop="vehicleAscriptionType">
        <el-select v-model="vehicleForm.vehicleAscriptionType" size="small" class="width90">
          <el-option
            v-for="dict in vehicleAscriptionTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="parseInt(dict.dictValue)"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="车牌类型" prop="classificationCode">
        <el-select v-model="vehicleForm.classificationCode" size="small" class="width90">
          <el-option
            v-for="dict in classificationCodeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="parseInt(dict.dictValue)"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="车牌颜色" prop="vehicleLicenseColorCode">
        <el-select v-model="vehicleForm.vehicleLicenseColorCode" size="small" class="width90">
          <el-option
            v-for="dict in vehicleLicenseColorCodeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="parseInt(dict.dictValue)"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="车身颜色" prop="vehicleColorCode">
        <el-select v-model="vehicleForm.vehicleColorCode" size="small" class="width90">
          <el-option
            v-for="dict in vehicleColorCodeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="parseInt(dict.dictValue)"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="车辆能源类型" prop="vehicleEnergyType">
        <el-select v-model="vehicleForm.vehicleEnergyType" size="small" class="width90">
          <el-option
            v-for="dict in vehicleEnergyTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="parseInt(dict.dictValue)"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="车长" prop="vehicleLength">
        <el-input v-model="vehicleForm.vehicleLength" placeholder="请输入车长" size="small" class="width90"/>
      </el-form-item>
      <el-form-item label="车宽" prop="vehicleWidth">
        <el-input v-model="vehicleForm.vehicleWidth" placeholder="请输入车宽" size="small" class="width90"/>
      </el-form-item>
      <el-form-item label="车高" prop="vehicleHeight">
        <el-input v-model="vehicleForm.vehicleHeight" placeholder="请输入车高" size="small" class="width90"/>
      </el-form-item>
      <el-form-item label="车辆总重量" prop="vehicleTotalWeight">
        <el-input v-model="vehicleForm.vehicleTotalWeight" placeholder="请输入车辆总重量" size="small" class="width90"/>
      </el-form-item>
      <el-form-item label="车辆可载重量" prop="vehicleLoadWeight">
        <el-input v-model="vehicleForm.vehicleLoadWeight" placeholder="请输入车辆可载重量" size="small" class="width90"/>
      </el-form-item>
      <el-form-item label="车辆可载平方" prop="vehicleLoadVolume">
        <el-input v-model="vehicleForm.vehicleLoadVolume" placeholder="请输入车辆可载平方" size="small" class="width90"/>
      </el-form-item>
      <el-form-item label="车辆可载立方" prop="vehicleRemainingLoadVolume">
        <el-input v-model="vehicleForm.vehicleRemainingLoadVolume" placeholder="请输入车辆可载立方" size="small" class="width90"/>
      </el-form-item>
      <el-form-item label="车身自重" prop="selfRespect">
        <el-input v-model="vehicleForm.selfRespect" placeholder="请输入车身自重" size="small" class="width90"/>
      </el-form-item>
      <el-form-item label="车架号" prop="chassisNumber">
        <el-input v-model="vehicleForm.chassisNumber" placeholder="请输入车架号" size="small" class="width90"/>
      </el-form-item>
      <el-form-item label="发动机号" prop="engineNumber">
        <el-input v-model="vehicleForm.engineNumber" placeholder="请输入发动机号" size="small" class="width90"/>
      </el-form-item>
      <el-form-item label="底盘号" prop="vehicleChassisNumber">
        <el-input v-model="vehicleForm.vehicleChassisNumber" placeholder="请输入底盘号" size="small" class="width90"/>
      </el-form-item>
      <el-form-item label="功率" prop="vehiclePower">
        <el-input v-model="vehicleForm.vehiclePower" placeholder="请输入功率" size="small" class="width90"/>
      </el-form-item>
      <el-form-item label="轴数" prop="axesNumber">
        <el-input v-model="vehicleForm.axesNumber" placeholder="请输入轴数" size="small" class="width90"/>
      </el-form-item>
      <el-form-item label="年审时间" prop="annualVerificationDate">
        <el-date-picker clearable
          v-model="vehicleForm.annualVerificationDate"
          type="date"
          value-format="yyyy-MM-dd"
          size="small"
          class="width90"
          placeholder="选择年审时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="运输介子" prop="transportMeson">
        <el-input v-model="vehicleForm.transportMeson" placeholder="请输入运输介子" size="small" class="width90"/>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addDriver, updateDriver } from "@/api/assets/driver";
import UploadImage from '@/components/UploadImage/index';

export default {
  props: {
    title: String,
    open: Boolean,
    disable: Boolean
  },
  components: {
    UploadImage
  },
  data() {
    return {
      // 司机类别字典
      driverTypeOptions: [
        {dictLabel: '独立', dictValue: 1},
        {dictLabel: '分配', dictValue: 2},
        {dictLabel: '其他', dictValue: 3}
      ],
      // 审核状态字典
      statusOptions: [
        {dictLabel: '未审核', dictValue: 0},
        {dictLabel: '审核中', dictValue: 1},
        {dictLabel: '审核未通过', dictValue: 2},
        {dictLabel: '审核通过', dictValue: 3}
      ],
      // 是否冻结字典
      isFreezoneOptions: [
        {dictLabel: '正常', dictValue: 0},
        {dictLabel: '冻结', dictValue: 1}
      ],
      // 是否
      isOption: [
        {dictLabel: '否', dictValue: 0},
        {dictLabel: '是', dictValue: 1}
      ],
      // 网点编码字典
      branchCodeOptions: [],
      // 省编码字典
      provinceCodeOptions: [],
      // 市编码字典
      cityCodeOptions: [],
      // 县/区编码字典
      countyCodeOptions: [],
      // 驾驶证类型字典
      driverLicenseTypeOptions: [],
      // 结算方式字典
      // settlementTypeOptions: [
      //   {dictLabel: '次结', dictValue: '次结'},
      //   {dictLabel: '月结', dictValue:'月结'}
      // ],
      // 定位来源字典
      // locationSourceOptions: [
      //   {dictLabel: '中交兴路', dictValue: '中交兴路'},
      //   {dictLabel: 'APP端', dictValue:'APP端'},
      //   {dictLabel: 'GPS硬件', dictValue:'GPS硬件'}
      // ],
      // 车辆归属类型字典
      vehicleAscriptionTypeOptions: [
        {dictLabel: '自有', dictValue: 0},
        {dictLabel: '加盟', dictValue: 1}
      ],
      // 车牌类型代码字典
      classificationCodeOptions: [],
      // 车牌颜色代码字典
      vehicleLicenseColorCodeOptions: [],
      // 车身颜色代码字典
      vehicleColorCodeOptions: [],
      // 车辆能源类型字典
      vehicleEnergyTypeOptions: [],
      // 表单参数
      form: {},
      vehicleForm: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: "姓名不能为空", trigger: "blur" }
        ],
        telphone: [
          { required: true, message: "手机号码不能为空", trigger: "blur" }
        ],
        identificationNumber: [
          { required: true, message: "身份证号不能为空", trigger: "blur" }
        ],
        homeAddress: [
          { required: true, message: "详细地址不能为空", trigger: "blur" }
        ]
      },
      vehicleRules: {}
    }
  },
  computed: {
    visible: {
      get() {
        return this.open;
      },
      set(v) {
        this.$emit("update:open", v);
      },
    },
  },
  created() {
    
  },
  methods: {
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        console.log(valid)
        if (valid) {
          let driver = this.form;
          driver.vehicleInfo = this.vehicleForm;
          if (this.form.id != undefined) {
            updateDriver(driver).then(response => {
              this.msgSuccess("修改成功");
              this.close();
              this.$emit('refresh');
            });
          } else {
            addDriver(driver).then(response => {
              this.msgSuccess("新增成功");
              this.close();
              this.$emit('refresh');
            });
          }
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
      this.$emit("update:open", false);
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        code: null,
        userCode: null,
        driverType: null,
        branchCode: null,
        provinceCode: null,
        cityCode: null,
        countyCode: null,
        name: null,
        telphone: null,
        fixedPhone: null,
        workCompany: null,
        driverCity: null,
        homeAddress: null,
        identificationNumber: null,
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
        licenseNumber: null
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
        delFlag: null
      };
      this.resetForm("form");
      this.resetForm("vehicleForm");
    },
    // 表单赋值
    setForm(data) {
      this.form = data;
      this.vehicleForm = data.vehicleInfo;
      console.log(this.vehicleForm)
    }
  }
}
</script>

<style scoped>
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
/* 计数器样式 */
.el-input-number ::v-deep.el-input__inner{
  text-align: left;
}
/* 上传图片文字样式 */
.upload-image-label{
  margin: 0;
  line-height: 24px;
}
</style>