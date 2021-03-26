import request from '@/utils/request';

// 查询运单列表
export function listManages(query) {
  return request({
    url: '/transportation/waybill/manageList',
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

// 运单作废
export function waybillInvalid(code) {
  return request({
    url: `/transportation/waybillOper/invalid?wayBillInCode=${code}`,
    method: 'get'
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
    url: `/transportation/waybillComment/getByWayBillCode?wayBillCode=${code}&type=${type}`,
    method: 'get'
  });
}
