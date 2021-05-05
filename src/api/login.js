import request from '@/utils/request';

// 登录方法
export function login(username, password, code, uuid) {
  return request({
    url: '/auth/login',
    method: 'post',
    data: { username, password, code, uuid }
  });
}

// 刷新方法
export function refreshToken() {
  return request({
    url: '/auth/refresh',
    method: 'post'
  });
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: '/system/user/getInfo',
    method: 'get'
  });
}

// 退出方法
export function logout() {
  return request({
    url: '/auth/logout',
    method: 'delete'
  });
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/code',
    method: 'get'
  });
}

// 发送短信
export function send_sms(telno, type) {
  return request({
    url: '/auth/send_sms',
    method: 'post',
    data: { telno, type }
  });
}

// 手机号短信登陆
export function sms_login(telno, captcha) {
  return request({
    url: '/auth/sms_login',
    method: 'post',
    data: { telno, captcha }
  });
}
