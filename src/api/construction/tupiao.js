import request from '@/utils/request';

// web土票管理列表
export function getProjectTicketList(data) {
  return request({
    url: '/tools/projectTicket/web—getProjectTicketList',
    method: 'post',
    data: data
  });
}

