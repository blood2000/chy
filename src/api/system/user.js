import request from '@/utils/request';
import { praseStrEmpty } from '@/utils/ddc';

// 查询用户列表
export function listUser(query) {
  return request({
    url: '/system/user/list',
    method: 'get',
    params: query
  });
}

// 查询用户全部列表
export function listAllUser(data) {
  return request({
    url: '/system/user/listAll',
    method: 'post',
    data: data
  });
}

//查询用户是否货主
export function checkUser(userCode) {
  return request({
    url: '/assets/shipment/isShipment/' + praseStrEmpty(userCode),
    method: 'get',
  });
}

// 查询用户详细
export function getUser(userId, query) {
  return request({
    url: '/system/user/' + praseStrEmpty(userId),
    method: 'get',
    params: query
  });
}

// 新增用户
export function addUser(data) {
  return request({
    url: '/system/user',
    method: 'post',
    data: data
  });
}

// 修改用户
export function updateUser(data) {
  return request({
    url: '/system/user',
    method: 'put',
    data: data
  });
}

// 删除用户
export function delUser(userId) {
  return request({
    url: '/system/user/' + userId,
    method: 'delete'
  });
}

// 用户密码重置
export function resetUserPwd(userId, password) {
  const data = {
    userId,
    password
  };
  return request({
    url: '/system/user/resetPwd',
    method: 'put',
    data: data
  });
}

// 用户状态修改
export function changeUserStatus(userCode, status) {
  const data = {
    userCode,
    status
  };
  return request({
    url: '/system/user/changeStatus',
    method: 'put',
    data: data
  });
}

// 查询用户个人信息
export function getUserProfile() {
  return request({
    url: '/system/user/profile',
    method: 'get'
  });
}

// 修改用户个人信息
export function updateUserProfile(data) {
  return request({
    url: '/system/user/profile',
    method: 'put',
    data: data
  });
}

// 用户密码重置
export function updateUserPwd(oldPassword, newPassword) {
  const data = {
    oldPassword,
    newPassword
  };
  return request({
    url: '/system/user/profile/updatePwd',
    method: 'put',
    params: data
  });
}

// 用户头像上传
export function uploadAvatar(data) {
  return request({
    url: '/system/user/profile/avatar',
    method: 'post',
    data: data
  });
}

export function changeUserAvatar(data) {
  return request({
    url: '/system/user/changeUserAvatar',
    method: 'post',
    data: data
  });
}

// 解禁用用户
export function updateUserStatusByUserCode(userCode, status) {
  const data = {
    userCode,
    status
  };
  return request({
    url: '/system/user/updateUserStatusByUserCode',
    method: 'put',
    data: data
  });
}

export function getUserAlreadyExist(query) {
  return request({
    url: '/system/user/userAlreadyExist',
    method: 'get',
    params: query
  });
}

// 根据手机号搜索用户名
export function getUserByPhoneNum(phoneNum) {
  return request({
    url: '/system/user/getUserByPhoneNum/' + phoneNum,
    method: 'get'
  });
}

// // 获取用户详情
// export function getUserDetail(phoneNum) {
//   return request({
//     url: '/system/user/detail' + ,
//     method: 'get'
//   });
// }


// 根据手机号搜索用户名
export function getTeamInfoByPhone(phoneNum) {
  return request({
    url: '/assets/team/getTeamInfoByPhone/' + phoneNum,
    method: 'get'
  });
}

