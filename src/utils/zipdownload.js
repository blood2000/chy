import axios from 'axios';
import { getToken } from '@/utils/auth';

const mimeMap = {
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  zip: 'application/zip'
};

const produceCode = '776ca8e240574192b6e0f69b417163df';// 产品编码
const appCode = '3f78fbfc13b14fa4b3d78665124ef4bb';// 应用编码
const appVersion = '2.0';// 应用版本
const terminalType = 'web';// 终端类别（0其它 1:app 2:web 3:微信小程序）
const terminalDeviceBrand = '1';// 手机厂商-app
const terminalSystemModel = '2';// 手机型号-app
const terminalSystemVersion = '3';// 系统版本号-app
const terminalIMEI = '4';// MEI（国际移动设备识别码）-app

const baseUrl = process.env.VUE_APP_BASE_API;
export function downLoadZip(str, filename) {
  var url = baseUrl + str;
  axios({
    method: 'get',
    url: url,
    responseType: 'blob',
    headers: {
      'Authorization': 'Bearer ' + getToken(),
      'Produce-Code': produceCode,
      'App-Code': appCode,
      'App-Version': appVersion,
      'Terminal-Type': terminalType
    }
  }).then(res => {
    resolveBlob(res, mimeMap.zip);
  });
}
/**
 * 解析blob响应内容并下载
 * @param {*} res blob响应内容
 * @param {String} mimeType MIME类型
 */
export function resolveBlob(res, mimeType) {
  const aLink = document.createElement('a');
  var blob = new Blob([res.data], { type: mimeType });
  // //从response的headers中获取filename, 后端response.setHeader("Content-disposition", "attachment; filename=xxxx.docx") 设置的文件名;
  var patt = new RegExp('filename=([^;]+\\.[^\\.;]+);*');
  var contentDisposition = decodeURI(res.headers['content-disposition']);
  var result = patt.exec(contentDisposition);
  var fileName = result[1];
  fileName = fileName.replace(/\"/g, '');
  aLink.href = URL.createObjectURL(blob);
  aLink.setAttribute('download', fileName); // 设置下载文件名称
  document.body.appendChild(aLink);
  aLink.click();
  document.body.appendChild(aLink);
}
