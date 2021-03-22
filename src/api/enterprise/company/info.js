import request from '@/utils/request';

// 获取货主企业信息
export function getCompanyInfo(data) {
  return request({
    url: `/assets/shipment/getShipmentAndEnterprise`,
    method: 'post',
    data: data
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
