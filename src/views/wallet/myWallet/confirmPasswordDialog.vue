<template>
  <!-- 提现需要输入密码 -->
  <el-dialog :title="'确认提现'" :visible="visible" width="600px" append-to-body @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="110px">
      <el-form-item label="支付密码" prop="password">
        <el-input v-model="form.password" class="width90" placeholder="请输入支付密码" type="password" clearable />
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { transferApply } from '@/api/wallet/wallet';
import { sha1 } from '@/utils/sha1';

export default {
  props: {
    open: Boolean,
    info: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        password: [
          { required: true, trigger: 'blur', message: '支付密码不能为空' }
          // { validator: this.formValidate.passWord, trigger: 'blur' }
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
          const params = { ...this.info };
          params.password = sha1(this.form.password);
          transferApply(params).then(response => {
            this.msgSuccess('操作成功');
            this.cancel();
            this.$emit('refresh');
          });
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
.width90{
  width: 90%;
}
</style>
