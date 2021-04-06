import request from '@/utils/request';

// 查询列表
export function listProduce(query) {
  return request({
    url: '/system/produce/list',
    method: 'get',
    params: query
  });
}
// 查询分页列表
export function list(data) {
  return request({
    url: '/system/produce/list',
    method: 'post',
    data: data
  });
}
// 查询岗位详细
export function getProduce(produceId) {
  return request({
    url: '/system/produce/' + produceId,
    method: 'get'
  });
}
// 新增产品
export function addProduce(data) {
  return request({
    url: '/system/produce',
    method: 'post',
    data: data
  });
}
// 修改产品
export function updateProduce(data) {
  return request({
    url: '/system/produce',
    method: 'put',
    data: data
  });
}
// 删除
export function delProduce(produceId) {
  return request({
    url: '/system/produce/' + produceId,
    method: 'delete'
  });
}
// 状态修改
export function changeStatus(produceCode, delFlag) {
  const data = {
    produceCode,
    delFlag
  };
  return request({
    url: '/system/produce/changeStatus',
    method: 'put',
    data: data
  });
}
