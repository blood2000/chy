import request from '@/utils/request';

// 查询合同列表列表
export const listContractApi = '/transportation/orderContract/list';
export function listContract(query) {
  return request({
    url: '/transportation/orderContract/list',
    method: 'get',
    params: query
  });
}
// 同步合同
export function syncContract(query) {
  return request({
    url: '/transportation/orderContract/sync',
    method: 'get',
    params: query
  });
}

// 生成电子合同
export function getContract(id) {
  return request({
    url: '/transportation/orderContract/generate/' + id,
    method: 'get'
  });
}
// 根据ID获取运单合同
export function getOrderContract(id) {
  return request({
    url: '/transportation/orderContract/' + id,
    method: 'get'
  });
}

// 保存合同
export function addTest(data) {
  return request({
    url: '/transportation/orderContract/save',
    method: 'post',
    data: data
  });
}
