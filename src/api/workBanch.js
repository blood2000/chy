import request from '@/utils/request';

// 查询统计数据
export function statisticInfo(branchCode, dataTime) {
  return request({
    url: `/transportation/workBench/getWorkBenchCount?branchCode=${branchCode}&dataTime=${dataTime}`,
    method: 'get'
  });
}

// 查询运单列表
export function waybillList(query) {
  return request({
    url: '/transportation/waybill/manageList',
    method: 'get',
    params: query
  });
}

// 查询货源管理列表列表
export function orderList(query) {
  return request({
    url: '/transportation/orderInfoSearch/getOrderInfoList',
    method: 'get',
    params: query
  });
}

// 查询发票列表
export function billList(data) {
  return request({
    url: '/transportation/invoiceApply/listInvoiceApply',
    method: 'post',
    data: data
  });
}

// 货主工作台统计
export function shipmentInformation(query) {
  return request({
    url: '/transportation/shipmentWorkBench/shipmentInformation',
    method: 'get',
    params: query
  });
}

// 运营侧 导航栏待审核数字
export function getUnreviewed(branchCode) {
  return request({
    url: `/transportation/workBench/getUnreviewed/${branchCode}`,
    method: 'get'
  });
}


