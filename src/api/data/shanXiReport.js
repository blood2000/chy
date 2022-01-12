import request from '@/utils/request';

// 1上报司机信息
export function waybillReportDriverReport(query) {
  return request({
    url: '/transportation/waybillReport/driverReport',
    method: 'get',
    params: query
  });
}

// 2上报车辆信息
export function waybillReportVehicleReport(query) {
  return request({
    url: '/transportation/waybillReport/vehicleReport',
    method: 'get',
    params: query
  });
}

// 3上报运单
export function waybillReportWaybillReport(query) {
  return request({
    url: '/transportation/waybillReport/waybillReport',
    method: 'get',
    params: query
  });
}

// 6上报资金流水
export function waybillReportFinancialReport(query) {
  return request({
    url: '/transportation/waybillReport/financialReport',
    method: 'get',
    params: query
  });
}
