import request from '@/utils/request';

// 查询司机投诉列表
export const listComplaintApi = '/transportation/driverComplaint/list';
export function listComplaint(query) {
  return request({
    url: '/transportation/driverComplaint/list',
    method: 'get',
    params: query
  });
}

// 处理投诉
export function handleComplaint(data) {
  return request({
    url: '/transportation/driverComplaint/handle',
    method: 'post',
    data: data
  });
}

