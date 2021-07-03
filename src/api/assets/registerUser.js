import request from '@/utils/request';

export function list(data) {
  return request({
    url: '/assets/ruser/list',
    method: 'post',
    data: Object.assign({}, { isAsc: 'desc', orderByColumn: 'create_time' }, data)
  });
}

export function delRegisterUser(userCode) {
  return request({
    url: '/assets/ruser/' + userCode,
    method: 'delete'
  });
}

export function registerTeam(data) {
  return request({
    url: '/assets/ruser/team',
    method: 'post',
    data: data
  });
}

export function registerDriver(data) {
  return request({
    url: '/assets/ruser/driver',
    method: 'post',
    data: data
  });
}

