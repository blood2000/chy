import request from '@/utils/request';
import { praseStrEmpty } from '@/utils/ddc';
// 获取货主企业信息
export function getCompanyInfo(data) {
  return request({
    url: `/assets/shipment/getShipmentAndEnterprise/` + praseStrEmpty(data),
    method: 'get',
    params: Object.assign({}, { urlShow: 'urlShow' })
  });
}

// 保存货主企业信息
export function saveCompanyInfo(data) {
  return request({
    url: '/assets/shipment/saveShipmentAndEnterprise',
    method: 'post',
    data: data
  });
}
