import { compareBeginEndTime } from '@/utils/ddc';
// 数字
const numberReg = /^\d+$|^\d+[.]?\d+$/;
// 中文
const cnReg = /^[\u4e00-\u9fa5]+$/;
// 检测姓名,必须要有两个汉字
// const nameReg = /^[\u4e00-\u9fa5]{2,}$/;
// 检测姓名,可以是中文/字母/数字
const nameReg = /^[\da-zA-Z\u4E00-\u9FA5]{1,10}$/;
// 邮箱
const emailReg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
// 手机号
const phoneReg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
// 手机号&&座机号
const phoneReg01 = /^(0|86|17951)?(13[0-9]|15[012356789]|17[01678]|18[0-9]|14[57])[0-9]{8}$/;
const phoneReg02 = /^(0[0-9]{2,3}\-)([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/;
// 身份证
const idCardReg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
// 6位纯数字
const number6 = /^[0-9]{6}$/;

// 判断传入日期是否小于当前日期
function compareTime(time) {
  const _new = Date.parse(new Date());
  const lastTime = Date.parse(new Date(time));
  // 8.64e7 为一天的毫秒数
  if (_new > lastTime + 8.64e7) {
    return true;
  }
}
// 车牌号
const plateNoReg = /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/;
// 银行卡
// const bankCardReg = /^([1-9]{1})(\d{15}|\d{16}|\d{18})$/;
// 驾驶证
const driverCardReg = /^[1-8]\d{11}$/;
// 行驶证
// 道路运输经营许可证
// 从业资格证
// 统一社会信用代码
const organizationReg = /(^(?:(?![IOZSV])[\dA-Z]){2}\d{6}(?:(?![IOZSV])[\dA-Z]){10}$)|(^\d{15}$)/;
// 纳税人识别号

export const formValidate = {
  // 数字验证
  number: function(rule, value, callback) {
    if (value === undefined || value === null || value === '') {
      callback();
    }
    if (!numberReg.test(value)) {
      callback(new Error('请输入数字'));
    } else {
      callback();
    }
  },
  // 中文验证
  cn: function(rule, value, callback) {
    if (value === undefined || value === null || value === '') {
      callback();
    }
    if (!cnReg.test(value)) {
      callback(new Error('请输入中文'));
    } else {
      callback();
    }
  },
  // 姓名验证
  name: function(rule, value, callback) {
    if (value === undefined || value === null || value === '') {
      callback();
    }
    if (!nameReg.test(value)) {
      callback(new Error('请输入正确的姓名'));
    } else {
      callback();
    }
  },
  // 邮箱验证
  email: function(rule, value, callback) {
    if (value === undefined || value === null || value === '') {
      callback();
    }
    if (!emailReg.test(value)) {
      callback(new Error('请输入正确的邮箱'));
    } else {
      callback();
    }
  },
  // 手机验证
  telphone: function(rule, value, callback) {
    if (value === undefined || value === null || value === '') {
      callback();
    }
    if (!phoneReg.test(value)) {
      callback(new Error('请输入正确的手机号码'));
    } else {
      callback();
    }
  },
  // 手机 || 座机验证
  phone: function(rule, value, callback) {
    if (value === undefined || value === null || value === '') {
      callback();
    }
    if (!phoneReg01.test(value) && !phoneReg02.test(value)) {
      callback(new Error('请输入正确的号码'));
    } else {
      callback();
    }
  },
  // 身份证验证
  idCard: function(rule, value, callback) {
    if (value === undefined || value === null || value === '') {
      callback();
    }
    if (!idCardReg.test(value)) {
      callback(new Error('请输入正确的身份证号'));
    } else {
      callback();
    }
  },
  // 证件是否过期
  // effective: 长期有效的时候不做校验
  isExpired(rule, value, callback, effective) {
    if (value === undefined || value === null || value === '' || effective) {
      callback();
    }
    if (compareTime(value)) {
      const msg = '该证件已过期，请更新证件';
      callback(new Error(msg));
    } else {
      callback();
    }
  },
  // 证件验证: 起始时间必填; 长期有效的时候截止时间可以不填,否则必填; 截止时间大于起始时间;
  idCardValidate: function(rule, value, callback, beginTime, effective, text = '身份证') {
    if (!beginTime) {
      return callback(new Error(`${text}有效期起始时间不能为空`));
    } else if (!effective && !value) {
      return callback(new Error(`${text}有效期截止时间不能为空`));
    } else if (!effective && !compareBeginEndTime(beginTime, value)) {
      return callback(new Error(`${text}有效期截止时间不能小于起始时间`));
    }
    return callback();
  },
  // 证件验证: 截止时间大于起始时间;
  idCardTimeValidate: function(rule, value, callback, beginTime, text = '') {
    if (!compareBeginEndTime(beginTime, value)) {
      return callback(new Error(`${text}截止时间不能小于起始时间`));
    }
    return callback();
  },
  // 车牌号
  plateNo: function(rule, value, callback) {
    if (value === undefined || value === null || value === '') {
      callback();
    }
    if (!plateNoReg.test(value)) {
      callback(new Error('请输入正确的车牌号'));
    } else {
      callback();
    }
  },
  // 银行卡
  bankCard: function(rule, value, callback) {
    if (value === undefined || value === null || value === '') {
      callback();
    }
    const ptr_length = /^.{0,50}$/;
    if (!numberReg.test(value)) {
      callback(new Error('请输入正确的银行卡号'));
    } else if (!ptr_length.test(value)) {
      callback(new Error('银行卡号长度应小于50位'));
    } else {
      callback();
    }
  },
  // 支行号
  subBankCard: function(rule, value, callback) {
    if (value === undefined || value === null || value === '') {
      callback();
    }
    // 12位数字
    const ptr_length = /^[0-9a-zA-Z_]{12,12}$/;
    if (ptr_length.test(value)) {
      callback();
    } else {
      callback(new Error('请输入正确的支行号'));
    }
  },
  // 驾驶证
  driverCard: function(rule, value, callback) {
    if (value === undefined || value === null || value === '') {
      callback();
    }
    if (!driverCardReg.test(value)) {
      callback(new Error('请输入正确的驾驶证号'));
    } else {
      callback();
    }
  },
  // 统一社会信用代码
  organizationCode: function(rule, value, callback) {
    if (value === undefined || value === null || value === '') {
      callback();
    }
    if (!organizationReg.test(value)) {
      callback(new Error('请输入正确的统一社会信用代码'));
    } else {
      callback();
    }
  },
  // 密码校验
  passWord: function(rule, value, callback) {
    if (value === undefined || value === null || value === '') {
      callback();
      return;
    }
    // 是否包含数字
    const ptr_digit = /^.*[0-9]+.*$/;
    // 是否包含大小写字母
    const ptr_lowcase = /^.*[a-zA-Z]+.*$/;
    // 是否包含特殊字符
    const ptr_special = /((?=[\x21-\x7e]+)[^A-Za-z0-9])/;
    // 是否长度为8-16位数
    const ptr_length = /^.{8,16}$/;
    // 是否包含空格
    const ptr_space = new RegExp('\\s');
    if (value.match(ptr_space)) callback(new Error('密码中不能包含空格'));
    if (!ptr_length.test(value)) callback(new Error('密码长度应为8-16位'));
    if ((ptr_digit.test(value) && ptr_lowcase.test(value) && ptr_special.test(value)) ||
       (!ptr_digit.test(value) && ptr_lowcase.test(value) && ptr_special.test(value)) ||
       (ptr_digit.test(value) && !ptr_lowcase.test(value) && ptr_special.test(value)) ||
       (ptr_digit.test(value) && ptr_lowcase.test(value) && !ptr_special.test(value))) {
      callback();
    } else {
      callback(new Error('密码中至少包含字母、数字、特殊字符中的两种'));
    }
  },
  // 6位纯数字
  number6Password: function(rule, value, callback) {
    if (value === undefined || value === null || value === '') {
      callback();
    }
    if (!number6.test(value)) {
      callback(new Error('请输入6位数字的密码'));
    } else {
      callback();
    }
  },
  // 值大于0
  greaterThanZero: function(rule, value, callback, text = '输入值') {
    if (value === undefined || value === null || value === '') {
      callback();
    }
    if (value === 0) {
      callback(new Error(`${text}不能为0`));
    } else {
      callback();
    }
  }
};
