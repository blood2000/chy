import request from '@/utils/request';
[request][0].defaults.timeout = 100000;

// 批量核算
export function batchCheck(data) {
  return request({
    url: '/transportation/waybillBalanceInfo/batchCheck',
    method: 'post',
    data: data
  });
}
