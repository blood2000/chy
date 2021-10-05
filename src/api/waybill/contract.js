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

// 生成货主电子签章
export function getShipmentSign(data) {
  return request({
    url: '/iot/zjtdBusiness/cargoOwnerContractCreationAndSigning',
    method: 'post',
    data: data
  });
}

// 生成司机电子签章
export function getDriverSign(data) {
  return request({
    url: '/iot/zjtdBusiness/driverContractCreationAndSigning',
    method: 'post',
    data: data
  });
}

// 批量生成电子签章
export function getContractSign(data) {
  return request({
    url: '/iot/zjtdBusiness/contractCreationAndSigning',
    method: 'post',
    data: data
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

// 根据code获取运单合同详情
export function getContractByCode(code) {
  return request({
    url: '/transportation/orderContract/' + code,
    method: 'get'
  });
}
