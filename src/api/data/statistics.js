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

// 查询司机往来明细合计
export function getDriverCount(query) {
  return request({
    url: '/transportation/driverCountSearch/getDriverCount',
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
export const listCustomerApi = '/transportation/customerCountSearch/getCustomerShipmentCountList';
export function listCustomer(query) {
  return request({
    url: '/transportation/customerCountSearch/getCustomerShipmentCountList',
    method: 'get',
    params: query
  });
}
// 查询客服统计合计
export function countCustomer(query) {
  return request({
    url: '/transportation/customerCountSearch/getCustomerShipmentMoneyCount',
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

// 查询客户消费明细统计
export function countConsumption(query) {
  return request({
    url: '/transportation/customerCountSearch/getShipmentMoneyCount',
    method: 'get',
    params: query
  });
}

// 查询团队列表
export function market(data) {
  return request({
    url: '/assets/market/list',
    method: 'post',
    data: data
  });
}

// 查询业务员列表
export function user(data) {
  return request({
    url: '/assets/marketShipmentSalesmanRel/list',
    method: 'post',
    data: data
  });
}

// 查询财务统计报表列表
export const financialDetailReportListApi = '/transportation/platformDataFinancial/financialDetailReportList';
export function financialDetailReportList(query) {
  return request({
    url: '/transportation/platformDataFinancial/financialDetailReportList',
    method: 'get',
    params: query
  });
}
//查询财务统计合计
export function financialDetailReportCount(query) {
  return request({
    url: '/transportation/platformDataFinancial/financialDetailReportCount',
    method: 'get',
    params: query
  });
}

// 查询平台统计报表列表
export const teamDetailReportListApi = '/transportation/platformDataSummary/teamDetailReportList';
export function teamDetailReportList(query) {
  return request({
    url: '/transportation/platformDataSummary/teamDetailReportList',
    method: 'get',
    params: query
  });
}
// 查询平台统计合计
export function teamDetailReportCount(query) {
  return request({
    url: '/transportation/platformDataSummary/teamDetailReportCount',
    method: 'get',
    params: query
  });
}

// 查询云资金记录列表
export const findListApi = '/payment/cloudMoneyParsing/findList';
export function findList(query) {
  return request({
    url: '/payment/cloudMoneyParsing/findList',
    method: 'get',
    params: query
  });
}

// 云资金统计
export function statistical(query) {
  return request({
    url: '/payment/cloudMoneyParsing/statistical',
    method: 'get',
    params: query
  });
}

// 匹配
export function matching(data) {
  return request({
    url: '/payment/cloudMoneyParsing/matchingByIds',
    method: 'post',
    data: data
  });
}

export function getArrearsList(query) {
  return request({
    url: '/transportation/platformDataSummary/getArrearsList',
    method: 'get',
    params: query
  });
}
