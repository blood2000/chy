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

// 忘记密码
export function forgetPassword(data) {
  return request({
    url: '/payment/wallet/forgetPassword',
    method: 'put',
    data: data
  });
}

// 提现申请
export function transferApply(data) {
  return request({
    url: '/payment/pay/transferApply',
    method: 'post',
    data: data
  });
}

// 获取网商账号
export function getUserWalletBank() {
  return request({
    url: '/payment/wallet/getUserWalletBank',
    method: 'post'
  });
}
