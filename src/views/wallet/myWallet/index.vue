<template>
  <div class="page-wallet">
    <div class="app-container">
      <h3 class="g-title-medium mb10">我的账户</h3>
      <el-row class="mb20">
        <el-col :span="8">
          <p class="g-text">{{ walletInfo.crediAmount ? walletInfo.crediAmount : '' }}</p>
          <p class="g-text">可用余额</p>
        </el-col>
        <el-col :span="8">
          <p class="g-text">{{ walletInfo.freezeAmount ? walletInfo.freezeAmount : '' }}</p>
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

    <div class="app-container">
      <h3 class="g-title-medium mb10">支付与安全</h3>
      <p class="g-text mb20">
        <span class="g-color-blue">{{ passType === 1 ? '已设置' : '未设置' }}</span>
      </p>
      <p class="g-text mb20">保护账户财产安全，请设置一个与登录密码不同的支付密码</p>
      <el-button type="primary" @click="handleChangePassword">{{ passType === 1 ? '修改支付密码' : '设置新密码' }}</el-button>
      <el-button v-if="passType === 1 " @click="handleForgotPassword">忘记密码</el-button>
    </div>

    <!-- 账户提现弹窗 -->
    <withdraw-dialog :open.sync="withdrawOpen" />
    <!-- 修改密码弹窗 -->
    <change-password-dialog :open.sync="changePasswordOpen" :type="passType" />
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
      passType: 1, // 假设0未设置密码， 1为已设置密码
      walletInfo: {},
      // 提现
      withdrawOpen: false,
      // 密码
      changePasswordOpen: false
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
      this.withdrawOpen = true;
    },
    // 修改密码按钮
    handleChangePassword() {
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
