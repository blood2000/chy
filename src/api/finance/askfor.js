import request from '@/utils/request';

// 查询发票索取列表
export const askforListApi = '/transportation/invoice/listWayBill';
export function askforList(data) {
  return request({
    url: '/transportation/invoice/listWayBill',
    method: 'post',
    data: data
  });
}

// 查询货主信息列表
export function shipmentList(query) {
  return request({
    url: '/assets/shipment/list',
    method: 'get',
    params: query
  });
}

// 索取发票
export function askInvoice(data) {
  return request({
    url: '/transportation/invoice/askInvoice',
    method: 'post',
    data: data
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


