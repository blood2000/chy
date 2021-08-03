import request from '@/utils/request';
import { listDriverApi } from '../assets/driver';
// 查询树
export function getMediaTypeTree(data) {
  return request({
    url: '/system/media/type/treeselect',
    method: 'post',
    data: Object.assign({}, { isAsc: 'asc', orderByColumn: 'create_time' }, data)
  });
}

// 新增树节点
export function addMediaTypeTree(data) {
  return request({
    url: '/system/media/type',
    method: 'post',
    data: data
  });
}

// 获取树节点
export function getMediaType(code) {
  return request({
    url: `/system/media/type/${code}`,
    method: 'get'
  });
}
// 编辑树节点
export function editMediaTypeTree(data) {
  return request({
    url: '/system/media/type',
    method: 'put',
    data: data
  });
}

// 删除树节点
export function delMediaTypeTree(dictCodes) {
  return request({
    url: `/system/media/type/${dictCodes}`,
    method: 'delete'
  });
}

// 获取多媒体列表
export function getMediaInfoList(data) {
  return request({
    url: '/system/media/info/list',
    method: 'post',
    data: Object.assign({}, { isAsc: 'desc', orderByColumn: 'create_time' }, data)
  });
}

export function addMediaInfo(data) {
  return request({
    url: '/system/media/info',
    method: 'post',
    data: data
  });
}

export function editMediaInfo(data) {
  return request({
    url: '/system/media/info',
    method: 'put',
    data: data
  });
}

export function delMediaInfo(mediaCode) {
  return request({
    url: `/system/media/info/${mediaCode}`,
    method: 'delete'
  });
}
export function getMediaInfo(code) {
  return request({
    url: `/system/media/info/${code}`,
    method: 'get'
  });
}
