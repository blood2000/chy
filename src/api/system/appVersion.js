import request from '@/utils/request';
// 查询菜单列表
export function listAppVersion(query) {
  return request({
    url: '/system/version/list',
    method: 'get',
    params: query
  });
}

// 查询分页列表
export function list(data) {
  return request({
    url: '/system/version/list',
    method: 'post',
    data: data
  });
}
// 查询版本详细
export function getVersion(versionId) {
  return request({
    url: '/system/version/' + versionId,
    method: 'get'
  });
}
// 新增产品
export function addVersion(data) {
  return request({
    url: '/system/version',
    method: 'post',
    data: data
  });
}
// 修改产品
export function updateVersion(data) {
  return request({
    url: '/system/version',
    method: 'put',
    data: data
  });
}
// 状态修改
export function changeStatus(appVersionCode, delFlag) {
  const data = {
    appVersionCode,
    delFlag
  };
  return request({
    url: '/system/version/changeStatus',
    method: 'put',
    data: data
  });
}

export function changeForce(appVersionCode, isForce) {
  const data = {
    appVersionCode,
    isForce
  };
  return request({
    url: '/system/version/changeStatus',
    method: 'put',
    data: data
  });
}


export function changeUpdate(appVersionCode, isUpdate) {
  const data = {
    appVersionCode,
    isUpdate
  };
  return request({
    url: '/system/version/changeStatus',
    method: 'put',
    data: data
  });
}


