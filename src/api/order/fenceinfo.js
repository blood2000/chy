import request from '@/utils/request';

export function getList(query) {
  return request({
    url: '/kafka/zjFenceCollisionLog/page',
    method: 'get',
    params: query
  });
}
