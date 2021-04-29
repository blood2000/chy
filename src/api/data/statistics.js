import request from '@/utils/request';

// 查询司机往来明细列表
export const listDrivertoApi = '/schedule/driverCountSearch/getDriverCommunicationList';
export function listDriverto(query) {
  return request({
    url: '/schedule/driverCountSearch/getDriverCommunicationList',
    method: 'get',
    params: query
  });
}

// 查询司机往来明细合计
export function getDriverCount(query) {
  return request({
    url: '/schedule/driverCountSearch/getDriverCount',
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
export const listCustomerApi = '/schedule/customerCountSearch/getCustomerShipmentCountList';
export function listCustomer(query) {
  return request({
    url: '/schedule/customerCountSearch/getCustomerShipmentCountList',
    method: 'get',
    params: query
  });
}
// 查询客户消费明细统计
export function countCustomer(query) {
  return request({
    url: '/schedule/customerCountSearch/getCustomerShipmentMoneyCount',
    method: 'get',
    params: query
  });
}

// 查询客户消费明细列表
export const listConsumptionApi = '/schedule/customerCountSearch/getShipmentCountList';
export function listConsumption(query) {
  return request({
    url: '/schedule/customerCountSearch/getShipmentCountList',
    method: 'get',
    params: query
  });
}

// 查询客户消费明细统计
export function getShipmentMoneyCount(query) {
  return request({
    url: '/schedule/customerCountSearch/getShipmentMoneyCount',
    method: 'get',
    params: query
  });
}
