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
export function getRules(code) {
  return request({
    url: `${code}`,
    method: 'get'
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

// 获取增减费用项目
export function getRuleItemList(query) {
  return request({
    url: `/transportation/ruleItem/list`,
    method: 'get',
    params: query
  });
}
