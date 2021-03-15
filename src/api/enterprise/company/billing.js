import request from '@/utils/request';

// 修改开票信息
export function updateBilling(data) {
  return request({
    url: '',
    method: 'put',
    data: data
  });
}
