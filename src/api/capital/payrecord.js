import request from '@/utils/request';

// 司机打款记录-查询列表
export function payRecordlist(query) {
  return request({
    url: '/system/config/list',
    method: 'get',
    params: query
  });
}
