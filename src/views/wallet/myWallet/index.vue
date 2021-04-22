<template>
  <div class="page-wallet">
    <div class="app-container app-container--card">
      <h3 class="g-card-title g-card-header mb20">我的账户</h3>
      <el-row class="mb20">
        <el-col :span="8">
          <p class="g-text mb10">
            <span class="g-text-20 g-strong mr5">{{ walletInfo.crediAmount||walletInfo.crediAmount==0 ? walletInfo.crediAmount : '---' }}</span>
            元
          </p>
          <p class="g-text">可用余额</p>
        </el-col>
        <el-col :span="8">
          <p class="g-text mb10">
            <span class="g-text-20 g-strong mr5">{{ walletInfo.freezeAmount||walletInfo.freezeAmount==0 ? walletInfo.freezeAmount : '---' }}</span>
            元
          </p>
          <p class="g-text">冻结金额</p>
        </el-col>
      </el-row>
      <el-button type="primary" @click="handleWithdraw">提现</el-button>
      <el-button type="text" @click="handleJumpPage('rechargeDescription')">充值说明</el-button>
      <el-button type="text" @click="handleJumpPage('accountDetails')">账户明细</el-button>
      <el-button type="text" @click="handleJumpPage('withdrawalsRecord')">提现记录</el-button>
      <el-button type="text" @click="handleJumpPage('transactionRecord')">付款明细</el-button>
      <el-button type="text" @click="handleJumpPage('transactionRecord')">冻结明细</el-button>
    </div>

    <div class="app-container app-container--card">
      <h3 class="g-card-title g-card-header mb20">支付与安全</h3>
      <p class="g-text mb20">
        <span class="g-color-blue">已设置</span>
      </p>
      <p class="g-text mb20">保护账户财产安全，请设置一个与登录密码不同的支付密码</p>
      <el-button type="primary" @click="handleChangePassword">修改支付密码</el-button>
      <el-button @click="handleForgotPassword">忘记密码</el-button>
    </div>

    <!-- 账户提现弹窗 -->
    <withdraw-dialog :open.sync="withdrawOpen" :user-code="userCode" :credi-amount="crediAmount" @refresh="getWallet" />
    <!-- 修改密码弹窗 -->
    <change-password-dialog :open.sync="changePasswordOpen" :amount-id="amountId" />
  </div>
</template>
<script>
import { getUserInfo } from '@/utils/auth';
import { getWalletInfo } from '@/api/wallet/wallet';
import withdrawDialog from './withdrawDialog';
import ChangePasswordDialog from './changePasswordDialog.vue';

export default {
  name: 'MyWallet',
  components: {
    withdrawDialog,
    ChangePasswordDialog
  },
  data() {
    return {
      walletInfo: {},
      // 提现
      withdrawOpen: false,
      // 密码
      changePasswordOpen: false,
      // 钱包id
      amountId: null,
      userCode: null,
      crediAmount: null
    };
  },
  created() {
    this.getWallet();
  },
  methods: {
    // 获取钱包信息
    getWallet() {
      const { user = {}} = getUserInfo() || {};
      const { userCode } = user;
      getWalletInfo({ code: userCode }).then(response => {
        this.walletInfo = response.data || {};
      });
    },
    // 提现按钮
    handleWithdraw() {
      this.userCode = this.walletInfo.userCode;
      this.crediAmount = this.walletInfo.crediAmount;
      this.withdrawOpen = true;
    },
    // 修改密码按钮
    handleChangePassword() {
      this.amountId = this.walletInfo.id;
      this.changePasswordOpen = true;
    },
    // 忘记密码按钮
    handleForgotPassword() {

    },
    // 跳转页面
    handleJumpPage(url) {
      if (!url) return;
      this.$router.push({ path: url });
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
