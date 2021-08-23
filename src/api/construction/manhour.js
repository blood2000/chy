import request from '@/utils/request';

// web机械工时列表
export const getMachineWorkingapi = '/kydsz/machineWorkHours/web—getMachineWorkingList';
export function getMachineWorkingList(data) {
  return request({
    url: '/kydsz/machineWorkHours/web—getMachineWorkingList',
    method: 'post',
    data: data
  });
}
