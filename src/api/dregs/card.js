import request from '@/utils/request';

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
export function cpuCardListCardData(query) {
  return request({
    url: '/transportation/cpuCard/listCardData',
    method: 'get',
    params: query
  });
}



