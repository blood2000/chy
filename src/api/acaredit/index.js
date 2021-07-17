import request from '@/utils/request';

// 查询卡历史记录
export function cardHistoryList(query) {
  return request({
    url: '/transportation/batch/cardHistoryList',
    method: 'get',
    params: query
  });
}
