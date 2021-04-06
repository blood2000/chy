import request from '@/utils/request';
// 查询菜单列表
export function listApplication(query) {
  return request({
    url: '/system/application/list',
    method: 'get',
    params: query
  });
}
export function listAll(query) {
  return request({
    url: '/system/application/listAll',
    method: 'get',
    params: query
  });
}
export function list(query) {
  return request({
    url: '/system/application/list',
    method: 'post',
    data: query
  });
}
// 查询详细
export function getApplication(appId) {
  return request({
    url: '/system/application/' + appId,
    method: 'get'
  });
}
// 新增应用
export function addApplication(data) {
  return request({
    url: '/system/application',
    method: 'post',
    data: data
  });
}

// 修改应用
export function updateApplication(data) {
  return request({
    url: '/system/application',
    method: 'put',
    data: data
  });
}
// 状态修改
export function changeStatus(produceCode, delFlag) {
  const data = {
    produceCode,
    delFlag
  };
  return request({
    url: '/system/application/changeStatus',
    method: 'put',
    data: data
  });
}
