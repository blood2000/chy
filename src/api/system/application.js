import request from '@/utils/request';
// 查询菜单列表
export function listApplication(query) {
  return request({
    url: '/system/application/list',
    method: 'get',
    params: query
  })
}
