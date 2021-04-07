import request from '@/utils/request';

// 平台用户余额-查询列表
export const balanceListApi = '/payment/wallet/userAmout/list';
export function balanceList(data) {
  return request({
    url: balanceListApi,
    method: 'post',
    data: data
  });
}
