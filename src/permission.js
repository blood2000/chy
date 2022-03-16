import router from './router';
import store from './store';
import { Message, MessageBox } from 'element-ui';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { getToken, setToken } from '@/utils/auth';

NProgress.configure({ showSpinner: false });

const whiteList = ['/login', '/auth-redirect', '/bind', '/register'];

function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');
    if (pair[0] === variable) { return pair[1]; }
  }
  return (false);
}

const token = getQueryVariable('token');
if (token) {
  setToken(decodeURI(token));
}

router.beforeEach((to, from, next) => {
  NProgress.start();
  if (getToken()) {
    /* 满足条件, 在登录页面处理东西 */
    if (to.query.idp && to.path === '/login' && store.getters.isDefaultPassword) {
      next();
      NProgress.done();
      return;
    }

    /* has token*/
    if (to.path === '/login') {
      next({ path: '/' });
      NProgress.done();
    } else {
      /* 针对是否初始密码进行处理 */
      if (!to.query.idp && store.getters.isDefaultPassword) {
        MessageBox.confirm('初始密码不安全, 请修改密码，或者退出登录', '系统提示', {
          confirmButtonText: '修改密码',
          cancelButtonText: '退出登录',
          type: 'warning',
          closeOnClickModal: false,
          closeOnPressEscape: false
        }
        ).then(() => {
          next(`/login?redirect=${to.fullPath}&idp=true&t=${Date.now()}`);
        }).catch(() => {
          store.dispatch('LogOut').then(() => {
            location.href = '/index';
          });
        });
        // store.dispatch('LogOut').then(() => {
        //   Message.error({
        //     message: '初始密码不安全, 请重新登陆并修改密码',
        //     duration: 5000
        //   });
        //   next(`/login?redirect=${to.fullPath}&idp=true`);
        // });
      } else

      if (store.getters.roles.length === 0) {
        // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetInfo').then(res => {
          // 拉取user_info
          const roles = res.roles;
          store.dispatch('GenerateRoutes', { roles }).then(accessRoutes => {
            // 根据roles权限生成可访问的路由表
            router.addRoutes(accessRoutes); // 动态添加可访问路由表
            next({ ...to, replace: true }); // hack方法 确保addRoutes已完成
          });
        }).catch(err => {
          store.dispatch('LogOut').then(() => {
            Message.error(err);
            next({ path: '/' });
          });
        });
      } else {
        next();
      }
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next();
    } else {
      next(`/login?redirect=${to.fullPath}`); // 否则全部重定向到登录页
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});
