import request from '@/utils/request';

// 渣土使用表头
export const ztApi = '/transportation/batch/findWaybillBalanceList';
export function ztApiList(query) {
  return request({
    url: ztApi,
    method: 'get',
    params: query
  });
}

// 查询运单核算列表
export const adjustListApi = '/transportation/waybillBalanceInfo/findList';
export function adjustList(query) {
  return request({
    url: '/transportation/waybillBalanceInfo/findList',
    method: 'get',
    params: query
  });
}

// 货主驳回卸货凭证
export function rejectUnload(data) {
  return request({
    url: '/transportation/waybillBalanceInfo/shipperRebutUnloading',
    method: 'post',
    data: data
  });
}

// 查询运单子单列表
export const childListApi = '/transportation/waybill/childList';
export function childList(query) {
  return request({
    url: '/transportation/waybill/childList',
    method: 'get',
    params: query
  });
}

// 批量核算详情
export function adjustDetail(data) {
  return request({
    url: '/transportation/waybillBalanceInfo/batchDetail',
    method: 'post',
    data: data
  });
}
// 批量渣土核算详情
export function batchDetail(data) {
  return request({
    url: 'transportation/batch/batchDetail',
    method: 'post',
    data: data
  });
}

// 计算费用
export function calculateFee(data) {
  return request({
    url: '/transportation/calculateFee/calculate',
    method: 'post',
    data: data
  });
}
// 批量计算费用
export function batchCalculate(data) {
  return request({
    url: '/transportation/calculateFee/batchCalculate',
    method: 'post',
    data: data
  });
}


// 根据司机实收金额计算
export function deliveryCashFee(data) {
  return request({
    url: '/transportation/calculateFee/deliveryCashFee',
    method: 'post',
    data: data
  });
}

// 批量核算
export function batchCheck(data) {
  return request({
    url: '/transportation/waybillBalanceInfo/batchCheck',
    method: 'post',
    data: data
  });
}

// 批量申请打款
export function batchApply(data) {
  return request({
    url: '/transportation/waybillBalanceInfo/batchApply',
    method: 'post',
    data: data
  });
}

// 批量评价
export function batchAdd(data) {
  return request({
    url: '/transportation/waybillComment/batchAdd',
    method: 'post',
    data: data
  });
}

