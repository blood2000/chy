const CryptoJS = require('crypto-js');
import {
  // MessageBox,
  Message
} from 'element-ui';

import { decrypt } from '@/utils/jsencrypt';

// 手机号  项目Id  调度组电话  发卡人电话  发卡时间（时间戳） 卡批次号
// 1000|3|18415451845;120;16612345678;17812345678;1621648441990;1621648441990123;r
// 1000|4|120;16612345678;17812345678;1621648441990;1621648441990123;r
export let userMark = '1000|3|';
export const USERINFO = [
  // 'user_name', // 张三 用户姓名
  'user_telno', //
  'project_id', // 120 项目Id
  'team_telno', // 16612345678 调度者关联用户的手机号
  'issuing_telno', // 17812345678 发卡人用户手机号
  // 'issuing_name', // 陈大帅 发卡人姓名
  'issuing_time', // 1621648441990  发卡时间（时间戳）
  'issuing_pc', // 1621648441990123 卡批次号
  'icType' // 追加一个 ic卡type
];
// 货源单号 运单单号 项目 车牌号 驾驶员用户手机号 入场时间（时间戳） 出场时间（时间戳） 渣土场编号
// 1010|2|2105272013285566;2101041059202001;110;鄂ALF106;13812345678;1621648441990;1621648441990;2614710
export const versionMark = '1010|2|';
export const DATAINFO = [
  'orderId', // 货源单号
  'waybillNo', // 运单单号
  'projectName', // 项目id
  'licenseNumber', // 车牌号
  // 'driverName',
  'driverPhone', // 驾驶员用户手机号
  'fillTime',
  'signTime',
  'serialNumber' // 渣土场编号
];

const CardReader = {
  _cmdIndex: 1,
  socket: null,
  _attr: {
    protocol: document.location.protocol,
    host: '127.0.0.1',
    port: 31213,
    // key: 'FFFFFFFFFFFFFFFF'
    key: decrypt('HtC6EzlC0+Wa2kmhYgXqE1ZkVjzml+OGOoOveH0w2BdJ48FFG13zi+J28jaqPeo+6f7qKZAckqNT5CuPIM+39w==')
  },
  fn: {
    getWsUrl: function() {
      if (CardReader._attr.protocol === 'https') {
        return 'wss://' + CardReader._attr.host + ':' + CardReader._attr.port;
      } else {
        return 'ws://' + CardReader._attr.host + ':' + CardReader._attr.port;
      }
    },
    connect: function(success, error) {
      if (CardReader.socket == null) {
        CardReader.socket = new WebSocket(this.getWsUrl());
        CardReader.socket.onopen = function() {
          CardReader.log.info('# [Socket] 连接本地服务成功');
          success && success('连接服务成功');
        };
        CardReader.socket.onclose = function(event) {
          Message.error('# [Socket] 本地服务链接已断开 : ', event.wasClean);
          CardReader.log.warn('# [Socket] 本地服务链接已断开 : ', event.wasClean);
          error && error();
        };
        CardReader.socket.onmessage = function(event) {
          CardReader.log.info(event.data);
        };
        CardReader.socket.onerror = function(event) {
          CardReader.log.error('# [Socket] 断开本地服务链接 ： ', event.message);
        };
      }
    },
    /**
     * 执行命令
     * @param command
     */
    execute: function(command) {
      CardReader._cmdIndex++;
      if (CardReader._cmdIndex > 10000) {
        CardReader._cmdIndex = 0;
      }
      if (CardReader.socket.readyState === WebSocket.OPEN) {
        CardReader.socket.send(command + ',' + CardReader._cmdIndex);
      } else {
        CardReader.log.error('# [Socket] 发送指令失败，请检查Websocket是否链接成功');
      }
    },
    /**
     * 带返回值的执行
     * @param command
     * @returns {Promise<unknown>}
     */
    exec: async function(command) {
      CardReader.fn.execute(command);
      return CardReader.fn._receiveMessage();
    },
    apdu: async function(command) {
      return this.exec('SendCOSCommand,' + command);
    },
    _receiveMessage: function() {
      return new Promise((resolve, reject) => {
        CardReader.socket.onmessage = function(e) {
          const ret = CardReader.fn.getResult(e.data);
          if (ret.success) {
            resolve(e.data);
          } else {
            if (ret.code) {
              reject({
                ...ret,
                success: false,
                msg: '读卡错误信息：' + (CardReader.codes[ret.code] ? CardReader.codes[ret.code].message : ret.code)
              });
            } else {
              reject({
                ...ret,
                success: false,
                code: '',
                msg: '请将【数据IC卡】放至有效位置或重启本地应用'
              });
            }
          }
        };
      });
    },
    _receiveMessageWithTimeout: function(timeout) {
      return new Promise(resolve => {
        CardReader.socket.onmessage = function(e) {
          resolve(e.data);
        };
        setTimeout(function() {
          resolve('timeout');
        }, timeout);
      });
    },
    /**
     * 获得返回对象
     * @param str
     * @returns {{code: string, data: (string|null), success: boolean}}
     */
    getResult: function(str, hasCode) {
      hasCode = hasCode !== undefined ? hasCode : true;
      const arr = str.split(',');
      return {
        'success': arr[2] === 'True',
        'code': (function() {
          if (hasCode) {
            return arr.length >= 4 ? arr[3].substr(arr[3].length - 4) : '';
          } else return '';
        })(),
        'data': (function() {
          if (hasCode) {
            return arr.length >= 4 ? arr[3].substr(0, arr[3].length - 4) : null;
          } else {
            return str;
          }
        })(),
        'source': str
      };
    },
    /**
     * 数据
     * @param str 格式: XX | XXX | XXXXXXXX;XXXXXXXX;XXXXXXXX;XXXXXXXX;XXXXXXXX;XXXXXXXX
     * @returns {{code: string, data: (string|null), success: boolean}}
     */
    resultData: function(str, key = USERINFO) {
      const arr = str.split('|');
      const arr2 = arr[2].split(';');
      const data = {};
      key.forEach((e, index) => {
        data[e] = arr2[index];
      });
      if (key.length !== arr2.length) {
        data['other'] = arr2.filter((e, index) => {
          return index >= key.length;
        });
      }
      return {
        meter: [arr[0], arr[1]],
        data
      };
    },

    setData: function(heder = versionMark, data) {
      if (!data) return;
      const arr = [];
      DATAINFO.forEach((key) => {
        arr.push(data[key] || '');
      });
      return heder + arr.join(';');
    },

    /**
     * trycatch 错误处理
     *
     */
    catchError: function(error) {
      let errordata = {};
      if (typeof error.success === 'undefined') {
        // Object
        console.log('语法报错');
        CardReader.action.error();
        errordata.msg = error.message;
      } else {
        errordata = {
          ...error,
          msg: error.code ? CardReader.codes[error.code].message : '请将【数据IC卡】放至有效位置 或者是 本地连接应用报错, 请重启本地连接应用'
        };
      }

      return errordata;
    },


    /**
     * DES 单倍长加密
     * @param message
     * @param key
     * @returns {string}
     */
    encryptByDES: function(message, key) {
      const postfixHexText = 'f391dd89b1736b72';
      const keyHex = CryptoJS.enc.Hex.parse(key);
      const messageHex = CryptoJS.enc.Hex.parse(message);
      const encrypted = CryptoJS.DES.encrypt(messageHex, keyHex, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      });
      const encryptedHex = encrypted.ciphertext.toString();
      return encryptedHex.substring(0, encryptedHex.length - postfixHexText.length);
    },
    strToHex16: function(str) {
      const charBuf = this.writeUTF(str, true);
      let re = '';
      for (let i = 0; i < charBuf.length; i++) {
        let x = (charBuf[i] & 0xFF).toString(16);
        if (x.length === 1) {
          x = '0' + x;
        }
        re += x;
      }
      return re;
    },
    writeUTF: function(str, isGetBytes) {
      const back = [];
      let byteSize = 0;
      for (let i = 0; i < str.length; i++) {
        const code = str.charCodeAt(i);
        if (code >= 0x00 && code <= 0x7f) {
          byteSize += 1;
          back.push(code);
        } else if (code >= 0x80 && code <= 0x7ff) {
          byteSize += 2;
          back.push((192 | (31 & (code >> 6))));
          back.push((128 | (63 & code)));
        } else if ((code >= 0x800 && code <= 0xd7ff) ||
          (code >= 0xe000 && code <= 0xffff)) {
          byteSize += 3;
          back.push((224 | (15 & (code >> 12))));
          back.push((128 | (63 & (code >> 6))));
          back.push((128 | (63 & code)));
        }
      }
      for (let i = 0; i < back.length; i++) {
        back[i] &= 0xff;
      }
      if (isGetBytes) {
        return back;
      }
      if (byteSize <= 0xff) {
        return [0, byteSize].concat(back);
      } else {
        return [byteSize >> 8, byteSize & 0xff].concat(back);
      }
    },
    numToHex16: function(num) {
      const val = num.toString(16);
      if (val.length % 2 === 1) {
        return '0' + val;
      }
      return val;
    },
    utf8HexToStr: function(str) {
      const buf = [];
      for (let i = 0; i < str.length; i += 2) {
        buf.push(parseInt(str.substring(i, i + 2), 16));
      }
      return this.readUTF(buf);
    },

    /**
     * 返序
     */

    strReverse: function(str) {
      if (str && str.length === 8) {
        const strs = str.split('');
        str = strs[6] + strs[7] + strs[4] + strs[5] + strs[2] + strs[3] + strs[0] + strs[1];
      }
      return str;
    },

    /**
     * 16 进制转 10进制
     * @param hex
     * @returns {any}
     */
    hex2int: function(hex) {
      var len = hex.length;
      var a = new Array(len);
      var code;
      for (var i = 0; i < len; i++) {
        code = hex.charCodeAt(i);
        if (code >= 48 && code < 58) {
          code -= 48;
        } else {
          code = (code & 0xdf) - 65 + 10;
        }
        a[i] = code;
      }

      return a.reduce(function(acc, c) {
        acc = 16 * acc + c;
        return acc;
      }, 0);
    },

    readUTF: function(arr) {
      if (typeof arr === 'string') {
        return arr;
      }
      let UTF = '';
      const _arr = arr;
      for (let i = 0; i < _arr.length; i++) {
        const one = _arr[i].toString(2);
        const v = one.match(/^1+?(?=0)/);
        if (v && one.length === 8) {
          const bytesLength = v[0].length;
          let store = _arr[i].toString(2).slice(7 - bytesLength);
          for (let st = 1; st < bytesLength; st++) {
            store += _arr[st + i].toString(2).slice(2);
          }
          UTF += String.fromCharCode(parseInt(store, 2));
          i += bytesLength - 1;
        } else {
          UTF += String.fromCharCode(_arr[i]);
        }
      }
      return UTF;
    },
    /**
     * 按照字符数进行分割字符串
     * @param str
     * @param num
     */
    splitByCharNum: function(str, num) {
      const data = [];
      let temp = '';
      for (let i = 0; i < str.length; i++) {
        if (temp.length === 2) {
          data.push(temp);
          temp = '';
        }
        temp += str.charAt(i);
      }
      if (temp !== '') {
        data.push(temp);
      }
      return data;
    }
  },
  log: {
    info: function(message) {
      console.log(message);
    },
    success: function(message) {
      console.log(message);
    },
    warn: function(message) {
      console.warn(message);
    },
    error: function(message) {
      console.error(message);
    }
  },
  /**
   * 动作
   */
  action: {
    /**
     * 获得卡片
     * 包含：获得卡、卡片复位、获取随机值进行认证
     * endLve: 单独调用是否结束(默认 false==结束)
     * key:
     * getCar: 只发回卡信息(默认 false ==要验证)
     * code9000: 详细验证 (默认false == 只验证 !9000 )
     * false, key, false, true
     */
    getCard: async function(endLve, key = CardReader._attr.key, getCar = false, code9000 = false) {
      let ret;
      let GetCardNo;
      let ResetCpuCardNoGetCardNo;
      try {
        ret = await CardReader.fn.exec(CardReader.command.get.card);
        GetCardNo = CardReader.fn.getResult(ret); // 卡的信息

        ret = await CardReader.fn.exec(CardReader.command.reset);
        ResetCpuCardNoGetCardNo = CardReader.fn.getResult(ret); // 卡片复位信息


        if (getCar) {
          const str = CardReader.fn.strReverse(GetCardNo.data.substring(0, 8));
          GetCardNo.data = CardReader.fn.hex2int(str);
          await CardReader.fn.exec(CardReader.command.deselect);
          await CardReader.fn.exec(CardReader.command.beep);
          return {
            code: '9000',
            success: true,
            GetCardNo,
            ResetCpuCardNoGetCardNo
          };
        }

        ret = await this.verifyencrypt(key, code9000);
        if (!ret.success) return ret;

        if (endLve) {
          await CardReader.fn.exec(CardReader.command.deselect);
          await CardReader.fn.exec(CardReader.command.beep);
        }
        const str = CardReader.fn.strReverse(GetCardNo.data.substring(0, 8));

        GetCardNo.data = CardReader.fn.hex2int(str);

        return {
          ...ret,
          code: '9000',
          success: true,
          GetCardNo,
          ResetCpuCardNoGetCardNo
        };
      } catch (error) {
        return {
          code: '',
          ...CardReader.fn.catchError(error),
          success: false
        };
      }
    },

    /**
     * 进入根目录验证
     * code9000: true 只判断code 9000
     * 调用: ret = await this.verifyencrypt(key, true)
     */
    verifyencrypt: async function(key = CardReader._attr.key, code9000 = false) {
      try {
        let ret = await CardReader.fn.apdu((function() {
          return ['00', 'A4', '00', '00', '02', '3F00'].join('');
        })());

        ret = await CardReader.fn.exec(CardReader.command.get.random);
        ret = CardReader.fn.getResult(ret);
        // 构造外部认证参数
        const encrypt = CardReader.fn.encryptByDES(ret.data, key);
        ret = await CardReader.fn.exec('SendCOSCommand,0082000008' + encrypt);
        ret = CardReader.fn.getResult(ret);

        // console.log(ret, '验证结果');
        // 63CB
        if (code9000) {
          if (ret.code !== '9000') {
            await CardReader.action.error();
            return {
              ...ret,
              codeMsg: CardReader.codes[ret.code] ? CardReader.codes[ret.code].message : '',
              success: false,
              msg: '验证失败，请勿多次尝试，否则易造成锁卡（废卡）'
            };
          }
        } else {
          if (ret.code !== '9000') {
            if (ret.code === '6983') {
              await CardReader.action.error();
              return {
                ...ret,
                codeMsg: CardReader.codes[ret.code] ? CardReader.codes[ret.code].message : '',
                success: false,
                msg: '密钥被锁死，卡片失效'
              };
            } else
            if (ret.code === '6982') {
              await CardReader.action.error();
              return {
                ...ret,
                codeMsg: CardReader.codes[ret.code] ? CardReader.codes[ret.code].message : '',
                success: false,
                msg: '验证失败，请勿多次尝试，否则易造成锁卡（废卡）'
              };
            } else
            if (ret.code.indexOf('63') === 0) {
              await CardReader.action.error();
              return {
                ...ret,
                codeMsg: CardReader.codes[ret.code] ? CardReader.codes[ret.code].message : '',
                success: false,
                msg: '认证失败，剩余认证次数：' + CardReader.fn.hex2int(ret.code.substr(2))
              };
            } else {
              await CardReader.action.error();
              return {
                ...ret,
                codeMsg: CardReader.codes[ret.code] ? CardReader.codes[ret.code].message : '',
                success: false,
                msg: '验证失败，请勿多次尝试，否则易造成锁卡（废卡）'
              };
            }
          }
        }

        return {
          ...ret,
          code: '9000',
          success: true
        };
      } catch (error) {
        return {
          code: '',
          ...CardReader.fn.catchError(error),
          success: false
        };
      }
    },



    /**
     * 注销卡片
     * @returns {Promise<void>}
     */
    cancellation: async function(key = CardReader._attr.key) {
      let ret = await this.getCard(false, key, false, true);
      if (!ret.success) { // 获取卡片失败
        return ret;
      }

      try {
        // ret = await CardReader.fn.apdu((function() {
        //   return ['00', 'A4', '00', '00', '02', '3F00'].join('');
        // })());
        ret = await CardReader.fn.exec(CardReader.command.clean);
        ret = CardReader.fn.getResult(ret);
        if (ret.code !== '9000') {
          await CardReader.action.error();
          return {
            ...ret,
            codeMsg: CardReader.codes[ret.code] ? CardReader.codes[ret.code].message : '',
            success: false,
            msg: '注销卡失败'
          };
        }

        ret = await CardReader.fn.exec('SendCOSCommand,80E00000073F005001F1FFFF');
        ret = await CardReader.fn.exec('SendCOSCommand,80D401000D39F0F1AADD' + key);

        ret = CardReader.fn.getResult(ret);
        if (ret.code !== '9000') {
          await CardReader.action.error();
          return {
            ...ret,
            codeMsg: CardReader.codes[ret.code] ? CardReader.codes[ret.code].message : '',
            success: false,
            msg: '注销卡失败2'
          };
        }

        await CardReader.fn.exec(CardReader.command.deselect);
        await CardReader.fn.exec(CardReader.command.beep);
        return {
          code: '9000',
          success: true,
          msg: `注销卡片成功`,
          data: null
        };
      } catch (error) {
        return {
          code: '',
          ...CardReader.fn.catchError(error),
          success: false
        };
      }
    },

    // /**
    //  * 注销卡片
    //  * @returns {Promise<void>}
    //  */
    // cancellation: async function() {
    //   let ret;
    //   ret = await CardReader.fn.exec(CardReader.command.get.card);
    //   console.log('获得卡', ret);
    //   ret = await CardReader.fn.exec(CardReader.command.reset);
    //   console.log('选择卡', ret);
    //   ret = await CardReader.fn.exec(CardReader.command.get.random);
    //   ret = CardReader.fn.getResult(ret);
    //   console.log('获得随机数', ret);
    //   if (!ret.success) {
    //     await CardReader.action.error();
    //     console.error('请重新放置卡片：' + (CardReader.codes[ret.code] ? CardReader.codes[ret.code].message : ret.code));
    //     return;
    //   }
    //   const encrypt = CardReader.fn.encryptByDES(ret.data, 'FFFFFFFFFFFFFFFF');
    //   ret = await CardReader.fn.exec('SendCOSCommand,0082000008' + encrypt);

    //   console.log(ret, '验证结果---');
    //   ret = await CardReader.fn.apdu((function() {
    //     return ['00', 'A4', '00', '00', '02', '3F00'].join('');
    //   })());
    //   console.log('选择MF', ret);
    //   // ret = await CardReader.fn.exec(CardReader.command.clean);
    //   // console.log('清空当前目录文件', ret);
    //   // console.log(CardReader._attr.key);

    //   ret = await CardReader.fn.exec('SendCOSCommand,80E00000073F005001F1FFFF');
    //   ret = await CardReader.fn.exec('SendCOSCommand,80D401000D39F0F1AADD' + 'FFFFFFFFFFFFFFFF');
    //   ret = CardReader.fn.getResult(ret);
    //   console.log('新的加密', ret);

    //   await CardReader.fn.exec(CardReader.command.deselect);
    //   await CardReader.fn.exec(CardReader.command.beep);
    //   return {
    //     code: '9000',
    //     success: true,
    //     msg: `注销卡片成功`,
    //     data: null
    //   };
    // },

    /**
     * 出错指令
     */
    error: async function() {
      await CardReader.fn.exec(CardReader.command.deselect);
      await CardReader.fn.exec(CardReader.command.beep);
      setTimeout(function() {
        CardReader.fn.exec(CardReader.command.beep);
      }, 100);
    }

  },
  /**
   * 通用指令集
   */
  command: {
    get: {
      /**
       * 获得随机数
       */
      random: 'SendCOSCommand,0084000008',
      /**
       * 获得卡片
       */
      card: 'GetCardNo,82'
    },
    /**
     * 卡片复位
     */
    reset: 'ResetCpuCardNoGetCardNo',
    /**
     * 卡片擦除（清楚当前目录下的所有文件）
     */
    clean: 'SendCOSCommand,800E000000',
    /**
     * 取消选择卡片
     */
    deselect: 'DeselectCpuCard',
    /**
     * 蜂鸣
     */
    beep: 'Beep,10'

  },
  codes: {
    '6281': {
      'message': '回送的数据可能错误'
    },
    '6400': {
      'message': '状态标志未改变'
    },
    '6581': {
      'message': '写 EEPROM 不成功'
    },
    '6700': {
      'message': '错误的长度'
    },
    '6900': {
      'message': 'CLA 与线路保护要求不匹配'
    },
    '6981': {
      'message': '命令与文件结构不相容'
    },
    '6982': {
      'message': '不满足安全状态'
    },
    '6983': {
      'message': '密钥被锁死'
    },
    '6985': {
      'message': '使用条件不满足'
    },
    '6987': {
      'message': '无安全报文'
    },
    '6988': {
      'message': '安全报文数据项不正确'
    },
    '6A80': {
      'message': '数据域参数错误'
    },
    '6A81': {
      'message': '功能不支持或卡中无 MF 或卡片已锁定'
    },
    '6A82': {
      'message': '文件未找到'
    },
    '6A83': {
      'message': '记录未找到'
    },
    '6A84': {
      'message': '文件无足够空间'
    },
    '6A86': {
      'message': '参数 P1 P2 错误'
    },
    '6B00': {
      'message': '在达到 Le/Lc 字节之前文件结束，偏移量错误'
    },
    '6E00': {
      'message': '无效的 CLA'
    },
    '6F00': {
      'message': '数据无效'
    },
    '9302': {
      'message': 'MAC 错误'
    },
    '9303': {
      'message': '应用已被锁定'
    },
    '9401': {
      'message': '金额不足'
    },
    '9403': {
      'message': '密钥未找到'
    },
    '9406': {
      'message': '所需的 MAC 不可用'
    }
  }
};


// /**
//  * ==================== 密码验证==getCard 7/29====================
//  * @param key
//  * @returns {Promise<void>}
//  */
// CardReader.action['verify'] = async function(pwd, endLve) {
//   console.log('开始执行密码验证！');
//   let ret;
//   let GetCardNo;
//   let ResetCpuCardNoGetCardNo;
//   // ============ 获取卡, 验证卡密码 ====================

//   try {
//     ret = await CardReader.fn.exec(CardReader.command.get.card);
//     GetCardNo = CardReader.fn.getResult(ret); // 卡的信息

//     ret = await CardReader.fn.exec(CardReader.command.reset);
//     ResetCpuCardNoGetCardNo = CardReader.fn.getResult(ret); // 卡片复位信息

//     ret = await CardReader.fn.exec(CardReader.command.get.random);
//     ret = CardReader.fn.getResult(ret);

//     console.log('> 构造外部认证参数:');
//     const encrypt = CardReader.fn.encryptByDES(ret.data, pwd);
//     console.log('key:' + pwd + ' encrypt:' + encrypt);

//     ret = await CardReader.fn.exec('SendCOSCommand,0082000008' + encrypt);

//     ret = CardReader.fn.getResult(ret);

//     console.log('获得认证结果', ret);

//     // 63CB
//     if (ret.code !== '9000') {
//       await CardReader.action.error();
//       return {
//         ...ret,
//         codeMsg: CardReader.codes[ret.code] ? CardReader.codes[ret.code].message : '',
//         success: false,
//         msg: '验证失败，请勿多次尝试，否则易造成锁卡（废卡）'
//       };
//     }

//     if (endLve) {
//       await CardReader.fn.exec(CardReader.command.deselect);
//       await CardReader.fn.exec(CardReader.command.beep);
//     }
//     const str = CardReader.fn.strReverse(GetCardNo.data.substring(0, 8));

//     GetCardNo.data = CardReader.fn.hex2int(str);

//     return {
//       ...ret,
//       code: '9000',
//       success: false,
//       GetCardNo,
//       ResetCpuCardNoGetCardNo
//     };
//   } catch (error) {
//     console.log(error);
//     return {
//       code: '',
//       ...CardReader.fn.catchError(error),
//       success: false
//     };
//   }
// };

// /**
//  * 白卡初始化 使用 one() tow() 先销卡后再重新设置新密码 7/29====================
//  * @returns {Promise<void>}
//  */

// CardReader.action['init'] = async function(oldKey, newKey) {
//   let ret = await this.getCard(false, oldKey);
//   if (!ret.success) { // 获取卡片失败
//     return ret;
//   }

//   try {
//     // console.log('开始执行白卡初始化！' + oldKey + ' ' + newKey);
//     // 清空卡
//     // console.log('> 清空卡:');
//     ret = await CardReader.fn.exec(CardReader.command.clean);
//     ret = CardReader.fn.getResult(ret);
//     // console.log(ret);
//     // 创建密钥文件
//     // console.log('> 创建密钥文件:');

//     ret = await CardReader.fn.exec('SendCOSCommand,80E00000073F005001F1FFFF');
//     // console.log(ret);
//     // 增加外部认证密钥(ZJZ1C@RD)
//     // console.log('> 增加外部认证密钥:');
//     ret = await CardReader.fn.exec('SendCOSCommand,80D401000D39F0F1AADD' + newKey);
//     // console.log(ret);
//     // 取消选择卡片
//     await CardReader.fn.exec(CardReader.command.deselect);
//     await CardReader.fn.exec(CardReader.command.beep);
//     // alert('卡片初始化成功');

//     return {
//       ...ret,
//       code: '9000',
//       success: true,
//       msg: '卡片初始化成功'
//     };
//   } catch (error) {
//     return {
//       code: '',
//       ...CardReader.fn.catchError(error),
//       success: false
//     };
//   }
// };

// /**
//  * ==================== 重置密码 ====================
//  *
//  */
// CardReader.action['resetPwd'] = async function(oldKey, newKey) {
//   try {
//     console.log('开始重置卡片外部认证密码！');

//     // 获取卡片信息
//     let ret = await CardReader.fn.exec(CardReader.command.get.card);
//     // 卡片复位
//     ret = await CardReader.fn.exec(CardReader.command.reset);
//     // 选择主目录
//     ret = await CardReader.fn.apdu((function() {
//       return ['00', 'A4', '00', '00', '02', '3F00'].join('');
//     })());
//     // 获得随机数
//     ret = await CardReader.fn.exec(CardReader.command.get.random);
//     ret = CardReader.fn.getResult(ret);

//     // 构造外部认证参数
//     const encrypt = CardReader.fn.encryptByDES(ret.data, oldKey);
//     // 发送认证指令
//     ret = await CardReader.fn.exec('SendCOSCommand,0082000008' + encrypt);
//     ret = CardReader.fn.getResult(ret);
//     // console.log(ret);
//     if (ret.code !== '9000') {
//       if (ret.code === '6A88') {
//         // 密钥未找到
//         // 创建密钥文件
//         ret = await CardReader.fn.exec('SendCOSCommand,80E00000073F005001F1FFFF');
//         // 增加外部认证密钥(ZJZ1C@RD)
//         // console.log('> 增加外部认证密钥:');
//         ret = await CardReader.fn.exec('SendCOSCommand,80D401000D39F0F1AADD' + newKey);
//       }
//     } else {
//       // 旧密码认证成功->修改秘钥
//       ret = await CardReader.fn.exec('SendCOSCommand,80D439000D39F0F1AADD' + newKey);
//       // console.log(ret);
//     }
//     // 取消选择卡片
//     await CardReader.fn.exec(CardReader.command.deselect);
//     await CardReader.fn.exec(CardReader.command.beep);
//   } catch (error) {
//     return {
//       code: '',
//       ...CardReader.fn.catchError(error),
//       success: false
//     };
//   }
// };
// /**
//  * *************************** 写数据 用户数据到卡里 ***************************
//  *
//  */
// CardReader.action['writeUserInfo2Card'] = async function(data, umeter, resEnd, key) {
//   if (data) {
//     console.log('【发卡流程】');
//     let ret = await this.getCard(false, key);
//     if (!ret.success) { // 获取卡片失败
//       return ret;
//     }

//     try {
//       // 构造用户数据
//       let str;
//       if (umeter) {
//         str = umeter + (USERINFO.map(e => data[e])).join(';'); // ['1000', '1', (USERINFO.map(e => data[e])).join(';')].join('|');
//       } else {
//         str = userMark + (USERINFO.map(e => data[e])).join(';'); // ['1000', '1', (USERINFO.map(e => data[e])).join(';')].join('|');
//       }

//       // 用户信息数据加密
//       str = CardReader.fn.strToHex16(str);
//       const size = '00' + CardReader.fn.numToHex16(str.length / 2);

//       // 清空目录
//       // ret = await CardReader.fn.exec(CardReader.command.clean);

//       // 创建应用目录
//       ret = await CardReader.fn.apdu((function() {
//         return ['80', 'E0', '3F', '01', '0D', '38', '00FF', 'F0', 'F0', 95, 'FFFF', CardReader.fn.strToHex16('ADF01')].join('');
//       })());
//       ret = CardReader.fn.getResult(ret);
//       if (ret.code !== '9000') {
//         await CardReader.action.error();
//         return {
//           ...ret,
//           success: false,
//           codeMsg: CardReader.codes[ret.code] ? CardReader.codes[ret.code].message : '',
//           msg: '创建应用目录失败'
//         };
//       }
//       // 选择目录
//       ret = await CardReader.fn.apdu((function() {
//         return ['00', 'A4', '00', '00', '02', '3F', '01'].join('');
//       })());
//       // 创建二进制文件
//       ret = await CardReader.fn.apdu((function() {
//         const cmd = ['80', 'E0', '00', CardReader.fn.numToHex16(1), '07', '28', size, 'F0', 'F0', 'FFFF'].join('');
//         // console.log(cmd);
//         return cmd;
//       })());
//       // console.log('创建二进制文件', ret);
//       ret = CardReader.fn.getResult(ret);
//       if (ret.code !== '9000') {
//         await CardReader.action.error();
//         return {
//           ...ret,
//           success: false,
//           codeMsg: CardReader.codes[ret.code] ? CardReader.codes[ret.code].message : '',
//           msg: '创建二进制文件失败'
//         };
//       }

//       // 写二进制文件
//       ret = await CardReader.fn.apdu((function() {
//         return ['00', 'D6', CardReader.fn.numToHex16(1 | 0x80), '00', CardReader.fn.numToHex16(str.length / 2), str].join('');
//       })());
//       ret = CardReader.fn.getResult(ret);
//       if (ret.code !== '9000') {
//         await CardReader.action.error();
//         return {
//           ...ret,
//           success: false,
//           codeMsg: CardReader.codes[ret.code] ? CardReader.codes[ret.code].message : '',
//           msg: '写入用户信息失败'
//         };
//       }

//       // 选择主文件目录这个不写了吗????
//       // ret = await CardReader.fn.apdu((function() {
//       //   return ['00', 'A4', '00', '00', '02', '3F', '00'].join('');
//       // })());
//       // // 创建数据索引目录
//       // ret = await CardReader.fn.apdu((function() {
//       //   const cmd = ['80', 'E0', '3F', '02', '0D', '38', '0032', 'F0', 'F0', 96, 'FFFF', CardReader.fn.strToHex16('ADF03')].join('');
//       //   return cmd;
//       // })());
//       // ret = CardReader.fn.getResult(ret);
//       // if (ret.code !== '9000') {
//       //   await CardReader.action.error();
//       //   return {
//       //     ...ret,
//       //     success: false,
//       //     codeMsg: CardReader.codes[ret.code] ? CardReader.codes[ret.code].message : '',
//       //     msg: '创建数据索引目录失败'
//       //   };
//       // }

//       // 取消选择卡片
//       if (!resEnd) {
//         await CardReader.fn.exec(CardReader.command.deselect);
//         await CardReader.fn.exec(CardReader.command.beep);
//       }

//       return {
//         code: '9000',
//         success: true,
//         msg: `发卡成功`,
//         data: data
//       };
//     } catch (error) {
//       return {
//         code: '',
//         ...CardReader.fn.catchError(error),
//         success: false
//       };
//     }
//   }
// };


/**
 * ==================== 获取卡片的信息 为true ====================
 */
CardReader.action['getCardInfo'] = async function(key, getCar) {
  const ret = await this.getCard(true, key, getCar, true);
  if (!ret.success) { // 获取卡片失败
    return ret;
  }

  return {
    ...ret,
    code: '9000',
    success: true,
    msg: `获取卡片成功`
  };
};

/**
 * ==================== 读取用户信息 ====================
 * @returns {Promise<void>}
 */
CardReader.action['readUserInfo'] = async function(key, resEnd) {
  console.log('【读取用户信息】');

  let ret = await this.getCard(false, key, false, true);
  if (!ret.success) { // 获取卡片失败
    return ret;
  }
  try {
    const GetCardNo = ret.GetCardNo;
    // ret = await CardReader.fn.apdu((function() {
    //   return ['00', 'A4', '00', '00', '02', '3F00'].join('');
    // })());
    // 选择用户信息目录
    ret = await CardReader.fn.apdu((function() {
      return ['00', 'A4', '00', '00', '02', '3F', '01'].join('');
    })());
    ret = CardReader.fn.getResult(ret);
    if (ret.code !== '9000') {
      await CardReader.action.error();
      let msg = '读取用户信息失败';
      if (ret.code === '6A82') {
        msg = '这是一张白卡';
      }
      return {
        ...ret,
        success: false,
        codeMsg: CardReader.codes[ret.code] ? CardReader.codes[ret.code].message : '',
        msg
      };
    }

    // 读二进制文件
    ret = await CardReader.fn.apdu((function() {
      return ['00', 'B0', CardReader.fn.numToHex16(1 | 0x80), '00', '00'].join('');
    })());
    ret = CardReader.fn.getResult(ret);
    if (ret.code !== '9000') {
      await CardReader.action.error();
      return {
        ...ret,
        success: false,
        codeMsg: CardReader.codes[ret.code] ? CardReader.codes[ret.code].message : '',
        msg: '读取用户信息失败'
      };
    }
    // 解析后的数据
    const data = CardReader.fn.utf8HexToStr(ret.data);

    // 取消选择卡片(默认结束进程)
    if (!resEnd) {
      await CardReader.fn.exec(CardReader.command.deselect);
      await CardReader.fn.exec(CardReader.command.beep);
    }


    const resInfo = CardReader.fn.resultData(data, USERINFO);
    const userInfo = resInfo.data;
    userMark = `${resInfo.meter[0]}|${resInfo.meter[1]}|`;

    return {
      ...ret,
      code: '9000',
      msg: `读取成功`,
      success: true,
      strData: data,
      // data: CardReader.fn.resultData(data, USERINFO),
      userInfo,
      GetCardNo,
      userMark,
      dataList: [],
      meter: versionMark
    };
  } catch (error) {
    return {
      code: '',
      ...CardReader.fn.catchError(error),
      success: false
    };
  }
};

/**
 * ==================== 获得卡数据 传key ====================
 * @returns {Promise<void>}
 */
CardReader.action['readData'] = async function(key = CardReader._attr.key, resEnd) {
  console.log('【读取卡数据】');
  let ret = await this.getCard(false, key, false, true);
  if (!ret.success) { // 获取卡片失败
    return ret;
  }

  try {
    // 选择索引目录
    ret = await CardReader.fn.apdu((function() {
      return ['00', 'A4', '00', '00', '02', '3F', '02'].join('');
    })());
    // 读取索引目录索引文件('请确保有这个文件目录')
    ret = await CardReader.fn.apdu((function() {
      return ['00', 'B0', CardReader.fn.numToHex16(1 | 0x80), '00', '00'].join('');
    })());
    ret = CardReader.fn.getResult(ret);
    if (ret.code !== '9000') {
      await CardReader.action.error();
      return {
        ...ret,
        success: false,
        codeMsg: CardReader.codes[ret.code] ? CardReader.codes[ret.code].message : '',
        msg: '读取索引目录索引文件失败'
      };
    }
    /**
     * 通过索引文件去获取卡中的数据量，然后进行递归的方式去遍历获取
     */
    const iData = CardReader.fn.splitByCharNum(ret.data, 2);
    // 转为数值
    const index = [];
    index[0] = parseInt(iData[0], 16);
    index[1] = parseInt(iData[1], 16);
    let count = 0;
    let errCount = 0;
    const data = [];
    let meter = '';
    while (index[0] > 2 && index[1] > 0) {
      // 选择数据目录
      ret = await CardReader.fn.apdu((function() {
        return ['00', 'A4', '00', '00', '02', '3F', CardReader.fn.numToHex16(index[0])].join('');
      })());
      // 读取二进制文件
      ret = await CardReader.fn.apdu((function() {
        return ['00', 'B0', CardReader.fn.numToHex16(index[1] | 0x80), '00', '00'].join('');
      })());
      ret = CardReader.fn.getResult(ret);
      if (ret.code === '9000') {
        const datae = CardReader.fn.utf8HexToStr(ret.data).replace(eval('/\u0000/g'), '');
        if (datae) {
          data.push(CardReader.fn.resultData(datae, DATAINFO).data);
          !meter && (meter = CardReader.fn.resultData(datae, DATAINFO).meter);
        }
        count += 1;
      } else {
        errCount += 1;
      }
      if (index[1] - 1 === 0) {
        index[0] -= 1;
        index[1] = 30;
      } else {
        index[1] -= 1;
      }
    }
    // 取消选择卡片
    if (!resEnd) {
      await CardReader.fn.exec(CardReader.command.deselect);
      await CardReader.fn.exec(CardReader.command.beep);
    }

    const dataList = data;
    return {
      ...ret,
      code: '9000',
      success: true,
      msg: `共读取了：${count + errCount}条记录，成功：${count}, 失败：${errCount}`,
      dataList,
      meter
    };
  } catch (error) {
    return {
      code: '',
      ...CardReader.fn.catchError(error),
      success: false
    };
  }
};

/**
 * ==================== 读取用户信息 + 读取卡数据 ========================================
 * @returns {Promise<void>}
 */

CardReader.action['readUserInfoAndreadData'] = async function(key = CardReader._attr.key) {
  // 1. 获取卡片
  let ret = await this.getCard(false, key, false, true);
  if (!ret.success) { // 获取卡片失败
    return ret;
  }

  try {
    const GetCardNo = ret.GetCardNo;
    // 读取用户信息
    ret = await CardReader.fn.apdu((() => ['00', 'A4', '00', '00', '02', '3F', '01'].join(''))());
    ret = CardReader.fn.getResult(ret);
    if (ret.code !== '9000') {
      await CardReader.action.error();
      let msg = '读取用户信息失败';
      if (ret.code === '6A82') {
        msg = '这是一张白卡';
      }
      return {
        ...ret,
        codeMsg: CardReader.codes[ret.code] ? CardReader.codes[ret.code].message : '',
        success: false,
        msg
      };
    }

    ret = await CardReader.fn.apdu((() => ['00', 'B0', CardReader.fn.numToHex16(1 | 0x80), '00', '00'].join(''))());
    ret = CardReader.fn.getResult(ret);
    if (ret.code !== '9000') {
      await CardReader.action.error();
      return {
        ...ret,
        success: false,
        codeMsg: CardReader.codes[ret.code] ? CardReader.codes[ret.code].message : '',
        msg: '无用户信息'
      };
    }

    ret = CardReader.fn.utf8HexToStr(ret.data);
    const resInfo = CardReader.fn.resultData(ret, USERINFO);
    const userInfo = resInfo.data;
    userMark = `${resInfo.meter[0]}|${resInfo.meter[1]}|`;

    // 获取卡数据前---------------------
    ret = await this.verifyencrypt(key, true);
    if (!ret.success) return ret;

    // 读取卡信息
    ret = await CardReader.fn.apdu((() => ['00', 'A4', '00', '00', '02', '3F', '02'].join(''))());
    ret = CardReader.fn.getResult(ret);
    if (ret.code !== '9000') {
      await CardReader.action.error();
      return {
        ...ret,
        userInfo,
        success: false,
        codeMsg: CardReader.codes[ret.code] ? CardReader.codes[ret.code].message : '',
        msg: '无02文件夹'
      };
    }
    ret = await CardReader.fn.apdu((() => ['00', 'B0', CardReader.fn.numToHex16(1 | 0x80), '00', '00'].join(''))());
    ret = CardReader.fn.getResult(ret);
    if (ret.code !== '9000') {
      await CardReader.action.error();
      return {
        ...ret,
        userInfo,
        success: false,
        codeMsg: CardReader.codes[ret.code] ? CardReader.codes[ret.code].message : '',
        msg: '读取索引目录索引文件失败'
      };
    }
    /**
     * 通过索引文件去获取卡中的数据量，然后进行递归的方式去遍历获取
     */
    const iData = CardReader.fn.splitByCharNum(ret.data, 2);

    const index = iData.map(e => parseInt(e, 16));

    let count = 0;
    let errCount = 0;
    let winCount = 0;

    const data = [];
    let meter = null;

    while (index[0] > 2 && index[1] > 0) {
      // 选择文件
      ret = await CardReader.fn.apdu((() => ['00', 'A4', '00', '00', '02', '3F', CardReader.fn.numToHex16(index[0])].join(''))());
      // 读取文件
      ret = await CardReader.fn.apdu((() => ['00', 'B0', CardReader.fn.numToHex16(index[1] | 0x80), '00', '00'].join(''))());

      ret = CardReader.fn.getResult(ret);
      if (ret.code === '9000') {
        const datae = (CardReader.fn.utf8HexToStr(ret.data).replace(eval('/\u0000/g'), ''));
        if (datae) {
          data.push(CardReader.fn.resultData(datae, DATAINFO).data);
          !meter && (meter = CardReader.fn.resultData(datae, DATAINFO).meter);
        } else {
          console.log(datae);
          winCount += 1;
        }
        count += 1;
      } else {
        errCount += 1;
      }

      // 倒过来读取的
      if (index[1] - 1 === 0) {
        index[0] -= 1;
        index[1] = 30;
      } else {
        index[1] -= 1;
      }
    }

    console.log('共读取了：', count + errCount, ' 条记录，成功：', count, ' 失败：', errCount);

    const dataList = data;

    await CardReader.fn.exec(CardReader.command.deselect);
    await CardReader.fn.exec(CardReader.command.beep);
    if (winCount > 0) {
      console.log(`${ret.code}: 无效数据${winCount}条`);
    }


    if (errCount > 0) {
      console.log(`${ret.code}: ${errCount}条数据异常`);
    }

    return {
      ...ret,
      code: '9000',
      msg: `读取数据${count}成功`,
      success: true,
      userInfo,
      dataList,
      GetCardNo,
      meter,
      userMark
    };
  } catch (error) {
    return {
      code: '',
      ...CardReader.fn.catchError(error),
      success: false
    };
  }
};


/**
 * *************************** 写数据 运单信息到卡里（判断是否因为目录的创建影响了记录的创建） ***************************
 * @returns {Promise<void>}
 */
CardReader.action['writeData'] = async function(data, key = CardReader._attr.key) {
  if (!data) return;
  const odata = data;
  console.log('【写数据】');


  data = CardReader.fn.strToHex16(data);
  const dfSize = '1900';
  const efSize = '00C8';

  // [{文件目录名索引},{文件索引}]
  const index = [3, 0];

  let ret = await this.getCard(false, key, false, true);
  if (!ret.success) { // 获取卡片失败
    return ret;
  }

  try {
    // 选择索引目录
    ret = await CardReader.fn.apdu((function() {
      return ['00', 'A4', '00', '00', '02', '3F', '02'].join('');
    })());
    ret = CardReader.fn.getResult(ret);

    if (ret.code === '6A82') {
      // 创建 02 目录
    }

    if (ret.code === '9000') {
      // 读取索引目录索引文件
      ret = await CardReader.fn.apdu((function() {
        return ['00', 'B0', CardReader.fn.numToHex16(1 | 0x80), '00', '00'].join('');
      })());
      ret = CardReader.fn.getResult(ret);
      if (ret.code === '9000') {
        // 设置文件索引
        const iData = CardReader.fn.splitByCharNum(ret.data, 2);
        index[0] = parseInt(iData[0], 16);
        index[1] = parseInt(iData[1], 16);
      }
    }

    /**
     * 根据索引信息去找
     */
    // 判断文件索引下的目录再加一是否超过30，若超过目录索引就要加一
    if (index[1] + 1 > 30) {
      index[0] += 1;
      index[1] = 1;
    } else {
      index[1] += 1;
    }
    // 通过索引去找要写的数据目录，若目录不存在就进行创建
    // 选择数据目录
    // 回到主目录
    ret = await this.verifyencrypt(key, true);
    if (!ret.success) return ret;

    ret = await CardReader.fn.apdu((function() {
      return ['00', 'A4', '00', '00', '02', '3F', CardReader.fn.numToHex16(index[0])].join('');
    })());
    ret = CardReader.fn.getResult(ret);
    if (ret.code === '6A82') {
      // 找不到目录进行创建，默认目录大小参照方法前的定义值  dfSize
      // 选择主目录下去创建数据目录

      // 创建数据目录
      ret = await CardReader.fn.apdu((function() {
        const cmd = ['80', 'E0', '3F', CardReader.fn.numToHex16(index[0]), '0D', '38', dfSize, 'F0', 'F0', 96, 'FFFF', CardReader.fn.strToHex16('ADF' + (index[0] < 10 ? '0' + index[0] : index[0]))].join('');
        return cmd;
      })());
      ret = CardReader.fn.getResult(ret);

      if (ret.code !== '9000') {
        await CardReader.action.error();
        return {
          ...ret,
          success: false,
          codeMsg: CardReader.codes[ret.code] ? CardReader.codes[ret.code].message : '',
          msg: '创建数据目录失败'
        };
      }
      // 创建后进行选择数据目录
      ret = await CardReader.fn.apdu((function() {
        return ['00', 'A4', '00', '00', '02', '3F', CardReader.fn.numToHex16(index[0])].join('');
      })());
    }
    // 通过索引去创建文件
    // 创建二进制文件
    ret = await CardReader.fn.apdu((function() {
      const cmd = ['80', 'E0', '00', CardReader.fn.numToHex16(index[1]), '07', '28', efSize, 'F0', 'F0', 'FFFF'].join('');
      return cmd;
    })());

    ret = CardReader.fn.getResult(ret);
    if (ret.code !== '9000') {
      await CardReader.action.error();
      return {
        ...ret,
        success: false,
        codeMsg: CardReader.codes[ret.code] ? CardReader.codes[ret.code].message : '',
        msg: '创建二进制文件失败',
        data: null
      };
    }
    // 写二进制文件
    ret = await CardReader.fn.apdu((function() {
      const recSize = CardReader.fn.numToHex16(data.length / 2);
      return ['00', 'D6', CardReader.fn.numToHex16(index[1] | 0x80), '00', recSize, data].join('');
    })());
    ret = CardReader.fn.getResult(ret);

    if (ret.code !== '9000') {
      await CardReader.action.error();
      return {
        ...ret,
        success: false,
        codeMsg: CardReader.codes[ret.code] ? CardReader.codes[ret.code].message : '',
        msg: '数据写卡失败',
        data: null
      };
    }
    /**
     * 写索引文件
     * 因为重新选择了根，需要再次认证一下
     */

    ret = await this.verifyencrypt(key, true);
    if (!ret.success) return ret;

    /**
     * 写索引文件
     */
    // 清空全局索引目录
    // 选择全局索引目录
    ret = await CardReader.fn.apdu((function() {
      return ['00', 'A4', '00', '00', '02', '3F', '02'].join('');
    })());
    ret = CardReader.fn.getResult(ret);

    if (ret.code === '6A82') {
      // 创建数据索引目录
      ret = await CardReader.fn.apdu((function() {
        const cmd = ['80', 'E0', '3F', '02', '0D', '38', '0032', 'F0', 'F0', 96, 'FFFF', CardReader.fn.strToHex16('ADF02')].join('');
        return cmd;
      })());
      // 创建后进行选择数据目录
      ret = await CardReader.fn.apdu((function() {
        return ['00', 'A4', '00', '00', '02', '3F02'].join('');
      })());
    }

    // 清空02索引目录????
    ret = await CardReader.fn.exec(CardReader.command.clean);
    // 创建二进制文件
    ret = await CardReader.fn.apdu((function() {
      return ['80', 'E0', '00', CardReader.fn.numToHex16(1), '07', '28', '0002', 'F0', 'F0', 'FFFF'].join('');
    })());

    ret = CardReader.fn.getResult(ret);
    if (ret.code !== '9000') {
      await CardReader.action.error();
      return {
        ...ret,
        success: false,
        codeMsg: CardReader.codes[ret.code] ? CardReader.codes[ret.code].message : '',
        msg: '创建索引二进制文件失败',
        data: null
      };
    }

    // 写二进制文件
    ret = await CardReader.fn.apdu((function() {
      const iData = CardReader.fn.numToHex16(index[0]) + CardReader.fn.numToHex16(index[1]);
      const cmd = ['00', 'D6', CardReader.fn.numToHex16(1 | 0x80), '00', CardReader.fn.numToHex16(iData.length / 2), iData].join('');
      return cmd;
    })());
    ret = CardReader.fn.getResult(ret);
    if (ret.code !== '9000') {
      await CardReader.action.error();
      return {
        ...ret,
        success: false,
        codeMsg: CardReader.codes[ret.code] ? CardReader.codes[ret.code].message : '',
        msg: '索引数据写卡失败',
        data: null
      };
    }
    // 读取索引文件
    ret = await CardReader.fn.apdu((function() {
      return ['00', 'B0', CardReader.fn.numToHex16(1 | 0x80), '00', '00'].join('');
    })());
    ret = CardReader.fn.getResult(ret);
    if (ret.code !== '9000') {
      await CardReader.action.error();
      return {
        ...ret,
        success: false,
        codeMsg: CardReader.codes[ret.code] ? CardReader.codes[ret.code].message : '',
        msg: '读取索引数据失败',
        data: null
      };
    }
    // 取消选择卡片
    await CardReader.fn.exec(CardReader.command.deselect);
    await CardReader.fn.exec(CardReader.command.beep);

    return {
      code: '9000',
      success: true,
      msg: '写入成功',
      data: {
        data: odata,
        index: ret.data
      }
    };
  } catch (error) {
    return {
      code: '',
      ...CardReader.fn.catchError(error),
      success: false
    };
  }
};

/**
 * *************************** 写数据 用户信息 估计要废弃 ***************************
 */
CardReader.action['issuingCard'] = async function(data, umeter, resEnd, key = CardReader._attr.key) {
  if (data) {
    console.log('【发卡流程】');
    let ret = await this.getCard(false, key, false, true);
    if (!ret.success) { // 获取卡片失败
      return ret;
    }

    try {
      // 构造用户数据
      let str;
      if (umeter) {
        str = umeter + (USERINFO.map(e => data[e])).join(';'); // ['1000', '1', (USERINFO.map(e => data[e])).join(';')].join('|');
      } else {
        str = userMark + (USERINFO.map(e => data[e])).join(';'); // ['1000', '1', (USERINFO.map(e => data[e])).join(';')].join('|');
      }

      // 用户信息数据加密
      str = CardReader.fn.strToHex16(str);
      const size = '00' + CardReader.fn.numToHex16(str.length / 2);

      // 清空目录('单独再处理')
      // ret = await CardReader.fn.exec(CardReader.command.clean);

      // 创建应用目录
      ret = await CardReader.fn.apdu((function() {
        return ['80', 'E0', '3F', '01', '0D', '38', '00FF', 'F0', 'F0', 95, 'FFFF', CardReader.fn.strToHex16('ADF01')].join('');
      })());
      ret = CardReader.fn.getResult(ret);
      if (ret.code !== '9000') {
        await CardReader.action.error();
        return {
          ...ret,
          success: false,
          codeMsg: CardReader.codes[ret.code] ? CardReader.codes[ret.code].message : '',
          msg: '创建应用目录失败'
        };
      }
      // 选择目录
      ret = await CardReader.fn.apdu((function() {
        return ['00', 'A4', '00', '00', '02', '3F', '01'].join('');
      })());
      // 创建二进制文件
      ret = await CardReader.fn.apdu((function() {
        const cmd = ['80', 'E0', '00', CardReader.fn.numToHex16(1), '07', '28', size, 'F0', 'F0', 'FFFF'].join('');
        return cmd;
      })());
      ret = CardReader.fn.getResult(ret);
      if (ret.code !== '9000') {
        await CardReader.action.error();
        return {
          ...ret,
          success: false,
          codeMsg: CardReader.codes[ret.code] ? CardReader.codes[ret.code].message : '',
          msg: '创建二进制文件失败'
        };
      }

      // 写二进制文件
      ret = await CardReader.fn.apdu((function() {
        return ['00', 'D6', CardReader.fn.numToHex16(1 | 0x80), '00', CardReader.fn.numToHex16(str.length / 2), str].join('');
      })());
      ret = CardReader.fn.getResult(ret);
      if (ret.code !== '9000') {
        await CardReader.action.error();
        return {
          ...ret,
          success: false,
          codeMsg: CardReader.codes[ret.code] ? CardReader.codes[ret.code].message : '',
          msg: '写入用户信息失败'
        };
      }

      // 选择主文件目录这个不写了吗????(这个是自接创建??)
      // ret = await CardReader.fn.apdu((function() {
      //   return ['00', 'A4', '00', '00', '02', '3F', '00'].join('');
      // })());
      // 创建数据索引目录


      // ret = await CardReader.fn.apdu((function() {
      //   const cmd = ['80', 'E0', '3F', '02', '0D', '38', '0032', 'F0', 'F0', 96, 'FFFF', CardReader.fn.strToHex16('ADF02')].join('');
      //   return cmd;
      // })());
      // ret = CardReader.fn.getResult(ret);
      // console.log('创建索引目录');
      // if (ret.code !== '9000') {
      //   await CardReader.action.error();
      //   return {
      //     ...ret,
      //     success: false,
      //     codeMsg: CardReader.codes[ret.code] ? CardReader.codes[ret.code].message : '',
      //     msg: '创建数据索引目录失败'
      //   };
      // }

      // 取消选择卡片
      if (!resEnd) {
        await CardReader.fn.exec(CardReader.command.deselect);
        await CardReader.fn.exec(CardReader.command.beep);
      }

      return {
        code: '9000',
        success: true,
        msg: `发卡成功`,
        data: data
      };
    } catch (error) {
      return {
        code: '',
        ...CardReader.fn.catchError(error),
        success: false
      };
    }
  }
};

// CardReader.action['createFolder'] = async function(index, key) {
//   let ret = await this.getCard(false, key);
//   if (!ret.success) { // 获取卡片失败
//     return ret;
//   }
//   // 选择主目录
//   ret = await CardReader.fn.apdu((function() {
//     return ['00', 'A4', '00', '00', '02', '3F', '00'].join('');
//   })());
//   // 创建应用目录
//   ret = await CardReader.fn.apdu((function() {
//     const cmd = ['80', 'E0', '3F', CardReader.fn.numToHex16(index), '0D', '38', '1900', 'F0', 'F0', 96, 'FFFF', CardReader.fn.strToHex16('ADF' + (index < 10 ? '0' + index : index))].join('');
//     // console.log(cmd);
//     return cmd;
//   })());
//   // console.log('创建数据目录', ret);
//   // 取消选择卡片
//   await CardReader.fn.exec(CardReader.command.deselect);
//   await CardReader.fn.exec(CardReader.command.beep);
// };


export default CardReader;
