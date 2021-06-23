<template>
  <el-dialog title="货主/企业认证" :visible="visible" width="800px" append-to-body :close-on-click-modal="false" @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="140px">
      <template v-if="form.shipperType === 1">
        <el-form-item label="企业名称" prop="companyName">
          <el-input v-model="form.companyName" class="width90" clearable />
        </el-form-item>
      </template>
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
      <template v-if="form.shipperType === 1">
        <el-form-item label="法人姓名" prop="artificialName">
          <el-input v-model="form.artificialName" placeholder="请输入法人姓名" class="width90" clearable />
        </el-form-item>
        <el-form-item label="法人身份证" prop="artificialIdentificationNumber">
          <el-input v-model="form.artificialIdentificationNumber" placeholder="请输入法人身份证" class="width90" clearable />
        </el-form-item>
        <el-form-item label="统一社会信用代码" prop="organizationCodeNo">
          <el-input v-model="form.organizationCodeNo" class="width90" placeholder="请输入统一社会信用代码" clearable />
        </el-form-item>
        <!--<el-form-item label="营业执照号" prop="businessLicenseNo">
          <el-input v-model="form.businessLicenseNo" placeholder="支持自动识别" class="width90" clearable />
        </el-form-item>-->
      </template>
      <!-- 选择省/市/区 -->
      <province-city-county
        ref="ChooseArea"
        :visible="visible"
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
        <el-input v-model="form.area" class="width90" clearable placeholder="支持自动识别" />
      </el-form-item>
      <el-form-item>
        <el-row>
          <el-col :span="7">
            <p class="upload-image-label">身份证(人像面)</p>
            <upload-image v-model="form.identificationImg" image-type="id-card" side="front" icon-type="idcard" @fillForm="fillForm" />
          </el-col>
          <el-col :span="7">
            <p class="upload-image-label">身份证(国徽面)</p>
            <upload-image v-model="form.identificationBackImg" image-type="id-card" side="back" icon-type="idcard_back" @fillForm="fillForm" />
          </el-col>
         <!-- <el-col :span="7">
            <p class="upload-image-label">本人手持身份证正面</p>
            <upload-image v-model="form.identificationInhandImg" icon-type="idcard_hand" />
          </el-col>-->
          <el-col v-show="form.shipperType === 1" :span="7">
            <p class="upload-image-label">法人身份证(人像面)</p>
            <upload-image v-model="form.artificialIdentificationImg" icon-type="idcard" />
          </el-col>
          <el-col v-show="form.shipperType === 1" :span="7" class="mt">
            <p class="upload-image-label">法人身份证(国徽面)</p>
            <upload-image v-model="form.artificialIdentificationBackImg" icon-type="idcard_back" />
          </el-col>
          <!--<el-col v-show="form.shipperType === 1" :span="7" class="mt">
            <p class="upload-image-label">法人手持身份证照</p>
            <upload-image v-model="form.artificialIdentificationInhandImg" icon-type="idcard_hand" />
          </el-col>-->
          <el-col v-show="form.shipperType === 1" :span="7" class="mt">
            <p class="upload-image-label">营业执照</p>
            <upload-image v-model="form.businessLicenseImg" image-type="business-license" icon-type="organization" @fillForm="fillForm" />
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button v-hasPermi="['assets:shipment:enterprise:save']" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { saveCompanyInfo } from '@/api/enterprise/company/info';
import UploadImage from '@/components/UploadImage/index';
import ProvinceCityCounty from '@/components/ProvinceCityCounty';
import { praseBooleanToNum, praseNumToBoolean } from '@/utils/ddc';

export default {
  components: {
    UploadImage,
    ProvinceCityCounty
  },
  props: {
    open: Boolean,
    info: {
      type: Object,
      default: function() {
        return {};
      }
    },
    shipmentCode: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        organizationCodeNo: [
          { required: true, trigger: 'blur', message: '统一社会信用代码不能为空' }
        ],
        /* businessLicenseNo: [
          { required: true, trigger: 'blur', message: '营业执照号不能为空' }
        ],*/
        companyName: [
          { required: true, trigger: 'blur', message: '企业名称不能为空' }
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
          { validator: (rules, value, callback) => this.formValidate.isExpired(rules, value, callback, this.form.identificationEffective), trigger: ['change', 'blur'] }
        ],
        artificialIdentificationNumber: [
          { validator: this.formValidate.idCard, trigger: ['blur', 'change'] }
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
  methods: {
    // 提交按钮
    submitForm: function() {
      // const flag = this.$refs.ChooseArea.submit();
      const flag = true;
      this.$refs['form'].validate(valid => {
        if (valid && flag) {
          /* if (this.form.shipperType === 1 && (!this.form.businessLicenseImg || this.form.businessLicenseImg === '')) {
            this.msgWarning('请上传营业执照');
            return;
          }*/
          this.form.identificationEffective = praseBooleanToNum(this.form.identificationEffective);
          if (this.shipmentCode) {
            this.form.shipmentCode = this.shipmentCode;
          }
          saveCompanyInfo(this.form).then(response => {
            this.msgSuccess('修改成功');
            this.close();
            this.$emit('refresh');
          });
        }
      });
    },
    // 取消按钮
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
      this.form = {};
      this.resetForm('form');
    },
    setForm() {
      this.form = { ...this.info };
      this.form.identificationEffective = praseNumToBoolean(this.form.identificationEffective);
    },
    // 图片识别后回填
    fillForm(type, data, side) {
      switch (type) {
        case 'id-card':
          if (side === 'front') {
            if (data.name) {
              this.$set(this.form, 'adminName', data.name);
            } else {
              this.$set(this.form, 'adminName', '');
            }
            if (data.number) {
              this.$set(this.form, 'identificationNumber', data.number);
            } else {
              this.$set(this.form, 'identificationNumber', '');
            }
            if (data.address) {
              this.$set(this.form, 'area', data.address);
            } else {
              this.$set(this.form, 'area', '');
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
                this.$set(this.form, 'identificationEndTime', data.valid_to);
              }
            } else {
              this.$set(this.form, 'identificationEffective', false);
              this.$set(this.form, 'identificationEndTime', '');
            }
          }
          break;
        case 'business-license':
          if (data.registration_number) {
            this.$set(this.form, 'organizationCodeNo', data.registration_number);
          } else {
            this.$set(this.form, 'organizationCodeNo', '');
          }
          break;
        default:
          break;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.width90{
  width: 90%;
}
.width60{
  width: 60%;
}
.width28{
  width: 28.5%;
}
.mr3{
  margin-right: 3%;
}
.mt{
  margin-top: 22px;
}
</style>
