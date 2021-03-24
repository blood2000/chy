import request from '@/utils/request';

// 查询运单列表
export function listManages(query) {
  return request({
    url: '/transportation/waybill/manageList',
    method: 'get',
    params: query
  });
}

// 查询运单详细
export function getDetail(code) {
  return request({
    url: `/transportation/waybill/getWayBillByCode?code=${code}`,
    method: 'get'
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

