import request from '@/utils/request';

// 发布货源
export function orderPubilsh(data) {
  return request({
    url: '/transportation/order/pubilsh',
    method: 'post',
    data: data
  });
}
