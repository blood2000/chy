export const dataJson = {
  'module': '', // 模块 user,transport,trade
  branchCode: '', // 网点
  // 1.平台用户注册注销模块
  'user': {
    // 用户
    'user': {
      'userType': '', // 货主shipment,司机driver,调度team
      'operateType': '', // 1.新增 2注销
      'info': {
        'name': '' // info内目前只放姓名，如果后期大屏需要更多数据往这里面加
      }
    },
    // 车辆
    'car': {
      'operateType': '', // 1.新增 2注销
      'info': {
        'CPH': '' // info内目前只放车牌号，如果后期大屏需要更多数据往这里面加
      }
    }
  },

  // 2.运输
  'transport': {
    // 货单
    'order': {
      'operateType': '', // 1.发布 2下架  基本是发布的,下架的下面也没有数据
      'shipment': {
        'code': '',
        'name': ''
      }, // 货主基本信息,
      'orderCode': '', // 货源CODE,如果后面有更多的需求，可根据CODe去获取
      'address': {
        'load': [{
          'province': '', // 货源省份
          'City': '', // 货源城市
          'Location': '' // 货源经纬度
        }],
        'land': [{
          'province': '', // 货源省份
          'loadCity': '', // 货源城市
          'loadLocation': '' // 货源经纬度
        }]
      },
      'goods': '', // 多商品逗号隔开
      'isNewPoint': true, // 是否新增网点
      'isNewLine': true // 是否新增路线

    },
    // 运单
    'waybill': {
      'status': '', // 1.接单 2装货 3.卸货 4.复核 5.结算
      'num': 1, // 1.接单 2装货 3.卸货基本为1，4.复核 5.结算存在批量
      'orderCode': '', // 货源CODE,如果后面有更多的需求，可根据CODE去获取
      'waybillCode': '', // 运单CODE,如果后面有更多的需求，可根据CODe去获取
      // 以下只有接单的时候才有
      'driver': {
        'code': '',
        'name': '',
        'telphone': ''
      }, // 司机基本信息
      'shipment': {
        'code': '',
        'adminName': '',
        'companyName': '',
        'telphone': ''
      }, // 货主基本信息
      'address': {
        'loadProvince': '', // 装货-省份
        'loadCity': '', // 装货-城市编码
        'loadLocation': '', // 装货-坐标点
        'unloadProvince': '', // 卸货-省份
        'unloadCity': '', // 卸货-城市编码
        'unloadLocation': '' // 卸货-坐标点
      },
      'goods': ''
    }
  },

  // 3.交易,批量将金额汇总展示
  'trade': {
    // 打款
    'settle': {
      'shipment': {
        'code': '',
        'name': ''
      }, // 货主基本信息
      'driver': {
        'code': '',
        'name': ''
      }, // 司机基本信息
      'amount': 10000
    },
    // 开票，批量将金额汇总展示
    'invoice': {
      'shipment': {
        'code': '',
        'name': ''
      }, // 货主基本信息
      'amount': 10000
    }
  }
};
