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

