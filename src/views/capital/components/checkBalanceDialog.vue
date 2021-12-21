<template>
  <!-- 查询网商余额 -->
  <el-dialog :title="title" class="i-amount" :visible="visible" width="900px" append-to-body :close-on-click-modal="false" @close="cancel">
    <div class="amount-content ly-flex-align-center ly-flex-pack-justify">
      <div>
        <p class="label mb10">总余额：</p>
        <p class="text">{{ (balanceCount || balanceCount === 0) ? floor(balanceCount) : '---' }}</p>
      </div>
      <div>
        <p class="label mb10">福建网商余额：</p>
        <p class="text">{{ (WSBK || WSBK === 0) ? floor(WSBK) : '---' }}</p>
      </div>
      <div>
        <p class="label mb10">山西网商余额：</p>
        <p class="text">{{ (SXWSBK || SXWSBK === 0) ? floor(SXWSBK) : '---' }}</p>
      </div>
      <div>
        <p class="label mb10">民生余额：</p>
        <p class="text">{{ (CMBC || CMBC === 0) ? floor(CMBC) : '---' }}</p>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { getBalance } from '@/api/capital/ubalance';

export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    open: Boolean,
    userCode: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      // 表单参数
      balanceCount: null,
      WSBK: null,
      SXWSBK: null,
      CMBC: null
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
        this.getBalance();
      }
    }
  },
  methods: {
    /** 查询网商余额 */
    getBalance() {
      getBalance(this.userCode).then(response => {
        if (response.data) {
          const { balanceCount, bklist } = response.data;
          this.balanceCount = balanceCount;
          if (bklist) {
            bklist.forEach(el => {
              if (el.WSBK !== undefined && el.WSBK !== null) {
                this.WSBK = el.WSBK;
              }
              if (el.SXWSBK !== undefined && el.SXWSBK !== null) {
                this.SXWSBK = el.SXWSBK;
              }
              if (el.CMBC !== undefined && el.CMBC !== null) {
                this.CMBC = el.CMBC;
              }
            });
          }
        }
      });
    },
    /** 取消按钮 */
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
      this.balanceCount = null;
      this.WSBK = null;
      this.SXWSBK = null;
      this.CMBC = null;
    }
  }
};
</script>

<style lang="scss" scoped>
.width90{
  width: 90%;
}
/* 可用余额 */
.amount-content{
  height: 126px;
  background: #FAFAFA;
  border: 1px dashed #D4D4D4;
  border-radius: 2px;
  padding: 0 50px;
  .label{
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    color: #20273A;
    text-align: left;
    padding-left: 22px;
    background: url('~@/assets/images/payment/icon_amount.png') no-repeat 0px 1px;
  }
  .text{
    font-size: 22px;
    font-weight: bold;
    line-height: 22px;
    color: #20273A;
    text-align: left;
  }
}
</style>
