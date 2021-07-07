
// import axios from 'axios';
import JSZip from 'jszip';
import FileSaver from 'file-saver';
// const getFile = (url) => {
//   return new Promise((resolve, reject) => {
//     axios({
//       method: 'get',
//       url,
//       responseType: 'arraybuffer'
//     }).then(data => {
//       resolve(data.data);
//     }).catch(error => {
//       reject(error.toString());
//     });
//   });
// };

/**
 * 批量导出轨迹并打包压缩功能
    1.选中电子合同的地址存在一个数组中
    2.依次请求地址并将其下载
    3.后用jszip压缩文件
    4.最后用file-saver生成文件
 * selectImgList String 数据Url地址
 * zipName String 压缩包名(不传就是时间戳)
 * success Function 成功回调函数
*/
export const handleBatchDownload = async(selectImgList, zipName = '', success) => {
  const data = selectImgList;
  const zip = new JSZip();
  // const cache = {};
  // const promises = [];
  await data.forEach((item, index) => {
    console.log(item);
    // const arr_name = item.split('/');
    const file_name = index + '.png'; // 获取文件名
    zip.file(file_name, item.replace(/^data:image\/\w+;base64,/, ''), {
      base64: true
    }); // 逐个添加文件
    // cache[file_name] = data;
    // promises.push(promise);
  });
  zip.generateAsync({
    type: 'blob'
  }).then(content => { // 生成二进制流
    FileSaver.saveAs(content, zipName + Date.now() + '.zip'); // 利用file-saver保存文件
    success && success();
  });
  // Promise.all(promises).then(() => {
  // });
};
