import request from '@/utils/request';

// 监管数据
export function getRegulatoryData(branchCode) {
  return request({
    url: `/schedule/bigScreenSeach/getRegulatoryCount/${branchCode}`,
    method: 'get'
  });
}

// 用户情况
export function getUserData(branchCode) {
  return request({
    url: `/schedule/bigScreenSeach/getBranchUser/${branchCode}`,
    method: 'get'
  });
}

// 业绩数据
export function getCompanyPerformance(branchCode) {
  return request({
    url: `/schedule/bigScreenSeach/getCompanyPerformance/${branchCode}`,
    method: 'get'
  });
}


// 运力情况
export function getCapacityData(branchCode) {
  return request({
    url: `/schedule/bigScreenSeach/getTransportCount/${branchCode}`,
    method: 'get'
  });
}

// 货单/运单数
export function getShipmentWaybillCount(branchCode, timeType) {
  return request({
    url: `/schedule/bigScreenSeach/getWaybillCount`,
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
    url: `/schedule/bigScreenSeach/getBusinessDetail/${branchCode}`,
    method: 'get'
  });
}

// 目标达成情况
export function getTarget(branchCode) {
  return request({
    url: `/schedule/bigScreenSeach/getBigScrennTarget/${branchCode}`,
    method: 'get'
  });
}

// 总排名 公司/司机
export function getCompanyDriverRank(branchCode) {
  return request({
    url: `/schedule/bigScreenSeach/getCompanyRanking/${branchCode}`,
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
    url: `/waybillSettlement/getNew3`,
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
