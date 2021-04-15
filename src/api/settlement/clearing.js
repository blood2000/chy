import request from '@/utils/request';

// 查询运单清分列表
export const clarifyListApi = '/transportation/waybillSettlementClarify/clarifyList';
export function clarifyList(query) {
  return request({
    url: '/transportation/waybillSettlementClarify/clarifyList',
    method: 'get',
    params: query
  });
}

// 批量清分
export function batch(data) {
  return request({
    url: '/transportation/waybillSettlementClarify/batch',
    method: 'post',
    data: data
  });
}

// 批量更新清分状态
export function batchStatus(data) {
  return request({
    url: '/transportation/waybillSettlementClarify/batchStatus',
    method: 'post',
    data: data
  });
}

