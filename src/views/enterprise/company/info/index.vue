<template>
  <div class="page-company-info">
    <!-- 企业信息 -->
    <div v-if="form.shipperType === 1" class="app-container app-container--card">
      <h3 class="g-card-title g-card-header mb20">企业信息</h3>
      <el-row>
        <!-- <el-col :span="4">
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
        </el-col> -->
        <el-col :span="18">
          <el-form ref="queryForm" :model="form" :rules="rules" label-width="140px" :label-position="'left'">
            <el-form-item label="企业名称：" prop="companyName">
              <span class="mr20">{{ form.companyName }}</span>
              <span v-if="form.authStatus === 0" class="g-color-gray mr20">
                <i class="el-icon-warning-outline" />未认证
              </span>
              <span v-else-if="form.authStatus === 1" class="g-color-warning mr20">
                <i class="el-icon-warning-outline" />认证中
              </span>
              <span v-else-if="form.authStatus === 2" class="g-color-error mr20">
                <i class="el-icon-circle-close" />认证未通过
              </span>
              <span v-else-if="form.authStatus === 3" class="g-color-success mr20">
                <i class="el-icon-circle-check" />已认证
              </span>
              <el-button type="text no-padding" @click="handleCertification">认证</el-button>
            </el-form-item>
            <el-form-item label="统一社会信用代码：" prop="organizationCodeNo">
              {{ form.organizationCodeNo }}
            </el-form-item>
            <!--<el-form-item label="营业执照号：" prop="businessLicenseNo">
              {{ form.businessLicenseNo }}
            </el-form-item>-->
            <el-form-item label="营业执照：" prop="businessLicenseImg">
              <upload-image v-show="form.businessLicenseImg" v-model="form.businessLicenseImg" :disabled="true" icon-type="organization" />
            </el-form-item>
            <!-- <el-form-item label="业务城市" prop="name">
              <add-city-tag :prop-citys="form.citys" @refresh="(val) => form.citys=val" />
            </el-form-item> -->
          </el-form>
        </el-col>
      </el-row>
    </div>

    <!-- 个人信息 -->
    <div v-if="form.shipperType === 0" class="app-container app-container--card">
      <h3 class="g-card-title g-card-header mb20">个人信息</h3>
      <el-row>
        <el-form ref="queryForm" :model="form" :rules="rules" label-width="100px" :label-position="'left'">
          <el-form-item label="姓名：" prop="adminName">
            <span class="mr20">{{ form.adminName }}</span>
            <span v-if="form.authStatus === 0" class="g-color-gray mr20">
              <i class="el-icon-warning-outline" />未认证
            </span>
            <span v-else-if="form.authStatus === 1" class="g-color-warning mr20">
              <i class="el-icon-warning-outline" />认证中
            </span>
            <span v-else-if="form.authStatus === 2" class="g-color-error mr20">
              <i class="el-icon-circle-close" />认证未通过
            </span>
            <span v-else-if="form.authStatus === 3" class="g-color-success mr20">
              <i class="el-icon-circle-check" />已认证
            </span>
            <el-button v-hasPermi="['assets:shipment:enterprise:save']" type="text no-padding" @click="handleCertification">认证</el-button>
          </el-form-item>
          <el-form-item label="身份证号：" prop="identificationNumber">
            {{ form.identificationNumber }}
          </el-form-item>
        </el-form>
      </el-row>
    </div>

    <!-- 管理员信息 -->
    <div class="app-container app-container--card">
      <h3 class="g-card-title g-card-header mb20">管理员信息</h3>
      <el-row>
        <el-col :span="8">
          <label>姓名：</label>
          {{ form.adminName }}
        </el-col>
        <el-col :span="8">
          <label>身份证号：</label>
          {{ form.identificationNumber }}
        </el-col>
        <!-- <el-col :span="8">
          <label>认证状态：</label>
          <span class="g-color-error mr20">
            <i class="el-icon-warning-outline" />
            未升级
          </span>
          <el-button type="text no-padding" @click="securityUpgrade">安全升级</el-button>
          <p class="g-text g-color-gray tip">为保证您的账户安全，请尽快完成安全升级</p>
        </el-col> -->
      </el-row>
    </div>

    <!-- 货主/企业认证 对话框 -->
    <certification-dialog ref="detailDialog" :open.sync="open" :info="form" :shipment-code="shipmentCode" @refresh="getCompanyInfo" />
  </div>
</template>

<script>
import { getCompanyInfo } from '@/api/enterprise/company/info';
import CertificationDialog from './CertificationDialog.vue';
import UploadImage from '@/components/UploadImage/index';

export default {
  name: 'CompanyInfo',
  components: {
    CertificationDialog,
    UploadImage
    // AddCityTag
  },
  props: {
    shipmentCode: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      open: false,
      form: {},
      rules: {
        // organizationCodeNo: [
        //   { required: true, trigger: 'blur', message: '统一社会信用代码不能为空' }
        // ],
        // businessLicenseNo: [
        //   { required: true, trigger: 'blur', message: '营业执照号不能为空' }
        // ],
        // companyName: [
        //   { required: true, trigger: 'blur', message: '企业名称不能为空' }
        // ],
        // businessLicenseImg: [
        //   { required: true, trigger: 'blur', message: '营业执照不能为空' }
        // ]
      }
    };
  },
  mounted() {
    this.getCompanyInfo();
  },
  methods: {
    getCompanyInfo() {
      getCompanyInfo(this.shipmentCode).then(response => {
        this.form = response.data || {};
        // this.$set(this.form, 'citys', [
        //   {
        //     cityCode: '3501',
        //     cityName: '福州市',
        //     createBy: null,
        //     createCode: null,
        //     createTime: null,
        //     id: 2148,
        //     params: {},
        //     provinceCode: '35',
        //     remark: null,
        //     searchValue: null,
        //     updateBy: null,
        //     updateCode: null,
        //     updateTime: null
        //   }
        // ]);
        // this.$forceUpdate();
      });
    },
    // 企业认证
    handleCertification() {
      this.$refs.detailDialog.reset();
      this.$refs.detailDialog.setForm();
      this.open = true;
    },
    // 安全升级
    securityUpgrade() {}
  }
};
</script>

<style lang="scss" scoped>
.input-width{
  width: 600px;
}
.input-width-large{
  width: 60%;
}
.tip{
  margin: 5px 0 0 70px;
  font-size: 13px;
}
</style>
