import request from '@/utils/request';


export function list(query) {
  return request({
    url: '/system/sms/pageList',
    method: 'get',
    params: query
  });
}
