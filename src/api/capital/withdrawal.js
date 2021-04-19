import request from '@/utils/request';

// 提现申请-查询列表
export const withDrawalListApi = '/payment/transferApply/list';
export function getWithDrawalList(data) {
  return request({
    url: withDrawalListApi,
    method: 'post',
    data: Object.assign({}, { isAsc: 'asc', orderByColumn: 'id' }, data)
  });
}
