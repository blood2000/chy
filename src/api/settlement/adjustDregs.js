import request from '@/utils/request';

// 发票索取列表  1已申请对账列表 2已申请开票列表 3已申请打款列表 4已完成列表
export const adjustListApi = '/transportation/batch/list';
export function adjustDregsList(query) {
  return request({
    url: adjustListApi,
    method: 'get',
    params: query
  });
}
