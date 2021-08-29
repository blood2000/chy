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
    method: 'post',
    timeout: 3 * 60 * 1000
  });
}

// 网商批量驳回
export function reject(ids) {
  return request({
    url: `/payment/pay/reject?ids=${ids}`,
    method: 'post'
  });
}

// 重新绑卡
export function reBindCard(id) {
  return request({
    url: `/payment/pay/reBindCard?id=${id}`,
    method: 'post',
    timeout: 3 * 60 * 1000
  });
}
