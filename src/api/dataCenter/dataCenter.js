import request from '@/utils/request';

// 获取数据集信息
export function getDataModel(id) {
  return request({
    url: `/analysis/dataModelInfos/${id}`,
    method: 'get'
  });
}

// 模型查询
export function searchDataModel(data) {
  return request({
    url: '/analysis/dataModelInfos/query',
    method: 'post',
    data: data
  });
}
