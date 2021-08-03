import request from '@/utils/request';

// 发票索取列表  1已申请对账列表 2已申请开票列表 3已申请打款列表 4已完成列表 com.ddc.common.beans.trans.batch.vo.BatchInfoListVo
export const adjustListApi = '/transportation/batch/list';
export function adjustDregsList(query) {
  return request({
    url: adjustListApi,
    method: 'get',
    params: query
  });
}
// 特殊的状态为-1的 驳回核验列表
export function rejectionList(query) {
  return request({
    url: '/transportation/batch/rejectionList',
    method: 'get',
    params: query
  });
}


// 批量修改司机实收金额
export function batchUpdateMoney(data) {
  return request({
    url: '/transportation/batch/updateMoney',
    method: 'post',
    data: data
  });
}

// 结算审核中立即核算 transportation:dispatch:immediateAccounting ???
export function immediateAccounting(data) {
  return request({
    url: '/transportation/batch/immediateAccounting',
    method: 'post',
    data: data
  });
}

// 批量对账中对账单基本信息
export function accountStatement(query) {
  return request({
    url: '/transportation/batch/accountStatement',
    method: 'get',
    params: query
  });
}
// 确定批量申请对账
export function applyForReconciliation(data) {
  return request({
    url: '/transportation/batch/applyForReconciliation',
    method: 'post',
    data: data
  });
}

// 确定批量索票
export function passBatchClaim(data) {
  return request({
    url: '/transportation/batch/passBatchClaim',
    method: 'post',
    data: data
  });
}

// 驳回批量索票
export function refuseBatchClaim(data) {
  return request({
    url: '/transportation/batch/refuseBatchClaim',
    method: 'post',
    data: data
  });
}

// 计算费用
export function calculateFee(data) {
  return request({
    url: '/transportation/batch/calculateFee',
    method: 'post',
    data: data
  });
}

// 查看批次详情
export function batchInfo(query) {
  return request({
    url: '/transportation/batch/batchInfo',
    method: 'get',
    params: query
  });
}

// 相关运单 com.ddc.common.beans.trans.invoice.vo.list.InvoiceWaybillInfoVo
export const BatchInfoListVo = '/transportation/batch/batchRelatedWaybill';
export function batchRelatedWaybill(query) {
  return request({
    url: BatchInfoListVo,
    method: 'get',
    params: query
  });
}

// 核销列表
export function checkList(data) {
  return request({
    url: '/transportation/icCheck/checkList',
    method: 'post',
    data: data
  });
}
// 删除运单
export function delWaybill(query) {
  return request({
    url: '/transportation/icCheck/delWaybill',
    method: 'get',
    params: query
  });
}

// 核销列表
export function check(data) {
  return request({
    url: '/transportation/icCheck/check',
    method: 'post',
    data: data
  });
}

// 核验驳回
export function refuseVerification(data) {
  return request({
    url: '/transportation/batch/refuseVerification',
    method: 'post',
    data: data
  });
}

// 核验驳回
export function refuseApplied(data) {
  return request({
    url: '/transportation/batch/refuseApplied',
    method: 'post',
    data: data
  });
}

// 已回单详情
export function receiptInfo(query) {
  return request({
    url: '/transportation/batch/receiptInfo',
    method: 'get',
    params: query
  });
}
