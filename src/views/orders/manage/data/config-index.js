export default [

  {
    prop: 'mainOrderNumber',
    isShow: true,
    width: 200,
    tooltip: true,
    fixed: 'left',
    label: '货源单号'
  },
  {
    prop: 'adminName',
    isShow: true,
    width: 120,
    tooltip: true,
    label: '货主名称'
  },
  {
    prop: 'companyName',
    isShow: true,
    width: 120,
    tooltip: true,
    label: '企业名称'
  },
  {
    prop: 'goodsBigTypeName',
    isShow: true,
    width: 120,
    tooltip: true,
    label: '货物大类'
  },
  {
    prop: 'goodsTypeName',
    isShow: true,
    width: 120,
    tooltip: true,
    label: '货物小类'
  },
  {
    prop: 'addressName1',
    isShow: true,
    width: 200,
    tooltip: true,
    label: '装货地'
  },
  {
    prop: 'contact1',
    isShow: true,
    width: 200,
    tooltip: true,
    label: '装货地联系人'
  },
  // {
  //   prop: 'contactPhone1',
  //   isShow: true,
  //   width: 200,
  //   tooltip: true,
  //   label: '装货地联系电话'
  // },
  {
    prop: 'addressName2',
    isShow: true,
    width: 200,
    tooltip: true,
    label: '卸货地'
  },
  {
    prop: 'contact2',
    isShow: true,
    width: 200,
    tooltip: true,
    label: '卸货地联系人'
  },
  // {
  //   prop: 'contactPhone2',
  //   isShow: true,
  //   width: 200,
  //   tooltip: true,
  //   label: '卸货地联系电话'
  // },
  {
    prop: 'remark',
    isShow: true,
    width: 120,
    tooltip: true,
    label: '备注'
  },
  {
    prop: 'goodsPrice',
    isShow: true,
    width: 120,
    tooltip: true,
    label: '货物单价'
  },
  {
    prop: 'shipmentPrice',
    isShow: true,
    width: 120,
    tooltip: true,
    label: '运输单价'
  },
  {
    prop: 'transactionPrice',
    isShow: true,
    width: 120,
    tooltip: true,
    label: '成交单价'
  },
  // {
  //   prop: 'unitPrice',
  //   isShow: true,
  //   width: 120,
  //   tooltip: true,
  //   label: '承运单价'
  // },
  {
    prop: 'businessType',
    isShow: true,
    width: 120,
    tooltip: true,
    label: '业务类型'
  },
  {
    prop: 'cargoCodeQr',
    isShow: false,
    width: 120,
    tooltip: true,
    label: '货集码地址'
  },


  // {
  //   prop: 'isDel',
  //   isShow: true,
  //   width: 120,
  //   tooltip: true,
  //   label: '是否删除'
  // },
  {
    prop: 'isPublic',
    isShow: true,
    width: 120,
    tooltip: true,
    label: '是否公开货源'
  },
  {
    prop: 'isSpecified',
    isShow: true,
    width: 120,
    tooltip: true,
    label: '是否指定接单人'
  },
  {
    prop: 'loadType',
    isShow: true,
    width: 120,
    tooltip: true,
    label: '装卸类型'
  },
  {
    prop: 'nickName',
    isShow: false,
    width: 120,
    tooltip: true,
    label: '昵称'
  },
  {
    prop: 'phonenumber',
    isShow: false,
    width: 120,
    tooltip: true,
    label: '手机号码'
  },
  {
    prop: 'projectName',
    isShow: true,
    width: 120,
    tooltip: true,
    label: '项目'
  },
  {
    prop: 'status',
    isShow: false,
    width: 120,
    tooltip: true,
    label: '状态'
  },
  {
    prop: 'notRobbedOrder',
    isShow: true,
    width: 120,
    tooltip: true,
    label: '可抢单量'
  },
  {
    prop: 'robbedOrder',
    isShow: true,
    width: 120,
    tooltip: true,
    label: '已抢单量'
  },
  {
    prop: 'tin_weight',
    isShow: true,
    width: 120,
    tooltip: true,
    label: '重量/体积/车数'
  },
  {
    prop: 'stowageStatus',
    isShow: true,
    width: 120,
    tooltip: true,
    label: '配载方式'
  },
  {
    prop: 'createTime',
    isShow: true,
    width: 120,
    tooltip: true,
    label: '发布时间'
  },
  {
    prop: 'updateTime',
    isShow: true,
    width: 120,
    tooltip: true,
    label: '修改时间'
  },

  {
    prop: 'opNickName',
    isShow: true,
    width: 120,
    tooltip: true,
    label: '创建人'
  },
  {
    prop: 'updateUserName',
    isShow: true,
    width: 120,
    tooltip: true,
    label: '操作人'
  },
  {
    prop: 'edit',
    isShow: true,
    label: '操作',
    width: 180,
    fixed: 'right'
  }
];

// redisAddressList	装货卸货地址信息列表	array	货源商品装货卸货地址_3
// redisOrderClassGoodsVoList	货集码列表	array	货源（分类）码编号_2
// redisOrderFreightInfoVoList	运费规则商品下的地址下的规则	array	RedisOrderFreightInfoVo
// redisOrderGoodsVoList		array	货源商品信息_2
// redisOrderSpecifiedVoList		array	货源指定接单人表_1
