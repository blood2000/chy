<template>
  <el-dialog
    class="page-shipment-manage-dialog"
    :visible="visible"
    :fullscreen="isfullscreen"
    width="1300px"
    title="管理"
    append-to-body
    :close-on-click-modal="false"
    @close="cancel"
  >
    <el-tabs v-model="activeName">
      <el-tab-pane label="企业资料" name="info">
        <company-info-page v-if="activeName === 'info'" :shipment-code="shipmentCode" />
      </el-tab-pane>
      <el-tab-pane label="开票信息管理" name="bill">
        <bill-page v-if="activeName === 'bill'" :shipment-code="shipmentCode" />
      </el-tab-pane>
      <el-tab-pane label="核算规则" name="rule">
        <rule-page v-if="activeName === 'rule'" class="table-page" :shipment-code="shipmentCode" />
      </el-tab-pane>
      <el-tab-pane label="货集码管理" name="stock">
        <stock-page v-if="activeName === 'stock'" class="table-page" :shipment-code="shipmentCode" :org-code="companyCode" />
      </el-tab-pane>
      <el-tab-pane label="项目管理" name="project">
        <project-Page v-if="activeName === 'project'" class="table-page" :shipment-code="shipmentCode" :company-code="companyCode" />
      </el-tab-pane>
      <el-tab-pane label="常用地址管理" name="address">
        <address-page v-if="activeName === 'address'" class="table-page" :shipment-code="shipmentCode" :company-code="companyCode" />
      </el-tab-pane>
      <template v-if="companyCode">
        <el-tab-pane label="企业成员管理" name="member">
          <user-page v-if="activeName === 'member'" class="table-page" :company-code="companyCode" :user-code="userCode" :show-shipment="true" :org-type="orgType" />
        </el-tab-pane>
        <el-tab-pane label="企业组织管理" name="dep">
          <dept-page v-if="activeName === 'dep'" class="table-page" :company-code="companyCode" :user-code="userCode" :show-shipment="true" :org-type="orgType" />
        </el-tab-pane>
        <el-tab-pane label="企业角色管理" name="role">
          <role-page v-if="activeName === 'role'" class="table-page" :company-code="companyCode" :user-code="userCode" :show-shipment="true" :org-type="orgType" />
        </el-tab-pane>
        <el-tab-pane label="调度组管理" name="group">
          <group-page v-if="activeName === 'group'" class="table-page" :shipment-code="shipmentCode" />
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
import GroupPage from '../../enterprise/group';

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
    RolePage,
    GroupPage
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
    },
    userCode: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      isfullscreen: false,
      activeName: 'info',
      orgType: 1,
      isShipment: true
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
    .el-dialog__body{
      padding-top: 10px;
      .app-container{
        box-shadow: none;
        padding: 0;
      }
      .table-page{
        .app-container, &.app-container{
          margin: 0;
        }
      }
    }
  }
}
</style>
