// 数字
const numberReg = /^\d+$|^\d+[.]?\d+$/;
// 中文
const cnReg = /^[\u4e00-\u9fa5]+$/;
// 检测姓名,必须要有两个汉字
const nameReg = /^[\u4e00-\u9fa5]{2,}$/;
// 邮箱
const emailReg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
// 手机号
const phoneReg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
// 身份证
const idCardReg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
// 判断传入日期是否小于当前日期
function compareTime(time) {
  const _new = Date.parse(new Date());
  const lastTime = Date.parse(new Date(time));
  if (_new > lastTime) {
    return true;
  }
}
// 车牌号
const plateNoReg = /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/;
// 银行卡
const bankCardReg = /^([1-9]{1})(\d{15}|\d{16}|\d{18})$/;
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
    if (!value) return;
    if (!numberReg.test(value)) {
      callback(new Error('请输入数字'));
    } else {
      callback();
    }
  },
  // 中文验证
  cn: function(rule, value, callback) {
    if (!value) return;
    if (!cnReg.test(value)) {
      callback(new Error('请输入中文'));
    } else {
      callback();
    }
  },
  // 姓名验证
  name: function(rule, value, callback) {
    if (!value) return;
    if (!nameReg.test(value)) {
      callback(new Error('请输入正确的姓名'));
    } else {
      callback();
    }
  },
  // 邮箱验证
  email: function(rule, value, callback) {
    if (!value) return;
    if (!emailReg.test(value)) {
      callback(new Error('请输入正确的邮箱'));
    } else {
      callback();
    }
  },
  // 手机验证
  telphone: function(rule, value, callback) {
    if (!value) return;
    if (!phoneReg.test(value)) {
      callback(new Error('请输入正确的手机号码'));
    } else {
      callback();
    }
  },
  // 身份证验证
  idCard: function(rule, value, callback) {
    if (!value) return;
    if (!idCardReg.test(value)) {
      callback(new Error('请输入正确的身份证号'));
    } else {
      callback();
    }
  },
  // 证件是否过期
  isExpired(rule, value, callback) {
    if (value === undefined || value === null || value === '') {
      return;
    }
    if (compareTime(value)) {
      const msg = '该证件已过期，请更新证件';
      callback(new Error(msg));
    } else {
      callback();
    }
  },
  // 车牌号
  plateNo: function(rule, value, callback) {
    if (!value) return;
    if (!plateNoReg.test(value)) {
      callback(new Error('请输入正确的车牌号'));
    } else {
      callback();
    }
  },
  // 银行卡
  bankCard: function(rule, value, callback) {
    if (!value) return;
    if (!bankCardReg.test(value)) {
      callback(new Error('请输入正确的银行卡号'));
    } else {
      callback();
    }
  },
  // 驾驶证
  driverCard: function(rule, value, callback) {
    if (!value) return;
    if (!driverCardReg.test(value)) {
      callback(new Error('请输入正确的驾驶证号'));
    } else {
      callback();
    }
  },
  // 统一社会信用代码
  organizationCode: function(rule, value, callback) {
    if (!value) return;
    if (!organizationReg.test(value)) {
      callback(new Error('请输入正确的统一社会信用代码'));
    } else {
      callback();
    }
  }
};
