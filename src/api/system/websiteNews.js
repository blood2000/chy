import request from '@/utils/request';

// 分页列表
export function list(query) {
  return request({
    url: '/system/websiteNews/list',
    method: 'post',
    data: query
  });
}

// 查询新闻
export function getWebsiteNews(code) {
  return request({
    url: '/system/websiteNews/' + code,
    method: 'get'
  });
}

// 删除新闻
export function delWebsiteNews(code) {
  return request({
    url: '/system/websiteNews/' + code,
    method: 'delete'
  });
}

// 修改新闻
export function updateWebsiteNews(data) {
  return request({
    url: '/system/websiteNews',
    method: 'put',
    data: data
  });
}

// 新增新闻
export function addWebsiteNews(data) {
  return request({
    url: '/system/websiteNews',
    method: 'post',
    data: data
  });
}
