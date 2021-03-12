import request from '@/utils/request';

// 查询司机列表
export function listDriver(query) {
  return request({
    url: '/assets/driver/list',
    method: 'get',
    params: query
  });
}

// 查询司机详细
export function getDriver(driverId) {
  return request({
    url: '/assets/driver/' + driverId,
    method: 'get'
  });
}

// 新增司机
export function addDriver(data) {
  return request({
    url: '/assets/driver',
    method: 'post',
    data: data
  });
}

// 修改司机
export function updateDriver(data) {
  return request({
    url: '/assets/driver',
    method: 'put',
    data: data
  });
}

// 删除司机
export function delDriver(userIds) {
  return request({
    url: '/assets/driver/' + userIds,
    method: 'delete'
  });
}
