import request from '@/utils/request';

// 查询etc运单列表
export const etcListApi = '/transportation/waybill/etcWithWaybillList';
export function etcList(query) {
  return request({
    url: '/transportation/waybill/etcWithWaybillList',
    method: 'get',
    params: query
  });
}

// 索取Etc发票
export function askForEtcInvoice(data) {
  return request({
    url: '/transportation/waybillOper/askForEtcInvoice',
    method: 'post',
    data: data
  });
}

// 查看Etc发票
export function etcInvoice(waybillCode) {
  return request({
    url: '/transportation/etcInvoice/getEtcByWaybillCode/' + waybillCode,
    method: 'get'
  });
}

