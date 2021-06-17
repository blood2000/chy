<template>
  <div class="page-wallet">
    <div class="app-container app-container--card">
      <h3 class="g-card-title g-card-header mb20">我的账户</h3>
      <el-row class="mb20">
        <el-col :span="8">
          <p class="g-text mb10">
            <span class="g-text-20 g-strong mr5">{{ walletInfo.amount||walletInfo.amount==0 ? walletInfo.amount : '---' }}</span>
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
      <el-button  v-has-permi="['myWallet:account:withdrawal']" type="primary" class="mr20" :disabled="!walletInfo.amount || walletInfo.amount === 0" @click="handleWithdraw">提现</el-button>
      <el-button  v-has-permi="['myWallet:account:description']" type="text" class="mr10" @click="handleJumpPage('rechargeDescription')">充值说明</el-button>
      <el-button  v-has-permi="['myWallet:account:details']" type="text" class="mr10" @click="handleJumpPage('accountDetails')">账户明细</el-button>
      <el-button  v-has-permi="['myWallet:account:record']" type="text" class="mr10" @click="handleJumpPage('withdrawalsRecord')">出入账记录</el-button>
      <el-button  v-has-permi="['myWallet:account:transaction']" type="text" class="mr10" @click="handleJumpPage('transactionRecord')">交易记录</el-button>
      <el-button v-hasPermi="['wallet:statement']" type="text" class="mr10" @click="handleJumpPage('Statement')">批次对账单</el-button>
    </div>

    <div class="app-container app-container--card">
      <h3 class="g-card-title g-card-header mb20">支付与安全</h3>
      <p class="g-text mb20">
        <span class="g-color-blue">{{ isEmptyPassword ? '未设置' : '已设置' }}</span>
      </p>
      <p class="g-text mb20">保护账户财产安全，请设置一个与登录密码不同的支付密码</p>
      <el-button v-has-permi="['myWallet:pay:reset']" type="primary" @click="handleChangePassword('edit')">{{ isEmptyPassword ? '设置支付密码' : '修改支付密码' }}</el-button>
      <el-button v-has-permi="['myWallet:pay:forget']" @click="handleChangePassword('forget')">忘记密码</el-button>
    </div>

    <!-- 账户提现弹窗 -->
    <withdraw-dialog :open.sync="withdrawOpen" :user-code="userCode" :credi-amount="amount" @refresh="getWallet" />
    <!-- 修改/忘记密码弹窗 -->
    <change-password-dialog :open.sync="changePasswordOpen" :amount-id="amountId" :title="title" :type="changePasswordType" :is-empty-password="isEmptyPassword" @refresh="getWallet" />
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
      changePasswordType: null,
      title: null,
      // 钱包id
      amountId: null,
      userCode: null,
      amount: null,
      // 支付密码是否设置
      isEmptyPassword: null
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
        this.isEmptyPassword = this.walletInfo.isEmptyPassword;
      });
    },
    // 提现按钮
    handleWithdraw() {
      this.userCode = this.walletInfo.userCode;
      this.amount = this.walletInfo.amount;
      this.withdrawOpen = true;
    },
    // 修改密码按钮
    handleChangePassword(type) {
      if (type === 'forget') {
        this.title = '忘记密码';
      } else if (type === 'edit') {
        if (this.isEmptyPassword) {
          this.title = '设置支付密码';
        } else {
          this.title = '修改支付密码';
        }
      }
      this.changePasswordType = type;
      this.amountId = this.walletInfo.id;
      this.changePasswordOpen = true;
    },
    // 跳转页面
    handleJumpPage(url) {
      if (!url) return;
      this.$router.push({
        path: url
      });
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
