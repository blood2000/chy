import request from '@/utils/request';

// web项目列表
export function webGetMachineProjectList(query) {
  return request({
    url: '/kydsz/machineProject/webGetMachineProjectList',
    method: 'get',
    params: query
  });
}
