import request from '@/utils/request'

// 查询【请填写功能名称】列表
export function getOrderInfoList(query) {
  return request({
    url: '/order/getOrderInfoList',
    method: 'get',
    params: query
  })
}