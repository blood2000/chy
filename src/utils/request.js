import axios from 'axios';
import { MessageBox, Message } from 'element-ui';
import store from '@/store';
import { getToken } from '@/utils/auth';
import errorCode from '@/utils/errorCode';
import { tansParams, parseTime } from '@/utils/ddc';
import {
  authorPre,
  produceCode,
  appCode,
  appVersion,
  terminalType,
  terminalDeviceBrand,
  terminalSystemModel,
  terminalSystemVersion,
  terminalIMEI
} from '@/headers';

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8';
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: process.env.VUE_APP_BASE_API,
  // 超时
  timeout: 30000
});

// const contentType='application/json';

// request拦截器
service.interceptors.request.use(config => {
  // 是否需要设置 token
  const isToken = (config.headers || {}).isToken === false;

  // header添加其他信息
  // 产品编码
  config.headers['Produce-Code'] = produceCode;
  // 应用编码
  config.headers['App-Code'] = appCode;
  // 应用版本
  config.headers['App-Version'] = appVersion;
  // 终端类型
  config.headers['Terminal-Type'] = terminalType;
  // 手机厂商-app
  config.headers['Terminal-Device-Brand'] = terminalDeviceBrand;
  // 手机型号-app
  config.headers['Terminal-System-Model'] = terminalSystemModel;
  // 系统版本号-app
  config.headers['Terminal-System-Version'] = terminalSystemVersion;
  // IMEI（国际移动设备识别码）-app
  config.headers['Terminal-IMEI'] = terminalIMEI;

  if (getToken() && !isToken) {
    config.headers['Authorization'] = authorPre + getToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  // get请求映射params参数
  if (config.method === 'get' && config.params) {
    let url = config.url + '?';
    for (const propName of Object.keys(config.params)) {
      const value = config.params[propName];
      var part = encodeURIComponent(propName) + '=';
      if (value !== '' && value !== null && value !== undefined && typeof (value) !== 'undefined') {
        if (typeof value === 'object') {
          for (const key of Object.keys(value)) {
            const params = propName + '[' + key + ']';
            var subPart = encodeURIComponent(params) + '=';
            url += subPart + encodeURIComponent(value[key]) + '&';
          }
        } else {
          url += part + encodeURIComponent(value) + '&';
        }
      }
    }
    url = url.slice(0, -1);
    config.params = {};
    config.url = url;
  }
  return config;
}, error => {
  console.log(error);
  Promise.reject(error);
});

// 响应拦截器
service.interceptors.response.use(res => {
  // 未设置状态码则默认成功状态
  const code = res.data.code || 200;
  // 获取错误信息
  const msg = errorCode[code] || res.data.msg || errorCode['default'];
  if (code === 401) {
    MessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
      confirmButtonText: '重新登录',
      cancelButtonText: '取消',
      type: 'warning'
    }
    ).then(() => {
      store.dispatch('LogOut').then(() => {
        location.href = '/index';
      });
    });
    return Promise.reject('error');
  } else if (code === 500) {
    Message({
      message: msg,
      type: 'info',
      showClose: true
    });
    return Promise.reject(new Error(msg));
  } else if (code === 404) {
    // 404时不弹出报错提示
    return Promise.reject(new Error(msg));
  } else if (code === 406) {
    MessageBox.confirm('您的IP无此操作权限', '系统提示', {
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      return;
      /* store.dispatch('LogOut').then(() => {
        location.href = '/index';
      });*/
    });
  } else if (code === 501) {
    return res.data;
  } else if (code === 40300) {
    // 账号需要密钥验证
    return Promise.reject(res.data);
  } else if (code === 40200) {
    // 禁止使用默认密码
    return Promise.reject(res.data);
  } else if (code !== 200) {
    Message({
      message: msg,
      type: 'info',
      showClose: true
    });
    return Promise.reject('error');
  } else {
    return res.data;
  }
},
error => {
  console.log('err' + error);
  const { message } = error;
  if (message === 'Network Error') {
    // message = '后端接口连接异常';
  } else if (message.includes('timeout')) {
    // message = '系统接口请求超时';
  } else if (message.includes('Request failed with status code')) {
    // message = '系统接口' + message.substr(message.length - 3) + '异常';
  } else {
    Message({
      message: message,
      type: 'error',
      duration: 5 * 1000,
      showClose: true
    });
  }
  return Promise.reject(error);
});

// 通用下载方法
export function download(url, params, filename, headers, type = '.xlsx') {
  filename = filename + '_' + parseTime(new Date(), '{y}{m}{d}{h}{i}') + type;
  Message({
    message: '导出中，请稍候',
    type: 'info',
    duration: 3 * 1000,
    showClose: true
  });
  return service.post(url, params, getDownloadConfig(headers)).then((data) => {
    var reader = new FileReader();
    reader.onload = function(event) {
      const result = reader.result.length < 100 ? JSON.parse(reader.result) : '';// 内容就在这里
      if (Object.prototype.toString.call(result) === '[object Object]' && (result.code === 400 || result.code === 404)) {
        // 400
        Message({
          message: result.msg,
          type: 'error',
          duration: 3 * 1000,
          showClose: true
        });
      } else {
        // success
        Message({
          message: '导出成功',
          type: 'success',
          duration: 3 * 1000,
          showClose: true
        });
        const content = data;
        const blob = new Blob([content]);
        if ('download' in document.createElement('a')) {
          const elink = document.createElement('a');
          elink.download = filename;
          elink.style.display = 'none';
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          URL.revokeObjectURL(elink.href);
          document.body.removeChild(elink);
        } else {
          navigator.msSaveBlob(blob, filename);
        }
      }
    };
    reader.readAsText(data);
  }).catch((r) => {
    Message({
      message: '导出失败',
      type: 'error',
      duration: 3 * 1000,
      showClose: true
    });
    console.error(r);
  });
}
function getDownloadConfig(headers) {
  if (headers != null && headers.indexOf('json') > 0) {
    return {
      headers: {
        'Content-Type': headers || 'application/x-www-form-urlencoded'
      },
      responseType: 'blob',
      timeout: 10 * 60 * 1000 // 有些表导出数据量太大, 超时时间设为10分钟
    };
  } else {
    return {
      transformRequest: [(params) => {
        return tansParams(params);
      }],
      headers: {
        'Content-Type': headers || 'application/x-www-form-urlencoded'
      },
      responseType: 'blob',
      timeout: 10 * 60 * 1000 // 有些表导出数据量太大, 超时时间设为10分钟
    };
  }
}
export default service;
