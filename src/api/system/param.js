import request from '@/utils/request';

// 查询树
export function getParamTree(data) {
  return request({
    url: '/system/param/type/treeselect',
    method: 'post',
    data: Object.assign({}, { isAsc: 'asc', orderByColumn: 'create_time' }, data)
  });
}

// 新增树节点
export function addParamTree(data) {
  return request({
    url: '/system/param/type',
    method: 'post',
    data: data
  });
}

// 编辑树节点
export function editParamTree(data) {
  return request({
    url: '/system/param/type',
    method: 'put',
    data: data
  });
}

// 删除树节点
export function delParamTree(typeCodes) {
  return request({
    url: `/system/param/type/${typeCodes}`,
    method: 'delete'
  });
}

// 选中树节点详情
export function getParamInfo(id) {
  return request({
    url: `/system/param/type/${id}`,
    method: 'get'
  });
}

// 查询参数配置
export function getParam(data) {
  return request({
    url: '/system/param/data/list',
    method: 'post',
    data: Object.assign({}, { isAsc: 'desc', orderByColumn: 'create_time' }, data)
  });
}

// 新增参数配置
export function addParam(data) {
  return request({
    url: '/system/param/data',
    method: 'post',
    data: data
  });
}

// 编辑参数配置
export function editParam(data) {
  return request({
    url: '/system/param/data',
    method: 'put',
    data: data
  });
}

// 删除参数配置
export function delParam(codes) {
  return request({
    url: `/system/param/data/${codes}`,
    method: 'delete'
  });
}

