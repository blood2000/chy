import request from '@/utils/request';

// 上传图片api
export const uploadImgApi = '/assets/upload/uploadToHW';
// 下载图片api
export const downImgApi = '/assets/upload/imageDown';

// 获取文件列表
export function getFile(code) {
  return request({
    url: `/assets/upload/getUrlByCode?code=${code}`,
    method: 'post'
  });
}

// 自动识别
export function uploadOcr(data) {
  return request({
    url: '/assets/upload/ocr',
    method: 'post',
    data: data
  });
}
