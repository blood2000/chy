import request from '@/utils/request';

// web考勤列表
export const getEmployeeAttendanceApi = '/kydsz/employeeAttendance/web—getEmployeeAttendanceList';
export function getEmployeeAttendanceList(data) {
  return request({
    url: '/kydsz/employeeAttendance/web—getEmployeeAttendanceList',
    method: 'post',
    data: data
  });
}
