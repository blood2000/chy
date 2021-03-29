import request from '@/utils/request';

// 查询作废运单列表
export const listNullifyApi = '/transportation/waybill/manageList';
export function listNullify(query) {
  return request({
    url: '/transportation/waybill/manageList',
    method: 'get',
    params: query
  });
}

// 驳回运单详细
export function invalidRejected(wayBillCode) {
  return request({
    url: '/transportation/waybillOper/invalidRejected?wayBillCode=' + wayBillCode,
    method: 'get'
  });
}


