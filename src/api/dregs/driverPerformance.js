import request from '@/utils/request';

// 司机绩效统计
export function driverValueList(query) {
  return request({
    url: '/transportation/batch/driverValueList',
    method: 'get',
    params: query
  });
}

// 司机绩效统计
export function disZtcList(teamCode) {
  return request({
    url: '/transportation/batch/disZtcList/' + teamCode,
    method: 'get'
  });
}
// 司机绩效统计
export function disProjectList(teamCode) {
  return request({
    url: '/transportation/batch/disProjectList/' + teamCode,
    method: 'get'
  });
}
