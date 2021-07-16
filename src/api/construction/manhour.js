import request from '@/utils/request';

// web机械工时列表
export const getMachineWorkingapi = '/kydsz/machineWork/web—getMachineWorkingList';
export function getMachineWorkingList(data) {
  return request({
    url: '/kydsz/machineWork/web—getMachineWorkingList',
    method: 'post',
    data: data
  });
}

