import request from '@/utils/request';

// 查询发票列表
export const rejectListApi = '/transportation/batch/operateLogList';
export function rejectList(query) {
  return request({
    url: '/transportation/batch/operateLogList',
    method: 'get',
    params: query
  });
}
