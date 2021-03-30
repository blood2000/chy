import request from '@/utils/request';

// 平台用户余额-查询列表
export function balanceList(query) {
  return request({
    url: '/system/config/list',
    method: 'get',
    params: query
  });
}
