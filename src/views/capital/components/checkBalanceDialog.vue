<template>
  <!-- 查询网商余额 -->
  <el-dialog :title="title" class="i-amount" :visible="visible" width="600px" append-to-body :close-on-click-modal="false" @close="cancel">
    <el-form ref="form" :model="form" label-width="100px">
      <!-- <el-form-item label="可用余额" prop="WSBK">
        <el-input v-model="form.WSBK" readonly class="width90" clearable />
      </el-form-item> -->
      <div class="amount-content ly-flex-align-center ly-flex-pack-center">
        <div>
          <p class="label mb10">可用余额：</p>
          <p class="text">{{ form.WSBK || form.WSBK ===0 ? form.WSBK : '---' }}</p>
        </div>
      </div>
    </el-form>
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
      form: {
        WSBK: null
      }
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
        const { bklist } = response.data;
        if (bklist) {
          bklist.forEach(el => {
            if (Object.keys(el)[0] === 'WSBK') {
              this.form.WSBK = el['WSBK'];
            }
          });
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
      this.form = {
        WSBK: null
      };
      this.resetForm('form');
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
  .label{
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    color: #20273A;
    text-align: center;
    padding-left: 22px;
    background: url('~@/assets/images/payment/icon_amount.png') no-repeat 0px 1px;
  }
  .text{
    font-size: 22px;
    font-weight: bold;
    line-height: 22px;
    color: #20273A;
    text-align: center;
  }
}
</style>
