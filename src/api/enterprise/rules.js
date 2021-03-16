import request from '@/utils/request';

// 查询规则列表
export function listRules(query) {
  return request({
    url: '/system/config/list',
    method: 'get',
    params: query
  });
}

// 查询规则详细
export function getRules(id) {
  return request({
    url: `/assets/shipment/cargocode/${id}`,
    method: 'get'
  });
}

// 新增规则
export function addRules(data) {
  return request({
    url: '/assets/shipment/cargocode',
    method: 'post',
    data: data
  });
}

// 修改规则
export function updateRules(data) {
  return request({
    url: '/assets/shipment/cargocode',
    method: 'put',
    data: data
  });
}

// 删除规则
export function delRules(ids) {
  return request({
    url: `/assets/shipment/cargocode/${ids}`,
    method: 'delete'
  });
}
