import request from '@/utils/request';

// 查询调度组列表
export const listInfoApi = '/transportation/dispatch/list';
export function listInfo(query) {
  return request({
    url: '/transportation/dispatch/list',
    method: 'get',
    params: query
  });
}

// 新增调度组
export function addInfo(data) {
  return request({
    url: '/transportation/dispatch/add',
    method: 'post',
    data: data
  });
}

// 删除调度组
export function delInfo(id) {
  return request({
    url: '/transportation/dispatch/del/' + id,
    method: 'delete'
  });
}
