import { login, logout, getInfo, refreshToken, sms_login, pwd_login, updatePwdByCaptcha, check_captcha } from '@/api/login';
import { getToken, setToken, setExpiresIn, removeToken, setUserInfo, removeUserInfo } from '@/utils/auth';

const user = {
  state: {
    token: getToken(),
    name: '',
    nickName: '',
    roleName: '',
    avatar: '',
    roles: [],
    permissions: [],
    isAdmin: false, // 是否是管理员
    isShipment: false, // 是否是货主
    isDriver: false, // 是否是司机
    isDispatcher: false, // 是否是调度者
    shipment: [], // 货主信息
    defaultRoleCode: '',
    branch: [] // 网点
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_EXPIRES_IN: (state, time) => {
      state.expires_in = time;
    },
    SET_NAME: (state, name) => {
      state.name = name;
    },
    SET_NICK_NAME: (state, nickName) => {
      state.nickName = nickName;
    },
    SET_ROLE_NAME: (state, roleName) => {
      state.roleName = roleName;
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar;
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions;
    },
    SET_IS_ADMIN: (state, isAdmin) => {
      state.isAdmin = isAdmin;
    },
    SET_DEFAULT_ROLE_CODE: (state, defaultRoleCode) => {
      state.defaultRoleCode = defaultRoleCode;
    },
    SET_IS_SHIPMENT: (state, isShipment) => {
      state.isShipment = isShipment;
    },
    SET_IS_DRIVER: (state, isDriver) => {
      state.isDriver = isDriver;
    },
    SET_IS_DISPATCHER: (state, isDispatcher) => {
      state.isDispatcher = isDispatcher;
    },
    SET_SHIPMENT: (state, shipment) => {
      state.shipment = shipment;
    },
    SET_BRANCH: (state, branch) => {
      state.branch = branch;
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim();
      const password = userInfo.password;
      const code = userInfo.code;
      const uuid = userInfo.uuid;
      return new Promise((resolve, reject) => {
        login(username, btoa(password), code, uuid).then(res => {
          const data = res.data;
          setToken(data.access_token);
          commit('SET_TOKEN', data.access_token);
          setExpiresIn(data.expires_in);
          commit('SET_EXPIRES_IN', data.expires_in);
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },
    // 登录
    Login2({ commit }, userInfo) {
      const telno = userInfo.telno.trim();
      const captcha = userInfo.captcha.trim();

      return new Promise((resolve, reject) => {
        sms_login(telno, captcha).then(res => {
          const data = res.data;
          setToken(data.access_token);
          commit('SET_TOKEN', data.access_token);
          setExpiresIn(data.expires_in);
          commit('SET_EXPIRES_IN', data.expires_in);
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },
    // 登录
    Login3({ commit }, userInfo) {
      const telno = userInfo.telno.trim();
      const password = userInfo.password.trim();

      return new Promise((resolve, reject) => {
        pwd_login(telno, btoa(password)).then(res => {
          const data = res.data;
          setToken(data.access_token);
          commit('SET_TOKEN', data.access_token);
          setExpiresIn(data.expires_in);
          commit('SET_EXPIRES_IN', data.expires_in);
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 修改密码
    RetrievePassword({ commit }, userInfo) {
      const newPwd = userInfo.newPwd.trim();
      const captcha = userInfo.captcha.trim();
      const telno = userInfo.telno.trim();

      return new Promise((resolve, reject) => {
        updatePwdByCaptcha(telno, captcha, btoa(newPwd)).then(res => {
          // const data = res.data;
          // setToken(data.access_token);
          // commit('SET_TOKEN', data.access_token);
          // setExpiresIn(data.expires_in);
          // commit('SET_EXPIRES_IN', data.expires_in);
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 校验验证码是否有效
    checkCaptcha({ commit }, userInfo) {
      const telno = userInfo.telno.trim();
      const captcha = userInfo.captcha.trim();
      const type = userInfo.type.trim();

      return new Promise((resolve, reject) => {
        check_captcha(telno, captcha, type).then(res => {
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },



    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(res => {
          const user = res.user;
          const avatar = user.avatar === '' ? require('@/assets/images/profile.jpg') : user.avatar;
          if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', res.roles);
            commit('SET_PERMISSIONS', res.permissions);
          } else {
            commit('SET_ROLES', ['ROLE_DEFAULT']);
          }
          commit('SET_NAME', user.userName);
          commit('SET_NICK_NAME', user.nickName);
          if (user.roles && user.roles.length > 0) {
            commit('SET_ROLE_NAME', user.roles[0].roleName);
          } else {
            commit('SET_ROLE_NAME', '');
          }
          commit('SET_AVATAR', avatar);
          console.log(user.branch);
          if (user.branch) { // 网点
            commit('SET_BRANCH', user.branch);
          }
          // 保存一下用户信息
          setUserInfo({
            isAdmin: res.isAdmin,
            isShipment: res.isShipment,
            shipment: res.shipment,
            user: res.user
          });

          commit('SET_IS_ADMIN', res.isAdmin);
          commit('SET_IS_SHIPMENT', res.isShipment);
          commit('SET_IS_DRIVER', res.isDriver);
          commit('SET_IS_DISPATCHER', res.isDispatcher);
          commit('SET_SHIPMENT', res.shipment);
          commit('SET_DEFAULT_ROLE_CODE', res.defaultRoleCode);
          resolve(res);
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 刷新token
    RefreshToken({ commit, state }) {
      return new Promise((resolve, reject) => {
        refreshToken(state.token).then(res => {
          setExpiresIn(res.data);
          commit('SET_EXPIRES_IN', res.data);
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 退出系统
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '');
          commit('SET_ROLES', []);
          commit('SET_PERMISSIONS', []);
          removeToken();
          removeUserInfo();
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '');
        removeToken();
        resolve();
      });
    }
  }
};

export default user;
