import request from '@/utils/request';

// web土票管理列表
export const getProjectTicketApi = '/kydsz/projectTicket/web—getProjectTicketList';
export function getProjectTicketList(data) {
  return request({
    url: getProjectTicketApi,
    method: 'post',
    data: data
  });
}

// web土票名称模糊
export function getTicketName(query) {
  return request({
    url: '/kydsz/projectTicket/web—getTicketName',
    method: 'get',
    params: query
  });
}

// web土票名称模糊
export function getReceiveSite(query) {
  return request({
    url: '/kydsz/projectTicket/web—getReceiveSite',
    method: 'get',
    params: query
  });
}

