import request from '@/utils/request';

// web机械工时列表
export const getMachineWorkingapi = '/tools/machineWork/web—getMachineWorkingList';
export function getMachineWorkingList(data) {
  return request({
    url: '/tools/machineWork/web—getMachineWorkingList',
    method: 'post',
    data: data
  });
}

