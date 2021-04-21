import request from '@/utils/request';

// 查询运输异常列表
export const listAbnormalApi = '/transportation/waybillAbnormal/getOrderException';
export function listAbnormal(query) {
  return request({
    url: '/transportation/waybillAbnormal/getOrderException',
    method: 'get',
    params: query
  });
}

// 查询运输异常详细
export function getAbnormal(code) {
  return request({
    url: '/transportation/waybillAbnormal/findByCode?code=' + code,
    method: 'post'
  });
}

// 查询运单详细
export function getWaybill(code) {
  return request({
    url: '/transportation/waybillAbnormal/getOrderExceptionDetail?' + code,
    method: 'get'
  });
}

// 处理运输异常
export function handleAbnormal(data) {
  return request({
    url: '/transportation/waybillAbnormal/handle',
    method: 'post',
    data: data
  });
}
