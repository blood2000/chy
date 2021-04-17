import request from '@/utils/request';

// 司机打款记录-查询列表
export const payRecordlistApi = '/payment/wallet/remit/list';
export function payRecordlist(data) {
  return request({
    url: payRecordlistApi,
    method: 'post',
    data: Object.assign({}, data, { isAsc: 'asc', orderByColumn: 'id' })
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
