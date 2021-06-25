import request from '@/utils/request';

// 上报列表
export const listApi = '/transportation/waybillReport/findList';
export function waybillReport(query) {
  return request({
    url: listApi,
    method: 'get',
    params: query
  });
}

// 上报 先  司机, 车辆，然后运单，装, 卸，资金

// 1上报司机信息
export function waybillReportDriver(waybillReportCode) {
  return request({
    url: '/transportation/waybillReport/driver/' + waybillReportCode,
    method: 'get'
  });
}
// 1根据司机编码上报司机信息
export function waybillReportDriverByCode(driverCode) {
  return request({
    url: '/transportation/waybillReport/driverByCode/' + driverCode,
    method: 'get'
  });
}
// 2上报车辆信息
export function waybillReportVehicle(waybillReportCode) {
  return request({
    url: '/transportation/waybillReport/vehicle/' + waybillReportCode,
    method: 'get'
  });
}
// 2根据车辆编码上报车辆信息
export function waybillReportVehicleByCode(vehicleCode) {
  return request({
    url: '/transportation/waybillReport/vehicleByCode/' + vehicleCode,
    method: 'get'
  });
}
// 3上报运单
export function waybillReportWaybill(waybillReportCode) {
  return request({
    url: '/transportation/waybillReport/waybill/' + waybillReportCode,
    method: 'get'
  });
}
// 4上报装货位置
export function waybillReportLoad(waybillReportCode) {
  return request({
    url: '/transportation/waybillReport/load/' + waybillReportCode,
    method: 'get'
  });
}
// 5上报卸货位置
export function waybillReportUnload(waybillReportCode) {
  return request({
    url: '/transportation/waybillReport/unload/' + waybillReportCode,
    method: 'get'
  });
}
// 6上报资金流水
export function waybillReportBill(waybillReportCode) {
  return request({
    url: '/transportation/waybillReport/bill/' + waybillReportCode,
    method: 'get'
  });
}


// 查询调度列表
export function batch(data) {
  return request({
    url: '/transportation/waybillReport/batch',
    method: 'post',
    data: data
  });
}

export function reportMark(waybillReportCode, markFlag) {
  return request({
    url: `/transportation/waybillReport/mark/${waybillReportCode}/${markFlag}`,
    method: 'get'
  });
}

