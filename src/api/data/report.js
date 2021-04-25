import request from '@/utils/request';

// 上报列表
export const listApi = '/transportation/waybillReport/findList';
export function waybillReport(query) {
  return request({
    url: listApi,
    method: 'get',
    params: query
  });
}

// 查询调度列表
// export function teamList(data) {
//   return request({
//     url: '/assets/team/list',
//     method: 'post',
//     data: data
//   });
// }
