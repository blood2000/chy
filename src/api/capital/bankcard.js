import request from '@/utils/request';

// 用户银行卡-查询列表
export const bankListApi = '/payment/bankCard/list';
export function banklist(data) {
  return request({
    url: bankListApi,
    method: 'post',
    data: data
  });
}

// 查询详细
export function getBankDetail(id) {
  return request({
    url: `/payment/bankCard/${id}`,
    method: 'get'
  });
}

// 新增
export function addBank(data) {
  return request({
    url: '/payment/bankCard',
    method: 'post',
    data: data
  });
}

// 修改
export function updateBank(data) {
  return request({
    url: '/payment/bankCard',
    method: 'put',
    data: data
  });
}

// 删除
export function delBank(ids) {
  return request({
    url: `/payment/bankCard/${ids}`,
    method: 'delete'
  });
}
