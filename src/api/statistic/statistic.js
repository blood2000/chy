import request from '@/utils/request';

// 监管数据
export function getRegulatoryData(branchCode) {
  return request({
    url: `/schedule/bigScreenSeach/getRegulatoryCount/${branchCode}`,
    method: 'get'
  });
}

// 用户情况
export function getUserData(branchCode) {
  return request({
    url: `/schedule/bigScreenSeach/getBranchUser/${branchCode}`,
    method: 'get'
  });
}

// 运力情况
export function getCapacityData(branchCode) {
  return request({
    url: `/schedule/bigScreenSeach/getTransportCount/${branchCode}`,
    method: 'get'
  });
}
