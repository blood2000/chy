import request from '@/utils/request';

// 查询运单列表
export const listManagesApi = '/transportation/waybill/manageList';
export function listManages(query) {
  return request({
    url: listManagesApi,
    method: 'get',
    params: query
  });
}

// 查询渣土运单列表
export const listDregsManagesApi = '/transportation/waybill/managesDregsList';
export function listDregsManages(query) {
  return request({
    url: listDregsManagesApi,
    method: 'get',
    params: query
  });
}

// 标记异常
export function waybillAbnormal(data) {
  return request({
    url: '/transportation/waybillAbnormal/add',
    method: 'post',
    data: data
  });
}

// 批量标记异常
export function batchAbnormalAdd(data) {
  return request({
    url: '/transportation/waybillAbnormal/batchAbnormalAdd',
    method: 'post',
    data: data
  });
}

// 运单作废
export function waybillInvalid(code, reson) {
  return request({
    url: `/transportation/waybillOper/invalid?wayBillInCode=${code}&cancelReason=${reson}`,
    method: 'get'
  });
}
// 运单取消
export function waybillCancel(code) {
  return request({
    url: `/transportation/waybillOper/appCancelOrder/${code}`,
    method: 'delete'
  });
}
// 货主备注运单
export function waybillRemark(data) {
  return request({
    url: '/transportation/waybillOper/shipperRemark',
    method: 'post',
    data: data
  });
}

// 查询分单列表
export function waybillChild(query) {
  return request({
    url: '/transportation/waybill/childList',
    method: 'get',
    params: query
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

// 多式联运列表
export const multiListApi = '/transportation/waybill/multiList';
export function getMultiList(query) {
  return request({
    url: '/transportation/waybill/multiList',
    method: 'get',
    params: query
  });
}

// 查询多式联运运单详情
export function getMultiDetail(code) {
  return request({
    url: `/transportation/waybill/multiDetail?waybillCode=${code}`,
    method: 'get'
  });
}

// 多式联运子单列表
export function getMultiSonList(query) {
  return request({
    url: '/transportation/waybill/multiSonList',
    method: 'get',
    params: query
  });
}
