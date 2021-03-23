import request from '@/utils/request';

// 查询跟踪单列表
export function trackList(query) {
  return request({
    url: '/transportation/waybill/trackingList',
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

// 车辆卸货
export function unload(data) {
  return request({
    url: '/transportation/waybillOper/unload',
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

// 获取装货、卸货信息
export function getInfoDetail(waybillNo) {
  return request({
    url: '/transportation/waybillAttachment/getByWaybillNo?waybillNo=' + waybillNo,
    method: 'get'
  });
}

