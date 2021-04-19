import request from '@/utils/request';

// 查询车辆列表
export const listVehicleApi = '/assets/vehicle/list';
export function listInfo(data) {
  return request({
    url: listVehicleApi,
    method: 'get',
    params: Object.assign({}, { isAsc: 'desc', orderByColumn: 'create_time' }, data)
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

// 查询车辆归属调度列表
export function listVehicleBelongTeam(vehicleCode) {
  return request({
    url: `/assets/vehicle/teamList?vehicleCode=${vehicleCode}`,
    method: 'post'
  });
}

// 查询车辆归属司机列表
export function listVehicleBelongDriver(vehicleCode) {
  return request({
    url: `/assets/vehicle/driverList?vehicleCode=${vehicleCode}`,
    method: 'post'
  });
}

// 已读
export function authRead(data) {
  return request({
    url: '/assets/vehicle/authRead',
    method: 'post',
    data: data
  });
}

// 审核
export function examine(data) {
  return request({
    url: '/assets/vehicle/examine',
    method: 'post',
    data: data
  });
}
