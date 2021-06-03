<template>
  <el-dialog title="提现申请" class="i-money" :visible="visible" width="800px" append-to-body @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="选择银行卡" prop="bankNumber">
        <el-select
          v-model="form.bankNumber"
          clearable
          filterable
          placeholder="请选择银行卡"
          :class="addBankFlag ? 'width70 mr2' : 'width90'"
          @change="changeBank"
        >
          <el-option
            v-for="dict in bankOptions"
            :key="dict.account"
            :label="`${dict.bankName}（${dict.account}）`"
            :value="dict.account"
          />
        </el-select>
        <el-button v-if="addBankFlag" type="primary" @click="addBank">添加银行卡</el-button>
      </el-form-item>
      <el-form-item v-show="form.bankNumber" label="提现到">
        <div class="amount-content ly-flex-align-center width90" style="padding: 0 20px">
          <div>
            <p class="mb5">
              <label class="label">结算账户名：</label>
              {{ form.bankAcountName ? form.bankAcountName : '-' }}
            </p>
            <p class="mb5">
              <label class="label">结算账户开户行：</label>
              {{ form.bankName ? form.bankName : '-' }}
            </p>
            <p class="mb5">
              <label class="label">结算账户账号：</label>
              {{ form.bankNumber ? form.bankNumber : '-' }}
            </p>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="可用余额">
        <div class="amount-content ly-flex-align-center ly-flex-pack-center width90" style="height: 60px">
          <div>
            <p class="text">{{ crediAmount || crediAmount === 0 ? crediAmount : '---' }}</p>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="提现金额" prop="money">
        <el-input-number v-model="form.money" :min="0" :precision="2" :controls="false" placeholder="请输入提现金额" class="width90" clearable />
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>

    <!-- 确认密码 -->
    <confirm-password-dialog :open.sync="confirmPasswordOpen" :info="form" @refresh="refresh" />
    <!-- 新增银行卡 -->
    <bank-dialog ref="bankDialogRef" :open.sync="addBankOpen" :title="'新增银行卡'" :disable="false" :user-code="userCode" @refresh="getBankList" />
  </el-dialog>
</template>

<script>
import { banklist } from '@/api/capital/bankcard';
import ConfirmPasswordDialog from './confirmPasswordDialog';
import BankDialog from '../../capital/bankcard/bankDialog';

export default {
  components: {
    ConfirmPasswordDialog,
    BankDialog
  },
  props: {
    open: Boolean,
    userCode: {
      type: String,
      default: null
    },
    crediAmount: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      // 表单参数
      form: {
        applyerCode: null,
        bankAcountName: null,
        bankMobile: null,
        bankName: null,
        bankNumber: null,
        money: null
      },
      // 表单校验
      rules: {
        bankNumber: [
          { required: true, trigger: ['blur', 'change'], message: '银行卡不能为空' }
        ],
        money: [
          { required: true, trigger: 'blur', message: '提现金额不能为空' }
        ]
      },
      // 银行卡列表
      bankOptions: [],
      // 输入支付密码弹窗
      confirmPasswordOpen: false,
      // 新增银行卡
      addBankFlag: false,
      addBankOpen: false
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
        this.getBankList();
      }
    }
  },
  methods: {
    // 查询用户银行卡
    getBankList() {
      banklist({
        userCode: this.userCode
      }).then(response => {
        this.bankOptions = response.data.rows || [];
        if (this.bankOptions.length > 0) {
          this.addBankFlag = false;
        } else {
          this.addBankFlag = true;
          this.msgWarning('请先添加银行卡');
        }
      });
    },
    // 选择银行
    changeBank(data) {
      const bank = this.bankOptions.filter(el => {
        return el.account === data;
      })[0];
      this.form.bankAcountName = bank.name;
      this.form.bankMobile = bank.mobile;
      this.form.bankName = bank.bankName;
    },
    // 添加银行卡
    addBank() {
      this.$refs.bankDialogRef.reset();
      this.$refs.bankDialogRef.getUserByCode();
      this.addBankOpen = true;
    },
    // 提交按钮
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.money > this.crediAmount) {
            this.msgWarning('提现金额不能大于可用余额!');
            return;
          }
          if (this.form.money === 0) {
            this.msgWarning('提现金额不能为0');
            return;
          }
          this.form.applyerCode = this.userCode;
          this.confirmPasswordOpen = true;
        }
      });
    },
    // 取消按钮
    cancel() {
      this.close();
      this.reset();
    },
    // 关闭弹窗
    close() {
      this.$emit('update:open', false);
    },
    // 表单重置
    reset() {
      this.form = {};
      this.resetForm('form');
    },
    // 提现成功后更新
    refresh() {
      this.cancel();
      this.$emit('refresh');
    }
  }
};
</script>

<style lang="scss" scoped>
.width90{
  width: 90%;
}
.width70{
  width: 70%;
}
.mr2{
  margin-right: 2%;
}
/* 计数器样式 */
.el-input-number ::v-deep.el-input__inner{
  text-align: left;
}
/* 可用余额 */
.amount-content{
  height: 126px;
  background: #FAFAFA;
  border: 1px dashed #D4D4D4;
  border-radius: 2px;
  .label{
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    color: #20273A;
    text-align: center;
  }
  .text{
    font-size: 22px;
    font-weight: bold;
    line-height: 22px;
    color: #20273A;
    text-align: center;
    padding-left: 24px;
    background: url('~@/assets/images/payment/icon_amount.png') no-repeat 0px 1px;
  }
}
</style>
