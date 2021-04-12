<template>
  <el-dialog :title="type===1?'修改支付密码':'设置新密码'" :visible="visible" width="600px" append-to-body @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item v-if="type===1" label="原密码">
        <el-input v-model="form.name" class="width90" placeholder="请输入原密码" type="password" />
      </el-form-item>
      <el-form-item label="新密码" prop="name1">
        <el-input v-model="form.name1" class="width90" placeholder="请输入新密码" type="password" />
      </el-form-item>
      <el-form-item label="确认密码" prop="name2">
        <el-input v-model="form.name2" class="width90" placeholder="请输入确认密码" type="password" />
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
    open: Boolean,
    type: {
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
        name: [
          { required: true, trigger: 'blur', message: '原密码不能为空' }
        ],
        name1: [
          { required: true, trigger: 'blur', message: '新密码不能为空' }
        ],
        name2: [
          { required: true, trigger: 'blur', message: '确认密码不能为空' }
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
.width90{
  width: 90%;
}
</style>
