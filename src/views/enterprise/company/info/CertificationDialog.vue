<template>
  <el-dialog title="货主/企业认证" :visible="visible" width="800px" append-to-body @close="cancel">
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
      <template v-if="form.shipperType === 1">
        <el-form-item label="法人姓名" prop="artificialName">
          <el-input v-model="form.artificialName" placeholder="请输入法人姓名" class="width90" clearable />
        </el-form-item>
        <el-form-item label="法人身份证" prop="artificialIdentificationNumber">
          <el-input v-model="form.artificialIdentificationNumber" class="width90" clearable />
        </el-form-item>
        <el-form-item label="统一社会信用代码" prop="organizationCodeNo">
          <el-input v-model="form.organizationCodeNo" class="width90" clearable />
        </el-form-item>
        <el-form-item label="营业执照号" prop="businessLicenseNo">
          <el-input v-model="form.businessLicenseNo" class="width90" clearable />
        </el-form-item>
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
        <el-input v-model="form.area" class="width90" clearable />
      </el-form-item>
      <el-form-item>
        <el-row>
          <el-col :span="7">
            <p class="upload-image-label">身份证正面照</p>
            <upload-image v-model="form.identificationImg" />
          </el-col>
          <el-col :span="7">
            <p class="upload-image-label">身份证反面照</p>
            <upload-image v-model="form.identificationBackImg" />
          </el-col>
          <el-col :span="7">
            <p class="upload-image-label">本人手持身份证正面</p>
            <upload-image v-model="form.identificationInhandImg" />
          </el-col>
          <el-col v-show="form.shipperType === 1" :span="7" class="mt">
            <p class="upload-image-label">法人身份证正面照</p>
            <upload-image v-model="form.artificialIdentificationImg" />
          </el-col>
          <el-col v-show="form.shipperType === 1" :span="7" class="mt">
            <p class="upload-image-label">法人身份证背面照</p>
            <upload-image v-model="form.artificialIdentificationBackImg" />
          </el-col>
          <el-col v-show="form.shipperType === 1" :span="7" class="mt">
            <p class="upload-image-label">法人手持身份证照</p>
            <upload-image v-model="form.artificialIdentificationInhandImg" />
          </el-col>
          <el-col v-show="form.shipperType === 1" :span="7" class="mt">
            <p class="upload-image-label">营业执照照</p>
            <upload-image v-model="form.businessLicenseImg" />
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { saveCompanyInfo } from '@/api/enterprise/company/info';
import UploadImage from '@/components/UploadImage/index';
import ProvinceCityCounty from '@/components/ProvinceCityCounty';

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
        businessLicenseNo: [
          { required: true, trigger: 'blur', message: '营业执照号不能为空' }
        ],
        companyName: [
          { required: true, trigger: 'blur', message: '公司名称不能为空' }
        ],
        adminName: [
          { required: true, message: '姓名不能为空', trigger: 'blur' },
          { validator: this.formValidate.name, trigger: 'blur' }
        ],
        identificationNumber: [
          { required: true, message: '身份证号不能为空', trigger: 'blur' },
          { validator: this.formValidate.idCard, trigger: 'blur' }
        ],
        identificationEndTime: [
          { required: true, message: '身份证有效期不能为空', trigger: 'blur' },
          { validator: this.formValidate.isExpired }
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
      const flag = this.$refs.ChooseArea.submit();
      this.$refs['form'].validate(valid => {
        if (valid && flag) {
          /* if (this.form.shipperType === 1 && (!this.form.businessLicenseImg || this.form.businessLicenseImg === '')) {
            this.msgWarning('请上传营业执照照');
            return;
          }*/
          if (this.form.identificationEffective) {
            this.form.identificationEffective = 1;
          } else {
            this.form.identificationEffective = 0;
          }
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
      this.form = this.info;
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
