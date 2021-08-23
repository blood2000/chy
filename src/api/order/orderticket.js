import request from '@/utils/request';

// 查询货源票制列表列表
export function listOrderTicketRel(query) {
  return request({
    url: '/transportation/orderTicketRel/list',
    method: 'get',
    params: query
  });
}

// 查询货源票制详细
// export function getTest(testId) {
//   return request({
//     url: '/system/test/' + testId,
//     method: 'get'
//   });
// }

// 新增货源票制
export function addOrderTicketRel(data) {
  return request({
    url: '/transportation/orderTicketRel/add',
    method: 'post',
    data: data
  });
}

// 修改货源票制
export function updateOrderTicketRel(data) {
  return request({
    url: '/transportation/orderTicketRel/update',
    method: 'post',
    data: data
  });
}

// 删除货源票制
export function delOrderTicketRel(ids) {
  return request({
    url: '/transportation/orderTicketRel/del/' + ids,
    method: 'delete'
  });
}
