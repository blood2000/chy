<template>
  <el-dialog
    class="page-shipment-manage-dialog"
    :visible="visible"
    :fullscreen="isfullscreen"
    width="1300px"
    title="管理"
    append-to-body
    @close="cancel"
  >
    <el-tabs v-model="activeName">
      <el-tab-pane label="公司资料" name="info">
        <company-info-page v-if="activeName === 'info'" :shipment-code="shipmentCode" />
      </el-tab-pane>
      <el-tab-pane label="开票信息管理" name="bill">
        <bill-page v-if="activeName === 'bill'" :shipment-code="shipmentCode" />
      </el-tab-pane>
      <el-tab-pane label="核算规则" name="rule">
        <rule-page v-if="activeName === 'rule'" :shipment-code="shipmentCode" />
      </el-tab-pane>
      <el-tab-pane label="货集码管理" name="stock">
        <stock-page v-if="activeName === 'stock'" :shipment-code="shipmentCode" />
      </el-tab-pane>
      <el-tab-pane label="项目管理" name="project">
        <project-Page v-if="activeName === 'project'" :shipment-code="shipmentCode" />
      </el-tab-pane>
      <el-tab-pane label="常用地址管理" name="address">
        <address-page v-if="activeName === 'address'" :shipment-code="shipmentCode" />
      </el-tab-pane>
      <template v-if="companyCode">
        <el-tab-pane label="公司成员管理" name="member">
          <user-page v-if="activeName === 'member'" :company-code="companyCode" />
        </el-tab-pane>
        <el-tab-pane label="公司组织管理" name="dep">
          <dept-page v-if="activeName === 'dep'" :company-code="companyCode" />
        </el-tab-pane>
        <el-tab-pane label="公司角色管理" name="role">
          <role-page v-if="activeName === 'role'" :company-code="companyCode" />
        </el-tab-pane>
      </template>
    </el-tabs>
  </el-dialog>
</template>

<script>
import CompanyInfoPage from '../../enterprise/company/info';
import BillPage from '../../enterprise/company/billing';
import RulePage from '../../enterprise/rules';
import StockPage from '../../enterprise/stockcode';
import ProjectPage from '../../enterprise/project';
import AddressPage from '../../enterprise/company/address';
import UserPage from '../../system/user';
import DeptPage from '../../system/dept';
import RolePage from '../../system/role';

export default {
  name: 'ShipmentManageDialog',
  components: {
    CompanyInfoPage,
    BillPage,
    RulePage,
    StockPage,
    ProjectPage,
    AddressPage,
    UserPage,
    DeptPage,
    RolePage
  },
  props: {
    open: Boolean,
    shipmentCode: {
      type: String,
      default: null
    },
    companyCode: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      isfullscreen: false,
      activeName: 'info'
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
  watch: {
    open(val) {
      if (val) {
        this.activeName = 'info';
      }
    }
  },
  methods: {
    // 取消按钮
    cancel() {
      this.close();
    },
    // 关闭弹窗
    close() {
      this.$emit('update:open', false);
      this.activeName = null;
    }
  }
};
</script>

<style lang="scss">
.page-shipment-manage-dialog{
  .el-dialog{
    height: 90vh;
    .el-dialog__body{
      padding: 0 20px 20px;
      background: #fff;
      .app-container{
        box-shadow: none;
        margin: 0;
        padding: 0;
      }
    }
  }
}
</style>
