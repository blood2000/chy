import request from '@/utils/request'

// 查询货源管理列表列表
export function getOrderInfoList(query) {
  return request({
    url: '/transportation/order/getOrderInfoList',
    method: 'get',
    params: query
  })
}

// 删除货源
export function delOrder(orderId) {
  return request({
    url: '/transportation/order/delete/' + orderId,
    method: 'delete'
  })
}
