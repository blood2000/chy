<template>
  <el-dialog :class="[{'i-add':title==='新增'},{'i-check':title==='审核'}]" :title="title" :visible="visible" width="800px" append-to-body :close-on-click-modal="disable" @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" :disabled="disable" label-width="140px">
      <el-form-item label="发货人/发货企业" prop="shipperType">
        <el-select
          v-model="form.shipperType"
          class="width90"
        >
          <el-option
            v-for="dict in typeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="手机号/账号" prop="telphone">
        <el-input v-model="form.telphone" placeholder="请输入手机号/账号" class="width90" clearable />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password" :placeholder="form.id?'密码未修改可不填写':'请输入密码'" class="width60 mr3" clearable />
        <span class="g-color-blue">(初始密码为{{ initialPassword }})</span>
      </el-form-item>
      <el-form-item>
        <el-row>
          <el-col :span="7">
            <p class="upload-image-label">管理员身份证正面照</p>
            <upload-image v-model="form.identificationImg" :disabled="disable" image-type="id-card" side="front" @fillForm="fillForm" />
          </el-col>
          <el-col :span="7">
            <p class="upload-image-label">管理员身份证背面照</p>
            <upload-image v-model="form.identificationBackImg" :disabled="disable" image-type="id-card" side="back" @fillForm="fillForm" />
          </el-col>
          <el-col :span="7">
            <p class="upload-image-label">手持身份证照</p>
            <upload-image v-model="form.identificationInhandImg" :disabled="disable" />
          </el-col>
          <el-col v-show="form.shipperType === 1" :span="7" class="mt">
            <p class="upload-image-label">法人身份证正面照</p>
            <upload-image v-model="form.artificialIdentificationImg" :disabled="disable" />
          </el-col>
          <el-col v-show="form.shipperType === 1" :span="7" class="mt">
            <p class="upload-image-label">法人身份证背面照</p>
            <upload-image v-model="form.artificialIdentificationBackImg" :disabled="disable" />
          </el-col>
          <el-col v-show="form.shipperType === 1" :span="7" class="mt">
            <p class="upload-image-label">法人手持身份证照</p>
            <upload-image v-model="form.artificialIdentificationInhandImg" :disabled="disable" />
          </el-col>
          <el-col v-show="form.shipperType === 1" :span="7" class="mt">
            <p class="upload-image-label">营业执照</p>
            <upload-image v-model="form.businessLicenseImg" :disabled="disable" image-type="business-license" @fillForm="fillForm" />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="姓名" prop="adminName">
        <el-input v-model="form.adminName" placeholder="支持自动识别" class="width90" clearable />
      </el-form-item>
      <el-form-item label="身份证号" prop="identificationNumber">
        <el-input v-model="form.identificationNumber" placeholder="支持自动识别" class="width90" clearable />
      </el-form-item>
      <el-form-item prop="identificationEndTime">
        <label slot="label"><span style="color: #ff4949">* </span>身份证有效期</label>
        <el-date-picker
          v-model="form.identificationBeginTime"
          clearable
          class="width28"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="支持自动识别"
        />
        至
        <el-date-picker
          v-model="form.identificationEndTime"
          clearable
          class="width28 mr3"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="支持自动识别"
          :disabled="!!form.identificationEffective"
        />
        <el-checkbox v-model="form.identificationEffective">长期有效</el-checkbox>
      </el-form-item>
      <!-- <el-form-item label="网点" prop="branchCode">
        <el-select
          v-model="form.branchCode"
          filterable
          remote
          reserve-keyword
          placeholder="请输入网点"
          class="width90"
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
      <template v-if="form.shipperType === 1">
        <el-form-item label="企业名称" prop="companyName" :rules="[{ required: true, message: '企业名称不能为空', trigger: 'blur' }]">
          <el-input v-model="form.companyName" placeholder="请输入企业名称" class="width90" clearable />
          <!-- <el-select
            v-model="form.companyName"
            style="width: 90%"
            filterable
            allow-create
            default-first-option
            placeholder="请选择企业"
            @change="changeCompany"
          >
            <el-option
              v-for="item in companyList"
              :key="item.orgName"
              :label="item.orgName"
              :value="item"
            />
          </el-select>-->
        </el-form-item>
        <el-form-item label="统一社会信用代码" prop="organizationCodeNo" :rules="[{ required: true, message: '统一社会信用代码不能为空', trigger: 'blur' }]">
          <el-input v-model="form.organizationCodeNo" placeholder="请输入统一社会信用代码" class="width90" clearable />
        </el-form-item>
        <el-form-item label="营业执照号" prop="businessLicenseNo">
          <el-input v-model="form.businessLicenseNo" placeholder="请输入营业执照号" class="width90" clearable />
        </el-form-item>
        <el-form-item label="法人姓名" prop="artificialName">
          <el-input v-model="form.artificialName" placeholder="请输入法人姓名" class="width90" clearable />
        </el-form-item>
        <el-form-item label="法人身份证" prop="artificialIdentificationNumber">
          <el-input v-model="form.artificialIdentificationNumber" placeholder="请输入法人身份证" class="width90" clearable />
        </el-form-item>
      </template>
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
      <el-form-item label="详细地址" prop="area">
        <el-input v-model="form.area" clearable placeholder="支持自动识别" class="width90" />
      </el-form-item>
      <el-form-item label="票制类别" prop="ticketType">
        <el-select
          v-model="form.ticketType"
          filterable
          clearable
          class="width90"
          @change="changeTicketType"
        >
          <el-option
            v-for="dict in ticketTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-row :gutter="20">
        <el-col :span="11">
          <el-form-item label="税点(%)" prop="texPoint">
            <el-input-number v-model="form.texPoint" controls-position="right" :precision="2" placeholder="请输入税点" :step="1" :min="0" :max="100" clearable @input="changeTextPoint" />
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item prop="dispatchPoints">
            <label slot="label">
              <el-tooltip
                class="item"
                effect="light"
                placement="right"
              >
                <i class="el-icon-question" />
                <ul slot="content">
                  <li class="g-text">一票制：调度费点数 = 税点(%)</li>
                  <li class="g-text">二票制：调度费点数 = 税点(%)</li>
                  <li class="g-text">非一票制：调度费点数 = [税点/(1-税点)]</li>
                </ul>
              </el-tooltip>
              调度费点数(%)
            </label>
            <el-input v-model="form.dispatchPoints" disabled placeholder="请输入调度费点数" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <template v-if="form.ticketType == '2'">
        <el-form-item label="服务费税率(%)" prop="serviceRate" :rules="[{ required: true, message: '服务费税率不能为空', trigger: 'blur' }]">
          <el-input-number v-model="form.serviceRate" controls-position="right" :precision="2" placeholder="请输入服务费税率" :step="1" :min="0" :max="100" class="width90" clearable />
        </el-form-item>
        <!-- <el-form-item label="服务费比例(%)" prop="serviceRatio"  :rules="[{ required: true, message: '服务费比例不能为空', trigger: 'blur' }]" >
          <el-input-number v-model="form.serviceRatio" controls-position="right" :precision="2" placeholder="请输入服务费比例" :step="1" :min="0" :max="100" class="width90" clearable />
        </el-form-item>-->
      </template>
      <!-- <el-form-item label="是否冻结" prop="isFreezone">
        <el-select
          v-model="form.isFreezone"
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
      <el-form-item label="货源是否审核" prop="supplyIsAuth">
        <el-select
          v-model="form.supplyIsAuth"
          clearable
          filterable
          class="width90"
        >
          <el-option
            v-for="dict in isOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item label="是否独立核算" prop="isAccount">
        <el-select
          v-model="form.isAccount"
          clearable
          filterable
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
      <!-- <el-form-item label="核算方式" prop="accountType">
        <el-select v-model="form.accountType" placeholder="请选择核算方式" filterable clearable class="width90">
          <el-option
            v-for="dict in accountTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>-->
      <!-- <el-form-item label="是否抹零" prop="isWipe">
        <el-select
          v-model="form.isWipe"
          clearable
          filterable
          class="width28 mr3"
        >
          <el-option
            v-for="dict in isOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
        <el-select v-model="form.wipeType" placeholder="请选择抹零方式" filterable clearable class="width28">
          <el-option
            v-for="dict in wipeTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>-->
      <!-- <el-form-item label="是否开启合理路耗">
        <el-select
          v-model="form.isConsumption"
          clearable
          filterable
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
          filterable
          clearable
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
        <el-input-number v-model="form.consumptionMin" :controls="false" placeholder="最小值" class="width12" />
        至
        <el-input-number v-model="form.consumptionMax" :controls="false" placeholder="最大值" class="width12" />
      </el-form-item>-->
      <el-row :gutter="20">
        <el-col :span="11">
          <el-form-item label="是否月结" prop="isMonthly">
            <el-select
              v-model="form.isMonthly"
              clearable
              filterable
            >
              <el-option
                v-for="dict in isOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-if="form.isMonthly" :span="11">
          <el-form-item label="授信金额" prop="creditAmount">
            <el-input-number v-model="form.creditAmount" :precision="2" :controls="false" placeholder="保留两位小数" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="是否预付运费" prop="isPrepaid">
        <el-select
          v-model="form.isPrepaid"
          clearable
          filterable
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
      <el-button type="primary" :loading="buttonLoading" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
    <div v-if="title === '审核'" slot="footer" class="dialog-footer">
      <el-button type="primary" @click="reviewForm(3)">审核通过</el-button>
      <el-button type="danger" @click="reviewForm(2)">审核不通过</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addShipment, updateShipment, authRead, examine, getShipmentEnterprise } from '@/api/assets/shipment';
import { listDeptAll } from '@/api/system/dept';
import { getBranchList } from '@/api/system/branch';
import UploadImage from '@/components/UploadImage/index';
import ProvinceCityCounty from '@/components/ProvinceCityCounty';
import { praseBooleanToNum, praseNumToBoolean } from '@/utils/ddc';

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
      buttonLoading: false,
      // 初始密码
      initialPassword: 'abcd1234@',
      // 货主类型数据字典
      typeOptions: [
        { dictLabel: '发货人', dictValue: 0 },
        { dictLabel: '发货企业', dictValue: 1 }
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
        telphone: [
          { required: true, message: '手机号/账号不能为空', trigger: 'blur' },
          { validator: this.formValidate.telphone, trigger: 'blur' }
        ],
        adminName: [
          { required: true, message: '姓名不能为空', trigger: ['blur', 'change'] },
          { validator: this.formValidate.name, trigger: ['blur', 'change'] }
        ],
        identificationNumber: [
          { required: true, message: '身份证号不能为空', trigger: ['blur', 'change'] },
          { validator: this.formValidate.idCard, trigger: ['blur', 'change'] }
        ],
        identificationEndTime: [
          { validator: (rules, value, callback) => this.formValidate.idCardValidate(rules, value, callback, this.form.identificationBeginTime, this.form.identificationEffective), trigger: ['change', 'blur'] },
          { validator: (rules, value, callback) => this.formValidate.isExpired(rules, value, callback, this.form.identificationEffective), trigger: 'change' }
        ],
        creditAmount: [
          { validator: this.formValidate.number, trigger: 'blur' }
        ],
        ticketType: [
          { required: true, message: '票制类别不能为空', trigger: 'blur' }
        ],
        texPoint: [
          { required: true, message: '税点不能为空', trigger: ['change', 'blur'] }
        ],
        password: [
          { validator: this.formValidate.passWord, trigger: 'blur' }
        ]
      },
      // 网点查询
      loading: false,
      branchOptions: [],
      companyList: []
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
    // 不用了
    // this.getCompanyList();
  },
  methods: {
    changeTextPoint(value) {
      if (this.form.ticketType === '1') { // 一票制：调度费点数=原来的『税点(%) 』备注：运单结算使用的比例
        this.$set(this.form, 'dispatchPoints', value);
        this.$set(this.form, 'serviceRate', '');// 服务费税率
      } else if (this.form.ticketType === '2') { // 二票制：服务费税率(%)、调度费点数=原来的『服务费比例』备注：运单结算使用的比例
        this.$set(this.form, 'dispatchPoints', value);
      } else if (this.form.ticketType === '3') { // 非一票制：调度费点数=原来的『税点(%) 』备注：运单结算使用的比例是「合同税点/（1-合同税点）」
        this.$set(this.form, 'dispatchPoints', ((value / (100 - value)) * 100).toFixed(2));
        this.$set(this.form, 'serviceRate', '');// 服务费税率
      }
    },
    changeTicketType(value) {
      if (value === '1') { // 一票制：调度费点数=原来的『税点(%) 』备注：运单结算使用的比例
        this.$set(this.form, 'dispatchPoints', this.form.texPoint);
        this.$set(this.form, 'serviceRate', '');// 服务费税率
      } else if (value === '2') { // 二票制：服务费税率(%)、调度费点数=原来的『服务费比例』备注：运单结算使用的比例
        this.$set(this.form, 'dispatchPoints', this.form.texPoint);
      } else if (value === '3') { // 非一票制：调度费点数=原来的『税点(%) 』备注：运单结算使用的比例是「合同税点/（1-合同税点）」
        this.$set(this.form, 'serviceRate', '');// 服务费税率
        if (this.form.texPoint === '' || this.form.texPoint === undefined || this.form.texPoint === null) return;
        this.$set(this.form, 'dispatchPoints', ((this.form.texPoint / (100 - this.form.texPoint)) * 100).toFixed(2));
      }
    },
    changeCompany(item) {
      if (item.orgCode) {
        this.form.companyCode = item.orgCode;
        this.getCompany(item.orgCode);
      } else {
        this.form.companyName = item;
      }
      if (item.orgName) {
        this.form.companyName = item.orgName;
      }
    },
    getCompanyList() {
      listDeptAll().then((response) => {
        this.companyList = response.data;
      });
    },
    getCompany(companyCode) {
      getShipmentEnterprise(companyCode).then((response) => {
        this.form = Object.assign(this.form, response.data);
        console.log(this.form);
      });
    },
    /** 查询字典 */
    getDictsOptions() {
      // 核算规则
      /* this.getDicts('balance_rule').then((response) => {
        this.accountTypeOptions = response.data;
      }); */
      // 票制类别
      this.getDicts('assets_ticket_type').then((response) => {
        this.ticketTypeOptions = response.data;
      });
      // 合理路耗计量单位
      /* this.getDicts('consumption_unit').then((response) => {
        this.consumptionUnitOptions = response.data;
      }); */
      // 抹零方式
      /* this.getDicts('wipe_type').then((response) => {
        this.wipeTypeOptions = response.data;
      }); */
    },
    /** 提交按钮 */
    submitForm() {
      const flag = this.$refs.ChooseArea.submit();
      this.$refs['form'].validate(valid => {
        if (valid && flag) {
          this.buttonLoading = true;
          // 类型为发货人的时候，企业相关字段不能传
          if (this.form.shipperType === 0) {
            this.form.companyName = null;
            this.form.artificialName = null;
            this.form.artificialIdentificationNumber = null;
            this.form.organizationCodeNo = null;
            this.form.businessLicenseNo = null;
            this.form.artificialIdentificationImg = null;
            this.form.artificialIdentificationBackImg = null;
            this.form.artificialIdentificationInhandImg = null;
            this.form.businessLicenseImg = null;
          }
          if (!this.form.isMonthly) {
            this.form.creditAmount = null;
          }
          this.form.identificationEffective = praseBooleanToNum(this.form.identificationEffective);
          if (this.form.ticketType === '1') { // 一票制：调度费点数=原来的『税点(%) 』备注：运单结算使用的比例
            this.$set(this.form, 'dispatchPoints', this.form.texPoint);
            this.$set(this.form, 'serviceRate', '');// 服务费税率
          } else if (this.form.ticketType === '2') { // 二票制：服务费税率(%)、调度费点数=原来的『服务费比例』备注：运单结算使用的比例
            this.$set(this.form, 'dispatchPoints', this.form.texPoint);
          } else if (this.form.ticketType === '3') { // 非一票制：调度费点数=原来的『税点(%) 』备注：运单结算使用的比例是「合同税点/（1-合同税点）」
            this.$set(this.form, 'serviceRate', '');// 服务费税率
            this.$set(this.form, 'dispatchPoints', ((this.form.texPoint / (100 - this.form.texPoint)) * 100).toFixed(2));
          }
          if (this.form.id) {
            updateShipment(this.form).then(response => {
              this.buttonLoading = false;
              this.msgSuccess('修改成功');
              this.close();
              this.$emit('refresh');
            }).catch(() => {
              this.buttonLoading = false;
            });
          } else {
            addShipment(this.form).then(response => {
              this.buttonLoading = false;
              this.msgSuccess('新增成功');
              this.close();
              this.$emit('refresh');
            }).catch(() => {
              this.buttonLoading = false;
            });
          }
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
    /** 审核通过/未通过按钮 */
    reviewForm(key) {
      this.form.authStatus = key;
      this.form.identificationEffective = praseNumToBoolean(this.form.identificationEffective);
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
      this.buttonLoading = false;
      this.form = {
        adminName: null,
        adminCode: null,
        telphone: null,
        password: null,
        companyCode: null,
        companyName: null,
        shipperType: 0,
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
        isAccount: 1, // 是否独立核算，默认是
        accountType: null,
        isWipe: null,
        area: null,
        wipeType: null,
        isMonthly: null,
        isPrepaid: 1, // 是否预付运费，默认是
        isConsumption: null,
        consumptionUnit: null,
        consumptionMin: null,
        consumptionMax: null,
        dispatchPoints: null,
        creditAmount: null,
        ticketType: null,
        serviceRatio: null,
        serviceRate: null,
        supplyIsAuth: 0 // 是否审核货源，默认否
        // branchCode: null
      };
      this.resetForm('form');
    },
    // 表单赋值
    setForm(data) {
      this.form = data;
      this.form.identificationEffective = praseNumToBoolean(this.form.identificationEffective);
      if (this.form.branchCode && this.form.branchName) {
        this.branchOptions = [{
          code: this.form.branchCode,
          name: this.form.branchName
        }];
      }
    },
    // 已读
    authRead(data) {
      data.identificationEffective = praseBooleanToNum(data.identificationEffective);
      authRead(data).then(response => {
        this.$emit('refresh');
      });
    },
    // 查询网点列表
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
    // 图片识别后回填
    fillForm(type, data) {
      switch (type) {
        case 'id-card':
          if (data.name) this.form.adminName = data.name;
          if (data.number) this.form.identificationNumber = data.number;
          if (data.address) this.form.area = data.address;
          if (data.valid_from) this.form.identificationBeginTime = data.valid_from;
          if (data.valid_to) this.form.identificationEndTime = data.valid_to;
          break;
        case 'business-license':
          break;
        default:
          break;
      }
    }
  }
};
</script>

<style scoped>
.mr3{
  margin-right: 3%;
}
.mt{
  margin-top: 22px;
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
.width50{
  width: 50%;
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
