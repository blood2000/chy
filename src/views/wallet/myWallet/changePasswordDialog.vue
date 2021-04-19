<template>
  <el-dialog :title="'修改支付密码'" :visible="visible" width="600px" append-to-body @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="原密码" prop="passwordBefore">
        <el-input v-model="form.passwordBefore" class="width90" placeholder="请输入原密码 ( 若第一次修改, 则原密码为平台账户密码 )" type="password" />
      </el-form-item>
      <el-form-item label="新密码" prop="password">
        <el-input v-model="form.password" class="width90" placeholder="请输入新密码" type="password" />
      </el-form-item>
      <el-form-item label="确认密码" prop="passwordAgain">
        <el-input v-model="form.passwordAgain" class="width90" placeholder="请输入确认密码" type="password" />
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { editAmountPassword } from '@/api/wallet/wallet';
import { sha1 } from '@/utils/sha1';

export default {
  props: {
    open: Boolean,
    amountId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        passwordBefore: [
          { required: true, trigger: 'blur', message: '原密码不能为空' }
        ],
        password: [
          { required: true, trigger: 'blur', message: '新密码不能为空' },
          { validator: this.formValidate.passWord, trigger: 'blur' }
        ],
        passwordAgain: [
          { required: true, trigger: 'blur', message: '确认密码不能为空' },
          { validator: (rules, value, callback) => {
            if (value !== this.form.password) callback(new Error('确认密码与新密码不一致'));
            callback();
          }, trigger: 'blur' }
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
          editAmountPassword({
            id: this.amountId,
            password: sha1(this.form.password),
            passwordBefore: sha1(this.form.passwordBefore)
          }).then(response => {
            this.msgSuccess('修改成功');
            this.close();
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
