import request from '@/utils/request';

// 平台账户余额-查询列表
export const balanceListApi = '/payment/wallet/company/list';
export function balanceList(data) {
  return request({
    url: balanceListApi,
    method: 'post',
    data: data
  });
}
