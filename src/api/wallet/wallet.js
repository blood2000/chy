import request from '@/utils/request';

// 查询钱包详细
export function getWalletInfo(query) {
  return request({
    url: '/payment/wallet/getInfoByUserCode',
    method: 'get',
    params: query
  });
}

// 修改支付密码
export function editAmountPassword(data) {
  return request({
    url: '/payment/wallet',
    method: 'put',
    data: data
  });
}
