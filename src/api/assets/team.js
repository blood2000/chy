import request from '@/utils/request'

// 查询调度者列表
export function listInfo(query) {
  return request({
    url: '/assets/info/list',
    method: 'get',
    params: query
  })
}

// 查询调度者详细
export function getInfo(id) {
  return request({
    url: '/assets/info/' + id,
    method: 'get'
  })
}

// 新增调度者
export function addInfo(data) {
  return request({
    url: '/assets/info',
    method: 'post',
    data: data
  })
}

// 修改调度者
export function updateInfo(data) {
  return request({
    url: '/assets/info',
    method: 'put',
    data: data
  })
}

// 删除调度者
export function delInfo(id) {
  return request({
    url: '/assets/info/' + id,
    method: 'delete'
  })
}