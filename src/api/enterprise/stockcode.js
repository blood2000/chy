import request from '@/utils/request';

// 查询货集码列表
export function listStockcode(query) {
  return request({
    url: 'system/config/list',
    method: 'get',
    params: query
  });
}

// 查询货集码详细
export function getStockcode(id) {
  return request({
    url: '/system/info/' + id,
    method: 'get'
  });
}

// 新增货集码
export function addStockcode(data) {
  return request({
    url: '/system/info',
    method: 'post',
    data: data
  });
}

// 修改货集码
export function updateStockcode(data) {
  return request({
    url: '/system/info',
    method: 'put',
    data: data
  });
}

// 删除货集码
export function delStockcode(id) {
  return request({
    url: '/system/info/' + id,
    method: 'delete'
  });
}
