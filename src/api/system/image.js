import request from '@/utils/request';

// 获取文件列表
export function getFile(code) {
  return request({
    url: `/assets/upload/getUrlByCode?code=${code}`,
    method: 'post'
  });
}
