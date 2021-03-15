import request from '@/utils/request';

// 查询货源管理列表列表
export function getOrderInfoList(query) {
  return request({
    url: '/transportation/order/getOrderInfoList',
    method: 'get',
    params: query
  });
}

// 删除货源
export function delOrder(orderId) {
  return request({
    url: '/transportation/order/delete/' + orderId,
    method: 'delete'
  });
}

// 派单
export function dispatchOrder(data) {
  return request({
    url: '/transportation/order/dispatchOrder',
    method: 'post',
    data: data
  });
}

// 上下架货源
export function loadAndUnloadingGoods(data) {
  return request({
    url: '/transportation/order/loadAndUnloadingGoods',
    method: 'post',
    data: data
  });
}

