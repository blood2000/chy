<template>
  <!-- 进行改造 -->
  <div class="app-container">
    <el-steps v-if="false" :active="1" finish-status="success">
      <el-step title="基本信息" />
      <el-step title="装卸货地址" />
      <el-step title="预览" />
    </el-steps>

    <!-- 转货信息 -->

    <el-form
      ref="elForm"
      :model="formData"
      :rules="rules"
      size="medium"
      label-width="110px"
      :label-position="'left'"
    >
      <!-- 第一步 基本信息 -->
      <div class="content">
        <div v-if="isCreated" class="header mb8">代发货主信息</div>

        <el-form-item v-if="isCreated" label="代发货主" prop="tin1">
          <el-select
            v-model="formData.tin1"
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="remoteMethod"
            :loading="loading"
          >
            <el-option
              v-for="(item, index1) in shipmentList"
              :key="index1"
              :label="item.adminName"
              :value="item.code"
            />
          </el-select>
        </el-form-item>


        <OrderBasic
          v-if="formData.tin1"
          ref="OrderBasic"
          v-model="isMultiGoods"
          :pubilsh-code="formData.tin1"
          :cb-data="cbOrderBasic"
          @goods="(data)=> goods = data"
        />

        <el-button v-if="formData.tin1 && active < 2" @click="nextTo(2)">下一步</el-button>
      </div>

      <!-- 第二步 地址的填写 -->
      <div v-if="formData.tin1 && active >= 2" class="content">
        <div class="header mb8">地址信息</div>
        <el-form-item label="装卸类型" prop="tin7">
          <el-radio-group v-model="formData.tin7" size="medium">
            <el-radio
              v-for="dict in (isMultiGoods?[
                { dictValue: '1', dictLabel: '一装一卸' },
                { dictValue: '2', dictLabel: '多装一卸' },
                { dictValue: '3', dictLabel: '一装多卸' }
              ]:[{ dictValue: '1', dictLabel: '一装一卸' }])"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{ dict.dictLabel }}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-if="formData.tin7 !== '1'" label="允许自卸/自装">
          <div class="ly-flex">
            <el-form-item
              v-if="formData.tin7 === '2' || formData.tin7 === '4'"
              prop="tin8"
            >
              <el-checkbox v-model="formData.tin8">允许自装</el-checkbox>
            </el-form-item>
            <el-form-item
              v-if="formData.tin7 === '3' || formData.tin7 === '4'"
              :label-width="formData.tin7 === '4' ? '30px' : null"
              prop="tin9"
            >
              <el-checkbox v-model="formData.tin9">允许自卸</el-checkbox>
            </el-form-item>
          </div>
        </el-form-item>

        <el-divider />


        <div class="header mb8 m-flex">
          装货信息
          <el-button
            v-if="formData.tin7 === '2' || formData.tin7 === '4'"
            type="primary"
            style="margin-top: -12px"
            @click="_addAddress('address_add')"
          >添加地址</el-button>
        </div>

        <div
          v-for="address in address_add"
          :key="address.refName"
          class="oneAddress_item"
        >
          <OneAddress :ref="address.refName" type="1" :cb-data="address.cbData" />

          <el-button
            v-if="address_add.length >= 2"
            type="danger"
            @click="_delAddress('address_add', address.refName)"
          >删除地址</el-button>
        </div>

        <el-divider />

        <div class="header mb8 m-flex">
          卸货信息
          <el-button
            v-if="formData.tin7 === '3' || formData.tin7 === '4'"
            type="primary"
            style="margin-top: -12px"
            @click="_addAddress('address_xie')"
          >添加地址</el-button>
        </div>

        <div
          v-for="address in address_xie"
          :key="address.refName"
          class="oneAddress_item"
        >
          <OneAddress :ref="address.refName" type="2" :cb-data="address.cbData" />

          <el-button
            v-if="address_xie.length >= 2"
            type="danger"
            @click="_delAddress('address_xie', address.refName)"
          >删除地址</el-button>
        </div>

        <el-button v-if="active < 3" @click="nextSe(3)">下一步</el-button>
        <el-divider />
      </div>

      <!-- 第三步 货源信息 -->
      <div v-if="formData.tin1 && active >= 3" class="content">
        <div class="header mb8">货源信息</div>
        <goods-info ref="goodsInfo" :goods="goods" :goods-big-type="goodsBigType" :addr-add="addr_add" :addr-xie="addr_xie" :pubilsh-code="formData.tin1" :cb-goods-accounting="cbGoodsAccounting" />
      </div>

    </el-form>

    <div v-if="active >= 3">
      <el-button type="primary" @click="onSubmit('elForm')">立即发布</el-button>
      <el-button>取消</el-button>
    </div>
  </div>
</template>

<script>
import OrderBasic from './OrderBasic';
import OneAddress from './component/OneAddress';
import GoodsInfo from './GoodsInfo';

import GoodsAccounting from './component/GoodsAccounting';
import AccounTing from './component/AccounTing';
import MultiData from './component/MultiData';

import { listShipment } from '@/api/assets/shipment.js';

// 获取货集码列表 ? 要在什么时机调用?
// import { listStockcode } from '@/api/enterprise/stockcode';

import { orderPubilsh, getOrderByCode, orderFreight } from '@/api/order/release';

export default {
  components: {
    GoodsAccounting,
    AccounTing,
    MultiData,
    //
    OrderBasic,
    OneAddress,
    GoodsInfo
  },
  data() {
    return {
      basicInfor: null, // 创建货源的基本信息
      goodsBigType: '', // 获取出大类


      active: 1, // 步骤
      goods: [], // 商品
      // 地址数组形式
      address_add: [{ refName: 'address_add' + Date.now() }], // 装
      address_xie: [{ refName: 'address_xie' + Date.now() }], // 卸
      addr_add: [], // 装传进去
      addr_xie: [], // 卸传进去

      cbOrderBasic: null, // 传给OrderBasic组件的数据

      cbData: null,
      cbGoodsAccounting: null,
      orderFreightBoList: null,

      loading: false,
      // 多商品对应各自的规格
      tin2_1tabs: [],
      tin2_1tabs_activeName: '0',
      formData: {
        tin1: '', // 发布人Code
        tin7: '1', // 装卸类型 1.一装一卸 2.多装一卸 3.一装多卸 4.多装多卸
        tin8: false, // 允许自装 true=>是; false=> 否
        tin9: false //  允许自卸 true=>是; false=> 否
      },
      rules: {
        tin1: [
          { required: true, message: '请选择货物类型', trigger: 'change' }
        ],
        tin7: [
          { required: true, message: '请选择货物类型', trigger: 'change' }
        ]
      },

      shipmentList: [],
      // 选中的名
      activeName: 'first',
      // 是否显示弹出层
      open: false,
      // 弹框title
      title: '',
      // 用来判断多商品还是单商品
      isMultiGoods: false
    };
  },

  computed: {

    isTin1() {
      return !!this.formData.tin1;
    },
    isEdit() {
      return this.$route.query.t === '1';
    },
    isCreated() {
      return !this.$route.query.t && !this.$route.query.id;
    },
    isShowMulti() {
      return this.address_add.length >= 2 || this.address_xie.length >= 2;
    },
    addressTab() {
      let arr = [];

      if (this.isShowMulti) {
        if (this.address_add.length >= 2) {
          arr = [...arr, ...this.address_add];
        }
        if (this.address_xie.length >= 2) {
          arr = [...arr, ...this.address_xie];
        }
      }
      return arr;
    },
    nowType() {
      let bool = true;
      if (this.formData.tin7 === '2') {
        bool = true;
      } else if (this.formData.tin7 === '3') {
        bool = false;
      }
      return bool;
    }

  },
  watch: {
    isMultiGoods() {
      if (this.isMultiGoods) return;
      this.tin7 = '1';
      this.tin8 = false;
      this.tin9 = false;
    }
  },

  created() {
    if (this.$route.query.id) {
      this.getCbdata(this.$route.query.id);
    }



    // 测试
  },

  methods: {
    async nextTo(active) {
      this.basicInfor = await this.handlerPromise('OrderBasic', false);
      this.basicInfor.loadType = this.formData.tin7;
      this.goodsBigType = this.basicInfor.orderGoodsList[0].goodsBigType;
      console.log(this.goodsBigType);

      this.active = active; // 走第2步

      this.handlercbAddress([
        {
          'id': null,
          'code': 'd6f7c5dad3e143188f8287f0a82313e0',
          'orderCode': '9085f700cc304f949335231000d7eed6',
          'addressType': 2,
          'country': '中国',
          'province': '福建省',
          'city': '福州市',
          'citycode': '3501',
          'district': '仓山区',
          'street': '',
          'adcode': '350104',
          'location': [
            119.358265,
            26.045794
          ],
          'level': null,
          'detail': '富邦针织',
          'contact': '12123',
          'contactPhone': '12345678910',
          'addressAlias': '1212',
          'provinceCode': '35' // 没返回

        },
        {
          'id': null,
          'code': 'd30b05af28a843028ea29f7f6c61465f',
          'orderCode': '9085f700cc304f949335231000d7eed6',
          'addressType': 1,
          'country': '中国',
          'province': '福建省',
          'city': '福州市',
          'citycode': '3501',
          'district': '台江区',
          'street': '',
          'adcode': '350103',
          'location': [
            119.358265,
            26.045794
          ],
          'level': null,
          'detail': '富邦总部大楼',
          'contact': '123456',
          'contactPhone': '12345678910',
          'addressAlias': '案发地上',
          'provinceCode': '35',
          // m0DictValue: null, //
          // ruleDictValue: null,
          ruleInfoShipmentCode: '25bbb90b43be45b7aebc01d4ee1c2265'
          // 'orderFreightBoList': [
          //   {
          //     'orderCode': '9085f700cc304f949335231000d7eed6',
          //     'orderGoodsCode': null,
          //     'ruleDetailShipmentCode': '2d0141894ccb4542a7af469d3154caab',
          //     'ruleItemCode': '1',
          //     'ruleValue': 'DE',
          //     'type': null,
          //     'createCode': 'c0e8fdb5e44942d3a10907dc97768847',
          //     'createTime': '2021-03-23 10:04:22.895',
          //     'updateCode': null,
          //     'updateTime': null,
          //     'isDel': false
          //   },
          //   {
          //     'orderCode': '9085f700cc304f949335231000d7eed6',
          //     'orderGoodsCode': null,
          //     'ruleDetailShipmentCode': '5f8e26d37aec4e28b1060044dd1f37a2',
          //     'ruleItemCode': '14',
          //     'ruleValue': '50',
          //     'type': 1,
          //     'createCode': 'c0e8fdb5e44942d3a10907dc97768847',
          //     'createTime': '2021-03-23 10:04:22.908',
          //     'updateCode': null,
          //     'updateTime': null,
          //     'isDel': false
          //   },
          //   {
          //     'orderCode': '9085f700cc304f949335231000d7eed6',
          //     'orderGoodsCode': null,
          //     'ruleDetailShipmentCode': '75e1aafd564a4e5cba032919f0e0d8ff',
          //     'ruleItemCode': '15',
          //     'ruleValue': '100',
          //     'type': 1,
          //     'createCode': 'c0e8fdb5e44942d3a10907dc97768847',
          //     'createTime': '2021-03-23 10:04:22.919',
          //     'updateCode': null,
          //     'updateTime': null,
          //     'isDel': false
          //   },
          //   {
          //     'orderCode': '9085f700cc304f949335231000d7eed6',
          //     'orderGoodsCode': null,
          //     'ruleDetailShipmentCode': '06a474570a21484db43d9ce737f31eea',
          //     'ruleItemCode': '12',
          //     'ruleValue': '1000',
          //     'type': 2,
          //     'createCode': 'c0e8fdb5e44942d3a10907dc97768847',
          //     'createTime': '2021-03-23 10:04:22.934',
          //     'updateCode': null,
          //     'updateTime': null,
          //     'isDel': false
          //   },
          //   {
          //     'orderCode': '9085f700cc304f949335231000d7eed6',
          //     'orderGoodsCode': null,
          //     'ruleDetailShipmentCode': '43045d7b3ae6474db28c922ddc0d685b',
          //     'ruleItemCode': '13',
          //     'ruleValue': '500',
          //     'type': 2,
          //     'createCode': 'c0e8fdb5e44942d3a10907dc97768847',
          //     'createTime': '2021-03-23 10:04:22.945',
          //     'updateCode': null,
          //     'updateTime': null,
          //     'isDel': false
          //   }
          // ],
          // freight: {
          //   'detailList': [
          //     {
          //       'id': 140,
          //       'code': '06a474570a21484db43d9ce737f31eea',
          //       'ruleCode': '8c844a2e7ac340359c2bb41e7bd645b1',
          //       'ruleItemCode': '12',
          //       'ruleValue': '1000',
          //       'type': '2',
          //       'cnName': '卸车费',
          //       'enName': 'xcf',
          //       'showType': 1,
          //       'dictCode': null,
          //       'ruleType': 0,
          //       'dictLabel': null,
          //       'unit': null
          //     },
          //     {
          //       'id': 139,
          //       'code': '43045d7b3ae6474db28c922ddc0d685b',
          //       'ruleCode': '8c844a2e7ac340359c2bb41e7bd645b1',
          //       'ruleItemCode': '13',
          //       'ruleValue': '500',
          //       'type': '2',
          //       'cnName': '油费',
          //       'enName': 'yf',
          //       'showType': 1,
          //       'dictCode': null,
          //       'ruleType': 0,
          //       'dictLabel': null,
          //       'unit': null
          //     },
          //     {
          //       'id': 138,
          //       'code': '5f8e26d37aec4e28b1060044dd1f37a2',
          //       'ruleCode': '8c844a2e7ac340359c2bb41e7bd645b1',
          //       'ruleItemCode': '14',
          //       'ruleValue': '50',
          //       'type': '1',
          //       'cnName': 'ETC费',
          //       'enName': 'etc',
          //       'showType': 1,
          //       'dictCode': null,
          //       'ruleType': 0,
          //       'dictLabel': null,
          //       'unit': null
          //     },
          //     {
          //       'id': 137,
          //       'code': '75e1aafd564a4e5cba032919f0e0d8ff',
          //       'ruleCode': '8c844a2e7ac340359c2bb41e7bd645b1',
          //       'ruleItemCode': '15',
          //       'ruleValue': '100',
          //       'type': '1',
          //       'cnName': '超时费',
          //       'enName': 'csf',
          //       'showType': 1,
          //       'dictCode': null,
          //       'ruleType': 0,
          //       'dictLabel': null,
          //       'unit': null
          //     }
          //   ],
          //   'lossList': [
          //     {
          //       'id': 136,
          //       'code': '2d0141894ccb4542a7af469d3154caab',
          //       'ruleCode': '8c844a2e7ac340359c2bb41e7bd645b1',
          //       'ruleItemCode': '1',
          //       'ruleValue': 'DE',
          //       'type': null,
          //       'cnName': '路耗 计算方式',
          //       'enName': 'lhjsfs',
          //       'showType': 4,
          //       'dictCode': 'lossPlan',
          //       'ruleType': 1,
          //       'dictLabel': null,
          //       'unit': null
          //     }
          //   ]
          // }
        }
      ]);
    },
    async nextSe(active) {
      // 返回装货地址
      const address_add = this.address_add.map(async(e) => {
        return {
          ...e,
          ...e.cbData,
          ...(await this.$refs[e.refName][0]._submitForm())
        };
      });
      const address_xie = this.address_xie.map(async(e) => {
        return {
          ...e,
          ...e.cbData,
          ...(await this.$refs[e.refName][0]._submitForm())
        };
      });

      this.addr_add = await Promise.all(address_add);
      this.addr_xie = await Promise.all(address_xie);



      this.active = active; // 3
    },

    // 下一步
    async next(active) {
      if ((active + '') === '2') {
        // this.active = active + '';
      }
      if ((active + '') === '3') {
        // 返回装货地址
        const address_add = this.address_add.map(async(e) => {
          return await this.$refs[e.refName][0]._submitForm();
        });
        // 返回卸货地址
        const address_xie = this.address_xie.map(async(e) => {
          return await this.$refs[e.refName][0]._submitForm();
        });

        this.addr_add = await Promise.all(address_add);
        this.addr_xie = await Promise.all(address_xie);

        console.log(this.addr_add);
        console.log(this.addr_xie);

        // 这里是获取到装货地址和卸货地址
      }

      this.active = active + '';
    },
    onSubmit(form) {
      this.$refs[form].validate(async(valid) => {
        if (valid) {
          const data = await this.submAllData();

          orderPubilsh(data).then((response) => {
            this.msgSuccess('新增成功');

            setTimeout(() => {
              this.$router.push({ name: 'Manage' });
            }, 1000);
          });
        } else {
          return false;
        }
      });
    },

    // 3.
    async submAllData() {
      const { orderGoodsList, orderAddressPublishBoList } = await this.handlerAddress();

      const orderBasic = this.basicInfor;

      orderBasic.orderGoodsList = orderGoodsList.map(e => {
        return {
          goodsBigType: orderBasic.orderGoodsList[0].goodsBigType, // 大类code
          goodsType: e.dictCode, // 小类code
          businessType: e.businessType, // 业务类型
          'goodsPrice': e.goodsPrice, // 货物单价
          number: e.number ? e.number - 0 : 0, // 车
          'vehicleMaxWeight': e.vehicleMaxWeight, // 最高配载
          'stowageStatus': e.stowageStatus, // 配载方式
          'isOneselfLoad': this.formData.tin8,
          'isOneselfUnload': this.formData.tin9,
          'totalType': e.totalType, // 配载总量类型 1.不限（长期货源）2.定量货源
          'vehicleLength': e.vehicleLength,
          'vehicleType': e.vehicleType,
          'weight': e.weight ? e.weight : '' // 货品吨数

          // "goodsUnit": "", // 货物单位 0：吨 1：立方米 无
          // 'isModifyFinish': true, // 平台是否完成调价??
          // 'limitWastage': '', // 货物损耗 格式： 0/1(0-定额kg/车，1-定率千分之几/车)-1
          // "perWeight": 0, // 每车载重量（吨） ??
          // 'priceWastage': 0, // 路耗超出范围 赔偿单价 （元/吨）

        };
      });


      orderBasic.orderAddressPublishBoList = orderAddressPublishBoList;


      console.log(orderBasic, '最后数据');


      return orderBasic;
    },

    // 1. 远程搜索
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        // 获取代理用户表
        listShipment({ adminName: query, pageNum: 1, pageSize: 10 }).then(
          (res) => {
            this.shipmentList = res.rows;
            this.loading = false;
          }
        );
      } else {
        this.shipmentList = [];
      }
    },

    // 回填获取数据
    async getCbdata(id) {
      // console.log(getOrderByCode);

      const { data: data2 } = await getOrderByCode(id);
      console.log(data2);


      // 假数据
      const data1 = {
        'code': '9085f700cc304f949335231000d7eed6', // code
        'mainOrderNumber': '2103231004220621',
        'projectCode': '658b38b1bdc2478e849b57617c1a0e69', // 项目编码
        'isSpecified': true, // 是否指定接班人
        'remark': '这是放回的备注信息', // 备注
        'classCode': null,
        'isPublic': false, // 是否公开源
        'pubilshCode': 'c0e8fdb5e44942d3a10907dc97768847', // ???? 这个这么没了
        'loadType': null, // ?? 这个这么没了
        'redisOrderClassGoodsVoList': [
          {
            'code': 'cb872d4d99da49d79fc397546e83f66d',
            'classCode': '',
            'orderCode': '9085f700cc304f949335231000d7eed6',
            'createCode': 'c0e8fdb5e44942d3a10907dc97768847',
            'createTime': '2021-03-23 10:04:22.744',
            'updateCode': null,
            'updateTime': null
          }
        ],
        'redisOrderGoodsVoList': [
          {
            'code': '67fe2206fbad4c669ffcae0219fd457c',
            'orderCode': '9085f700cc304f949335231000d7eed6',
            'goodsBigType': 376,
            'totalType': null,
            'goodsType': 769,
            'goodsUnit': '0',
            'weight': null,
            'vehicleMaxWeight': 412,
            'shipmentPrice': 424,
            'goodsPrice': null,
            'vehicleType': 'G11',
            'vehicleLength': '0008,0007,0006',
            'limitWastage': null,
            'priceWastage': null,
            'isOneselfLoad': null,
            'isModifyFinish': null,
            'isOneselfUnload': null,
            'balanceRuleCode': null
          }
        ],
        'redisOrderSpecifiedVoList': [
          {
            'code': 'e954fc39145e4515a137e9f06a27a610',
            'orderCode': null,
            'userType': 2,
            'teamInfoCode': '',
            'driverInfoCode': '4059ee53bb7e4474b2395d7481aa4d27'
          },
          {
            'code': '26365f1b29464c21a165128c102b5367',
            'orderCode': null,
            'userType': 2,
            'teamInfoCode': '',
            'driverInfoCode': '483ed050c4144caaba662ef4204b52ca'
          }
        ],
        'redisAddressList': [
          {
            'id': null,
            'code': 'd6f7c5dad3e143188f8287f0a82313e0',
            'orderCode': '9085f700cc304f949335231000d7eed6',
            'addressType': 2,
            'country': '中国',
            'province': '福建省',
            'city': '福州市',
            'citycode': '3501',
            'district': '仓山区',
            'street': '',
            'adcode': '350104',
            'location': [
              119.358265,
              26.045794
            ],
            'level': null,
            'detail': '富邦针织',
            'contact': '12123',
            'contactPhone': '12345678910',
            'addressAlias': '1212',
            'provinceCode': '35' // 没返回

          },
          {
            'id': null,
            'code': 'd30b05af28a843028ea29f7f6c61465f',
            'orderCode': '9085f700cc304f949335231000d7eed6',
            'addressType': 1,
            'country': '中国',
            'province': '福建省',
            'city': '福州市',
            'citycode': '3501',
            'district': '台江区',
            'street': '',
            'adcode': '350103',
            'location': [
              119.358265,
              26.045794
            ],
            'level': null,
            'detail': '富邦总部大楼',
            'contact': '123456',
            'contactPhone': '12345678910',
            'addressAlias': '案发地上',
            'provinceCode': '35',
            // m0DictValue: null, //
            // ruleDictValue: null,
            ruleInfoShipmentCode: '25bbb90b43be45b7aebc01d4ee1c2265',
            'redisOrderFreightVoList': [
              {
                'orderCode': '9085f700cc304f949335231000d7eed6',
                'orderGoodsCode': null,
                'ruleDetailShipmentCode': '2d0141894ccb4542a7af469d3154caab',
                'ruleItemCode': '1',
                'ruleValue': 'DE',
                'type': null,
                'createCode': 'c0e8fdb5e44942d3a10907dc97768847',
                'createTime': '2021-03-23 10:04:22.895',
                'updateCode': null,
                'updateTime': null,
                'isDel': false
              },
              {
                'orderCode': '9085f700cc304f949335231000d7eed6',
                'orderGoodsCode': null,
                'ruleDetailShipmentCode': '5f8e26d37aec4e28b1060044dd1f37a2',
                'ruleItemCode': '14',
                'ruleValue': '50',
                'type': 1,
                'createCode': 'c0e8fdb5e44942d3a10907dc97768847',
                'createTime': '2021-03-23 10:04:22.908',
                'updateCode': null,
                'updateTime': null,
                'isDel': false
              },
              {
                'orderCode': '9085f700cc304f949335231000d7eed6',
                'orderGoodsCode': null,
                'ruleDetailShipmentCode': '75e1aafd564a4e5cba032919f0e0d8ff',
                'ruleItemCode': '15',
                'ruleValue': '100',
                'type': 1,
                'createCode': 'c0e8fdb5e44942d3a10907dc97768847',
                'createTime': '2021-03-23 10:04:22.919',
                'updateCode': null,
                'updateTime': null,
                'isDel': false
              },
              {
                'orderCode': '9085f700cc304f949335231000d7eed6',
                'orderGoodsCode': null,
                'ruleDetailShipmentCode': '06a474570a21484db43d9ce737f31eea',
                'ruleItemCode': '12',
                'ruleValue': '1000',
                'type': 2,
                'createCode': 'c0e8fdb5e44942d3a10907dc97768847',
                'createTime': '2021-03-23 10:04:22.934',
                'updateCode': null,
                'updateTime': null,
                'isDel': false
              },
              {
                'orderCode': '9085f700cc304f949335231000d7eed6',
                'orderGoodsCode': null,
                'ruleDetailShipmentCode': '43045d7b3ae6474db28c922ddc0d685b',
                'ruleItemCode': '13',
                'ruleValue': '500',
                'type': 2,
                'createCode': 'c0e8fdb5e44942d3a10907dc97768847',
                'createTime': '2021-03-23 10:04:22.945',
                'updateCode': null,
                'updateTime': null,
                'isDel': false
              }
            ],
            freight: {
              'detailList': [
                {
                  'id': 140,
                  'code': '06a474570a21484db43d9ce737f31eea',
                  'ruleCode': '8c844a2e7ac340359c2bb41e7bd645b1',
                  'ruleItemCode': '12',
                  'ruleValue': '1000',
                  'type': '2',
                  'cnName': '卸车费',
                  'enName': 'xcf',
                  'showType': 1,
                  'dictCode': null,
                  'ruleType': 0,
                  'dictLabel': null,
                  'unit': null
                },
                {
                  'id': 139,
                  'code': '43045d7b3ae6474db28c922ddc0d685b',
                  'ruleCode': '8c844a2e7ac340359c2bb41e7bd645b1',
                  'ruleItemCode': '13',
                  'ruleValue': '500',
                  'type': '2',
                  'cnName': '油费',
                  'enName': 'yf',
                  'showType': 1,
                  'dictCode': null,
                  'ruleType': 0,
                  'dictLabel': null,
                  'unit': null
                },
                {
                  'id': 138,
                  'code': '5f8e26d37aec4e28b1060044dd1f37a2',
                  'ruleCode': '8c844a2e7ac340359c2bb41e7bd645b1',
                  'ruleItemCode': '14',
                  'ruleValue': '50',
                  'type': '1',
                  'cnName': 'ETC费',
                  'enName': 'etc',
                  'showType': 1,
                  'dictCode': null,
                  'ruleType': 0,
                  'dictLabel': null,
                  'unit': null
                },
                {
                  'id': 137,
                  'code': '75e1aafd564a4e5cba032919f0e0d8ff',
                  'ruleCode': '8c844a2e7ac340359c2bb41e7bd645b1',
                  'ruleItemCode': '15',
                  'ruleValue': '100',
                  'type': '1',
                  'cnName': '超时费',
                  'enName': 'csf',
                  'showType': 1,
                  'dictCode': null,
                  'ruleType': 0,
                  'dictLabel': null,
                  'unit': null
                }
              ],
              'lossList': [
                {
                  'id': 136,
                  'code': '2d0141894ccb4542a7af469d3154caab',
                  'ruleCode': '8c844a2e7ac340359c2bb41e7bd645b1',
                  'ruleItemCode': '1',
                  'ruleValue': 'DE',
                  'type': null,
                  'cnName': '路耗 计算方式',
                  'enName': 'lhjsfs',
                  'showType': 4,
                  'dictCode': 'lossPlan',
                  'ruleType': 1,
                  'dictLabel': null,
                  'unit': null
                }
              ]
            }
          }
        ]
      };

      // console.log(123);


      const { code: orderCode, isPublic, isSpecified, loadType, projectCode, pubilshCode, remark, redisOrderClassGoodsVoList, redisOrderGoodsVoList, redisAddressList, redisOrderSpecifiedVoList } = data1;

      // 处理1
      this.formData.tin1 = pubilshCode;
      this.formData.tin7 = loadType || '1';
      // 处理2 OrderBasic 组件

      this.cbOrderBasic = {
        projectCode,
        isPublic,
        goodsBigType: redisOrderGoodsVoList[0].goodsBigType,
        goodsType: redisOrderGoodsVoList.map(e => {
          return e.goodsType;
        }),
        isSpecified,
        remark,
        orderSpecifiedList: redisOrderSpecifiedVoList,
        classList: redisOrderClassGoodsVoList.map(e => {
          return {
            classCode: e.classCode
          };
        })
      };

      // 处理OneAddress地址的 和 处理规则
      await this.handlercbAddress(redisAddressList);

      // 处理商品
      this.cbGoodsAccounting = redisOrderGoodsVoList;

      this.active = '';
      console.log(this.address_add);
    },

    // 数据
    async handlerPromise(refname, bool) {
      if (bool) {
        return await Promise.all(this.$refs[refname]._submitForm());
      } else {
        return await this.$refs[refname]._submitForm();
      }
    },

    // 处理地址 和 商品
    async handlerAddress() {
      const goodsInfo = await this.$refs.goodsInfo._submitForm();
      const orderGoodsList = goodsInfo.map(e => {
        return {
          ...e.orderGood,
          goodsType: e.dictCode

        };
      });

      let arr = [];
      for (const e of goodsInfo) {
        arr = [...arr, ...e.newRedis];
      }

      if (this.formData.tin7 === '3') {
        this.addr_xie = arr;
      } else {
        this.addr_add = arr;
      }



      return { orderGoodsList, orderAddressPublishBoList: [...this.addr_add, ...this.addr_xie] };
    },

    // 处理地址回填
    handlercbAddress(addressList) {
      this.address_add = [];
      this.address_xie = [];

      addressList.forEach((e, index) => {
        if ((e.addressType - 0) === 1) {
          // 装
          this.address_add.push({
            refName: 'address_add' + Date.now() + index,
            cbData: e
          });
        } else {
          // 卸
          this.address_xie.push({
            refName: 'address_xie' + Date.now() + index,
            cbData: e
          });
        }
      });
    },

    // // 处理规则
    // handlerRedisOrderFreight(addressList){

    // },

    // 1. 添加一个地址
    _addAddress(name) {
      this[name].push({
        refName: name + Date.now()
      });
    },
    // 2. 删一个地址
    _delAddress(name, refName) {
      this[name] = this[name].filter((e) => {
        return e.refName !== refName;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.app-container {
  overflow-y: auto;
  height: calc(100vh - 145px);
}
.header {
  padding-bottom: 10px;
  position: relative;
  font-weight: 700;
  &::before {
    content: "";
    position: absolute;
    width: 3px;
    height: 20px;
    left: -15px;
    top: 1px;
    background-color: #1890ff;
  }
}
.content {
  width: 80%;
}

.vih {
  line-height: 36px;
}

.footer-box {
  padding: 20px 0;
  line-height: 26px;
  color: #ccc;
  text-align: right;
}

.oneAddress_item {
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
}
.m-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
