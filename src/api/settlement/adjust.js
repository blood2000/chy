import request from '@/utils/request';

// 查询运单核算列表
export const adjustListApi = '/transportation/waybill/trackingList';
export function adjustList(query) {
  return request({
    url: '/transportation/waybill/trackingList',
    method: 'get',
    params: query
  });
}

// 查询运单子单列表
export const childListApi = '/transportation/waybill/childList';
export function childList(query) {
  return request({
    url: '/transportation/waybill/childList',
    method: 'get',
    params: query
  });
}

// 车辆装货
export function load(data) {
  return request({
    url: '/transportation/waybillOper/load',
    method: 'post',
    data: data
  });
}

// 车辆补装货凭证
export function loadCredentials(data) {
  return request({
    url: '/transportation/waybillOper/loadCredentials',
    method: 'post',
    data: data
  });
}

// 车辆卸货
export function unload(data) {
  return request({
    url: '/transportation/waybillOper/unload',
    method: 'post',
    data: data
  });
}

// 车辆补卸货凭证
export function unloadCredentials(data) {
  return request({
    url: '/transportation/waybillOper/unloadCredentials',
    method: 'post',
    data: data
  });
}

// 取消运单
export function cancel(data) {
  return request({
    url: '/transportation/waybillOper/cancel',
    method: 'post',
    data: data
  });
}

// 获取装货地址和卸货地址
export function getAddress(orderGoodsCode) {
  return request({
    url: '/transportation/orderAddress/getOrderGoodsAddress/' + orderGoodsCode,
    method: 'get'
  });
}

// 获取车辆列表
export function getVehicle(query) {
  return request({
    url: '/assets/vehicle/list',
    method: 'get',
    params: query
  });
}

// 根据CODE获取车辆
export function getVehicleInfo(code) {
  return request({
    url: '/assets/vehicle/getByCode?code=' + code,
    method: 'get'
  });
}

// 获取装货、卸货信息
export function getInfoDetail(waybillNo) {
  return request({
    url: '/transportation/waybillAttachment/getByWaybillNo?waybillNo=' + waybillNo,
    method: 'get'
  });
}

// 新增司机投诉货主
export function addComplaint(data) {
  return request({
    url: '/transportation/driverComplaint/add',
    method: 'post',
    data: data
  });
}

// 获取车辆轨迹
export function trackLocation(data) {
  return request({
    url: '/iot/jimiDevice/getTrackList',
    method: 'post',
    data: data
  });
}

// 获取车辆轨迹
export function location(data) {
  return request({
    url: '/iot/jimiDevice/location',
    method: 'post',
    data: data
  });
}

// 新增评价
export function waybillComment(data) {
  return request({
    url: '/transportation/waybillComment/add',
    method: 'post',
    data: data
  });
}

