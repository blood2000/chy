import request from '@/utils/request';

// 网点列表
export function getBranchList(query) {
  return request({
    url: '/system/branch/list',
    method: 'get',
    params: query
  });
}
