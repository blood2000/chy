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
export function waybillReportDriver(driverCode) {
  return request({
    url: '/transportation/waybillReport/driver/' + driverCode,
    method: 'get'
  });
}
// 2上报车辆信息
export function waybillReportVehicle(vehicleCode) {
  return request({
    url: '/transportation/waybillReport/vehicle/' + vehicleCode,
    method: 'get'
  });
}
// 3上报运单
export function waybillReportWaybill(waybillCode) {
  return request({
    url: '/transportation/waybillReport/waybill/' + waybillCode,
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
// export function teamList(data) {
//   return request({
//     url: '/assets/team/list',
//     method: 'post',
//     data: data
//   });
// }
