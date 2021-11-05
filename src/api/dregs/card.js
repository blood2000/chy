import request from '@/utils/request';
// console.log([request]);

// request.interceptors.request.use()
// 查询卡历史记录
export function cardHistoryList(query) {
  return request({
    url: '/transportation/batch/cardHistoryList',
    method: 'get',
    params: query
  });
}

// 补卡
/**
 *
    card16no	卡16位id		false  string
    cardBatchNo	卡批次		false  string
    newCardBatchNo	新的卡批次
*/
export function cardReplacement(data) {
  return request({
    url: '/transportation/batch/cardReplacement',
    method: 'post',
    data: data
  });
}



/* 获取迁卡数据 */
export function getCpuCardListCardData(query) {
  return request({
    url: '/transportation/cpuCard/listCardData',
    method: 'get',
    params: query
  });
}

/* 获取迁卡数据 */
// export function cpuCardListCardData2(data) {
//   // request.headers['Content-Type'] = 'multipart/form-data';


//   return request({
//     url: '/transportation/cpuCard/listCardData',
//     method: 'post',
//     data: data
//   });
// }
/* 获取迁卡数据 */
export function cpuCardListCardData(data) {
  return request({
    url: '/transportation/cpuCard/v2/listCardData',
    method: 'post',
    data: data
  });
}


/* 获取当前货主常用调度者 */
export function getShipmentTeamList(data) {
  return request({
    url: '/transportation/shipmentTeam/list',
    method: 'post',
    data: data
  });
}

/* 获取当前货主常用调度者 */
export function cpuCardGetCardUserInfo(data) {
  return request({
    url: '/transportation/cpuCard/getCardUserInfo',
    method: 'post',
    data: data
  });
}

/* 获取当前货主常用调度者 */
export function cpuCardSaveCardLog(data) {
  return request({
    url: '/transportation/cpuCard/saveCardLog',
    method: 'post',
    data: data
  });
}

/* 更新卡运单关联关系 */
export function cpuCardUpdateCardWaybillRel(data) {
  return request({
    url: '/transportation/cpuCard/updateCardWaybillRel',
    method: 'post',
    data: data
  });
}



