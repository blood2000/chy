import request from '@/utils/request';

// 设备类型目录树
export function getDeviceTypeTree(data) {
  return request({
    url: '/assets/device/type/catalogueTree',
    method: 'post',
    data: data
  });
}

// 设备类型列表
export function getDeviceTypeList(data) {
  return request({
    url: '/assets/device/type/list',
    method: 'post',
    data: data
  });
}

// 新增设备类型
export function addDeviceType(data) {
  return request({
    url: '/assets/device/type',
    method: 'post',
    data: data
  });
}

// 修改设备类型
export function updateDeviceType(data) {
  return request({
    url: '/assets/device/type',
    method: 'put',
    data: data
  });
}

// 获取设备类型
export function getDeviceTypeDetail(code) {
  return request({
    url: `/assets/device/type/${code}`,
    method: 'get'
  });
}

// 删除设备类型
export function delDriverType(codes) {
  return request({
    url: `/assets/device/type/${codes}`,
    method: 'delete'
  });
}

// 设备类型目录+设备类型树
export function getDeviceTypeTreeAll(data) {
  return request({
    url: '/assets/device/type/tree',
    method: 'post',
    data: data
  });
}

// 设备属性列表
export function getDeviceFieldList(data) {
  return request({
    url: '/assets/device/field/list',
    method: 'post',
    data: data
  });
}

// 新增设备属性映射
export function addDeviceField(data) {
  return request({
    url: '/assets/device/field',
    method: 'post',
    data: data
  });
}

// 编辑设备属性映射
export function updateDeviceField(data) {
  return request({
    url: '/assets/device/field',
    method: 'put',
    data: data
  });
}

// 获取设备属性
export function getDeviceFieldDetail(code) {
  return request({
    url: `/assets/device/field/${code}`,
    method: 'get'
  });
}

// 删除设备属性
export function delDriverField(codes) {
  return request({
    url: `/assets/device/field/${codes}`,
    method: 'delete'
  });
}
