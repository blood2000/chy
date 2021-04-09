import request from '@/utils/request';

// 查询货主列表
export const listShipmentApi = '/assets/shipment/list';
export function listShipment(data) {
  return request({
    url: listShipmentApi,
    method: 'post',
    data: Object.assign({}, data, { isAsc: 'asc', orderByColumn: 'id' })
  });
}

// 查询货主详细
export function getShipment(id) {
  return request({
    url: '/assets/shipment/' + id,
    method: 'get'
  });
}

// 新增货主
export function addShipment(data) {
  return request({
    url: '/assets/shipment',
    method: 'post',
    data: data
  });
}

// 修改货主
export function updateShipment(data) {
  return request({
    url: '/assets/shipment',
    method: 'put',
    data: data
  });
}

// 删除货主
export function delShipment(ids) {
  return request({
    url: '/assets/shipment/' + ids,
    method: 'delete'
  });
}

// 已读
export function authRead(data) {
  return request({
    url: '/assets/shipment/authRead',
    method: 'post',
    data: data
  });
}

// 审核
export function examine(data) {
  return request({
    url: '/assets/shipment/examine',
    method: 'post',
    data: data
  });
}

// 获取企业信息
export function getShipmentEnterprise(companyCode) {
  return request({
    url: '/assets/shipment/getEnterpriseByOrg/' + companyCode,
    method: 'get'
  });
}

