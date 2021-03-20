import request from '@/utils/request';

// 查询规则列表
export function listRules(query) {
  return request({
    url: '/transportation/ruleInfoShipment/list',
    method: 'get',
    params: query
  });
}

// 查询规则详细
export function getRules(data) {
  return request({
    url: `/transportation/ruleInfoShipment/detail`,
    method: 'get',
    params: data
  });
}

// 新增规则
export function addRules(data) {
  return request({
    url: '/transportation/ruleInfoShipment/add',
    method: 'post',
    data: data
  });
}

// 修改规则
export function updateRules(data) {
  return request({
    url: '/transportation/ruleInfoShipment/update',
    method: 'put',
    data: data
  });
}

// 删除规则
export function delRules(data) {
  return request({
    url: `/transportation/ruleInfoShipment/delete`,
    method: 'delete',
    params: data
  });
}

// 获取核算规则细项
export function getRuleItemList(query) {
  return request({
    url: `/transportation/ruleItem/list`,
    method: 'get',
    params: query
  });
}

// 删除核算规则细项
export function delDetailRules(data) {
  return request({
    url: `/transportation/ruleDetailShipment/delete`,
    method: 'delete',
    params: data
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
