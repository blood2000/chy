import request from '@/utils/request';

// 查询财务打款列表
export const paymentListApi = '/transportation/waybillSettlement/findList';
export function paymentList(query) {
  return request({
    url: '/transportation/waybillSettlement/findList',
    method: 'get',
    params: query
  });
}

// 查询财务打款列表-统计
export function statistical(query) {
  return request({
    url: '/transportation/waybillSettlement/statistical',
    method: 'get',
    params: query
  });
}

// 查询财务打款驳回
export function rejected(data) {
  return request({
    url: '/transportation/waybillSettlement/rejected',
    method: 'post',
    data: data
  });
}

// 批量打款
export function batch(data) {
  return request({
    url: '/transportation/waybillSettlement/batch',
    method: 'post',
    data: data
  });
}

