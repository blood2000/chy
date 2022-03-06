<template>
  <div class="page-wallet">
    <div class="app-container app-container--card">
      <h3 class="g-card-title g-card-header mb20">我的账户</h3>
      <el-row class="mb20">
        <el-col :span="8">
          <p class="g-text mb10">
            <span class="g-text-20 g-strong mr5">{{ walletInfo.amount||walletInfo.amount==0 ? floor(walletInfo.amount) : '---' }}</span>
            元
          </p>
          <p class="g-text">可用余额</p>
        </el-col>
        <el-col :span="8">
          <p class="g-text mb10">
            <span class="g-text-20 g-strong mr5">{{ walletInfo.freezeAmount||walletInfo.freezeAmount==0 ? floor(walletInfo.freezeAmount) : '---' }}</span>
            元
          </p>
          <p class="g-text">冻结金额</p>
        </el-col>
      </el-row>
      <el-button v-has-permi="['myWallet:account:withdrawal']" type="primary" class="mr20" :disabled="!walletInfo.amount || walletInfo.amount === 0" @click="handleWithdraw">提现</el-button>
      <el-button v-has-permi="['myWallet:account:description']" type="text" class="mr10" @click="handleJumpPage('rechargeDescription')">充值说明</el-button>
      <el-button v-has-permi="['myWallet:account:details']" type="text" class="mr10" @click="handleJumpPage('accountDetails')">账户明细</el-button>
      <el-button v-has-permi="['myWallet:account:record']" type="text" class="mr10" @click="handleJumpPage('withdrawalsRecord')">出入账记录</el-button>
      <el-button v-has-permi="['myWallet:account:transaction']" type="text" class="mr10" @click="handleJumpPage('transactionRecord')">交易记录</el-button>
      <el-button v-hasPermi="['wallet:statement']" type="text" class="mr10" @click="handleJumpPage('Statement')">批次对账单</el-button>
      <el-button v-hasPermi="['myWallet:account:bankcard']" type="text" class="mr10" @click="handleJumpPage('walletBankcard', {code: walletInfo.userCode})">银行卡</el-button>
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
    <withdraw-dialog ref="refWithdrawDialog" :open.sync="withdrawOpen" :user-code="userCode" :credi-amount="amount" :is-empty-password="isEmptyPassword" @refresh="getWallet" @isNoPasswordToSet="isNoPasswordToSet" />
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
      isEmptyPassword: null,

      // 临时变量控制
      nowType: null
    };
  },
  created() {
    this.getWallet();
  },
  methods: {
    // 未设置密码 去设置密码
    isNoPasswordToSet(type = 'edit') {
      this.isEmptyPassword = 1;
      this.handleChangePassword(type, '提现触发');
    },

    // 获取钱包信息
    getWallet() {
      const { user = {}} = getUserInfo() || {};
      const { userCode } = user;
      getWalletInfo({ code: userCode }).then(response => {
        this.walletInfo = response.data || {};

        this.isEmptyPassword = this.walletInfo.isEmptyPassword;

        if (this.nowType && this.nowType === '提现触发') {
          this.$refs.refWithdrawDialog.submitForm(this.isEmptyPassword);
        }
      });
    },
    // 提现按钮
    handleWithdraw() {
      this.userCode = this.walletInfo.userCode;
      this.amount = this.walletInfo.amount;
      this.withdrawOpen = true;
    },
    // 修改密码按钮
    handleChangePassword(type, now) {
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

      this.nowType = null;
      now && (this.nowType = now);
    },
    // 跳转页面
    handleJumpPage(url, query) {
      if (!url) return;
      this.$router.push({
        path: url,
        query: query || {}
      });
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
