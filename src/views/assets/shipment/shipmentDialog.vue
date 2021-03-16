<template>
  <el-dialog :title="title" :visible="visible" width="800px" append-to-body @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" :disabled="disable" label-width="140px">
      <el-form-item label="发货人/发货企业" prop="shipperType">
        <el-select
          v-model="form.shipperType"
          class="width90"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in typeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="手机号码" prop="telphone">
        <el-input v-model="form.telphone" placeholder="请输入手机号" size="small" class="width90" clearable />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password" placeholder="请输入密码" class="width60 mr3" size="small" clearable />
        <span class="g-color-blue">(初始密码为{{ initialPassword }})</span>
      </el-form-item>
      <el-form-item label="姓名" prop="adminName">
        <el-input v-model="form.adminName" placeholder="支持自动识别" size="small" class="width90" clearable />
      </el-form-item>
      <el-form-item label="身份证号" prop="identificationNumber">
        <el-input v-model="form.identificationNumber" placeholder="支持自动识别" size="small" class="width90" clearable />
      </el-form-item>
      <el-form-item label="身份证有效期" prop="identificationEndTime">
        <el-date-picker
          v-model="form.identificationBeginTime"
          clearable
          size="small"
          class="width28"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择"
        />
        至
        <el-date-picker
          v-model="form.identificationEndTime"
          clearable
          size="small"
          class="width28 mr3"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择"
        />
        <el-checkbox v-model="form.identificationEffective">长期有效</el-checkbox>
      </el-form-item>
      <template v-if="form.shipperType === 1">
        <el-form-item label="公司名称" prop="companyName">
          <el-input v-model="form.companyName" placeholder="请输入公司名称" size="small" class="width90" clearable />
        </el-form-item>
        <el-form-item label="统一社会信用代码" prop="organizationCodeNo">
          <el-input v-model="form.organizationCodeNo" placeholder="请输入统一社会信用代码" size="small" class="width90" clearable />
        </el-form-item>
      </template>
      <el-form-item label="所在地区">
        <el-select
          v-model="form.provinceCode"
          clearable
          size="small"
          class="width28 mr3"
          placeholder="省(支持自动识别)"
          @change="changeProvince"
        >
          <el-option
            v-for="dict in provinceCodeOptions"
            :key="dict.provinceCode"
            :label="dict.provinceName"
            :value="dict.provinceCode"
          />
        </el-select>
        <el-select
          v-model="form.cityCode"
          clearable
          size="small"
          class="width28 mr3"
          placeholder="市(支持自动识别)"
          @change="changeCity"
        >
          <el-option
            v-for="dict in cityCodeOptions"
            :key="dict.cityCode"
            :label="dict.cityName"
            :value="dict.cityCode"
          />
        </el-select>
        <el-select
          v-model="form.countyCode"
          clearable
          size="small"
          class="width28 mr3"
          placeholder="县/区(支持自动识别)"
        >
          <el-option
            v-for="dict in countyCodeOptions"
            :key="dict.countyCode"
            :label="dict.countyName"
            :value="dict.countyCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="详细地址" prop="area">
        <el-input v-model="form.area" clearable placeholder="支持自动识别" size="small" class="width90" />
      </el-form-item>
      <!-- <el-form-item label="营业执照号" prop="businessLicenseNo">
        <el-input v-model="form.businessLicenseNo" placeholder="请输入营业执照号" size="small" class="width90" clearable />
      </el-form-item>
      <el-form-item label="法人身份证" prop="artificialIdentificationNumber">
        <el-input v-model="form.artificialIdentificationNumber" placeholder="请输入法人身份证" size="small" class="width90" clearable />
      </el-form-item> -->
      <el-form-item>
        <el-row>
          <el-col :span="7" class="mb">
            <p class="upload-image-label">管理员身份证正面照</p>
            <upload-image :value="form.identificationImg" />
          </el-col>
          <el-col :span="7" class="mb">
            <p class="upload-image-label">管理员身份证背面照</p>
            <upload-image :value="form.identificationBackImg" />
          </el-col>
          <el-col :span="7" class="mb">
            <p class="upload-image-label">手持身份证照</p>
            <upload-image :value="form.identificationInhandImg" />
          </el-col>
          <el-col :span="7">
            <p class="upload-image-label">营业执照照</p>
            <upload-image :value="form.businessLicenseImg" />
          </el-col>
          <el-col :span="7">
            <p class="upload-image-label">法人身份证正面照</p>
            <upload-image :value="form.artificialIdentificationImg" />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="是否冻结" prop="isFreezone">
        <el-select
          v-model="form.isFreezone"
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
      <el-form-item label="票制类别" prop="ticketType">
        <el-select
          v-model="form.ticketType"
          clearable
          size="small"
          class="width90"
        >
          <el-option
            v-for="dict in ticketTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="服务费比例" prop="serviceRatio">
        <el-input v-model="form.serviceRatio" placeholder="请输入服务费比例" size="small" class="width90" clearable />
      </el-form-item>
      <el-form-item label="货源是否审核" prop="supplyIsAuth">
        <el-select
          v-model="form.supplyIsAuth"
          clearable
          size="small"
          class="width90"
        >
          <el-option
            v-for="dict in isOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否核算" prop="isAccount">
        <el-select
          v-model="form.isAccount"
          clearable
          size="small"
          class="width90"
        >
          <el-option
            v-for="dict in isOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="核算方式" prop="accountType">
        <el-select v-model="form.accountType" placeholder="请选择核算方式" clearable size="small" class="width90">
          <el-option
            v-for="dict in accountTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="调度费点数" prop="dispatchPoints">
        <el-input v-model="form.dispatchPoints" placeholder="请输入调度费点数" clearable size="small" class="width90" />
      </el-form-item>
      <el-form-item label="是否抹零" prop="isWipe">
        <el-select
          v-model="form.isWipe"
          clearable
          size="small"
          class="width28 mr3"
        >
          <el-option
            v-for="dict in isOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
        <el-select v-model="form.wipeType" placeholder="请选择抹零方式" clearable size="small" class="width28">
          <el-option
            v-for="dict in wipeTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="是否开启合理路耗">
        <el-select
          v-model="form.isConsumption"
          clearable
          size="small"
          class="width28 mr3"
        >
          <el-option
            v-for="dict in isOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
        <el-select
          v-model="form.consumptionUnit"
          clearable
          size="small"
          class="width28 mr3"
          placeholder="路耗单位"
        >
          <el-option
            v-for="dict in consumptionUnitOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
        <el-input v-model="form.consumptionMin" placeholder="最小值" size="small" class="width12" />
        至
        <el-input v-model="form.consumptionMax" placeholder="最大值" size="small" class="width12" />
      </el-form-item>
      <el-form-item label="是否月结" prop="isMonthly">
        <el-select
          v-model="form.isMonthly"
          clearable
          size="small"
          class="width28 mr3"
        >
          <el-option
            v-for="dict in isOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
        <el-input v-model="form.creditAmount" placeholder="授信金额(保留两位小数)" size="small" class="width28" />
      </el-form-item>
      <el-form-item label="是否预付运费" prop="isPrepaid">
        <el-select
          v-model="form.isPrepaid"
          clearable
          size="small"
          class="width90"
        >
          <el-option
            v-for="dict in isOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
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
import { addShipment, updateShipment, authRead, examine } from '@/api/assets/shipment';
import { getProvinceList, getCityList, geCountyList } from '@/api/system/area';
import UploadImage from '@/components/UploadImage/index';

export default {
  components: {
    UploadImage
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
      // 票制类别字典
      ticketTypeOptions: [],
      // 是否字典
      isOptions: [
        { dictLabel: '否', dictValue: 0 },
        { dictLabel: '是', dictValue: 1 }
      ],
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
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        adminName: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        identificationNumber: [
          { required: true, message: '身份证号不能为空', trigger: 'blur' }
        ],
        companyName: [
          { required: true, message: '公司名称不能为空', trigger: 'blur' }
        ],
        organizationCodeNo: [
          { required: true, message: '统一社会信用代码不能为空', trigger: 'blur' }
        ],
        identificationEndTime: [
          { required: true, message: '身份证有效期不能为空', trigger: 'blur' },
          { validator: this.certificateIsExpired }
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
      // 省
      getProvinceList().then((response) => {
        this.provinceCodeOptions = response.rows;
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          const shipmentInfo = this.form;
          if (shipmentInfo.identificationEffective) {
            shipmentInfo.identificationEffective = 1;
          } else {
            shipmentInfo.identificationEffective = 0;
          }
          if (shipmentInfo.id !== undefined) {
            updateShipment(shipmentInfo).then(response => {
              this.msgSuccess('修改成功');
              this.close();
              this.$emit('refresh');
            });
          } else {
            addShipment(shipmentInfo).then(response => {
              this.msgSuccess('新增成功');
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
    /** 审核通过/未通过按钮 */
    reviewForm(key) {
      this.form.authStatus = key;
      if (this.form.identificationEffective) {
        this.form.identificationEffective = 1;
      } else {
        this.form.identificationEffective = 0;
      }
      examine(this.form).then(response => {
        this.msgSuccess('操作成功');
        this.close();
        this.$emit('refresh');
      });
    },
    // 关闭弹窗
    close() {
      this.$emit('update:open', false);
    },
    // 表单重置
    reset() {
      this.form = {
        adminName: null,
        adminCode: null,
        telphone: null,
        password: this.initialPassword,
        companyCode: null,
        companyName: null,
        shipperType: null,
        identificationNumber: null,
        identificationBeginTime: null,
        identificationEndTime: null,
        identificationEffective: null,
        identificationImg: null,
        identificationBackImg: null,
        identificationInhandImg: null,
        businessLicenseImg: null,
        businessLicenseNo: null,
        organizationCodeNo: null,
        artificialIdentificationNumber: null,
        artificialIdentificationImg: null,
        authStatus: 0,
        isFreezone: null,
        createTime: null,
        updateTime: null,
        createCode: null,
        updateCode: null,
        delFlag: null,
        authTime: null,
        provinceCode: null,
        cityCode: null,
        countyCode: null,
        isAccount: null,
        accountType: null,
        isWipe: null,
        area: null,
        wipeType: null,
        isMonthly: null,
        isPrepaid: null,
        isConsumption: null,
        consumptionUnit: null,
        consumptionMin: null,
        consumptionMax: null,
        dispatchPoints: null,
        creditAmount: null,
        ticketType: null,
        serviceRatio: null,
        supplyIsAuth: null
      };
      this.resetForm('form');
      this.cityCodeOptions = [];
      this.countyCodeOptions = [];
    },
    // 表单赋值
    setForm(data) {
      this.form = data;
      if (this.form.identificationEffective) {
        this.form.identificationEffective = true;
      } else {
        this.form.identificationEffective = false;
      }
      if (data.password === null || data.password === undefined || data.password === '') {
        this.form.password = this.initialPassword;
      }
      // 市
      this.getCityListFun(this.form.provinceCode);
      // 区
      this.geCountyListFun(this.form.cityCode);
    },
    // 已读
    authRead(data) {
      if (data.identificationEffective) {
        data.identificationEffective = 1;
      } else {
        data.identificationEffective = 0;
      }
      authRead(data).then(response => {
        this.$emit('refresh');
      });
    },
    // 选中省
    changeProvince(code) {
      this.form.cityCode = null;
      this.form.countyCode = null;
      this.cityCodeOptions = [];
      this.countyCodeOptions = [];
      this.getCityListFun(code);
    },
    // 选中市
    changeCity(code) {
      this.form.countyCode = null;
      this.countyCodeOptions = [];
      this.geCountyListFun(code);
    },
    // 获取市
    getCityListFun(code) {
      if (code == null || code === '') {
        return;
      }
      getCityList({ provinceCode: code }).then((response) => {
        this.cityCodeOptions = response.rows;
      });
    },
    // 获取区
    geCountyListFun(code) {
      if (code == null || code === '') {
        return;
      }
      geCountyList({ cityCode: code }).then((response) => {
        this.countyCodeOptions = response.rows;
      });
    }
  }
};
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
.width70{
  width: 70%;
}
.width60{
  width: 60%;
}
.width28{
  width: 28%;
}
.width12{
  width: 12%;
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
