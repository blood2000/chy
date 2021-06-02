const CryptoJS = require('crypto-js');
import { MessageBox, Message } from 'element-ui';

const CardReader = {
  _cmdIndex: 1,
  socket: null,
  _attr: {
    protocol: document.location.protocol,
    host: '127.0.0.1',
    port: 31213,
    key: 'FFFFFFFFFFFFFFFF'
  },
  fn: {
    getWsUrl: function() {
      if (CardReader._attr.protocol == 'https') {
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
      if (CardReader.socket.readyState == WebSocket.OPEN) {
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
      return new Promise(resolve => {
        CardReader.socket.onmessage = function(e) {
          resolve(e.data);
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
      hasCode = hasCode != undefined ? hasCode : true;
      const arr = str.split(',');
      return {
        'success': arr[2] == 'True',
        'code': (function() {
          if (hasCode) { return arr.length >= 4 ? arr[3].substr(arr[3].length - 4) : ''; } else return '';
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
    resultData: function(str, key = [
      'user_code',
      'user_name',
      'user_telno',
      'issuing_code',
      'issuing_name']) {
      // 1000|1|adf34d2d22b64c43b31476a746dd757f;黄婷;18415451845;94671e0bff6647e88db777427d700e32;陈大帅;1622531892853

      const arr = str.split('|');
      const arr2 = arr[2].split(';');

      const data = {};
      key.forEach((e, index) => {
        data[e] = arr2[index];
      });
      if (key.length !== arr2.length) {
        console.log('字段不匹配, 截取');
        data['other'] = arr2.filter((e, index) => {
          return index >= key.length;
        });
      }
      return {
        meter: [arr[0], arr[1]],
        data
      };
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
      if (val.length % 2 == 1) {
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
    readUTF: function(arr) {
      if (typeof arr === 'string') {
        return arr;
      }
      let UTF = ''; const _arr = arr;
      for (let i = 0; i < _arr.length; i++) {
        const one = _arr[i].toString(2);
        const v = one.match(/^1+?(?=0)/);
        if (v && one.length == 8) {
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
        if (temp.length == 2) {
          data.push(temp);
          temp = '';
        }
        temp += str.charAt(i);
      }
      if (temp != '') {
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
         */
    getCard: async function() {
      let ret;
      ret = await CardReader.fn.exec(CardReader.command.get.card);
      ret = CardReader.fn.getResult(ret);
      ret = await CardReader.fn.exec(CardReader.command.reset);
      console.log('选择卡', ret);
      ret = await CardReader.fn.exec(CardReader.command.get.random);
      ret = CardReader.fn.getResult(ret);
      console.log('获得随机数', ret);
      if (!ret.success) {
        Message.error('读取卡片失败');
        console.error('请重新放置卡片：' + (CardReader.codes[ret.code] ? CardReader.codes[ret.code].message : ret.code));
        await CardReader.action.error();
        return;
      }
      const encrypt = CardReader.fn.encryptByDES(ret.data, CardReader._attr.key);
      ret = await CardReader.fn.exec('SendCOSCommand,0082000008' + encrypt);
      return ret;

      // 不做其他处理会有问题
    },
    /**
         * 注销卡片
         * @returns {Promise<void>}
         */
    cancellation: async function() {
      let ret = await this.getCard();
      ret = await CardReader.fn.apdu((function() {
        return ['00', 'A4', '00', '00', '02', '3F00'].join('');
      })());
      console.log('选择MF', ret);
      ret = await CardReader.fn.exec(CardReader.command.clean);
      console.log('清空当前目录文件', ret);
      await CardReader.fn.exec(CardReader.command.deselect);
      await CardReader.fn.exec(CardReader.command.beep);
      Message.error('注销卡片成功');
      return;
    },
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

  }, codes: {
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

/**
 * 发卡
 */
CardReader.action['issuingCard'] = async function(data) {
  const res = await MessageBox.confirm('确认发卡？发卡会清空卡中数据', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  });

  if (res === 'confirm') {
    console.log('【发卡流程】');
    let ret = await this.getCard();
    console.log('选择MF', ret);
    // 构造用户数据
    let str = ['1000', '1', [data.user_code, data.user_name, data.user_telno, data.issuing_code, data.issuing_name, new Date().getTime()].join(';')].join('|');
    str = CardReader.fn.strToHex16(str);
    const size = '00' + CardReader.fn.numToHex16(str.length / 2);
    // 清空目录
    ret = await CardReader.fn.exec(CardReader.command.clean);
    console.log('清空目录', ret);
    // 创建应用目录
    ret = await CardReader.fn.apdu((function() {
      return ['80', 'E0', '3F', '01', '0D', '38', '00FF', 'F0', 'F0', 95, 'FFFF', CardReader.fn.strToHex16('ADF01')].join('');
    })());
    console.log('创建应用目录', ret);
    // 选择目录
    ret = await CardReader.fn.apdu((function() {
      return ['00', 'A4', '00', '00', '02', '3F', '01'].join('');
    })());
    console.log('选择目录', ret);
    // 创建二进制文件
    ret = await CardReader.fn.apdu((function() {
      const cmd = ['80', 'E0', '00', CardReader.fn.numToHex16(1), '07', '28', size, 'F0', 'F0', 'FFFF'].join('');
      console.log(cmd);
      return cmd;
    })());
    console.log('创建二进制文件', ret);
    // 写二进制文件
    ret = await CardReader.fn.apdu((function() {
      return ['00', 'D6', CardReader.fn.numToHex16(1 | 0x80), '00', CardReader.fn.numToHex16(str.length / 2), str].join('');
    })());
    console.log('写二进制文件', ret);
    // 选择主文件目录
    ret = await CardReader.fn.apdu((function() {
      return ['00', 'A4', '00', '00', '02', '3F', '00'].join('');
    })());
    console.log('选择主文件目录', ret);
    // 创建数据索引目录
    ret = await CardReader.fn.apdu((function() {
      const cmd = ['80', 'E0', '3F', '02', '0D', '38', '0032', 'F0', 'F0', 96, 'FFFF', CardReader.fn.strToHex16('ADF03')].join('');
      console.log(cmd);
      return cmd;
    })());
    console.log('创建数据索引目录', ret);
    // 取消选择卡片
    await CardReader.fn.exec(CardReader.command.deselect);
    await CardReader.fn.exec(CardReader.command.beep);

    return {
      code: 200,
      msg: `发卡成功`,
      data: null
    };
  }
};

/**
 * 读取用户信息
 * @returns {Promise<void>}
 */
CardReader.action['readUserInfo'] = async function() {
  console.log('【读取用户信息】');
  let ret = await this.getCard();

  ret = await CardReader.fn.apdu((function() {
    return ['00', 'A4', '00', '00', '02', '3F00'].join('');
  })());
  console.log('选择MF', ret);
  // 选择用户信息目录
  ret = await CardReader.fn.apdu((function() {
    return ['00', 'A4', '00', '00', '02', '3F', '01'].join('');
  })());
  console.log('选择用户信息目录', ret);
  ret = CardReader.fn.getResult(ret);
  if (!ret.success || ret.code != '9000') {
    Message.error('不存在用户信息：' + (CardReader.codes[ret.code] ? CardReader.codes[ret.code].message : ret.code));
    console.error('不存在用户信息：' + (CardReader.codes[ret.code] ? CardReader.codes[ret.code].message : ret.code));
    return await CardReader.action.error();
  }

  // 读二进制文件
  ret = await CardReader.fn.apdu((function() {
    return ['00', 'B0', CardReader.fn.numToHex16(1 | 0x80), '00', '00'].join('');
  })());
  console.log('读二进制文件', ret);
  ret = CardReader.fn.getResult(ret);
  if (!ret.success || ret.code != '9000') {
    Message.error('不存在用户信息：' + (CardReader.codes[ret.code] ? CardReader.codes[ret.code].message : ret.code));
    console.error('不存在用户信息：' + (CardReader.codes[ret.code] ? CardReader.codes[ret.code].message : ret.code));
    return await CardReader.action.error();
  }
  console.log('解析后的用户数据：', CardReader.fn.utf8HexToStr(ret.data));
  const data = CardReader.fn.utf8HexToStr(ret.data);
  // 取消选择卡片
  await CardReader.fn.exec(CardReader.command.deselect);
  await CardReader.fn.exec(CardReader.command.beep);

  // 获取成功返回用户数据
  return Promise.resolve({
    code: 200,
    msg: `读取成功`,
    data: data
  });
};

/**
 * 获得卡数据
 * @returns {Promise<void>}
 */
CardReader.action['readData'] = async function() {
  console.log('【获得卡数据】');
  let ret = await this.getCard();
  // 选择索引目录
  ret = await CardReader.fn.apdu((function() {
    return ['00', 'A4', '00', '00', '02', '3F', '02'].join('');
  })());
  console.log('选择索引目录', ret);
  // 读取索引目录索引文件
  ret = await CardReader.fn.apdu((function() {
    return ['00', 'B0', CardReader.fn.numToHex16(1 | 0x80), '00', '00'].join('');
  })());
  console.log('读二进制文件', ret);
  ret = CardReader.fn.getResult(ret);
  if (!ret.success || ret.code != '9000') {
    Message.error('读文件失败，缺少数据索引信息：' + (CardReader.codes[ret.code] ? CardReader.codes[ret.code].message : ret.code));
    console.error('读文件失败，缺少数据索引信息：' + (CardReader.codes[ret.code] ? CardReader.codes[ret.code].message : ret.code));
    return await CardReader.action.error();
  }
  /**
     * 通过索引文件去获取卡中的数据量，然后进行递归的方式去遍历获取
     */
  const iData = CardReader.fn.splitByCharNum(ret.data, 2);
  // 转为数值
  const index = [];
  index[0] = parseInt(iData[0], 16);
  index[1] = parseInt(iData[1], 16);
  console.log(index);
  let count = 0; let errCount = 0;
  const data = [];
  while (index[0] > 2 && index[1] > 0) {
    // 选择数据目录
    ret = await CardReader.fn.apdu((function() {
      return ['00', 'A4', '00', '00', '02', '3F', CardReader.fn.numToHex16(index[0])].join('');
    })());
    console.log('选择数据目录', ret);
    // 读取二进制文件
    ret = await CardReader.fn.apdu((function() {
      return ['00', 'B0', CardReader.fn.numToHex16(index[1] | 0x80), '00', '00'].join('');
    })());
    ret = CardReader.fn.getResult(ret);
    if (ret.success && ret.code == '9000') {
      data.push(CardReader.fn.utf8HexToStr(ret.data).replace(eval('/\u0000/g'), ''));
      count += 1;
    } else {
      errCount += 1;
    }
    if (index[1] - 1 == 0) {
      index[0] -= 1;
      index[1] = 30;
    } else {
      index[1] -= 1;
    }
  }
  console.log('共读取了：', count + errCount, ' 条记录，成功：', count, ' 失败：', errCount);
  console.log('记录内容：');
  console.log(data);
  // 取消选择卡片
  await CardReader.fn.exec(CardReader.command.deselect);
  await CardReader.fn.exec(CardReader.command.beep);
  return Promise.resolve({
    code: 200,
    msg: `共读取了：${count + errCount} 条记录，成功：${count} -- 失败：${errCount}`,
    data: data
  });
};

/**
 * 写数据（判断是否因为目录的创建影响了记录的创建）
 * @returns {Promise<void>}
 */
CardReader.action['writeData'] = async function(data) {
  data = data || '1010|1|29804;2614710;广东深圳福龙学校项目;鄂ALF106;张三丰;13812345678;1621648441990;1621648441990;广东深圳妈湾石头';
  data = CardReader.fn.strToHex16(data);
  console.log('【写数据】');
  const dfSize = '1900'; const efSize = '00C8';

  // [{文件目录名索引},{文件索引}]
  const index = [3, 0];
  let ret = await this.getCard();
  // 选择索引目录
  ret = await CardReader.fn.apdu((function() {
    return ['00', 'A4', '00', '00', '02', '3F', '02'].join('');
  })());
  console.log('选择索引目录', ret);
  // 读取索引目录索引文件
  ret = await CardReader.fn.apdu((function() {
    return ['00', 'B0', CardReader.fn.numToHex16(1 | 0x80), '00', '00'].join('');
  })());
  console.log('读二进制文件', ret);
  ret = CardReader.fn.getResult(ret);
  if (ret.success && ret.code == '9000') {
    // 设置文件索引
    console.log('开始设置文件索引');
    const iData = CardReader.fn.splitByCharNum(ret.data, 2);
    index[0] = parseInt(iData[0], 16);
    index[1] = parseInt(iData[1], 16);
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
  ret = await CardReader.fn.apdu((function() {
    return ['00', 'A4', '00', '00', '02', '3F', CardReader.fn.numToHex16(index[0])].join('');
  })());
  console.log('通过索引去找目录', ret);
  ret = CardReader.fn.getResult(ret);
  if (ret.success && ret.code == '6A82') {
    // 找不到目录进行创建，默认目录大小参照方法前的定义值  dfSize
    // 选择主目录下去创建数据目录
    ret = await CardReader.fn.apdu((function() {
      return ['00', 'A4', '00', '00', '02', '3F', '00'].join('');
    })());
    console.log('选择主目录下去创建数据目录', ret);
    // 创建数据目录
    ret = await CardReader.fn.apdu((function() {
      const cmd = ['80', 'E0', '3F', CardReader.fn.numToHex16(index[0]), '0D', '38', dfSize, 'F0', 'F0', 96, 'FFFF', CardReader.fn.strToHex16('ADF' + (index[0] < 10 ? '0' + index[0] : index[0]))].join('');
      console.log(cmd);
      return cmd;
    })());
    console.log('创建数据目录', ret);
    ret = CardReader.fn.getResult(ret);
    if (!ret.success || ret.code != '9000') {
      await CardReader.action.error();
      console.error('写卡失败：' + (CardReader.codes[ret.code] ? CardReader.codes[ret.code].message : ret.code));
      return;
    }
    // 创建后进行选择数据目录
    ret = await CardReader.fn.apdu((function() {
      return ['00', 'A4', '00', '00', '02', '3F', CardReader.fn.numToHex16(index[0])].join('');
    })());
    console.log('创建后进行选择数据目录', ret);
  }
  // 通过索引去创建文件
  // 创建二进制文件
  ret = await CardReader.fn.apdu((function() {
    const cmd = ['80', 'E0', '00', CardReader.fn.numToHex16(index[1]), '07', '28', efSize, 'F0', 'F0', 'FFFF'].join('');
    console.log(cmd);
    return cmd;
  })());
  console.log('创建二进制文件', ret);
  ret = CardReader.fn.getResult(ret);
  if (!ret.success || ret.code != '9000') {
    // start = false;
    await CardReader.action.error();
    console.error('写卡失败：' + (CardReader.codes[ret.code] ? CardReader.codes[ret.code].message : ret.code));
    return {
      code: ret.code,
      msg: '写卡失败',
      data: null
    };
  }
  // 写二进制文件
  ret = await CardReader.fn.apdu((function() {
    const recSize = CardReader.fn.numToHex16(data.length / 2);
    console.log('写文件大小：', data.length / 2, recSize);
    return ['00', 'D6', CardReader.fn.numToHex16(index[1] | 0x80), '00', recSize, data].join('');
  })());
  console.log('写二进制文件', ret);
  ret = CardReader.fn.getResult(ret);
  if (!ret.success || ret.code != '9000') {
    await CardReader.action.error();
    console.error('写卡失败：' + (CardReader.codes[ret.code] ? CardReader.codes[ret.code].message : ret.code));
    return {
      code: ret.code,
      msg: '写卡失败',
      data: null
    };
  }
  /**
     * 写索引文件
     */
  // 清空全局索引目录
  // 选择全局索引目录
  ret = await CardReader.fn.apdu((function() {
    return ['00', 'A4', '00', '00', '02', '3F', '02'].join('');
  })());
  console.log('选择索引目录', ret);
  // 清空索引目录
  ret = await CardReader.fn.exec(CardReader.command.clean);
  console.log('清空索引目录', ret);
  // 创建二进制文件
  ret = await CardReader.fn.apdu((function() {
    return ['80', 'E0', '00', CardReader.fn.numToHex16(1), '07', '28', '0002', 'F0', 'F0', 'FFFF'].join('');
  })());
  console.log('创建二进制文件', ret);
  // 写二进制文件
  ret = await CardReader.fn.apdu((function() {
    console.log(index);
    const iData = CardReader.fn.numToHex16(index[0]) + CardReader.fn.numToHex16(index[1]);
    console.log(iData);
    const cmd = ['00', 'D6', CardReader.fn.numToHex16(1 | 0x80), '00', CardReader.fn.numToHex16(iData.length / 2), iData].join('');
    console.log(cmd);
    return cmd;
  })());
  console.log('写二进制文件', ret);
  // 读取索引文件
  ret = await CardReader.fn.apdu((function() {
    return ['00', 'B0', CardReader.fn.numToHex16(1 | 0x80), '00', '00'].join('');
  })());
  console.log('读取索引文件', ret);
  // 取消选择卡片
  await CardReader.fn.exec(CardReader.command.deselect);
  await CardReader.fn.exec(CardReader.command.beep);

  return {
    code: 200,
    msg: '写入成功',
    data: {
      data: data

    }
  };
};

CardReader.action['createFolder'] = async function(index) {
  let ret = await this.getCard();
  // 选择主目录
  ret = await CardReader.fn.apdu((function() {
    return ['00', 'A4', '00', '00', '02', '3F', '00'].join('');
  })());
  // 创建应用目录
  ret = await CardReader.fn.apdu((function() {
    const cmd = ['80', 'E0', '3F', CardReader.fn.numToHex16(index), '0D', '38', '1900', 'F0', 'F0', 96, 'FFFF', CardReader.fn.strToHex16('ADF' + (index < 10 ? '0' + index : index))].join('');
    console.log(cmd);
    return cmd;
  })());
  console.log('创建数据目录', ret);
  // 取消选择卡片
  await CardReader.fn.exec(CardReader.command.deselect);
  await CardReader.fn.exec(CardReader.command.beep);
};


export default CardReader;
