<template>
  <el-dialog title="货主/企业认证" :visible="visible" width="800px" append-to-body @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="160px">
      <el-form-item label="网商汇款账号" prop="name">
        <el-input v-model="form.name" class="width90" clearable />
      </el-form-item>
      <el-form-item label="手机号码" prop="name">
        <el-input v-model="form.name" class="width90" clearable />
      </el-form-item>
      <el-form-item label="联系人" prop="name">
        <el-input v-model="form.name" class="width90" clearable />
      </el-form-item>
      <el-form-item label="身份证" prop="name">
        <el-input v-model="form.name" class="width90" clearable />
      </el-form-item>
      <el-form-item label="公司名称" prop="name">
        <el-input v-model="form.name" class="width90" clearable />
      </el-form-item>
      <el-form-item label="统一社会信用代码代码" prop="name">
        <el-input v-model="form.name" class="width90" clearable />
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {} from '@/api/enterprise/company/info';

export default {
  props: {
    open: Boolean
  },
  data() {
    return {
      // 表单参数
      form: {},
      // 表单校验
      rules: {}
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
  create() {

  },
  methods: {
    // 提交按钮
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.msgSuccess('修改成功');
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
      this.form = {

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
</style>
