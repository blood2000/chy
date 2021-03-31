import request from '@/utils/request';

// 查询发票列表
export const billListApi = '/transportation/waybill/trackingList';
export function billList(query) {
  return request({
    url: '/transportation/waybill/trackingList',
    method: 'get',
    params: query
  });
}

// 查询弹窗发票列表
export const childListApi = '/transportation/waybill/childList';
export function childList(query) {
  return request({
    url: '/transportation/waybill/childList',
    method: 'get',
    params: query
  });
}


