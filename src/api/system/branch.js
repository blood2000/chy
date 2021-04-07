import request from '@/utils/request';

// 网点列表
export function getBranchList(query) {
  return request({
    url: '/system/branch/list',
    method: 'get',
    params: query
  });
}

export function list(query) {
  return request({
    url: '/system/branch/list',
    method: 'post',
    data: query
  });
}

// 查询岗位详细
export function getBranch(id) {
  return request({
    url: '/system/branch/' + id,
    method: 'get'
  });
}

// 新增岗位
export function addBranch(data) {
  return request({
    url: '/system/branch',
    method: 'post',
    data: data
  });
}

// 修改岗位
export function updateBranch(data) {
  return request({
    url: '/system/branch',
    method: 'put',
    data: data
  });
}

// 删除岗位
export function delBranch(id) {
  return request({
    url: '/system/branch/' + id,
    method: 'delete'
  });
}
