import request from '@/utils/request';

// 发布货源
export function orderPubilsh(data) {
  return request({
    url: '/transportation/order/pubilsh',
    method: 'post',
    data: data
  });
}

// 渣土发布货源
export function ztPublishOrder(data) {
  return request({
    url: '/transportation/app/orderInfo/publishOrder',
    method: 'post',
    data: data
  });
}
// 渣土发布货源
export function ztUpdateOrder(data) {
  return request({
    url: '/transportation/app/orderInfo/updateOrder',
    method: 'post',
    data: data
  });
}




// 修改货源 /transportation/order/modify
export function update(data) {
  return request({
    url: '/transportation/order/modify',
    method: 'post',
    data: data
  });
}

// 获取详情
export function getOrderByCode(code) {
  return request({
    url: '/transportation/orderInfoSearch/getOrderDetailBycode/' + code,
    method: 'get'
  });
}

// 获取承运码
export function getCym(code) {
  return request({
    url: '/transportation/waybill/app/getCym/' + code,
    method: 'get'
  });
}

// 获取货源运费信息
export function orderFreight(query) {
  return request({
    url: '/transportation/orderFreight/find',
    method: 'get',
    params: query
  });
}

export function estimateCost(data) {
  return request({
    url: '/transportation/orderFreight/estimateCost',
    method: 'post',
    data: data
  });
}

// 获取司机成交单价
export function getDriverPrice(data) {
  return request({
    url: '/transportation/calculateFee/getDriverPrice',
    method: 'post',
    data: data
  });
}

// 根据GoodsCode获取运单-列表
export function getByOrderCode(query) {
  return request({
    url: '/transportation/waybill/getByOrderCode',
    method: 'get',
    params: query
  });
}


// 创建电子围栏
export function fencePlatCreate(data) {
  return request({
    url: '/iot/fenceBusiness/fencePlatCreate',
    method: 'post',
    data: data
  });
}
