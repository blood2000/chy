import request from '@/utils/request';

// 查询货主列表
export const listShipmentApi = '/assets/shipment/list';
export function listShipment(data) {
  return request({
    url: listShipmentApi,
    method: 'post',
    data: Object.assign({}, { isAsc: 'desc', orderByColumn: 'create_time' }, data)
  });
}

export function listShipmentAll(data) {
  return request({
    url: '/assets/shipment/listAll',
    method: 'post',
    data: Object.assign({}, { isAsc: 'desc', orderByColumn: 'create_time' }, data)
  });
}
// 查询货主详细
export function getShipment(id) {
  return request({
    url: '/assets/shipment/' + id,
    method: 'get'
  });
}

// 查询货主详细
export function getShipmentByCode(query) {
  return request({
    url: '/assets/shipment/getByCode',
    method: 'get',
    params: query
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

// 票务规则
export function getWaybillStatus(data) {
  return request({
    url: '/transportation/invoiceApply/getWaybillStatus',
    method: 'post',
    data: data
  });
}

// 获取运营团队
export function getMarket(data) {
  return request({
    url: '/assets/market/list',
    method: 'post',
    data: data
  });
}

export function getOperateOrg(data) {
  return request({
    url: '/system/dept/operate_treeselect',
    method: 'post',
    data: data
  });
}

// 获取业务员
export function getOperateUser(data) {
  return request({
    url: '/system/user/listByOrg',
    method: 'post',
    data: data
  });
}

export function createWallet(data) {
  return request({
    url: `/assets/shipment/registerAll`,
    method: 'post',
    data: data
  });
}



