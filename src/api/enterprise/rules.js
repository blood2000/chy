import request from '@/utils/request';

// 查询规则列表
export function listRules(query) {
  return request({
    url: '/transportation/shipmentRule/list',
    method: 'get',
    params: query
  });
}

// 查询规则详细
export function getRules(code) {
  return request({
    url: `/transportation/shipmentRule/getById/${code}`,
    method: 'get'
  });
}

// 新增规则
export function addRules(data) {
  return request({
    url: '/assets/balanceRule/add',
    method: 'post',
    data: data
  });
}

// 修改规则
export function updateRules(data) {
  return request({
    url: '/assets/balanceRule/edit',
    method: 'post',
    data: data
  });
}

// 删除规则
export function delRules(ids) {
  return request({
    url: `/assets/balanceRule/${ids}`,
    method: 'delete'
  });
}

// 根据货主获取列表
export function getListRules(query) {
  return request({
    url: '/transportation/ruleInfoShipment/curlist',
    method: 'get',
    params: query
  });
}
// 根据CODE获取规则详情
export function getRuleItem(query) {
  return request({
    url: '/transportation/ruleInfoShipment/detail',
    method: 'get',
    params: query
  });
}
