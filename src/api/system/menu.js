import request from '@/utils/request';
import { praseStrEmpty } from '@/utils/ddc';

// 查询菜单列表
export function listMenu(query) {
  return request({
    url: '/system/menu/list',
    method: 'get',
    params: query
  });
}

// 查询菜单详细
export function getMenu(menuId) {
  return request({
    url: '/system/menu/' + menuId,
    method: 'get'
  });
}

// 查询菜单下拉树结构
export function treeselect(query, userCode) {
  return request({
    url: '/system/menu/treeselect/' + praseStrEmpty(userCode),
    method: 'get',
    params: query
  });
}

// 查询菜单下拉树结构（版本树+菜单树）
export function treeselect2(query, userCode) {
  return request({
    url: '/system/menu/treeselect2/' + praseStrEmpty(userCode),
    method: 'get',
    params: query
  });
}


// 根据角色ID查询菜单下拉树结构
export function roleMenuTreeselect(roleId, query) {
  return request({
    url: '/system/menu/roleMenuTreeselect/' + roleId,
    method: 'get',
    params: query
  });
}

// 根据角色ID查询菜单下拉树结构（版本树+菜单树）
export function roleMenuTreeselect2(roleId, query) {
  return request({
    url: '/system/menu/roleMenuTreeselect2/' + roleId,
    method: 'get',
    params: query
  });
}

// 新增菜单
export function addMenu(data) {
  return request({
    url: '/system/menu',
    method: 'post',
    data: data
  });
}

// 修改菜单
export function updateMenu(data) {
  return request({
    url: '/system/menu',
    method: 'put',
    data: data
  });
}

// 删除菜单
export function delMenu(menuId) {
  return request({
    url: '/system/menu/' + menuId,
    method: 'delete'
  });
}

// 产品应用版本树
export function versionTreeList(data) {
  return request({
    url: '/system/version/treeselect',
    method: 'post',
    data: data
  });
}
