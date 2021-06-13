import request from '@/utils/request';

// app渣土场
export function listForWeb(data) {
  return request({
    url: '/transportation/shipmentMuckyard/listForWeb',
    method: 'post',
    data: data
  });
}
