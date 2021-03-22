import request from '@/utils/request';

// 查询运单列表
export function listManages(query) {
  return request({
    url: '/transportation/waybill/manageList',
    method: 'get',
    params: query
  });
}

// 查询运单详细
export function getDetail(code) {
  return request({
    url: '/transportation/waybill/getWayBillByCode?code=' + code,
    method: 'get'
  });
}

// 新增运单
export function addManages(data) {
  return request({
    url: '/waybill/manages',
    method: 'post',
    data: data
  });
}

// 修改运单
export function updateManages(data) {
  return request({
    url: '/waybill/manages',
    method: 'put',
    data: data
  });
}

// 删除运单
export function delManages(id) {
  return request({
    url: '/waybill/manages/' + id,
    method: 'delete'
  });
}
