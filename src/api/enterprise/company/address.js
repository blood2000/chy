import request from '@/utils/request';

// 查询常用地址列表
export function listAddress(query) {
  return request({
    url: '/assets/shipment/address/list',
    method: 'get',
    params: query
  });
}

// 查询常用地址详细
export function getAddress(id) {
  return request({
    url: '/assets/shipment/address/' + id,
    method: 'get'
  });
}

// 新增常用地址
export function addAddress(data) {
  return request({
    url: '/assets/shipment/address',
    method: 'post',
    data: data
  });
}

// 修改常用地址
export function updateAddress(data) {
  return request({
    url: '/assets/shipment/address',
    method: 'put',
    data: data
  });
}

// 删除常用地址
export function delAddress(ids) {
  return request({
    url: '/assets/shipment/address/' + ids,
    method: 'delete'
  });
}
