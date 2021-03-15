import request from '@/utils/request';

// 查询运输异常列表
export function listAbnormal(query) {
  return request({
    url: '/waybill/abnormal/list',
    method: 'get',
    params: query
  });
}

// 查询运输异常详细
export function getAbnormal(waybillCode) {
  return request({
    url: '/waybill/abnormal/' + waybillCode,
    method: 'get'
  });
}

// 新增运输异常
export function addAbnormal(data) {
  return request({
    url: '/waybill/abnormal',
    method: 'post',
    data: data
  });
}

// 修改运输异常
export function updateAbnormal(data) {
  return request({
    url: '/waybill/abnormal',
    method: 'put',
    data: data
  });
}

// 删除运输异常
export function delAbnormal(waybillCode) {
  return request({
    url: '/waybill/abnormal/' + waybillCode,
    method: 'delete'
  });
}
