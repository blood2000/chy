import request from '@/utils/request';

// 获取文件列表
export function getFile(data) {
  return request({
    url: '/assets/upload/getUrlByCode',
    method: 'post',
    data: data
  });
}
