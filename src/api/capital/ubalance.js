import request from '@/utils/request';

// 平台用户余额-查询列表
export function balanceList(data) {
  return request({
    url: '/payment/wallet/userAmout/list',
    method: 'post',
    data: data
  });
}
