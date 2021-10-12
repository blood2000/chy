import request from '@/utils/request';

// 平台用户余额-查询列表
export const balanceListApi = '/payment/wallet/userAmout/list';
export function balanceList(data) {
  return request({
    url: balanceListApi,
    method: 'post',
    data: Object.assign({}, { isAsc: 'asc', orderByColumn: 'updateTime' }, data)
  });
}

// 查询网商余额
export function getBalance(userCode) {
  return request({
    url: `/payment/bk/member/balance?userCode=${userCode}`,
    method: 'post'
  });
}

// 用户金额统计
export function getTotalMoney(data) {
  return request({
    url: `/payment/wallet/userAmout/totalMoney`,
    method: 'post',
    data: data
  });
}
