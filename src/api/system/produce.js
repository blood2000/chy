import request from '@/utils/request';

// 查询菜单列表
export function listProduce(query) {
  return request({
    url: '/system/produce/list',
    method: 'get',
    params: query
  })
}
