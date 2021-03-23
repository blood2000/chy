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
          :cb-data="cbData"
        />
      </div>
      <el-divider />

      <div v-if="formData.tin1" class="content">
        <div class="header mb8">装卸货地址配置(第二步)</div>
        <template v-if="isMultiGoods">
          <el-form-item label="装货类型" prop="tin7">
            <el-radio-group v-model="formData.tin7" size="medium">
              <el-radio
                v-for="dict in [
                  { dictValue: '1', dictLabel: '一装一卸' },
                  { dictValue: '2', dictLabel: '多装一卸' },
                  { dictValue: '3', dictLabel: '一装多卸' }
                ]"
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
        </template>

        <el-divider />

        <div class="header mb8 m-flex">
          货源地址
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
          卸货地址
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

        <el-divider />

        <template v-if="!isMultiGoods">
          <div class="content">
            <div class="header mb8">配载信息(第三步)</div>

            <GoodsAccounting ref="goodsAccounting" :cb-data="cbGoodsAccounting" />

            <el-divider />
            <div class="header mb8">其他规则</div>

            <AccounTing ref="accounTing" :pubilsh-code="formData.tin1" :cb-data="orderFreightBoList" />

          </div>



          <div v-if="false" class="content">
            <div class="header mb8">预估运费</div>

            <div class="footer-box">
              <div>
                <span>预估运费(不含税):</span> <span>￥</span><span>8566.00</span>
              </div>
              <div>
                <span>(含税):</span> <span>￥</span><span>8566.00</span>
              </div>
            </div>
          </div>
        </template>

        <template v-else>
          <div class="content">
            <div class="header mb8">货物/核算</div>

            <el-tabs v-model="tin2_1tabs_activeName">
              <el-tab-pane
                v-for="item in tin2_1tabs"
                :key="item.value"
                :label="item.label"
                :name="item.value"
              >
                <!-- v-model="item.data" 如果自接传在去修改会警告, 倒不如处理完返回再赋值 -->
                <MultiData :ref="item.value" />
              </el-tab-pane>
            </el-tabs>
          </div>
        </template>
      </div>
    </el-form>

    <div>
      <el-button type="primary" @click="onSubmit('elForm')">立即发布</el-button>
      <el-button>取消</el-button>
    </div>
  </div>
</template>

<script>
import OrderBasic from './OrderBasic';
import OneAddress from './component/OneAddress';

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
    OneAddress
  },
  data() {
    return {
      cbData: null,
      cbGoodsAccounting: null,
      orderFreightBoList: null,

      loading: false,
      // 多商品对应各自的规格
      tin2_1tabs: [],
      tin2_1tabs_activeName: '0',
      // 地址数组形式
      address_add: [{ refName: 'add_' + Date.now() }], // 装
      address_xie: [{ refName: 'xie_' + Date.now() }], // 卸
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
  },

  methods: {
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
      const OrderBasic = await this.$refs.OrderBasic._submitForm();

      const address_add = this.address_add.map(async(e) => {
        return await this.$refs[e.refName][0]._submitForm();
      });
      const address_xie = this.address_xie.map(async(e) => {
        return await this.$refs[e.refName][0]._submitForm();
      });

      const addr_add = await Promise.all(address_add);
      const addr_xie = await Promise.all(address_xie);
      // console.log([...addr_xie, ...addr_add]); // 装卸货地址集合

      const goodsAccounting = await this.$refs.goodsAccounting._submitForm();
      // console.log(goodsAccounting, 'goodsAccounting------------');

      // 规则
      const accounTing = await this.$refs.accounTing._submitForm();
      // console.log(accounTing, 'accounTing 是个数组有详细的每一个细的规则------------');
      // 下面开始拼接
      const { orderGoodsList } = OrderBasic;
      // 1-  默认一装一卸
      OrderBasic.loadType = this.formData.tin7;
      OrderBasic.ruleInfoShipmentCode = accounTing[0].ruleCode;
      // 2- 装卸货数据
      OrderBasic.addressList = [...addr_xie, ...addr_add].map(ee => {
        return {
          ...ee,
          orderFreightBoList: accounTing // 把规则地址里面
        };
      });

      // 3- 其他是在OrderBsic.vue中配置了
      OrderBasic.orderGoodsList = orderGoodsList.map(e => {
        return {
          ...e,
          // 'balanceRuleCode': '', // 货主核算规则表CODE
          'goodsUnit': goodsAccounting.goodsUnit,
          // 'isModifyFinish': true, // 平台是否完成调价??
          'isOneselfLoad': this.formData.tin8,
          'isOneselfUnload': this.formData.tin9,
          // 'limitWastage': '', // 货物损耗 格式： 0/1(0-定额kg/车，1-定率千分之几/车)-1
          'perWeight': goodsAccounting.perWeight,
          'goodsPrice': goodsAccounting.goodsPrice,
          // 'priceWastage': 0, // 路耗超出范围 赔偿单价 （元/吨）
          'shipmentPrice': goodsAccounting.shipmentPrice,
          'totalType': goodsAccounting.weightType,
          'vehicleLength': goodsAccounting.vehicleLength,
          'vehicleType': goodsAccounting.vehicleType,
          'weight': goodsAccounting.weight ? goodsAccounting.weight : ''
        };
      });

      console.log(OrderBasic, '拼接后-----');

      return OrderBasic;
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

      let { data: data1 } = await getOrderByCode(id);
      console.log(data1);

      // 假数据
      data1 = {
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
            'perWeight': 412,
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
            'provinceCode': '35', // 没返回
            'redisOrderFreightVoList': [
              {
                'orderCode': '9085f700cc304f949335231000d7eed6',
                'orderGoodsCode': null,
                'ruleDetailShipmentCode': '2d0141894ccb4542a7af469d3154caab',
                'ruleItemCode': '1',
                'ruleValue': 'DE',
                'type': null,
                'createCode': 'c0e8fdb5e44942d3a10907dc97768847',
                'createTime': '2021-03-23 10:04:22.835',
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
                'createTime': '2021-03-23 10:04:22.845',
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
                'createTime': '2021-03-23 10:04:22.857',
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
                'createTime': '2021-03-23 10:04:22.864',
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
                'createTime': '2021-03-23 10:04:22.872',
                'updateCode': null,
                'updateTime': null,
                'isDel': false
              }
            ]
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
            ]
          }
        ]
      };
      // ----------转成想要的数据-----------

      const { code: orderCode, isPublic, isSpecified, loadType, projectCode, pubilshCode, remark, redisOrderClassGoodsVoList, redisOrderGoodsVoList, redisAddressList, redisOrderSpecifiedVoList } = data1;

      const classList = redisOrderClassGoodsVoList.map(e => {
        return {
          classCode: e.classCode
        };
      });

      const { goodsBigType, goodsType, goodsUnit, goodsPrice, isOneselfLoad, isOneselfUnload, perWeight, shipmentPrice, totalType, vehicleLength, vehicleType, weight } = redisOrderGoodsVoList[0];

      const freight = await orderFreight({
        orderCode,
        orderAddressCode: redisAddressList[0].code
      });
      console.log(freight, '获取货源运费信息');

      // 规则假数据
      // freight = {
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
      // };

      const addressList = redisAddressList; // 地址

      const data = {
        classList: classList,
        isPublic: isPublic,
        isSpecified: isSpecified,
        loadType: loadType || '1',
        orderGoodsList: [
          {
            addressList: addressList,
            'goodsBigType': goodsBigType,
            'goodsType': goodsType,
            'goodsUnit': goodsUnit,
            'goodsPrice': goodsPrice,
            'isOneselfLoad': !!isOneselfLoad,
            'isOneselfUnload': !!isOneselfUnload,
            'perWeight': perWeight,
            'shipmentPrice': shipmentPrice,
            'totalType': totalType || '1',
            'vehicleLength': vehicleLength,
            'vehicleType': vehicleType,
            'weight': weight
          }
        ],
        orderSpecifiedList: redisOrderSpecifiedVoList,
        projectCode: projectCode, // 项目code
        pubilshCode: pubilshCode, // 当前用户的code
        remark: remark
      };

      // 处理数据

      const { orderGoodsList } = data;
      this.formData.tin1 = pubilshCode;

      this.cbData = data; // 去其他页面

      orderGoodsList[0].addressList.forEach((e) => {
        if ((e.addressType - 0) === 1) {
          // 装
          this.address_add[0].cbData = e;
        } else {
          // 卸
          this.address_xie[0].cbData = e;
        }
      });

      this.cbGoodsAccounting = orderGoodsList[0];
      this.orderFreightBoList = freight.data;
    },

    // 1. 添加一个地址
    _addAddress(name) {
      this[name].push({
        refName: 'add_' + Date.now()
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
