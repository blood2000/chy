import request from '@/utils/request';

// 查询运单核算列表
export const adjustListApi = '/transportation/waybill/trackingList';
export function adjustList(query) {
  return request({
    url: '/transportation/waybill/trackingList',
    method: 'get',
    params: query
  });
}

// 查询运单子单列表
export const childListApi = '/transportation/waybill/childList';
export function childList(query) {
  return request({
    url: '/transportation/waybill/childList',
    method: 'get',
    params: query
  });
}


