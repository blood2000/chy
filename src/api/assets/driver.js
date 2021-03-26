import request from '@/utils/request';

// 查询司机列表
export function listDriver(query) {
  return request({
    url: '/assets/driver/list',
    method: 'post',
    data: query
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
