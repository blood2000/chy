<template>
  <div class="login pr">
    <img class="m_log pa" src="../assets/images/login/chy-log.png" alt="chy-log">

    <!-- 注册界面 -->
    <div v-if="isRpPage" class="login_box pa">
      <RetrievePassword @returnLogin="isRpPage = false" />
    </div>

    <!-- 登录界面 -->
    <div v-else class="login_box pa">

      <ul class="login-tab">
        <li :class="{'active': active==='0'}" @click="active = '0'">账号登录</li>
        <li :class="{'active': active==='1'}" @click="active = '1'">短信登录</li>
        <li :class="{'active': active==='3'}" @click="active = '3'">密码登录</li>
      </ul>

      <div class="p26">
        <h2 class="login-h2_t">WELCOME</h2>
        <div class="login-h6_t">您好，欢迎登录</div>

        <div class="login-box">
          <div v-if="false" class="login-msg">
            <i class="el-icon-warning" style="color:#faad14; margin:0 8px 0 16px" />
            非企业账户不能登录
          </div>
          <!-- <div v-if="false" class="login-errmsg">
            <i class="el-icon-remove" style="color:rgba(246, 89, 57, 1); margin:0 8px 0 16px" />
            账号或密码错误，请重新输入
          </div> -->
        </div>

        <div class="login-mform">
          <!-- 平台正常登录 -->
          <el-form v-show="active==='0'" ref="loginForm" :model="loginForm" :rules="loginRules">

            <el-form-item prop="username">
              <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="账号">
                <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="loginForm.password"
                type="password"
                auto-complete="off"
                placeholder="密码"
                @keyup.enter.native="handleLogin"
              >
                <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
              </el-input>
            </el-form-item>
            <el-form-item prop="code">
              <el-input
                v-model="loginForm.code"
                auto-complete="off"
                placeholder="验证码"
                style="width: 63%"
                @keyup.enter.native="handleLogin"
              >
                <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />
              </el-input>
              <div class="login-code">
                <img :src="codeUrl" class="login-code-img" @click="getCode">
              </div>
            </el-form-item>
            <el-form-item style="width:100%;">
              <el-button
                :loading="loading"
                size="medium"
                type="primary"
                style="width:100%;"
                @click.native.prevent="handleLogin"
              >
                <span v-if="!loading">立即登录</span>
                <span v-else>登 录 中...</span>
              </el-button>
            </el-form-item>
          </el-form>

          <!-- 短信登录 -->
          <el-form v-show="active==='1'" ref="loginForm2" :model="loginForm2" :rules="loginRules2">

            <el-form-item prop="telno">
              <el-input v-model="loginForm2.telno" type="text" auto-complete="off" placeholder="手机号码">
                <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
              </el-input>
            </el-form-item>
            <el-form-item
              prop="captcha"
              :rules="[
                { required: true, message: '验证码不能为空', trigger: 'blur' },
              ]"
            >
              <!-- type="number" -->
              <el-input
                v-model="loginForm2.captcha"
                auto-complete="off"
                placeholder="输入验证码"
                @keyup.enter.native="handleLogin2"
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
                @click.native.prevent="handleLogin2"
              >
                <span v-if="!loading">立即登录</span>
                <span v-else>登 录 中...</span>
              </el-button>
            </el-form-item>
          </el-form>

          <!-- 密码登录 -->
          <el-form v-show="active==='3'" ref="loginForm3" :model="loginForm3" :rules="loginRules3">

            <el-form-item prop="telno">
              <el-input v-model="loginForm3.telno" type="text" auto-complete="off" placeholder="手机号码">
                <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
              </el-input>
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                v-model="loginForm3.password"
                type="password"
                auto-complete="off"
                placeholder="密码"
                @keyup.enter.native="handleLogin3"
              >
                <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
              </el-input>
            </el-form-item>

            <el-form-item style="width:100%;">
              <el-button
                :loading="loading"
                size="medium"
                type="primary"
                style="width:100%;"
                @click.native.prevent="handleLogin3"
              >
                <span v-if="!loading">立即登录</span>
                <span v-else>登 录 中...</span>
              </el-button>
            </el-form-item>
          </el-form>

          <div class="ly-flex-pack-justify">
            <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;color:rgba(255, 255, 255, .6);">记住密码</el-checkbox>
            <div style="width:50%;" class="ly-t-right login-mform-btn">
              <!-- <span class="shou">注册</span>
              <span class="login-mform-btn-s">|</span> -->
              <span class="shou" @click="isRpPage = true">忘记密码</span>
            </div>
          </div>

        </div>

      </div>

    </div>

    <el-form v-if="false" ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
      <h3 class="title">综合服务管理平台</h3>
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="账号">
          <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input
          v-model="loginForm.code"
          auto-complete="off"
          placeholder="验证码"
          style="width: 63%"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" class="login-code-img" @click="getCode">
        </div>
      </el-form-item>
      <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox>
      <el-form-item style="width:100%;">
        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width:100%;"
          @click.native.prevent="handleLogin"
        >
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </el-form-item>
    </el-form>
    <!--  底部  -->
    <div class="el-login-footer">
      <span>Copyright © 2021-2023 ddc.vip All Rights Reserved.</span>
    </div>


    <video autoplay muted loop>
      <source src="../assets/images/mp4/【2048】202104271143janv2_2021429115831.mp4" type="video/mp4">
    </video>
  </div>
</template>

<script>
import { getCodeImg, send_sms } from '@/api/login';
import Cookies from 'js-cookie';
import { encrypt, decrypt } from '@/utils/jsencrypt';

import RetrievePassword from '@/components/Ddc/Tin/RetrievePassword';

export default {
  name: 'Login',
  components: { RetrievePassword },
  data() {
    return {
      isRpPage: false,
      Verification: true, // 通过v-show控制显示获取还是倒计时
      timer: 60, // 定义初始时间为60s
      active: '0',
      codeUrl: '',
      cookiePassword: '',
      loginForm: {
        username: 'admin',
        password: 'admin123',
        rememberMe: false,
        code: '',
        uuid: ''
      },
      loginForm2: {
        telno: '',
        captcha: ''
      },
      loginForm3: {
        telno: '',
        password: ''
      },


      loginRules: {
        username: [
          { required: true, trigger: 'blur', message: '用户名不能为空' }
        ],
        password: [
          { required: true, trigger: 'blur', message: '密码不能为空' }
        ],
        code: [{ required: true, trigger: 'change', message: '验证码不能为空' }]
      },

      loginRules2: {
        telno: [{ required: true, trigger: 'blur', message: '手机号不能为空' }, { validator: this.formValidate.telphone, trigger: 'blur' }]
      },

      loginRules3: {
        telno: [{ required: true, trigger: 'blur', message: '手机号不能为空' }, { validator: this.formValidate.telphone, trigger: 'blur' }],
        password: [{ required: true, trigger: 'blur', message: '密码不能为空' }]
      },
      loading: false,
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created() {
    this.getCode();
    this.getCookie();
  },
  methods: {
    getCode() {
      getCodeImg().then(res => {
        this.codeUrl = 'data:image/gif;base64,' + res.img;
        this.loginForm.uuid = res.uuid;
      });
    },
    getCookie() {
      const username = Cookies.get('username');
      const password = Cookies.get('password');
      const rememberMe = Cookies.get('rememberMe');

      const telno = Cookies.get('telno');

      const telno3 = Cookies.get('telno3');
      const password3 = Cookies.get('password3');

      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
      };

      this.loginForm2.telno = telno === undefined ? this.loginForm2.telno : telno;

      this.loginForm3 = {
        telno: telno3 === undefined ? this.loginForm3.telno : telno3,
        password: password3 === undefined ? this.loginForm3.password : decrypt(password3)
      };
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.loginForm.rememberMe) {
            Cookies.set('username', this.loginForm.username, { expires: 30 });
            Cookies.set('password', encrypt(this.loginForm.password), { expires: 30 });
            Cookies.set('rememberMe', this.loginForm.rememberMe, { expires: 30 });
          } else {
            this._remove();
          }

          this.$store.dispatch('Login', this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || '/' }).catch(() => {});
          }).catch(() => {
            this.loading = false;
            this.getCode();
          });
        }
      });
    },

    /* 短信登录 */
    handleLogin2() {
      this.$refs.loginForm2.validate(valid => {
        if (valid) {
          if (this.Verification) {
            this.msgError('请重新获取验证码~!');
            return;
          }

          this.loading = true;
          if (this.loginForm.rememberMe) {
            Cookies.set('telno', this.loginForm2.telno, { expires: 30 });
            Cookies.set('rememberMe', this.loginForm.rememberMe, { expires: 30 });
          } else {
            this._remove();
          }

          this.$store.dispatch('Login2', this.loginForm2).then(() => {
            this.$router.push({ path: this.redirect || '/' }).catch(() => {});
          }).catch(() => {
            this.loading = false;
          });
        }
      });
    },

    /* 密码登录 */
    handleLogin3() {
      this.$refs.loginForm3.validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.loginForm.rememberMe) {
            Cookies.set('telno3', this.loginForm3.telno, { expires: 30 });
            Cookies.set('password3', encrypt(this.loginForm3.password), { expires: 30 });
            Cookies.set('rememberMe', this.loginForm.rememberMe, { expires: 30 });
          } else {
            this._remove();
          }

          this.$store.dispatch('Login3', this.loginForm3).then(() => {
            this.$router.push({ path: this.redirect || '/' }).catch(() => {});
          }).catch(() => {
            this.loading = false;
          });
        }
      });
    },

    /* 发送验证码 */
    send() {
      this.$refs.loginForm2.validateField('telno', (err) => {
        if (!err) {
          send_sms(this.loginForm2.telno, 'login').then(res => {
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
    },

    /* 移除所有cooki */
    _remove() {
      const keys = ['username', 'password', 'rememberMe', 'telno', 'telno3', 'password3'];

      keys.forEach(e => {
        Cookies.remove(e);
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.login {
  display: flex;
  // justify-content: center;
  justify-content: flex-end;
  align-items: center;
  height: 100%;
  // background-image: url("../assets/images/login-background.jpg");
  background-size: cover;
  font-family: PingFang SC;

  video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: -1;
  }

  .p26{
    padding:0 26px;
  }

  .m_log{
    width: 182px;
    top: 6.2vh;
    left: 4.1vw;
  }
  .login_box{
    width: 376px;
    height: 490px;
    margin-right: 15vw;
    border-radius: 5px;
    background: rgba(37, 37, 37, .5);
  }
  &-tab{
    display: flex;
    border-bottom: 1px solid #3A3A3A;
    height: 70px;
    margin: 0 24px 0 16px;
    letter-spacing: 1px;
    li{
      font-size: 14px;
      line-height: 20px;
      color: #FFFFFF;
      cursor: pointer;
      // letter-spacing: 60px;
      opacity: 0.6;
      padding: 30px 20px 10px;
      margin-right: 2px;
      transition: all .5s;
    }
    li.active{
      font-size: 16px;
      font-weight: bold;
      color: #FFFFFF;
      opacity: 1;
      position: relative;
      &::after{
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        width: 55%;
        height: 2px;
        background: #FFFFFF;
        opacity: 1;
        border-radius: 2px;
      }
    }
  }
  &-h2_t{
    width: 167px;
    height: 45px;
    font-size: 32px;
    font-weight: bold;
    line-height: 45px;
    color: #FFFFFF;
    opacity: 1;

    margin-top: 33px;
  }
  &-h6_t{
    width: 88px;
    height: 17px;
    font-size: 12px;
    font-weight: 500;
    line-height: 17px;
    color: #FFFFFF;
    opacity: 1;
  }
  &-box{
    width: 100%;
    height: 36px;
    border-radius: 4px;
    margin: 5px 0;
    line-height: 36px;
  }
  &-msg{
    background: #FFFBE6;
    border: 1px solid #FAAD14;
    color: #282828;
    border-radius: 4px;
  }
  &-errmsg{
    background: #FCD5D5;
    border: 1px solid #F65939;
    color: #282828;
    border-radius: 4px;
  }
  &-mform{
    .el-input__inner {
      -moz-appearance: none;
      border: 1px solid #444444;
      color: #fff;
      background: rgba(37, 37, 37, .7);
      outline: 0;
      &:focus{
        box-shadow: 0px 3px 8px rgba(255, 255, 255, 0.18);
      }
    }
    .el-button--primary{
      background-color: #fff;
      border-color: transparent;
      color: #000000;
      font-weight: bold;
    }
    input::-webkit-outer-spin-button,input::-webkit-inner-spin-button{
      -webkit-appearance: none;
    }


    &-btn{
      color: #FFFFFF;
      opacity: 0.6;
      &-s{
        margin: 0 13px;
      }
    }

  }
  .shou{
    cursor: pointer;
  }
  .sen_btn{
    display: inline-block;
    height: 100%;
  }
}
.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;
  .el-input {
    height: 38px;
    input {
      height: 38px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.login-code-img {
  height: 38px;
}
</style>
