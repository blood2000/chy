import request from '@/utils/request';

// 查询规则列表
export function listRules(query) {
  return request({
    url: '/assets/balanceRule/findList',
    method: 'get',
    params: query
  });
}

// 查询规则详细
export function getRules(code) {
  return request({
    url: `/assets/balanceRule/${code}`,
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
