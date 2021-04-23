import request from '@/utils/request';

// 查询司机往来明细列表
export const listDrivertoApi = '/transportation/waybillAbnormal/getOrderException';
export function listDriverto(query) {
  return request({
    url: '/transportation/waybillAbnormal/getOrderException',
    method: 'get',
    params: query
  });
}

// 查询调度列表
export function teamList(data) {
  return request({
    url: '/assets/team/list',
    method: 'post',
    data: data
  });
}
