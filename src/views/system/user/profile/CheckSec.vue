<template>
  <el-form ref="form" v-loading="loading" :model="form" :rules="rules" label-width="80px">
    <el-form-item label="密钥" prop="customerSec">
      <el-input v-model="form.customerSec" placeholder="请输入客户端生成的密钥" class="input-width" />
    </el-form-item>

    <el-form-item>
      <el-button class="submit-button" type="primary" @click="submit">确 定</el-button>
      <!-- <el-button type="danger" size="mini" @click="close">关闭</el-button> -->
    </el-form-item>
  </el-form>
</template>

<script>
// import { updateUserPwd } from '@/api/system/user';
export default {
  props: {
    customerUuid: {
      type: String,
      required: true,
      default: ''
    }
  },

  data() {
    return {
      loading: false,
      form: {
        customerSec: undefined
      },
      // 表单校验
      rules: {
        customerSec: [
          { required: true, message: '请输入客户端生成的密钥', trigger: 'blur' }
        ]
      }
    };
  },
  computed: {
    que() {
      return {
        ...this.form,
        customerUuid: this.customerUuid
      };
    }
  },

  methods: {
    submit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store.dispatch('Login4', this.que).then((res) => {
            this.$emit('loginSuccess', res);
            this.loading = false;
          }).catch(() => {
            this.loading = false;
          });
        }
      });
    }
    // close() {
    //   this.$store.dispatch('tagsView/delView', this.$route);
    //   this.$router.push({ path: '/index' });
    // }
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
