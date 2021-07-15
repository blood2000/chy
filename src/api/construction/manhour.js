import request from '@/utils/request';

// web机械工时列表
export const getMachineWorkingapi = '/project-kydsz/machineWork/web—getMachineWorkingList';
export function getMachineWorkingList(data) {
  return request({
    url: '/project-kydsz/machineWork/web—getMachineWorkingList',
    method: 'post',
    data: data
  });
}

