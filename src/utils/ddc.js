/**
 * 通用js方法封装处理
 * Copyright (c) 2021 ddc
 */

const baseURL = process.env.VUE_APP_BASE_API;
import { setLocalStorage, getLocalStorage } from '@/utils/auth';

// 日期格式化
export function parseTime(time, pattern) {
  if (arguments.length === 0 || !time) {
    return null;
  }
  time = new Date(time);
  const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}';
  let date;
  if (typeof time === 'object') {
    date = time;
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time);
    } else if (typeof time === 'string') {
      time = time.replace(new RegExp(/-/gm), '/');
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000;
    }
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  };
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key];
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value]; }
    if (result.length > 0 && value < 10) {
      value = '0' + value;
    }
    return value || 0;
  });
  return time_str;
}

// 表单重置
export function resetForm(refName) {
  if (this.$refs[refName]) {
    this.$refs[refName].resetFields();
  }
}

// 添加日期范围
export function addDateRange(params, dateRange, propName) {
  var search = params;
  search.params = {};
  if (dateRange != null && dateRange !== '') {
    if (typeof (propName) === 'undefined') {
      search.params['beginTime'] = dateRange[0];
      search.params['endTime'] = dateRange[1];
    } else {
      search.params[propName + 'BeginTime'] = dateRange[0];
      search.params[propName + 'EndTime'] = dateRange[1];
    }
  }
  return search;
}

// 回显数据字典
export function selectDictLabel(datas, value) {
  if (datas === undefined || datas === null) {
    return '';
  }
  var actions = [];
  Object.keys(datas).some((key) => {
    if (('' + datas[key].dictValue) === ('' + value)) {
      actions.push(datas[key].dictLabel);
      return true;
    }
  });
  return actions.join('');
}

// 回显数据字典（字符串数组）
export function selectDictLabels(datas, value, separator) {
  var actions = [];
  var currentSeparator = undefined === separator ? ',' : separator;
  var temp = value.split(currentSeparator);
  Object.keys(value.split(currentSeparator)).some((val) => {
    Object.keys(datas).some((key) => {
      if (('' + datas[key].dictValue) === ('' + temp[val])) {
        actions.push(datas[key].dictLabel + currentSeparator);
      }
    });
  });
  return actions.join('').substring(0, actions.join('').length - 1);
}

export function selectProvinceLabel(datas, value) {
  if (datas === undefined || datas === null) {
    return '';
  }
  var actions = [];
  Object.keys(datas).some((key) => {
    if (('' + datas[key].provinceCode) === ('' + value)) {
      actions.push(datas[key].provinceName);
      return true;
    }
  });
  return actions.join('');
}

export function selectCityLabel(datas, value) {
  if (datas === undefined || datas === null) {
    return '';
  }
  var actions = [];
  Object.keys(datas).some((key) => {
    if (('' + datas[key].cityCode) === ('' + value)) {
      actions.push(datas[key].cityName);
      return true;
    }
  });
  return actions.join('');
}
// 通用下载方法
export function download(fileName) {
  window.location.href = baseURL + '/common/download?fileName=' + encodeURI(fileName) + '&delete=' + true;
}

// 字符串格式化(%s )
export function sprintf(str) {
  var args = arguments; var flag = true; var i = 1;
  str = str.replace(/%s/g, function() {
    var arg = args[i++];
    if (typeof arg === 'undefined') {
      flag = false;
      return '';
    }
    return arg;
  });
  return flag ? str : '';
}

// 转换字符串，undefined,null等转化为""
export function praseStrEmpty(str) {
  if (!str || str === 'undefined' || str === 'null') {
    return '';
  }
  return str;
}

// 0转为false, 1转为true
export function praseNumToBoolean(num) {
  if (num === 0) return false;
  if (num === 1) return true;
  return num;
}

// false转为0, true转为1
export function praseBooleanToNum(boolean) {
  if (!boolean) return 0;
  if (boolean) return 1;
  return boolean;
}

/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 * @param {*} rootId 根Id 默认 0
 */
export function handleTree(data, id, parentId, children, rootId) {
  id = id || 'id';
  parentId = parentId || 'parentId';
  children = children || 'children';
  rootId = rootId || Math.min.apply(Math, data.map(item => { return item[parentId]; })) || 0;
  // 对源数据深度克隆
  const cloneData = JSON.parse(JSON.stringify(data));
  // 循环所有项
  const treeData = cloneData.filter(father => {
    const branchArr = cloneData.filter(child => {
      // 返回每一项的子级数组
      return father[id] === child[parentId];
    });
    branchArr.length > 0 ? father.children = branchArr : '';
    // 返回第一层
    return father[parentId] === rootId;
  });
  return treeData !== '' ? treeData : data;
}

/**
   * 参数处理
   * @param {*} params  参数
   */
export function tansParams(params) {
  let result = '';
  Object.keys(params).forEach((key) => {
    if (!Object.is(params[key], undefined) && !Object.is(params[key], null) && !Object.is(JSON.stringify(params[key]), '{}')) {
      result += encodeURIComponent(key) + '=' + encodeURIComponent(params[key]) + '&';
    }
  });
  return result;
}

/**
 * 配置表头
 * @param {*} list 表头数组
 * @param {*} url 接口地址
 * @param {*} editColumn 操作列
 * @param {*} myColumen 自定义的表头(可以替代) 数组
 */
import { tableHeadList } from '@/api/system/table';
export function tableHeaderConfig(list, url, editColumn, myColumen) {
  return new Promise(resolve => {
    if (getLocalStorage(url)) {
      getLocalStorage(url).forEach(el => {
        list.push(el);
      });
      resolve();
    } else {
      tableHeadList(url.split('--')[0]).then(response => {
        const arr = [];
        response.data.forEach(el => {
          arr.push({
            label: el.comment,
            prop: el.fieldName,
            isShow: el.isShow,
            sortNum: el.sortNum || 0,
            width: el.width || '120',
            tooltip: true,
            isChild: el.isChild
          });
        });
        if (editColumn) {
          arr.push(editColumn);
        }
        if (myColumen && myColumen.length) {
          arr.unshift(...myColumen);
        }

        // 去重
        list.push(...objReduce(arr, 'prop'));

        // 根據距離遠近排序，越近在前面，升序
        list.sort(function(a, b) {
          if (a.sortNum < b.sortNum) {
            return -1;
          } else if (a.sortNum === b.sortNum) {
            return 0;
          } else {
            return 1;
          }
        });

        setLocalStorage(url, list);
        resolve();
      });
    }
  });
}

/**
 * 比较日期大小
 * 用于比较时间段，判断结束时间是否大于开始时间
 * @param {*} beginTime 开始时间
 * @param {*} endTime 结束时间
 */
export function compareBeginEndTime(beginTime, endTime) {
  if (endTime === '' || endTime === undefined || endTime === null) return true;
  const _begin = Date.parse(new Date(beginTime));
  const _end = Date.parse(new Date(endTime));
  // 8.64e7 为一天的毫秒数
  if (_end >= _begin) {
    return true;
  } else {
    return false;
  }
}

/**
 * md5加密
 */
import crypto from 'crypto';
export function Md5Util(text) {
  const md5 = crypto.createHash('md5');
  md5.update(text);
  const md5password = md5.digest('hex');
  return md5password;
}

/**
 * 数组内对象去重
 * @param {*} arr 数组
 * @param {*} id 对什么字段进行去重 字符串
 */
export function objReduce(arr, id) {
  const obj = {};
  return arr.reduce((cur, next) => {
    obj[next[id]] ? '' : obj[next[id]] = true && cur.push(next);
    return cur;
  }, []); // 设置cur默认类型为数组，并且初始值为空的数组
}

/**
 * 四舍五入
 * @param {*} number 数字
 * @param {*} precision 保留位置(1= 小数一位 2=小数二位, -1= 位数, -2=百位数)
 */
export function floor(number, precision = 2) {
  // return Math.floor(number * 100) / 100; // (截取)
  // return (number - 0).toFixed(2); //  bug比较多
  return Math.round((number - 0) * Math.pow(10, precision)) / Math.pow(10, precision);
}
