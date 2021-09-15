import request from '@/utils/request';

// // 查询货源票制列表列表
// export function listOrderTicketRel(query) {
//   return request({
//     url: '/transportation/orderTicketRel/list',
//     method: 'get',
//     params: query
//   });
// }

// // 查询货源票制详细
// // export function getTest(testId) {
// //   return request({
// //     url: '/system/test/' + testId,
// //     method: 'get'
// //   });
// // }

// // 新增货源票制
// export function addOrderTicketRel(data) {
//   return request({
//     url: '/transportation/orderTicketRel/add',
//     method: 'post',
//     data: data
//   });
// }

// 设备围栏相关业务-增加平台围栏
export function fencePlatCreate(data) {
  return request({
    url: '/iot/fenceBusiness/fencePlatCreate',
    method: 'post',
    data: data
  });
}

// 删除货源票制
export function fencePlatDelete(orderCode) {
  return request({
    url: `/iot/fenceBusiness/fencePlatDelete/${orderCode}`,
    method: 'delete'
  });
}
