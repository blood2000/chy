import request from '@/utils/request';

// 查询列表
export function listConfig(query) {
  return request({
    url: '/system/tableHead/pageList',
    method: 'get',
    params: query
  });
}

// 查询详细
export function getConfig(code) {
  return request({
    url: `/system/tableHead/getByCode?code=${code}`,
    method: 'get'
  });
}

// 新增
export function addConfig(data) {
  return request({
    url: '/system/tableHead/add',
    method: 'post',
    data: data
  });
}

// 修改
export function updateConfig(data) {
  return request({
    url: '/system/tableHead/update',
    method: 'put',
    data: data
  });
}

// 删除
export function delConfig(code) {
  return request({
    url: `/system/tableHead/delete?code=${code}`,
    method: 'delete'
  });
}

// 批量删除
export function delAllConfig(data) {
  return request({
    url: `/system/tableHead/deleteByCodes`,
    method: 'delete',
    data: data,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

// 同步
export function syncConfig(data) {
  return request({
    url: '/system/tableHead/sync',
    method: 'post',
    data: data
  });
}

/**
 * 查询表头字段
 * route：接口地址
 */
export function tableHeadList(route) {
  return request({
    url: '/system/tableHead/findList',
    method: 'get',
    params: {
      route: route
    }
  });
}

// 主表-分页列表
export function masterPageList(query) {
  return request({
    url: '/system/tableHead/masterPageList',
    method: 'get',
    params: query
  });
}

// 主表-新增
export function addMaster(data) {
  return request({
    url: '/system/tableHead/addMaster',
    method: 'post',
    data: data
  });
}

// 主表-修改
export function updateMaster(data) {
  return request({
    url: '/system/tableHead/updateMaster',
    method: 'put',
    data: data
  });
}

// 主表-删除
export function deleteMaster(code) {
  return request({
    url: `/system/tableHead/deleteMaster?code=${code}`,
    method: 'delete'
  });
}

