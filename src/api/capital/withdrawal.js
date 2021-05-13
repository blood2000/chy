import request from '@/utils/request';

// 提现申请-查询列表
export const withDrawalListApi = '/payment/transferApply/list';
export function getWithDrawalList(data) {
  return request({
    url: withDrawalListApi,
    method: 'post',
    data: Object.assign({}, { isAsc: 'desc', orderByColumn: 'applyDate' }, data)
  });
}

// 网商批量提现
export function toCard(ids) {
  return request({
    url: `/payment/pay/toCard?ids=${ids}`,
    method: 'post'
  });
}
