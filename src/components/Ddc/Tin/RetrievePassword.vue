<template>
  <div class="rp_box login-mform p26">
    <!-- 找回密码 -->
    <el-form v-show="active === '0'" ref="rpform" :model="rpform" :rules="rpRules">
      <h2 class="rp_box-h2_t">找回密码</h2>
      <el-form-item prop="telno">
        <el-input v-model="rpform.telno" type="text" auto-complete="off" placeholder="手机号码">
          <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item
        prop="captcha"
        :rules="[
          { required: true, message: '验证码不能为空', trigger: 'blur' },
        ]"
      >
        <el-input
          v-model="rpform.captcha"
          auto-complete="off"
          placeholder="输入验证码"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />

          <span v-show="Verification" slot="suffix" class="shou sen_btn" style="marginRight:10px;color:rgba(80, 148, 252, 1);" @click.stop="send">发送验证码</span>
          <span v-show="!Verification" slot="suffix" style="marginRight:10px;"><span>{{ timer }}</span>秒后重新获取</span>
        </el-input>
      </el-form-item>

      <el-form-item style="width:100%;">
        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width:100%;"
          @click.native.prevent="handleLogin"
        >
          <span>下一步</span>

        </el-button>
      </el-form-item>

      <div class="rp_box-return">
        <span class="shou" style="color: rgba(255, 255, 255, .6);" @click="$emit('returnLogin')">返回登录</span>
      </div>
    </el-form>

    <!-- 设置新密码 -->
    <el-form v-show="active === '1'" ref="setForm" :model="setForm" :rules="setRules">
      <h2 class="rp_box-h2_t">设置新密码</h2>
      <el-form-item prop="newPwd">
        <el-input
          v-model="setForm.newPwd"
          type="password"
          maxlength="16"
          minlength="8"
          auto-complete="off"
          placeholder="请设置8-16位新位密码"
        />
      </el-form-item>

      <el-form-item prop="newPwd2">
        <el-input
          v-model="setForm.newPwd2"
          type="password"
          auto-complete="off"
          placeholder="确认密码"
          @keyup.enter.native="handleLogin2"
        />
      </el-form-item>

      <el-form-item style="width:100%;">
        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width:100%;"
          @click.native.prevent="handleLogin2"
        >
          <span v-if="!loading">完成设置</span>
          <span v-else>设 置 中...</span>
        </el-button>
      </el-form-item>

      <div class="rp_box-return">
        <span class="shou" style="color: rgba(255, 255, 255, .6);" @click="$emit('returnLogin')">返回登录</span>
      </div>
    </el-form>
  </div>
</template>

<script>
import { send_sms } from '@/api/login';

export default {
  name: 'RetrievePassword',
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.setForm.newPwd2 !== '') {
          this.$refs.setForm.validateField('newPwd2');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.setForm.newPwd) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      active: '0',

      loading: false,

      Verification: true,
      timer: 60,
      rpform: {
        telno: '',
        captcha: ''
      },
      rpRules: {
        telno: [{ required: true, trigger: 'blur', message: '手机号不能为空' }, { validator: this.formValidate.telphone, trigger: 'blur' }]
      },

      setForm: {
        newPwd: '',
        newPwd2: ''
      },
      setRules: {
        newPwd: [{ validator: validatePass, trigger: 'blur' }],
        newPwd2: [{ validator: validatePass2, trigger: 'blur' }]
      }
    };
  },

  methods: {
    // 下一步
    handleLogin() {
      this.$refs.rpform.validate(valid => {
        if (valid) {
          if (this.Verification) {
            this.msgError('请重新获取验证码~!');
            return;
          }

          this.loading = true;
          const req = {
            telno: this.rpform.telno,
            captcha: this.rpform.captcha,
            type: 'reset'
          };

          this.$store.dispatch('checkCaptcha', req).then(() => {
            this.active = '1';
            this.Verification = true;
            this.timer = 60;
            this.loading = false;
          }).catch(() => {
            this.loading = false;
          });
        }
      });
    },

    handleLogin2() {
      this.$refs.setForm.validate(valid => {
        if (valid) {
          this.loading = true;
          const req = {
            newPwd: this.setForm.newPwd,
            captcha: this.rpform.captcha,
            telno: this.rpform.telno
          };

          this.$store.dispatch('RetrievePassword', req).then(() => {
            // 设置成功 返回登录页
            this.msgSuccess('密码重置成功!');
            this.loading = false;
            let itme = setTimeout(() => {
              this.$emit('returnLogin');
              clearTimeout(itme);
              itme = null;
            }, 1000);
          }).catch(() => {
            this.loading = false;
          });
        }
      });
    },

    send() {
      this.$refs.rpform.validateField('telno', (err) => {
        if (!err) {
          send_sms(this.rpform.telno, 'reset').then(res => {
            if (res.code === 200) {
              this.msgSuccess('验证码发送成功!');
              this._countdown();
            }
          });
        }
      });
    },

    /* 倒计时 */
    _countdown() {
      this.Verification = false; // 点击button改变v-show的状态
      let auth_timer = setInterval(() => { // 定时器设置每秒递减
        this.timer--; // 递减时间
        if (this.timer <= 0) {
          this.Verification = true; // 60s时间结束还原v-show状态并清除定时器
          this.timer = 60;
          clearInterval(auth_timer);
          auth_timer = null;
        }
      }, 1000);
    }
  }


};
</script>

<style lang="scss" scoped>
.rp_box{
    &-h2_t{
        height: 28px;
        font-size: 20px;
        font-weight: bold;
        line-height: 28px;
        color: #FFFFFF;
        margin: 36px 0 38px;
    }
    &-return{
        text-align: right;
    }
}
</style>
