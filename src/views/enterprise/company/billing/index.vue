<template>
  <div class="page-billing">
    <div class="app-container">
      <h3 class="g-title-medium">说明</h3>
      <p class="g-text">
        增值税发票信息提交后，我们将在一个工作日内完成审核工作。如有疑问，请点击右下角联系在线客服。
      </p>
      <p class="g-text g-color-blue">
        <i class="el-icon-info" />
        在开票信息通过审核前，暂时无法申请开具发票。
      </p>
    </div>

    <div class="app-container">
      <h3 class="g-title-medium">开票信息</h3>
      <el-form ref="form" :model="form" label-width="140px" :label-position="'left'">
        <h5 class="g-title-small g-strong g-color-gray mb20">| 增值税发票开票信息</h5>
        <el-form-item label="发票编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入发票编码" class="input-width" />
        </el-form-item>
        <el-form-item label="货主编码" prop="shipmentCode">
          <el-input v-model="form.shipmentCode" placeholder="请输入货主编码" class="input-width" />
        </el-form-item>
        <el-form-item label="纳税人识别号" prop="tax registration">
          <el-input v-model="form.taxRegistration" placeholder="请输入纳税人识别号" class="input-width" />
        </el-form-item>
        <el-form-item label="注册地址" prop="registrationAddrtion">
          <el-input v-model="form.registrationAddrtion" placeholder="请输入注册地址" class="input-width" />
        </el-form-item>
        <el-form-item label="注册电话" prop="registrationTelphone">
          <el-input v-model="form.registrationTelphone" placeholder="请输入注册电话" class="input-width" />
        </el-form-item>
        <el-form-item label="开户行" prop="openBankName">
          <el-input v-model="form.openBankName" placeholder="请输入开户行" class="input-width" />
        </el-form-item>
        <el-form-item label="账号" prop="openBankNumber">
          <el-input v-model="form.openBankNumber" placeholder="请输入账号" class="input-width" />
        </el-form-item>
        <hr class="g-hr">

        <h5 class="g-title-small g-strong g-color-gray mb20">| 发票收票地址</h5>
        <el-form-item label="收票人姓名" prop="payeeName">
          <el-input v-model="form.payeeName" placeholder="请输入收票人姓名" class="input-width" />
        </el-form-item>
        <el-form-item label="收票人联系电话" prop="payee telphone">
          <el-input v-model="form.payeeTelphone" placeholder="请输入收票人联系电话" class="input-width" />
        </el-form-item>
        <el-form-item label="收票人电子邮箱" prop="payeeEmail">
          <el-input v-model="form.payeeEmail" placeholder="请输入收票人电子邮箱" class="input-width" />
        </el-form-item>
        <el-form-item label="收票地址" prop="payeeAddress">
          <el-input v-model="form.payeeAddress" placeholder="请输入收票地址" class="input-width" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { updateBilling } from '@/api/enterprise/company/billing';

export default {
  data() {
    return {
      form: {}
    };
  },
  created() {

  },
  methods: {
    handleSubmit() {
      updateBilling(this.form).then(response => {

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
