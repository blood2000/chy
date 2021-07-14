import request from '@/utils/request';

// 运力统计
export function capacityStatisticsCount(query) {
  return request({
    url: '/transportation/capacityStatistics',
    method: 'get',
    params: query
  });
}

// 运单统计
export function waybillStatisticsCount(query) {
  return request({
    url: '/transportation/capacityStatistics/count',
    method: 'get',
    params: query
  });
}

// 列表
export function waybillStatisticsList(query) {
  return request({
    url: '/transportation/capacityStatistics/mapList',
    method: 'get',
    params: query
  });
}
