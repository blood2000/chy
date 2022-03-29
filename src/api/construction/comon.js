import request from '@/utils/request';

// web项目列表
export function webGetMachineProjectList(query) {
  return request({
    url: '/kydsz/machineProject/webGetMachineProjectList',
    method: 'get',
    params: query
  });
}


//根据主单修改子单状态
export function updateSubMenuStatus(data) {
  return request({
    url: '/transportation/waybillOper/flowSyncWaybillStatus',
    method: 'post',
    data: data
  });
}