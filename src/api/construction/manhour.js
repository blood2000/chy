import request from '@/utils/request';

// web机械工时列表
export function getMachineWorkingList(data) {
  return request({
    url: '/tools/machineWork/web—getMachineWorkingList',
    method: 'post',
    data: data
  });
}

