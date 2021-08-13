import request from '@/utils/request';

/** ============================设备类型管理============================ */
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

/** ============================设备属性管理============================ */
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

/** ============================设备信息管理============================ */
// 设备类型目录+设备类型树
export function getDeviceTypeTreeAll(data) {
  return request({
    url: '/assets/device/type/tree',
    method: 'post',
    data: data
  });
}

// 获取设备列表
export function getDeviceInfoList(data) {
  return request({
    url: `/assets/device/info/list`,
    method: 'post',
    data: data
  });
}

// 获取设备属性
export function getDeviceForm(typeCode) {
  return request({
    url: `/assets/device/info/getForm/${typeCode}`,
    method: 'post'
  });
}

// 新增设备
export function addDeviceInfo(data) {
  return request({
    url: '/assets/device/info',
    method: 'post',
    data: data
  });
}

// 修改设备
export function updateDeviceInfo(data) {
  return request({
    url: '/assets/device/info',
    method: 'put',
    data: data
  });
}

// 获取设备信息
export function getDeviceDetail(code) {
  return request({
    url: `/assets/device/info/${code}`,
    method: 'get'
  });
}

// 删除设备
export function delDriverInfo(codes) {
  return request({
    url: `/assets/device/info/${codes}`,
    method: 'delete'
  });
}

/** ============================设备字段字典管理============================ */
// 设备字段字典列表
export function getDeviceFieldOptionList(data) {
  return request({
    url: 'assets/device/field/options/list',
    method: 'post',
    data: data
  });
}

// 新增设备字段字典
export function addDeviceFieldOption(data) {
  return request({
    url: '/assets/device/field/options',
    method: 'post',
    data: data
  });
}

// 编辑设备字段字典
export function updateDeviceFieldOption(data) {
  return request({
    url: '/assets/device/field/options',
    method: 'put',
    data: data
  });
}

// 获取设备字段字典
export function getDeviceFieldOptionDetail(code) {
  return request({
    url: `/assets/device/field/options/${code}`,
    method: 'get'
  });
}

// 删除设备字段字典
export function delDriverFieldOption(codes) {
  return request({
    url: `/assets/device/field/options/{codes}`,
    method: 'delete'
  });
}

/** ============================设备控制台============================ */
// 设备列表
export function getConsoleDeviceList(query) {
  return request({
    url: '/assets/device/console/list',
    method: 'get',
    params: query
  });
}

// 获取设备位置信息
export function getConsoleDeviceLocation(data) {
  return request({
    url: '/assets/device/console/getDeviceLocationList',
    method: 'post',
    data: data
  });
}

// 获取设备统计信息
export function getConsoleDeviceStatistics() {
  return request({
    url: '/assets/device/console/getStatistics',
    method: 'get'
  });
}
