import request from '@/utils/request';

// 司机打款记录-查询列表
export const payRecordlistApi = '/system/config/list';
export function payRecordlist(query) {
  return request({
    url: payRecordlistApi,
    method: 'get',
    params: query
  });
}
