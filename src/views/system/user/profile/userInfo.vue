<template>
  <el-form ref="form" :model="form" :rules="rules" label-width="80px">
    <el-form-item label="用户姓名" prop="nickName">
      <el-input v-model="form.nickName" class="input-width" />
    </el-form-item>
    <el-form-item label="手机号码" prop="phonenumber">
      <el-input v-model="form.phonenumber" maxlength="11" class="input-width" />
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="form.email" maxlength="50" class="input-width" />
    </el-form-item>
    <el-form-item label="性别">
      <el-radio-group v-model="form.sex">
        <el-radio label="0">男</el-radio>
        <el-radio label="1">女</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button class="submit-button" type="primary" @click="submit">保 存</el-button>
      <!-- <el-button type="danger" size="mini" @click="close">关闭</el-button> -->
    </el-form-item>
  </el-form>
</template>

<script>
import { updateUserProfile } from '@/api/system/user';

export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      form: this.user,
      // 表单校验
      rules: {
        nickName: [
          { required: true, message: '用户昵称不能为空', trigger: 'blur' }
        ],
        phonenumber: [
          { required: true, message: '手机号码不能为空', trigger: 'blur' },
          { validator: this.formValidate.telphone, trigger: 'blur' }
        ]
      }
    };
  },
  watch: {
    user(val) {
      this.form = val;
      console.log(this.form);
    }
  },
  methods: {
    submit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          updateUserProfile(this.form).then(response => {
            this.msgSuccess('修改成功');
          });
        }
      });
    },
    close() {
      this.$store.dispatch('tagsView/delView', this.$route);
      this.$router.push({ path: '/index' });
    }
  }
};
</script>

<style scoped>
.submit-button{
  height: 30px;
  padding: 7px 20px;
  border-radius: 2px;
}
.input-width{
  width: 300px;
}
</style>
