export const dataJson = {
  'branchCode': '',
  'insertTime': '', // 时间戳格式
  'mode': '',
  'uuid': '',
  'invoiceNotice': {
    'companyName': '', // 公司名称
    'invoiceAmount': 0, // 开票金额
    'remark': '' // 滚动信息
  },
  'orderNoticeVo': {
    'branchCode': '',
    'uuid': '',
    // 货源
    'transportVo': {
      // 货单
      'orderBean': {
        // 地址
        'addressBean': {
          // 卸货
          'landBeanList': [
            {
              'city': '',
              'districtCode': '',
              'location': '',
              'province': ''
            }
          ],
          // 	装货信息
          'loadBeanList': [
            {
              'city': '',
              'districtCode': '',
              'location': '',
              'province': ''
            }
          ]
        },
        'orderCode': '',
        'goods': '', // 多商品
        'isNewLine': true, // 是否新增路线
        'newLineNum': 0, // 新增路线num  1 -1
        'isNewPoint': true, // 是否新增网点
        'newPointNum': 0, // 新增网点num  1 -1
        'operateType': 0, // 1发布(上架) 2下架
        'orderInfoNumber': 0, // 货单总数 1 -1
        'publishedNumber': 0, // 已发布 1 -1
        // 货主信息
        'shipmentBean': {
          'adminName': '',
          'code': ''
        }
      }
    }
  },
  'reportVo': {
    'appTrackReportNum': 0, // 已上报APP轨迹信息
    'carReportNum': 0, // 已上报车辆信息
    'driverReportNum': 0, // 已上报司机信息
    'fundReportNum': 0, // 已上报资金信息
    'hardwareTrackReportNum': 0, // 已上硬件轨迹信息
    'loadReportNum': 0, // 已上报装货信息
    'trackReportNum': 0, //	已上报轨迹信息
    'unLoadReportNum': 0, // 已上报卸货信息
    'waybillReportNum': 0 // 已上报运单信息
  },
  'userNotice': {
    'branchCode': '',
    // 车辆
    'car': {
      'info': {
        'cph': ''
      },
      'carNum': 0, // 车辆 1 -1
      'operateType': '' // 1新增 2注销
    },
    // 运力
    'user': {
      'info': {
        'name': ''
      },
      'driverNum': 0, // 司机 1 -1
      'shipmentNum': 0, // 货主 1 -1
      'teamNum': 0, // 调度者 1 -1
      'operateType': '', // 1新增 2注销
      'userType': '' // 货主shipment,司机driver,调度team
    }
  },
  'waybillNotice': {
    'orderCode': '',
    'waybillCode': '',
    'newNum': 0, // 总数量
    'accountNum': 0, // 复核数量
    'loadNum': 0, // 装货数量
    'unloadNum': 0, // 卸货数量
    'receiveNum': 0, // 接单数量
    'settlementNum': 0, // 结算数量
    'moneyNum': 0, // 打款数量
    'address': {
      'loadAddressAlias': '',
      'loadBankType': '',
      'loadCity': '',
      'loadCityCode': '',
      'loadContact': '',
      'loadContactPhone': '',
      'loadCountry': '',
      'loadDetail': '',
      'loadDistrict': '',
      'loadDistrictCode': '',
      'loadFormattedAddress': '',
      'loadLevel': '',
      'loadLocation': '',
      'loadLocations': [],
      'loadOrderAddressCode': '',
      'loadProvince': '',
      'loadProvinceCode': '',
      'loadStreet': '',
      'unloadAddressAlias': '',
      'unloadAddressName': '',
      'unloadBankType': '',
      'unloadCity': '',
      'unloadCityCode': '',
      'unloadContact': '',
      'unloadContactPhone': '',
      'unloadCountry': '',
      'unloadDetail': '',
      'unloadDistrict': '',
      'unloadDistrictCode': '',
      'unloadFormattedAddress': '',
      'unloadLevel': '',
      'unloadLocation': '',
      'unloadLocations': [],
      'unloadOrderAddressCode': '',
      'unloadProvince': '',
      'unloadProvinceCode': '',
      'unloadStreet': ''
    },
    'driver': {
      'code': '',
      'name': '',
      'telphone': ''
    },
    'shipment': {
      'code': '',
      'adminName': '',
      'companyName': '',
      'telphone': ''
    }
  },
  'waybillSettlementNotice': {
    'amount': 0, //	打款金额
    'totalFee': 0, // 手续费
    'driver': {
      'code': '',
      'name': '',
      'telphone': ''
    },
    'shipment': {
      'code': '',
      'adminName': '',
      'companyName': '',
      'telphone': ''
    }
  }
};
