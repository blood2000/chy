import request from '@/utils/request';

// 查询纸质回单列表
export function listInfo(query) {
  return request({
    url: '/transportation/waybill/receiptList',
    method: 'get',
    params: query
  });
}

// 查询纸质回单详细
export function getInfo(id) {
  return request({
    url: '/waybill/manages/' + id,
    method: 'get'
  });
}
