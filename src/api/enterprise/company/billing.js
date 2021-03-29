import request from '@/utils/request';
import { praseStrEmpty } from '@/utils/ddc';
// 新增开票信息
export function addBilling(data) {
  return request({
    url: '/assets/shipment/invoice',
    method: 'post',
    data: data
  });
}

// 修改开票信息
export function updateBilling(data) {
  return request({
    url: '/assets/shipment/invoice',
    method: 'put',
    data: data
  });
}

// 获取开票信息
export function getBilling(query) {
  return request({
    url: `/assets/shipment/invoice/` + praseStrEmpty(query),
    method: 'get'
  });
}
