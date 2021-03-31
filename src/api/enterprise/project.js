import request from '@/utils/request';

// 查询项目列表
export const listInfoApi = '/assets/shipment/project/list';
export function listInfo(data) {
  return request({
    url: '/assets/shipment/project/list',
    method: 'post',
    data: data
  });
}

// 查询项目详细
export function getInfo(id) {
  return request({
    url: '/assets/shipment/project/' + id,
    method: 'get'
  });
}

// 新增项目
export function addInfo(data) {
  return request({
    url: '/assets/shipment/project',
    method: 'post',
    data: data
  });
}

// 修改项目
export function updateInfo(data) {
  return request({
    url: '/assets/shipment/project',
    method: 'put',
    data: data
  });
}

// 删除项目
export function delInfo(id) {
  return request({
    url: '/assets/shipment/project/' + id,
    method: 'delete'
  });
}
