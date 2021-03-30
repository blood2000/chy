import request from '@/utils/request';

// 用户银行卡-查询列表
export function banklist(query) {
  return request({
    url: '/system/config/list',
    method: 'get',
    params: query
  });
}

// 查询详细
export function getBankDetail(id) {
  return request({
    url: '/assets/shipment/address/' + id,
    method: 'get'
  });
}

// 新增
export function addBank(data) {
  return request({
    url: '/assets/shipment/address',
    method: 'post',
    data: data
  });
}

// 修改
export function updateBank(data) {
  return request({
    url: '/assets/shipment/address',
    method: 'put',
    data: data
  });
}

// 删除
export function delBank(ids) {
  return request({
    url: '/assets/shipment/address/' + ids,
    method: 'delete'
  });
}
