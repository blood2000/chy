import request from '@/utils/request';

// 查询货集码列表
export function listStockcode(data) {
  return request({
    url: '/assets/shipment/cargocode/list',
    method: 'post',
    params: data
  });
}

// 查询货集码详细
export function getStockcode(id) {
  return request({
    url: `/assets/shipment/cargocode/${id}`,
    method: 'get'
  });
}
export function getStockCode(code) {
  return request({
    url: `/assets/shipment/cargocode/get/${code}`,
    method: 'get'
  });
}
// 新增货集码
export function addStockcode(data) {
  return request({
    url: '/assets/shipment/cargocode',
    method: 'post',
    data: data
  });
}

// 修改货集码
export function updateStockcode(data) {
  return request({
    url: '/assets/shipment/cargocode',
    method: 'put',
    data: data
  });
}

// 删除货集码
export function delStockcode(ids) {
  return request({
    url: `/assets/shipment/cargocode/${ids}`,
    method: 'delete'
  });
}

// 生成二维码
export function generateCode(data) {
  return request({
    url: '/assets/shipment/cargocode/generateCode',
    method: 'post'
  });
}

// 获取货集码下的货源列表
export function getOrderList(classCode, query) {
  return request({
    url: `/assets/shipment/cargocode/getOrderListByClassCode/${classCode}`,
    method: 'get',
    params: query
  });
}
