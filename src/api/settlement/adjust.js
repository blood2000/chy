import request from '@/utils/request';

// 查询运单核算列表
export const adjustListApi = '/transportation/waybillBalanceInfo/findList';
export function adjustList(query) {
  return request({
    url: '/transportation/waybillBalanceInfo/findList',
    method: 'get',
    params: query
  });
}

// 货主驳回卸货凭证
export function rejectUnload(data) {
  return request({
    url: '/transportation/waybillBalanceInfo/shipperRebutUnloading',
    method: 'post',
    data: data
  });
}

// 查询运单子单列表
export const childListApi = '/transportation/waybill/childList';
export function childList(query) {
  return request({
    url: '/transportation/waybill/childList',
    method: 'get',
    params: query
  });
}


