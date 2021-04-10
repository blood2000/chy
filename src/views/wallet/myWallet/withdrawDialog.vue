<template>
  <el-dialog title="账户提现" :visible="visible" width="800px" append-to-body @close="cancel">
    <div class="account-content">
      <p class="mb20">提现到:</p>
      <p class="mb20">
        <label>结算账户名:</label>
        福建省XXXXXX有限公司
      </p>
      <p class="mb20">
        <label>结算账户开户行:</label>
        农业银行
      </p>
      <p>
        <label>结算账户账号:</label>
        13154165789165
      </p>
    </div>
    <el-form ref="form" :model="form" :rules="rules" label-width="140px">
      <el-form-item label="可用余额">
        4916.88 元
      </el-form-item>
      <el-form-item label="提现金额" prop="name">
        <el-input v-model="form.name" placeholder="请输入提现金额" class="width90" clearable />
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>

export default {
  props: {
    open: Boolean
  },
  data() {
    return {
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, trigger: 'blur', message: '提现金额不能为空' }
        ]
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
  methods: {
    // 提交按钮
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.msgSuccess('操作成功');
          this.close();
          this.$emit('refresh');
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
    }
  }
};
</script>

<style lang="scss" scoped>
.account-content{
  width: 80%;
  margin: 0 auto 20px;
  border: 1px solid gray;
  padding: 20px;
}
.width90{
  width: 90%;
}
</style>
