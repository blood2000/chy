import request from '@/utils/request';

// 发布货源
export function orderPubilsh(data) {
  return request({
    url: '/transportation/order/pubilsh',
    method: 'post',
    data: data
  });
}

// 修改货源 /transportation/order/modify
export function update(data) {
  return request({
    url: '/transportation/order/modify',
    method: 'post',
    data: data
  });
}

// 获取详情
export function getOrderByCode(code) {
  return request({
    url: '/transportation/orderInfoSearch/getOrderDetailBycode/' + code,
    method: 'get'
  });
}
// // 获取详情
// export function getOrderByCode(mainOrderCode) {
//   return request({
//     url: '/transportation/orderInfoSearch/getOrderDetail/' + mainOrderCode,
//     method: 'get'
//   });
// }

// 获取货源运费信息
export function orderFreight(query) {
  return request({
    url: '/transportation/orderFreight/find',
    method: 'get',
    params: query
  });
}

// 获取货源预估费用
/* http://192.168.30.1:8080/doc.html#/ddc-transportation/%E8%B4%A7%E6%BA%90/estimateCostUsingGET
orderFreightBoList[0].code	运费code	query	true	string
orderFreightBoList[0].ruleCode	货主核算规则表CODE	query	true	string
orderFreightBoList[0].ruleItemCode	核算规则项表CODE	query	true	string
orderFreightBoList[0].ruleValue	规则项值	query	true	string
orderFreightBoList[0].type	规则项类型 1.收入 2.支出	query	true	integer(int32)

// 非必传
number	车数	query	false	integer(int32)
orderAddressCode	地址code	query	false	string
orderFreightBoList[0].ruleDetailShipmentCode	货主核算规则细表CODE	query	false	string
orderGoodsCode	商品code	query	false	string
stowageStatus	配载方式 0->吨，1->/方配载 2->车数配载	query	false	string
userCode	代发货主code	query	false	string
vehicleMaxWeight	最高配载吨数/立方	query	false	number
weight	货品吨数/立方	query	false	number
*/
export function estimateCost(data) {
  return request({
    url: '/transportation/orderFreight/estimateCost',
    method: 'post',
    data: data
  });
}

