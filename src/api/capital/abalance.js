import request from '@/utils/request';

// 平台账户余额-查询列表
export function balanceList(query) {
  return request({
    url: '/system/config/list',
    method: 'get',
    params: query
  });
}

// 获取变动明细列表
export function changeDetailList(query) {
  return request({
    url: '/system/config/list',
    method: 'get',
    params: query
  });
}
