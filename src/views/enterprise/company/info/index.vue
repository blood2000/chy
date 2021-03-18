<template>
  <div class="page-company-info">
    <div class="app-container">
      <h3 class="g-title-medium mb20">企业信息</h3>
      <el-row>
        <el-col :span="4">
          <div class="ly-flex ly-flex-pack-center">
            <div>
              <el-avatar :size="100" :src="form.heard" />
              <div class="g-text-center g-title-medium g-color-gray">
                <i class="el-icon-star-off" />
                <i class="el-icon-star-off" />
                <i class="el-icon-star-off" />
                <i class="el-icon-star-off" />
                <i class="el-icon-star-off" />
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="18">
          <el-form ref="form" :model="form" :rules="rules" label-width="80px" :label-position="'left'">
            <el-form-item label="企业名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入企业名称" class="input-width mr20" clearable />
              <span class="g-color-success mr20">
                <i class="el-icon-circle-check" />
                已认证
              </span>
              <el-button type="text no-padding" @click="handleCertification">查看</el-button>
            </el-form-item>
            <el-form-item label="主营业务" prop="name">
              <el-input v-model="form.name" placeholder="请输入主营业务" class="input-width" clearable />
            </el-form-item>
            <el-form-item label="业务城市" prop="name">
              <add-city-tag :prop-citys="form.citys" @refresh="(val) => form.citys=val" />
            </el-form-item>
            <el-form-item label="联系人" prop="name">
              <el-input v-model="form.name" placeholder="请输入联系人" class="input-width" clearable />
            </el-form-item>
            <el-form-item label="联系电话" prop="telphone">
              <el-input v-model="form.telphone" placeholder="请输入联系电话" class="input-width" clearable />
            </el-form-item>
            <el-form-item label="公司介绍" prop="name">
              <el-input v-model="form.name" type="textarea" placeholder="请输入公司介绍" class="input-width-large" clearable />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSubmit">保存</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>

    <div class="app-container">
      <h3 class="g-title-medium mb10">管理员信息</h3>
      <el-row>
        <el-col :span="6">
          <label>姓名：</label>
          hst
        </el-col>
        <el-col :span="7">
          <label>手机号：</label>
          17805972760
        </el-col>
        <el-col :span="8">
          <label>认证状态：</label>
          <span class="g-color-error mr20">
            <i class="el-icon-warning-outline" />
            未升级
          </span>
          <el-button type="text no-padding" @click="securityUpgrade">安全升级</el-button>
          <p class="g-text g-color-gray tip">为保证您的账户安全，请尽快完成安全升级</p>
        </el-col>
      </el-row>
    </div>

    <!-- 货主/企业认证 对话框 -->
    <certification-dialog :open.sync="open" />
  </div>
</template>

<script>
import {} from '@/api/enterprise/company/info';
import CertificationDialog from './CertificationDialog.vue';
import AddCityTag from '@/components/AddCityTag';

export default {
  components: {
    CertificationDialog,
    AddCityTag
  },
  data() {
    return {
      open: false,
      form: {
        citys: [
          {
            cityCode: '3501',
            cityName: '福州市',
            createBy: null,
            createCode: null,
            createTime: null,
            id: 2148,
            params: {},
            provinceCode: '35',
            remark: null,
            searchValue: null,
            updateBy: null,
            updateCode: null,
            updateTime: null
          }
        ]
      },
      rules: {
        telphone: [
          { validator: this.formValidate.telphone }
        ]
      }
    };
  },
  created() {

  },
  methods: {
    // 保存
    handleSubmit() {
      this.$refs['form'].validate(valid => {
        console.log(this.form);
      });
    },
    // 企业认证
    handleCertification() {
      this.open = true;
    },
    // 安全升级
    securityUpgrade() {}
  }
};
</script>

<style lang="scss" scoped>
.input-width{
  width: 300px;
}
.input-width-large{
  width: 60%;
}
.tip{
  margin: 5px 0 0 70px;
  font-size: 13px;
}
</style>
