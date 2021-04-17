<template>
  <div class="page-billing">
    <div class="app-container">
      <h3 class="g-title-medium mb10">说明</h3>
      <!-- <p class="g-text">
        增值税发票信息提交后，我们将在一个工作日内完成审核工作。如有疑问，请点击右下角联系在线客服。
      </p>
      <p class="g-text g-color-blue">
        <i class="el-icon-info" />
        在开票信息通过审核前，暂时无法申请开具发票。
      </p> -->
      <p class="g-text g-color-blue">
        <i class="el-icon-info" />
        请仔细核对以下开票信息内容，确保无误。超好运将不承担因增值税发票开票信息填写错误导致的后续责任。
      </p>
    </div>

    <div class="app-container">
      <h3 class="g-title-medium mb10">开票信息</h3>
      <el-form ref="form" :model="form" :rules="rules" label-width="140px" :label-position="'left'">
        <h5 class="g-title-small g-strong g-color-gray mb20">| 增值税发票开票信息</h5>
        <!-- <el-form-item label="发票编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入发票编码" class="input-width" clearable />
        </el-form-item>
         -->
        <el-form-item label="企业名称" prop="companyName">
          <el-input v-model="form.companyName" placeholder="请输入企业名称" class="input-width" clearable />
        </el-form-item>
        <el-form-item label="纳税人识别号" prop="taxRegistration">
          <el-input v-model="form.taxRegistration" placeholder="请输入纳税人识别号" class="input-width" clearable />
        </el-form-item>
        <el-form-item label="注册地址" prop="registrationAddrtion">
          <el-input v-model="form.registrationAddrtion" placeholder="请输入注册地址" class="input-width" clearable />
        </el-form-item>
        <el-form-item label="注册电话" prop="registrationTelphone">
          <el-input v-model="form.registrationTelphone" placeholder="请输入注册电话" class="input-width" clearable />
        </el-form-item>
        <el-form-item label="开户行" prop="openBankName">
          <el-input v-model="form.openBankName" placeholder="请输入开户行" class="input-width" clearable />
        </el-form-item>
        <el-form-item label="账号" prop="openBankNumber">
          <el-input v-model="form.openBankNumber" placeholder="请输入账号" class="input-width" clearable />
        </el-form-item>
        <hr class="g-hr">

        <h5 class="g-title-small g-strong g-color-gray mb20">| 发票收票地址</h5>
        <el-form-item label="收票人姓名" prop="payeeName">
          <el-input v-model="form.payeeName" placeholder="请输入收票人姓名" class="input-width" clearable />
        </el-form-item>
        <el-form-item label="收票人联系电话" prop="payeeTelphone">
          <el-input v-model="form.payeeTelphone" placeholder="请输入收票人联系电话" class="input-width" clearable />
        </el-form-item>
        <el-form-item label="收票人电子邮箱" prop="payeeEmail">
          <el-input v-model="form.payeeEmail" placeholder="请输入收票人电子邮箱" class="input-width" clearable />
        </el-form-item>
        <el-form-item label="收票地址" prop="payeeAddress">
          <el-input v-model="form.payeeAddress" placeholder="请输入收票地址" class="input-width" clearable />
        </el-form-item>

        <el-form-item>
          <el-button v-hasPermi="['assets:shipment:invoice:save']" type="primary" @click="handleSubmit">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { addBilling, updateBilling, getBilling } from '@/api/enterprise/company/billing';

export default {
  props: {
    shipmentCode: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      form: {},
      rules: {
        companyName: [
          { required: true, message: '企业名称不能为空', trigger: 'blur' }
        ],
        taxRegistration: [
          { required: true, message: '纳税人识别号不能为空', trigger: 'blur' }
        ],
        registrationAddrtion: [
          { required: true, message: '注册地址不能为空', trigger: 'blur' }
        ],
        registrationTelphone: [
          { required: true, message: '注册电话不能为空', trigger: 'blur' },
          { validator: this.formValidate.telphone, trigger: 'blur' }
        ],
        openBankName: [
          { required: true, message: '开户行不能为空', trigger: 'blur' }
        ],
        openBankNumber: [
          { required: true, message: '账号不能为空', trigger: 'blur' },
          { validator: this.formValidate.bankCard, trigger: 'blur' }
        ],
        payeeName: [
          { required: true, message: '收票人姓名不能为空', trigger: 'blur' },
          { validator: this.formValidate.name, trigger: 'blur' }
        ],
        payeeTelphone: [
          { required: true, message: '收票人联系电话不能为空', trigger: 'blur' },
          { validator: this.formValidate.telphone, trigger: 'blur' }
        ],
        payeeEmail: [
          { required: true, message: '收票人电子邮箱不能为空', trigger: 'blur' },
          { validator: this.formValidate.email, trigger: 'blur' }
        ],
        payeeAddress: [
          { required: true, message: '收票地址不能为空', trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    this.getBilling();
  },
  methods: {
    getBilling() {
      getBilling(this.shipmentCode).then(response => {
        this.form = response.data || {};
      });
    },
    handleSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.shipmentCode) {
            this.form.shipmentCode = this.shipmentCode;
          }
          if (this.form.id != null) {
            updateBilling(this.form).then(response => {
              this.msgSuccess('修改成功');
              this.getBilling();
            });
          } else {
            addBilling(this.form).then(response => {
              this.msgSuccess('新增成功');
              this.getBilling();
            });
          }
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.input-width{
  width: 600px;
}
</style>
