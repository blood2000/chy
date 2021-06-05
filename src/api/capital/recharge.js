import request from '@/utils/request';

// 充值记录-查询列表
export const rechargelistApi = '/payment/shipmentPaidRecord/list';
export function rechargelist(data) {
  return request({
    url: rechargelistApi,
    method: 'post',
    data: Object.assign({}, { isAsc: 'desc', orderByColumn: 'create_time' }, data)
  });
}
