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

// 添加车辆与司机的关系
export function addDriverCar(data) {
  return request({
    url: '/assets/vehicle/addDriverCar',
    method: 'post',
    data: data
  });
}

// 删除车辆与司机的关系
export function delDriverCar(data) {
  return request({
    url: '/assets/driver/delVehicleReDriver',
    method: 'delete',
    params: data
  });
}

// 添加车辆与调度者的关系
export function addTeamCar(data) {
  return request({
    url: '/assets/vehicle/addTeamCar',
    method: 'post',
    data: data
  });
}

// 删除车辆与调度者的关系
export function delTeamCar(data) {
  return request({
    url: '/assets/team/delTeamReVehicle',
    method: 'delete',
    params: data
  });
}

export function changeDataByLicenseNumber(code, licenseNumber) {
  const data = {
    code,
    licenseNumber
  };
  return request({
    url: `/assets/vehicle/changeDataByLicenseNumber?code=${code}&licenseNumber=${licenseNumber}`,
    method: 'post',
    data: data
  });
}

