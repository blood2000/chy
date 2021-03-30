import request from '@/utils/request';

// 提现申请-查询列表
export function getWithDrawalList(query) {
  return request({
    url: '/system/config/list',
    method: 'get',
    params: query
  });
}
