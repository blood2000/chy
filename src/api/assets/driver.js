import request from '@/utils/request';
import { praseStrEmpty } from '@/utils/ddc';
// 查询司机列表
export const listDriverApi = '/assets/driver/list';
export function listDriver(data) {
  return request({
    url: listDriverApi,
    method: 'post',
    data: Object.assign({}, { isAsc: 'desc', orderByColumn: 'create_time' }, data)
  });
}

// 查询司机详细
export function getDriver(id) {
  return request({
    url: '/assets/driver/' + id,
    method: 'get'
  });
}

// 新增司机
export function addDriver(data) {
  return request({
    url: '/assets/driver',
    method: 'post',
    data: data
  });
}

// 修改司机
export function updateDriver(data) {
  return request({
    url: '/assets/driver',
    method: 'put',
    data: data
  });
}

// 删除司机
export function delDriver(userIds) {
  return request({
    url: '/assets/driver/' + userIds,
    method: 'delete'
  });
}

// 已读
export function authRead(data) {
  return request({
    url: '/assets/driver/authRead',
    method: 'post',
    data: data
  });
}

// 审核
export function examine(data) {
  return request({
    url: '/assets/driver/examine',
    method: 'post',
    data: data
  });
}

// 批量导入
export function importData(data) {
  return request({
    url: '/assets/driver/importData',
    method: 'post',
    data: data
  });
}

// 下载协议号
export function getAgreementWord(query) {
  return request({
    url: '/assets/driver/agreement/getAgreementWord',
    method: 'get',
    params: query
  });
}

// 申请加入调度者
export function applyJoinTeam(data) {
  return request({
    url: '/assets/apply/join',
    method: 'post',
    data: data
  });
}

// 获取司机要处理的邀请列表
export function listApply(driverCode) {
  return request({
    url: `/assets/apply/driver/` + praseStrEmpty(driverCode),
    method: 'post'
  });
}

// 处理邀请
export function dealApply(data) {
  return request({
    url: `/assets/apply/invitation/deal`,
    method: 'put',
    data: data
  });
}

// 查询司机归属调度列表
export function listDriverBelongTeam(driverCode) {
  return request({
    url: `/assets/driver/teamList?driverCode=${driverCode}`,
    method: 'post'
  });
}

// 邀请司机列表
export function applyDriverList(data) {
  return request({
    url: '/assets/driver/applyDriverList',
    method: 'post',
    data: data
  });
}

// 重新激活
export function reRegistered(query) {
  return request({
    url: '/analysis/mybank/dark/reRegistered',
    method: 'get',
    params: query
  });
}

// 创建网商账号
export function createWallet(data) {
  return request({
    url: '/assets/driver/createWallet',
    method: 'post',
    data: data
  });
}
