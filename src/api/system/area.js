import request from '@/utils/request';

// 查询省
export function getProvinceList(query) {
  return request({
    url: '/system/province/list',
    method: 'get',
    params: query
  });
}

// 查询市
export function getCityList(query) {
  return request({
    url: '/system/city/list',
    method: 'get',
    params: query
  });
}

// 查询县
export function geCountyList(query) {
  return request({
    url: '/system/county/list',
    method: 'get',
    params: query
  });
}

// 添加区/县 code

export function addCounty(data) {
  return request({
    url: '/system/county',
    method: 'post',
    data: data
  });
}
