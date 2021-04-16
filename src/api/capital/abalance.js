import request from '@/utils/request';

// 平台账户余额-查询列表
export const balanceListApi = '/system/config/list';
export function balanceList(query) {
  return request({
    url: balanceListApi,
    method: 'get',
    params: query
  });
}
