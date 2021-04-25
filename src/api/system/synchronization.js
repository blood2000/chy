import request from '@/utils/request';

// 货主信息同步redis
export function setShipmentInfoRedisAll() {
  return request({
    url: '/assets/shipment/setShipmentInfoRedisAll',
    method: 'post'
  });
}

// 用户信息同步redis
export function setUserRoleInfoRedisAll() {
  return request({
    url: '/system/role/setUserRoleInfoRedisAll',
    method: 'post'
  });
}

// 司机信息同步redis
export function setDriverRedisAll() {
  return request({
    url: '/system/driver/setDriverRedisAll',
    method: 'post'
  });
}

// 调度者信息同步redis
export function setTeamrRedisAll() {
  return request({
    url: '/system/team/setTeamrRedisAll',
    method: 'post'
  });
}
