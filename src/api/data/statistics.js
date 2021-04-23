import request from '@/utils/request';

// 查询司机往来明细列表
export const listDrivertoApi = '/transportation/driverCountSearch/getDriverCommunicationList';
export function listDriverto(query) {
  return request({
    url: '/transportation/driverCountSearch/getDriverCommunicationList',
    method: 'get',
    params: query
  });
}

// 查询调度列表
export function teamList(data) {
  return request({
    url: '/assets/team/list',
    method: 'post',
    data: data
  });
}

// 查询客服统计报表列表
export const listCustomerApi = '/transportation/waybillAbnormal/getOrderException';
export function listCustomer(query) {
  return request({
    url: '/transportation/waybillAbnormal/getOrderException',
    method: 'get',
    params: query
  });
}

// 查询客户消费明细列表
export const listConsumptionApi = '/transportation/customerCountSearch/getShipmentCountList';
export function listConsumption(query) {
  return request({
    url: '/transportation/customerCountSearch/getShipmentCountList',
    method: 'get',
    params: query
  });
}
