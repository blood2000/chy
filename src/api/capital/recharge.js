import request from '@/utils/request';

// 充值记录-查询列表
export function rechargelist(query) {
  return request({
    url: '/system/config/list',
    method: 'get',
    params: query
  });
}
