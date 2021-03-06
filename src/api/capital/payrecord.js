import request from '@/utils/request';

// 司机打款记录-查询列表
export const payRecordlistApi = '/payment/wallet/remit/list';
export function payRecordlist(data) {
  return request({
    url: payRecordlistApi,
    method: 'post',
    data: Object.assign({}, { isAsc: 'desc', orderByColumn: 'id' }, data)
  });
}

// 修改批次号
export function editBzno(data) {
  return request({
    url: '/payment/pay/editBzno',
    method: 'post',
    data: data
  });
}

// 冻结记录
export function frreezeAmountLog(query) {
  return request({
    url: '/payment/frreezeAmountLog/list',
    method: 'get',
    params: query
  });
}

// 付款记录
export const shipperListApi = '/payment/wallet/remit/shipperList';
export function shipperlist(data) {
  return request({
    url: shipperListApi,
    method: 'post',
    data: Object.assign({}, { isAsc: 'desc', orderByColumn: 'id' }, data)
  });
}

// 统计
export function getTotalMoney(data) {
  return request({
    url: `/payment/wallet/remit/statistical`,
    method: 'post',
    data: data
  });
}

