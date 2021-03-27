import request from '@/utils/request';

// 发布货源
export function orderPubilsh(data) {
  return request({
    url: '/transportation/order/pubilsh',
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
// // 获取详情
// export function getOrderByCode(mainOrderCode) {
//   return request({
//     url: '/transportation/orderInfoSearch/getOrderDetail/' + mainOrderCode,
//     method: 'get'
//   });
// }

// 获取货源运费信息
export function orderFreight(query) {
  return request({
    url: '/transportation/orderFreight/find',
    method: 'get',
    params: query
  });
}

