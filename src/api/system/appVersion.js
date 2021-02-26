import request from '@/utils/request';
// 查询菜单列表
export function listAppVersion(query) {
  return request({
    url: '/system/version/list',
    method: 'get',
    params: query
  })
}
