import request from '@/utils/request';

// 查询稽核明细列表
export const listManagesApi = '/transportation/waybillInspect/inspectList';
export function listManages(query) {
  return request({
    url: listManagesApi,
    method: 'get',
    params: query
  });
}

// 新增标记稽核情况
export function waybillInspectSave(data) {
  return request({
    url: '/transportation/waybillInspect/save',
    method: 'post',
    data: data
  });
}

// 根据运单CODE查询稽查情况
export function findInspect(waybillCode) {
  return request({
    url: `/transportation/waybillInspect/findByWaybillCode?waybillCode=${waybillCode}`,
    method: 'get'
  });
}

// 查询运单详情-运单(根据运单CODE获取运单详情)
export function getWayBill(code) {
  return request({
    url: `/transportation/waybill/getWayBillByCode?code=${code}`,
    method: 'get'
  });
}

// 查询运单详情-回单(根据运单CODE获取运单装货-卸货信息)
export function getWaybillAttachment(code, type) {
  return request({
    url: `/transportation/waybillAttachment/getByWayBillCode?waybillCode=${code}&type=${type}`,
    method: 'get'
  });
}

// 查询运单详情-评价(根据运单CODE获取评价)
export function getWaybillComment(code, type) {
  return request({
    url: `/transportation/waybillComment/getByWayBillCode?wayBillCode=${code}&commentObject=${type}`,
    method: 'get'
  });
}

// 查询运单详情-轨迹(根据运单CODE获取运单轨迹)
export function getWaybillTrace(code) {
  return request({
    url: `/transportation/waybillTrace/getByWayBillCode?waybillCode=${code}`,
    method: 'get'
  });
}


// 查询运单详情-轨迹(根据运单CODE获取运单轨迹)
export const inspectStatisticsListApi = '/transportation/waybillInspect/inspectStatisticsList';
export function getInspectStatisticsList(clientName,endTime,startTime,teamName,userGradeDictValue,pageNum,pageSize) {
  return request({
    url: `/transportation/waybillInspect/inspectStatisticsList?clientName=${clientName}&endTime=${endTime}&startTime=${startTime}&teamName=${teamName}&userGradeDictValue=${userGradeDictValue}&pageNum=${pageNum}&pageSize=${pageSize}`,
    method: 'get'
  });
}
