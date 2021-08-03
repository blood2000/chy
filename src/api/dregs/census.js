import request from '@/utils/request';

// 统计首页
export function ListStatistics(query) {
  return request({
    url: '/transportation/statistics/pageStatisticsProject',
    method: 'get',
    params: query
  });
}
// 项目统计
export function ProjectDetails(query) {
  return request({
    url: '/transportation/statistics/getStatisticsProject',
    method: 'get',
    params: query
  });
}
// 出入明细
export function InOutDetails(query) {
  return request({
    url: '/transportation/statistics/getInOutDetails',
    method: 'get',
    params: query
  });
}
// 泥尾统计
export function MudtailDetails(query) {
  return request({
    url: '/transportation/statistics/getStatisticsMudtail',
    method: 'get',
    params: query
  });
}
// 车辆明细
export function ListVechicleDetails(query) {
  return request({
    url: '/transportation/statistics/listVechicleDetails',
    method: 'get',
    params: query
  });
}
