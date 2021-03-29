import request from '@/utils/request';

// 查询车辆列表
export const listVehicleApi = '/assets/vehicle/list';
export function listInfo(query) {
  return request({
    url: listVehicleApi,
    method: 'get',
    params: query
  });
}

// 查询车辆详细
export function getInfo(id) {
  return request({
    url: '/assets/vehicle/' + id,
    method: 'get'
  });
}

// 新增车辆
export function addInfo(data) {
  return request({
    url: '/assets/vehicle',
    method: 'post',
    data: data
  });
}

// 修改车辆
export function updateInfo(data) {
  return request({
    url: '/assets/vehicle',
    method: 'put',
    data: data
  });
}

// 删除车辆
export function delInfo(id) {
  return request({
    url: '/assets/vehicle/' + id,
    method: 'delete'
  });
}
