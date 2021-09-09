import request from '@/utils/request';

// 监管数据
export function getRegulatoryData(branchCode) {
  return request({
    url: `/transportation/bigScreenSeach/getRegulatoryCount/${branchCode}`,
    method: 'get'
  });
}

// 用户情况
export function getUserData(branchCode) {
  return request({
    url: `/transportation/bigScreenSeach/getBranchUser/${branchCode}`,
    method: 'get'
  });
}

// 业绩数据
export function getCompanyPerformance(branchCode) {
  return request({
    url: `/transportation/bigScreenSeach/getCompanyPerformance/${branchCode}`,
    method: 'get'
  });
}


// 运力情况
export function getCapacityData(branchCode) {
  return request({
    url: `/transportation/bigScreenSeach/getTransportCount/${branchCode}`,
    method: 'get'
  });
}

// 货单/运单数
export function getShipmentWaybillCount(branchCode, timeType) {
  return request({
    url: `/transportation/bigScreenSeach/getWaybillCount`,
    method: 'get',
    params: {
      branchCode,
      timeType
    }
  });
}

// 运营情况
export function getBusinessDetail(branchCode) {
  return request({
    url: `/transportation/bigScreenSeach/getBusinessDetail/${branchCode}`,
    method: 'get'
  });
}

// 目标达成情况
export function getTarget(branchCode) {
  return request({
    url: `/transportation/bigScreenSeach/getBigScrennTarget/${branchCode}`,
    method: 'get'
  });
}

// 总排名 公司/司机
export function getCompanyDriverRank(branchCode) {
  return request({
    url: `/transportation/bigScreenSeach/getCompanyRanking/${branchCode}`,
    method: 'get'
  });
}

// 最近3条滚屏-货单数据
export function getOrderTop() {
  return request({
    url: `/transportation/orderInfoSearch/getNewestOrderInfo`,
    method: 'get'
  });
}

// 最近3条滚屏-交易数据
export function getSettlementTop() {
  return request({
    url: `/transportation/waybillSettlement/getNew3`,
    method: 'get'
  });
}

// 最近3条滚屏-用户车辆数据
export function getUserAndCarTop() {
  return request({
    url: `/assets/notice/userAndCarTop`,
    method: 'post'
  });
}

// 货运类型排行v2
export function getCargoTypeListV2(branchCode, query) {
  return request({
    url: `/transportation/bigScreenSeach/v2/cargoTypeList/${branchCode}`,
    method: 'get',
    params: query
  });
}

// 承运排行v2
export function getCarrierRankingV2(query) {
  return request({
    url: `/transportation/bigScreenSeach/v2/carrierRanking`,
    method: 'get',
    params: query
  });
}

// 地域业务分布情况v2
export function getBusinessListV2(branchCode) {
  return request({
    url: `/transportation/bigScreenSeach/v2/regionBusinessDistributedList/${branchCode}`,
    method: 'get'
  });
}

// 运营情况v2
export function getOperationStatusV2(branchCode, query) {
  return request({
    url: `/transportation/bigScreenSeach/v2/operationStatus/${branchCode}`,
    method: 'get',
    params: query
  });
}

// 业绩数据v2
export function getPerformanceDataV2(branchCode, query) {
  return request({
    url: `/transportation/bigScreenSeach/v2/performanceData/${branchCode}`,
    method: 'get',
    params: query
  });
}
