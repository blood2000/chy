import request from '@/utils/request';

// 运单补录
export function extra(data) {
  return request({
    url: '/transportation/waybillOper/extra',
    method: 'post',
    data: data
  });
}

// 通过货源单号获取货源详情
export function getOrder(mainOrderCode) {
  return request({
    url: '/transportation/orderInfoSearch/getOrderDetail/' + mainOrderCode,
    method: 'get'
  });
}

// 获取货源所有商品
export function getGoods(orderCode) {
  return request({
    url: '/transportation/orderInfoSearch/getOrderInfoGoodsTypeList/' + orderCode,
    method: 'get'
  });
}

// 获取装货地址和卸货地址
export function getAddress(orderCode) {
  return request({
    url: '/transportation/orderAddress/getOrderAddress/' + orderCode,
    method: 'get'
  });
}

// 获取司机列表
export function driver(data) {
  return request({
    url: '/assets/driver/list',
    method: 'post',
    data: data
  });
}

// 获取车辆列表
export function vehicle(data) {
  return request({
    url: '/assets/vehicle/list',
    method: 'post',
    data: data
  });
}
