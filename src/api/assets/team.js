import request from '@/utils/request';
import { praseStrEmpty } from '@/utils/ddc';
// 查询调度者列表
export const listTeamApi = '/assets/team/list';
export function listInfo(query) {
  return request({
    url: listTeamApi,
    method: 'post',
    data: query
  });
}

// 查询调度者详细
export function getInfo(id) {
  return request({
    url: '/assets/team/' + id,
    method: 'get'
  });
}

// 新增调度者
export function addInfo(data) {
  return request({
    url: '/assets/team',
    method: 'post',
    data: data
  });
}

// 修改调度者
export function updateInfo(data) {
  return request({
    url: '/assets/team',
    method: 'put',
    data: data
  });
}

// 删除调度者
export function delInfo(id) {
  return request({
    url: '/assets/team/' + id,
    method: 'delete'
  });
}

// 邀请司机
export function applyDriver(data) {
  return request({
    url: '/assets/apply/invitation',
    method: 'post',
    data: data
  });
}

// 获取调度者要处理的司机列表
export function listApply(teamCode) {
  return request({
    url: `/assets/apply/team/` + praseStrEmpty(teamCode),
    method: 'post'
  });
}

// 处理申请
export function dealApply(data) {
  return request({
    url: `/assets/apply/join/deal`,
    method: 'put',
    data: data
  });
}

