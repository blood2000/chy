import request from '@/utils/request';

// 查询常用地址列表
export function listAddress(query) {
  return request({
    url: 'system/config/list',
    method: 'get',
    params: query
  });
}

// 查询常用地址详细
export function getAddress(code) {
  return request({
    url: '/enterprise/company/address/' + code,
    method: 'get'
  });
}

// 新增常用地址
export function addAddress(data) {
  return request({
    url: '/enterprise/company/address',
    method: 'post',
    data: data
  });
}

// 修改常用地址
export function updateAddress(data) {
  return request({
    url: '/enterprise/company/address',
    method: 'put',
    data: data
  });
}

// 删除常用地址
export function delAddress(code) {
  return request({
    url: '/enterprise/company/address/' + code,
    method: 'delete'
  });
}
