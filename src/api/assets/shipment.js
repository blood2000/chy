import request from '@/utils/request'

// 查询货主列表
export function listShipment(query) {
  return request({
    url: '/assets/shipment/list',
    method: 'post',
    data: query
  })
}

// 查询货主详细
export function getShipment(id) {
  return request({
    url: '/assets/shipment/' + id,
    method: 'get'
  })
}

// 新增货主
export function addShipment(data) {
  return request({
    url: '/assets/shipment',
    method: 'post',
    data: data
  })
}

// 修改货主
export function updateShipment(data) {
  return request({
    url: '/assets/shipment',
    method: 'put',
    data: data
  })
}

// 删除货主
export function delShipment(ids) {
  return request({
    url: '/assets/shipment/' + ids,
    method: 'delete'
  })
}