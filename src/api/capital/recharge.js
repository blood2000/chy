import request from '@/utils/request';

// 充值记录-查询列表
export const rechargelistApi = '/system/config/list';
export function rechargelist(query) {
  return request({
    url: rechargelistApi,
    method: 'get',
    params: query
  });
}
