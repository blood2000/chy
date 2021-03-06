import request from '@/utils/request';

// 列表
export function listDevice(data) {
  return request({
    url: '/assets/vehicle/device/list',
    method: 'post',
    data: Object.assign({}, { isAsc: 'desc', orderByColumn: 'create_time' }, data)
  });
}

// 新增
export function addDevice(data) {
  return request({
    url: '/assets/vehicle/device',
    method: 'post',
    data: data
  });
}

// 修改
export function updateDevice(data) {
  return request({
    url: '/assets/vehicle/device',
    method: 'put',
    data: data
  });
}

// 删除
export function delDevice(codes) {
  return request({
    url: '/assets/vehicle/device/del/' + codes,
    method: 'delete'
  });
}

export function getDevice(code) {
  return request({
    url: '/assets/vehicle/device/get/' + code,
    method: 'get'
  });
}

export function listAll(data) {
  return request({
    url: '/assets/device/info/listAll',
    method: 'post',
    data: Object.assign({}, { isAsc: 'desc', orderByColumn: 'create_time' }, data)
  });
}
