import request from '@/utils/request';

// 提现申请-查询列表
export const withDrawalListApi = '/system/config/list';
export function getWithDrawalList(query) {
  return request({
    url: withDrawalListApi,
    method: 'get',
    params: query
  });
}
