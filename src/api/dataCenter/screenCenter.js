import request from '@/utils/request';

/** ============================可视化大屏============================ */

// 大屏分页列表
export function getDataScreensList(query) {
  return request({
    url: `/analysis/dataScreens`,
    method: 'get',
    params: query
  });
}

// 新增数据大屏
export function addDataScreens(data) {
  return request({
    url: '/analysis/dataScreens',
    method: 'post',
    data: data
  });
}

// 修改数据大屏
export function updateDataScreens(id, data) {
  return request({
    url: `/analysis/dataScreens/${id}`,
    method: 'put',
    data: data
  });
}

// 获取数据大屏信息
export function getDataScreens(id) {
  return request({
    url: `/analysis/dataScreens/${id}`,
    method: 'get'
  });
}

// 删除数据大屏
export function delDataScreens(ids) {
  return request({
    url: `/analysis/dataScreens/${ids}`,
    method: 'delete'
  });
}

/** ============================图库接口============================ */

// 图库列表
export function getPictureLibraryList(query) {
  return request({
    url: `/analysis/dataScreenImages/page`,
    method: 'get',
    params: query
  });
}

// 图库新增图片
export function addPicture(data) {
  return request({
    url: '/analysis/dataScreenImages',
    method: 'post',
    data: data
  });
}

// 图库删除图片
export function delPicture(ids) {
  return request({
    url: `/analysis/dataScreenImages/${ids}`,
    method: 'delete'
  });
}

