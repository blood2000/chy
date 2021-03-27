<template>
  <!-- 进行改造 -->
  <div v-loading="loading" class="app-container">
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
            clearable
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
          <OneAddress :ref="address.refName" type="1" :cb-data="address.cbData" :is-rules="formData.tin8" />

          <el-button
            v-if="address_add.length >= 2"
            type="danger"
            @click="_delAddress('address_add', address.refName)"
          >删除地址</el-button>
          <el-button
            type="primary"
            style="margin-top: -12px"
            @click="selectAddress(address)"
          >常用地址</el-button>
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
          <OneAddress :ref="address.refName" type="2" :cb-data="address.cbData" :is-rules="formData.tin9" />

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

    <!-- 打开弹框 -->
    <el-dialog
      title="提示"
      :visible.sync="openSelectaddress"
      width="80%"
    >
      <div>
        <OpenDialog />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import OrderBasic from './OrderBasic';
import OneAddress from './component/OneAddress';
import GoodsInfo from './GoodsInfo';

import OpenDialog from './OpenDialog';

// import GoodsAccounting from './component/GoodsAccounting';
// import AccounTing from './component/AccounTing';
// import MultiData from './component/MultiData';


// 获取货集码列表 ? 要在什么时机调用?
// import { listStockcode } from '@/api/enterprise/stockcode';

import { listShipment } from '@/api/assets/shipment.js';
import { orderPubilsh, getOrderByCode, orderFreight } from '@/api/order/release';

export default {
  components: {
    OrderBasic,
    OneAddress,
    GoodsInfo,
    OpenDialog
  },
  data() {
    return {
      openSelectaddress: false, // 打开选择常用地址
      basicInfor: null, // 货源的基本信息-创建的时候搜集
      goodsBigType: '', // 获取出大类-其他组件要使用


      active: 1, // 步骤
      goods: [], // 商品-记入单商品还是多商品
      // 地址数组形式
      address_add: [{ refName: 'address_add' + Date.now() }], // 装-地址组件使用
      address_xie: [{ refName: 'address_xie' + Date.now() }], // 卸-地址组件使用
      addr_add: [], // 装-传递数据使用
      addr_xie: [], // 卸-传递数据使用

      cbOrderBasic: null, // 传给OrderBasic组件的数据-回填
      cbGoodsAccounting: null, // 传给组件的数据-回填

      // cbData: null,
      // orderFreightBoList: null,

      loading: false,

      // 多商品对应各自的规格
      // tin2_1tabs: [],
      // tin2_1tabs_activeName: '0',
      formData: {
        tin1: '', // 发布人Code
        tin7: '1', // 装卸类型 1.一装一卸 2.多装一卸 3.一装多卸 4.多装多卸
        tin8: false, // 允许自装 true=>是; false=> 否
        tin9: false //  允许自卸 true=>是; false=> 否
      },
      rules: {
        tin1: [
          { required: true, message: '请选择代发布人', trigger: 'change' }
        ],
        tin7: [
          { required: true, message: '请选择装卸类型', trigger: 'change' }
        ]
      },

      // 字典
      shipmentList: [], // 发布人下拉列表

      // 其他
      isMultiGoods: false // 用来判断多商品还是单商品
    };
  },

  computed: {

    // isTin1() {
    //   return !!this.formData.tin1;
    // },
    // isEdit() {
    //   return this.$route.query.t === '1';
    // },
    // 创建/编辑 true=>创建 false=>编辑
    isCreated() {
      return !this.$route.query.t && !this.$route.query.id;
    }
    // 是否有多地址 true=>多 false=>少
    // isShowMulti() {
    //   return this.address_add.length >= 2 || this.address_xie.length >= 2;
    // },
    // // addressTab() {
    //   let arr = [];

    //   if (this.isShowMulti) {
    //     if (this.address_add.length >= 2) {
    //       arr = [...arr, ...this.address_add];
    //     }
    //     if (this.address_xie.length >= 2) {
    //       arr = [...arr, ...this.address_xie];
    //     }
    //   }
    //   return arr;
    // },
    // nowType() {
    //   let bool = true;
    //   if (this.formData.tin7 === '2') {
    //     bool = true;
    //   } else if (this.formData.tin7 === '3') {
    //     bool = false;
    //   }
    //   return bool;
    // }

  },
  watch: {
    // 切换商品 false=> 单 true=>多
    isMultiGoods() {
      if (this.active >= 3) {
        this.active = 2;
      }
      if (this.isMultiGoods) return;
      this.tin7 = '1';
      this.tin8 = false;
      this.tin9 = false;
    }
  },

  created() {
    // 判断地址栏有没有id- true=>有说明编辑/详情 false=>创建-什么都不做
    if (this.$route.query.id) {
      this.getCbdata(this.$route.query.id);
    }
  },

  methods: {
    // 触发远程搜索
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        // 获取代理用户表
        listShipment({ adminName: query, pageNum: 1, pageSize: 10 }).then(
          (res) => {
            this.shipmentList = res.rows;
            this.loading = false;
          }
        ).catch(() => {
          this.loading = false;
        });
      } else {
        this.shipmentList = [];
      }
    },

    // 下一步 active =2
    async nextTo(active, cb) {
      if (!cb) {
        this.basicInfor = await this.handlerPromise('OrderBasic', false);
        this.basicInfor.loadType = this.formData.tin7;
        this.goodsBigType = this.basicInfor.orderGoodsList[0].goodsBigType;
      }

      this.active = active;

      // 测数据用
      this.handlercbAddress([
        {
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
          'detail': '富邦针织',
          'contact': '12123',
          'contactPhone': '12345678910',
          'addressAlias': '1212',
          'provinceCode': '35' // 没返回

        },
        {
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
          'provinceCode': '35'
        }
      ]);
    },

    // 下一步 active =3
    async nextSe(active, cb) {
      if (!this.formData.tin8 && this.formData.tin7 - 0 === 2 && this.address_add.length < 2) {
        this.msgError('多装一卸, 必须多地址');
        return;
      } else if (!this.formData.tin9 && this.formData.tin7 - 0 === 3 && this.address_xie.length < 2) {
        this.msgError('一装装卸, 必须多地址');
        return;
      }

      // this.address_add 是初始状态
      const address_add = this.address_add.map(async(e) => {
        return {
          ...e,
          ...e.cbData, // cb回填通过这个传递
          ...(await this.$refs[e.refName][0]._submitForm()) // 获取装货地址信息
        };
      });
      const address_xie = this.address_xie.map(async(e) => {
        return {
          ...e,
          ...e.cbData,
          ...(await this.$refs[e.refName][0]._submitForm()) // 获取卸货地址信息
        };
      });

      this.addr_add = await Promise.all(address_add);
      this.addr_xie = await Promise.all(address_xie);

      this.active = active; // 3
    },

    // 发布按钮触发(1.发布接口2.成功1秒后跳转)
    onSubmit(form) {
      this.$refs[form].validate(async(valid) => {
        if (valid) {
          const data = await this.submAllData();

          this.loading = true;
          orderPubilsh(data).then((response) => {
            this.msgSuccess('新增成功');
            this.loading = false;
            setTimeout(() => {
              this.$router.push({ name: 'Manage' });
            }, 1000);
          }).catch(() => {
            this.loading = false;
          });
        } else {
          return false;
        }
      });
    },

    // 整理出符合发布的数据格式
    async submAllData() {
      if (!this.basicInfor) {
        this.basicInfor = await this.handlerPromise('OrderBasic', false);
        this.goodsBigType = this.basicInfor.orderGoodsList[0].goodsBigType;
      }


      const {
        classList,
        isPublic,
        isSpecified,
        orderSpecifiedList,
        projectCode,
        pubilshCode,
        remark
      } = this.basicInfor; // 货源基本结构和信息

      // 处理商品信息和地址相关的规则
      const { orderGoodsList, orderAddressPublishBoList, orderFreightInfoBoList } = await this.handlerAddress();

      const orderBasic = {
        classList,
        orderInfoBo: {
          // branchCode:'',
          // createCode:'',
          isPublic,
          isSpecified,
          loadType: this.formData.tin7 - 0,
          projectCode,
          pubilshCode,
          remark
        },
        orderSpecifiedList
      };


      // 商品处理对象-按多个商品处理
      orderBasic.orderGoodsList = orderGoodsList.map(e => {
        return {
          goodsBigType: this.goodsBigType, // 大类code
          goodsType: e.goodsType, // 小类code
          identification: e.goodsType, // 约定好的
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
      orderBasic.orderFreightInfoBoList = orderFreightInfoBoList;

      // console.log(orderBasic, '最后数据');
      return orderBasic;
    },

    // 处理地址 和 商品
    async handlerAddress() {
      // 获取商品基本信息(1.商品info 2.地址及地址下对应的规则)
      const goodsInfo = await this.$refs.goodsInfo._submitForm();

      // 1.商品info
      const orderGoodsList = goodsInfo.map(e => {
        return {
          ...e.orderGood,
          goodsType: e.dictCode,
          identification: e.dictCode
        };
      });

      // 2. 地址及地址下对应的规则(注意: arr不包括一卸或者一装)

      // console.log(orderGoodsList);

      // 规则-找出来
      const orderFreightInfoBoList = goodsInfo.map(e => {
        return {
          orderAddressBoList: e.newRedis.map((ee, index) => {
            ee.identification = index + 1;
            return {
              addressIdentification: (ee.addressType - 0) === 1 ? (index + 1) + ':0' : '0:' + (index + 1),
              orderFreightBoList: ee.orderFreightBoList
            };
          }),
          goodsIdentification: e.dictCode
        };
      });

      let arr = [];
      for (const e of goodsInfo) {
        arr = [...arr, ...e.newRedis];
      }


      // 这一步是必要的
      if (this.formData.tin7 === '3') {
        this.addr_xie = arr;
      } else {
        this.addr_add = arr;
      }



      return { orderGoodsList, orderFreightInfoBoList, orderAddressPublishBoList: [...this.addr_add, ...this.addr_xie] };
    },



    /* 回填-------------------------------------------- */

    // 编辑和详情-回填获取数据
    async getCbdata(id) {
      // const tsetid = '5f9cb5fd9f0c45ec828f33accb6c43b3'; // 测试-替换id

      // const { data } = await getOrderByCode(tsetid);

      // if (!data) return;
      // console.log(data);

      // 假数据
      const data1 = {
        //
        'code': '9085f700cc304f949335231000d7eed6', // code
        'mainOrderNumber': '2103231004220621',
        'projectCode': '658b38b1bdc2478e849b57617c1a0e69', // 项目编码
        'isSpecified': true, // 是否指定接班人
        'remark': '这是放回的备注信息', // 备注
        'classCode': null,
        'isPublic': false, // 是否公开源
        'pubilshCode': 'c0e8fdb5e44942d3a10907dc97768847', // ???? 这个这么没了
        'loadType': null,

        // ok
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
            businessType: '1',
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
            // 'redisOrderFreightVoList': [
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
            // ]

            orderFreightVo: {
              'lossList': [
                {
                  'id': 403,
                  'code': 'f03c8f1582d045cba5f8a81dc4d64c5c',
                  'orderCode': '5f9cb5fd9f0c45ec828f33accb6c43b3',
                  'orderGoodsCode': '56257a28ce494dfe9d270c7b50242f76',
                  'ruleItemCode': '3',
                  'orderAddressCode': '5ecd6950a55a43c7bc5c00c06d05a0f5',
                  'ruleValue': '1',
                  'type': null,
                  'cnName': '路耗 规则',
                  'enName': 'LOSS_RULES',
                  'showType': 3,
                  'dictCode': 'lossRule',
                  'ruleType': 1,
                  'dictLabel': null,
                  'unit': null
                },
                {
                  'id': 402,
                  'code': '67f2f3b25b2c4b41809da76409d937e4',
                  'orderCode': '5f9cb5fd9f0c45ec828f33accb6c43b3',
                  'orderGoodsCode': '56257a28ce494dfe9d270c7b50242f76',
                  'ruleItemCode': '2',
                  'orderAddressCode': '5ecd6950a55a43c7bc5c00c06d05a0f5',
                  'ruleValue': '[0,20]',
                  'type': null,
                  'cnName': '路耗 容忍值',
                  'enName': 'LOSS_TOLERANCE',
                  'showType': 2,
                  'dictCode': null,
                  'ruleType': 1,
                  'dictLabel': null,
                  'unit': null
                },
                {
                  'id': 401,
                  'code': '3ad91ad524444e88b87f00a6a1033289',
                  'orderCode': '5f9cb5fd9f0c45ec828f33accb6c43b3',
                  'orderGoodsCode': '56257a28ce494dfe9d270c7b50242f76',
                  'ruleItemCode': '1',
                  'orderAddressCode': '5ecd6950a55a43c7bc5c00c06d05a0f5',
                  'ruleValue': 'DE',
                  'type': null,
                  'cnName': '路耗 计算方式',
                  'enName': 'LOSS_CALCULATE',
                  'showType': 4,
                  'dictCode': 'lossPlan',
                  'ruleType': 1,
                  'dictLabel': null,
                  'unit': null
                }
              ],
              'detailList': [
                {
                  'id': 410,
                  'code': '2de4e9ea88894d30b1ba39919e929b96',
                  'orderCode': '5f9cb5fd9f0c45ec828f33accb6c43b3',
                  'orderGoodsCode': '56257a28ce494dfe9d270c7b50242f76',
                  'ruleItemCode': '18',
                  'orderAddressCode': '5ecd6950a55a43c7bc5c00c06d05a0f5',
                  'ruleValue': '4',
                  'type': '2',
                  'cnName': '抹零规则',
                  'enName': 'M0',
                  'showType': 3,
                  'dictCode': 'M0',
                  'ruleType': 0,
                  'dictLabel': null,
                  'unit': null
                },
                {
                  'id': 409,
                  'code': 'a4acad6a82d9462dafc1c09da79ede3b',
                  'orderCode': '5f9cb5fd9f0c45ec828f33accb6c43b3',
                  'orderGoodsCode': '56257a28ce494dfe9d270c7b50242f76',
                  'ruleItemCode': '13',
                  'orderAddressCode': '5ecd6950a55a43c7bc5c00c06d05a0f5',
                  'ruleValue': '100',
                  'type': '2',
                  'cnName': '油费',
                  'enName': 'FUEL',
                  'showType': 1,
                  'dictCode': null,
                  'ruleType': 0,
                  'dictLabel': null,
                  'unit': null
                },
                {
                  'id': 408,
                  'code': 'c3196cbb6d5547c19ad10b2368b8d163',
                  'orderCode': '5f9cb5fd9f0c45ec828f33accb6c43b3',
                  'orderGoodsCode': '56257a28ce494dfe9d270c7b50242f76',
                  'ruleItemCode': '14',
                  'orderAddressCode': '5ecd6950a55a43c7bc5c00c06d05a0f5',
                  'ruleValue': '200',
                  'type': '2',
                  'cnName': 'ETC费',
                  'enName': 'ETC',
                  'showType': 1,
                  'dictCode': null,
                  'ruleType': 0,
                  'dictLabel': null,
                  'unit': null
                },
                {
                  'id': 407,
                  'code': '0eba2d82fd9c45e2b60d6df19eeeffe3',
                  'orderCode': '5f9cb5fd9f0c45ec828f33accb6c43b3',
                  'orderGoodsCode': '56257a28ce494dfe9d270c7b50242f76',
                  'ruleItemCode': '15',
                  'orderAddressCode': '5ecd6950a55a43c7bc5c00c06d05a0f5',
                  'ruleValue': '300',
                  'type': '2',
                  'cnName': '超时费',
                  'enName': 'OVERTIME_FEE',
                  'showType': 1,
                  'dictCode': null,
                  'ruleType': 0,
                  'dictLabel': null,
                  'unit': null
                },
                {
                  'id': 406,
                  'code': '8fb1becc2ee94db9a6f2a2e6778e647a',
                  'orderCode': '5f9cb5fd9f0c45ec828f33accb6c43b3',
                  'orderGoodsCode': '56257a28ce494dfe9d270c7b50242f76',
                  'ruleItemCode': '16',
                  'orderAddressCode': '5ecd6950a55a43c7bc5c00c06d05a0f5',
                  'ruleValue': '400',
                  'type': '2',
                  'cnName': '扣回单费',
                  'enName': 'RECEIPT_FEE',
                  'showType': 1,
                  'dictCode': null,
                  'ruleType': 0,
                  'dictLabel': null,
                  'unit': null
                },
                {
                  'id': 405,
                  'code': 'da3a391d596f4508a0901d6c50043051',
                  'orderCode': '5f9cb5fd9f0c45ec828f33accb6c43b3',
                  'orderGoodsCode': '56257a28ce494dfe9d270c7b50242f76',
                  'ruleItemCode': '12',
                  'orderAddressCode': '5ecd6950a55a43c7bc5c00c06d05a0f5',
                  'ruleValue': '500',
                  'type': '1',
                  'cnName': '卸车费',
                  'enName': 'DISCHARGE_FARE',
                  'showType': 1,
                  'dictCode': null,
                  'ruleType': 0,
                  'dictLabel': null,
                  'unit': null
                },
                {
                  'id': 404,
                  'code': '12dbb0f8b58f40b4a8de1571f928d013',
                  'orderCode': '5f9cb5fd9f0c45ec828f33accb6c43b3',
                  'orderGoodsCode': '56257a28ce494dfe9d270c7b50242f76',
                  'ruleItemCode': '11',
                  'orderAddressCode': '5ecd6950a55a43c7bc5c00c06d05a0f5',
                  'ruleValue': '600',
                  'type': '1',
                  'cnName': '装车费',
                  'enName': 'LOADING_FEE',
                  'showType': 1,
                  'dictCode': null,
                  'ruleType': 0,
                  'dictLabel': null,
                  'unit': null
                },
                {
                  'id': 400,
                  'code': '795624e3a9c744ffb9915723a2f6f557',
                  'orderCode': '5f9cb5fd9f0c45ec828f33accb6c43b3',
                  'orderGoodsCode': '56257a28ce494dfe9d270c7b50242f76',
                  'ruleItemCode': '17',
                  'orderAddressCode': '5ecd6950a55a43c7bc5c00c06d05a0f5',
                  'ruleValue': '95',
                  'type': '2',
                  'cnName': '运费单价',
                  'enName': 'FREIGHT_COST',
                  'showType': 1,
                  'dictCode': null,
                  'ruleType': 0,
                  'dictLabel': null,
                  'unit': null
                }
              ]
            },
            'orderFreightVoList': [
              {
                'lossList': [
                  {
                    'id': 403,
                    'code': 'f03c8f1582d045cba5f8a81dc4d64c5c',
                    'orderCode': '5f9cb5fd9f0c45ec828f33accb6c43b3',
                    'orderGoodsCode': '56257a28ce494dfe9d270c7b50242f76',
                    'ruleItemCode': '3',
                    'orderAddressCode': '5ecd6950a55a43c7bc5c00c06d05a0f5',
                    'ruleValue': '1',
                    'type': null,
                    'cnName': '路耗 规则',
                    'enName': 'LOSS_RULES',
                    'showType': 3,
                    'dictCode': 'lossRule',
                    'ruleType': 1,
                    'dictLabel': null,
                    'unit': null
                  },
                  {
                    'id': 402,
                    'code': '67f2f3b25b2c4b41809da76409d937e4',
                    'orderCode': '5f9cb5fd9f0c45ec828f33accb6c43b3',
                    'orderGoodsCode': '56257a28ce494dfe9d270c7b50242f76',
                    'ruleItemCode': '2',
                    'orderAddressCode': '5ecd6950a55a43c7bc5c00c06d05a0f5',
                    'ruleValue': '[0,20]',
                    'type': null,
                    'cnName': '路耗 容忍值',
                    'enName': 'LOSS_TOLERANCE',
                    'showType': 2,
                    'dictCode': null,
                    'ruleType': 1,
                    'dictLabel': null,
                    'unit': null
                  },
                  {
                    'id': 401,
                    'code': '3ad91ad524444e88b87f00a6a1033289',
                    'orderCode': '5f9cb5fd9f0c45ec828f33accb6c43b3',
                    'orderGoodsCode': '56257a28ce494dfe9d270c7b50242f76',
                    'ruleItemCode': '1',
                    'orderAddressCode': '5ecd6950a55a43c7bc5c00c06d05a0f5',
                    'ruleValue': 'DE',
                    'type': null,
                    'cnName': '路耗 计算方式',
                    'enName': 'LOSS_CALCULATE',
                    'showType': 4,
                    'dictCode': 'lossPlan',
                    'ruleType': 1,
                    'dictLabel': null,
                    'unit': null
                  }
                ],
                'detailList': [
                  {
                    'id': 410,
                    'code': '2de4e9ea88894d30b1ba39919e929b96',
                    'orderCode': '5f9cb5fd9f0c45ec828f33accb6c43b3',
                    'orderGoodsCode': '56257a28ce494dfe9d270c7b50242f76',
                    'ruleItemCode': '18',
                    'orderAddressCode': '5ecd6950a55a43c7bc5c00c06d05a0f5',
                    'ruleValue': '4',
                    'type': '2',
                    'cnName': '抹零规则',
                    'enName': 'M0',
                    'showType': 3,
                    'dictCode': 'M0',
                    'ruleType': 0,
                    'dictLabel': null,
                    'unit': null
                  },
                  {
                    'id': 409,
                    'code': 'a4acad6a82d9462dafc1c09da79ede3b',
                    'orderCode': '5f9cb5fd9f0c45ec828f33accb6c43b3',
                    'orderGoodsCode': '56257a28ce494dfe9d270c7b50242f76',
                    'ruleItemCode': '13',
                    'orderAddressCode': '5ecd6950a55a43c7bc5c00c06d05a0f5',
                    'ruleValue': '100',
                    'type': '2',
                    'cnName': '油费',
                    'enName': 'FUEL',
                    'showType': 1,
                    'dictCode': null,
                    'ruleType': 0,
                    'dictLabel': null,
                    'unit': null
                  },
                  {
                    'id': 408,
                    'code': 'c3196cbb6d5547c19ad10b2368b8d163',
                    'orderCode': '5f9cb5fd9f0c45ec828f33accb6c43b3',
                    'orderGoodsCode': '56257a28ce494dfe9d270c7b50242f76',
                    'ruleItemCode': '14',
                    'orderAddressCode': '5ecd6950a55a43c7bc5c00c06d05a0f5',
                    'ruleValue': '200',
                    'type': '2',
                    'cnName': 'ETC费',
                    'enName': 'ETC',
                    'showType': 1,
                    'dictCode': null,
                    'ruleType': 0,
                    'dictLabel': null,
                    'unit': null
                  },
                  {
                    'id': 407,
                    'code': '0eba2d82fd9c45e2b60d6df19eeeffe3',
                    'orderCode': '5f9cb5fd9f0c45ec828f33accb6c43b3',
                    'orderGoodsCode': '56257a28ce494dfe9d270c7b50242f76',
                    'ruleItemCode': '15',
                    'orderAddressCode': '5ecd6950a55a43c7bc5c00c06d05a0f5',
                    'ruleValue': '300',
                    'type': '2',
                    'cnName': '超时费',
                    'enName': 'OVERTIME_FEE',
                    'showType': 1,
                    'dictCode': null,
                    'ruleType': 0,
                    'dictLabel': null,
                    'unit': null
                  },
                  {
                    'id': 406,
                    'code': '8fb1becc2ee94db9a6f2a2e6778e647a',
                    'orderCode': '5f9cb5fd9f0c45ec828f33accb6c43b3',
                    'orderGoodsCode': '56257a28ce494dfe9d270c7b50242f76',
                    'ruleItemCode': '16',
                    'orderAddressCode': '5ecd6950a55a43c7bc5c00c06d05a0f5',
                    'ruleValue': '400',
                    'type': '2',
                    'cnName': '扣回单费',
                    'enName': 'RECEIPT_FEE',
                    'showType': 1,
                    'dictCode': null,
                    'ruleType': 0,
                    'dictLabel': null,
                    'unit': null
                  },
                  {
                    'id': 405,
                    'code': 'da3a391d596f4508a0901d6c50043051',
                    'orderCode': '5f9cb5fd9f0c45ec828f33accb6c43b3',
                    'orderGoodsCode': '56257a28ce494dfe9d270c7b50242f76',
                    'ruleItemCode': '12',
                    'orderAddressCode': '5ecd6950a55a43c7bc5c00c06d05a0f5',
                    'ruleValue': '500',
                    'type': '1',
                    'cnName': '卸车费',
                    'enName': 'DISCHARGE_FARE',
                    'showType': 1,
                    'dictCode': null,
                    'ruleType': 0,
                    'dictLabel': null,
                    'unit': null
                  },
                  {
                    'id': 404,
                    'code': '12dbb0f8b58f40b4a8de1571f928d013',
                    'orderCode': '5f9cb5fd9f0c45ec828f33accb6c43b3',
                    'orderGoodsCode': '56257a28ce494dfe9d270c7b50242f76',
                    'ruleItemCode': '11',
                    'orderAddressCode': '5ecd6950a55a43c7bc5c00c06d05a0f5',
                    'ruleValue': '600',
                    'type': '1',
                    'cnName': '装车费',
                    'enName': 'LOADING_FEE',
                    'showType': 1,
                    'dictCode': null,
                    'ruleType': 0,
                    'dictLabel': null,
                    'unit': null
                  },
                  {
                    'id': 400,
                    'code': '795624e3a9c744ffb9915723a2f6f557',
                    'orderCode': '5f9cb5fd9f0c45ec828f33accb6c43b3',
                    'orderGoodsCode': '56257a28ce494dfe9d270c7b50242f76',
                    'ruleItemCode': '17',
                    'orderAddressCode': '5ecd6950a55a43c7bc5c00c06d05a0f5',
                    'ruleValue': '95',
                    'type': '2',
                    'cnName': '运费单价',
                    'enName': 'FREIGHT_COST',
                    'showType': 1,
                    'dictCode': null,
                    'ruleType': 0,
                    'dictLabel': null,
                    'unit': null
                  }
                ]
              },
              {
                'lossList': [],
                'detailList': []
              }
            ]
          }
        ]

      };


      // const orderFreightInfoBoList = [
      //   {
      //     'orderAddressBoList': [
      //       {
      //         'addressIdentification': '1:0',
      //         'orderFreightBoList': [
      //           {
      //             'ruleCode': '111',
      //             'ruleDetailShipmentCode': '847da7be171545579b17125b2aff4cfe',
      //             'ruleItemCode': '17',
      //             'ruleValue': 95,
      //             'type': '2'
      //           },
      //           {
      //             'ruleCode': '111',
      //             'ruleDetailShipmentCode': '80b8256361d5469f97df84018d89f87c',
      //             'ruleItemCode': '1',
      //             'ruleValue': 'DE',
      //             'type': null
      //           },
      //           {
      //             'ruleCode': '111',
      //             'ruleDetailShipmentCode': '3dde472a67c54b5ab3c4dc3c2ebd77de',
      //             'ruleItemCode': '2',
      //             'ruleValue': '[0,20]',
      //             'type': null
      //           },
      //           {
      //             'ruleCode': '111',
      //             'ruleDetailShipmentCode': '84b29b7104574f32b2330db8c6e9ccca',
      //             'ruleItemCode': '3',
      //             'ruleValue': '1',
      //             'type': null
      //           },
      //           {
      //             'ruleCode': '111',
      //             'ruleDetailShipmentCode': '80c855bcae8d4c978827e397683566d2',
      //             'ruleItemCode': '11',
      //             'ruleValue': 600,
      //             'type': '1'
      //           },
      //           {
      //             'ruleCode': '111',
      //             'ruleDetailShipmentCode': '45cdfe8aef8942c8b80d47a2fb72c66d',
      //             'ruleItemCode': '12',
      //             'ruleValue': 500,
      //             'type': '1'
      //           },
      //           {
      //             'ruleCode': '111',
      //             'ruleDetailShipmentCode': 'feab632fe2854fd7a2c8cc2aabc554ea',
      //             'ruleItemCode': '16',
      //             'ruleValue': 400,
      //             'type': '2'
      //           },
      //           {
      //             'ruleCode': '111',
      //             'ruleDetailShipmentCode': '31fa8048f5154cbeb384fdf78e88978b',
      //             'ruleItemCode': '15',
      //             'ruleValue': 300,
      //             'type': '2'
      //           },
      //           {
      //             'ruleCode': '111',
      //             'ruleDetailShipmentCode': '95b12a6b9479454abbd88e3d098cc6bc',
      //             'ruleItemCode': '14',
      //             'ruleValue': 200,
      //             'type': '2'
      //           },
      //           {
      //             'ruleCode': '111',
      //             'ruleDetailShipmentCode': 'f55e4aa1350e48178fd018e86972c9d9',
      //             'ruleItemCode': '13',
      //             'ruleValue': 100,
      //             'type': '2'
      //           },
      //           {
      //             'ruleCode': '111',
      //             'ruleDetailShipmentCode': 'ae323a16785b4a519787fde3bd899484',
      //             'ruleItemCode': '18',
      //             'ruleValue': '4',
      //             'type': '2'
      //           }
      //         ]
      //       },
      //       {
      //         'addressIdentification': '2:0',
      //         'orderFreightBoList': [
      //           {
      //             'ruleCode': '111',
      //             'ruleDetailShipmentCode': '847da7be171545579b17125b2aff4cfe',
      //             'ruleItemCode': '17',
      //             'ruleValue': 95,
      //             'type': '2'
      //           },
      //           {
      //             'ruleCode': '111',
      //             'ruleDetailShipmentCode': '80b8256361d5469f97df84018d89f87c',
      //             'ruleItemCode': '1',
      //             'ruleValue': 'DE',
      //             'type': null
      //           },
      //           {
      //             'ruleCode': '111',
      //             'ruleDetailShipmentCode': '3dde472a67c54b5ab3c4dc3c2ebd77de',
      //             'ruleItemCode': '2',
      //             'ruleValue': '[0,20]',
      //             'type': null
      //           },
      //           {
      //             'ruleCode': '111',
      //             'ruleDetailShipmentCode': '84b29b7104574f32b2330db8c6e9ccca',
      //             'ruleItemCode': '3',
      //             'ruleValue': '1',
      //             'type': null
      //           },
      //           {
      //             'ruleCode': '111',
      //             'ruleDetailShipmentCode': '80c855bcae8d4c978827e397683566d2',
      //             'ruleItemCode': '11',
      //             'ruleValue': 600,
      //             'type': '1'
      //           },
      //           {
      //             'ruleCode': '111',
      //             'ruleDetailShipmentCode': '45cdfe8aef8942c8b80d47a2fb72c66d',
      //             'ruleItemCode': '12',
      //             'ruleValue': 500,
      //             'type': '1'
      //           },
      //           {
      //             'ruleCode': '111',
      //             'ruleDetailShipmentCode': 'feab632fe2854fd7a2c8cc2aabc554ea',
      //             'ruleItemCode': '16',
      //             'ruleValue': 400,
      //             'type': '2'
      //           },
      //           {
      //             'ruleCode': '111',
      //             'ruleDetailShipmentCode': '31fa8048f5154cbeb384fdf78e88978b',
      //             'ruleItemCode': '15',
      //             'ruleValue': 300,
      //             'type': '2'
      //           },
      //           {
      //             'ruleCode': '111',
      //             'ruleDetailShipmentCode': '95b12a6b9479454abbd88e3d098cc6bc',
      //             'ruleItemCode': '14',
      //             'ruleValue': 200,
      //             'type': '2'
      //           },
      //           {
      //             'ruleCode': '111',
      //             'ruleDetailShipmentCode': 'f55e4aa1350e48178fd018e86972c9d9',
      //             'ruleItemCode': '13',
      //             'ruleValue': 100,
      //             'type': '2'
      //           },
      //           {
      //             'ruleCode': '111',
      //             'ruleDetailShipmentCode': 'ae323a16785b4a519787fde3bd899484',
      //             'ruleItemCode': '18',
      //             'ruleValue': '4',
      //             'type': '2'
      //           }
      //         ]
      //       }
      //     ],
      //     'goodsIdentification': 812
      //   }
      // ];

      this.active = 3; // 自接全展示

      const { redisOrderGoodsVoList, redisAddressList } = data1;

      // 1
      this.handlerOrderBasic(data1);

      // 2
      this.handlercbAddress(redisAddressList);

      // 3
      this.handerRedisOrder(redisAddressList);

      // 4. 处理商品
      this.cbGoodsAccounting = redisOrderGoodsVoList;
    },

    // 1.处理 cbOrderBasic 要的数据
    handlerOrderBasic(data) {
      const { isPublic, isSpecified, loadType, projectCode, pubilshCode, remark, redisOrderClassGoodsVoList, redisOrderGoodsVoList, redisOrderSpecifiedVoList } = data;

      // 基本
      this.formData.tin1 = pubilshCode; // 货主的code(重要,根据这个展示所有)
      this.formData.tin7 = loadType ? loadType + '' : '1'; // 无则默认 '1'
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
    },

    // 2. 处理 OneAddress 地址要的数据
    handlercbAddress(addressList) {
      this.address_add = [];
      this.address_xie = [];

      addressList.forEach((e, index) => {
        if ((e.addressType - 0) === 1) {
          // 装
          this.address_add.push({
            refName: 'address_add' + Date.now() + index,
            cbData: e // 主要是这个
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

    // 3. 处理回填的数据(1.是要获取地址中的规则 2.要获取装地址到卸地址)
    handerRedisOrder(addressList, orderFreightInfoBoList) {
      addressList.forEach(e => {
        if (e.addressType === 1) {
          this.addr_add.push(e);
        } else {
          this.addr_xie.push(e);
        }
      });
    },

    // 3-1 把规则塞回去
    // handlerOrderFreight(address, orderFreightInfoBoList){
    //     orderFreightInfoBoList.map(e=>{

    //     })

    // }

    /* 方法和其他------------------------------------------- */

    // 1. 添加一个地址
    _addAddress(name) {
      // 处理到第三步后, 又点击返回
      if (this.active >= 3) {
        this.active = 2;
      }

      this[name].push({
        refName: name + Date.now()
      });
    },
    // 2. 删一个地址
    _delAddress(name, refName) {
      this[name] = this[name].filter((e) => {
        return e.refName !== refName;
      });
    },

    // 打开多选地址的弹框
    selectAddress(address) {
      console.log(address);
      this.openSelectaddress = true;
    },

    // 本来是想封装一下处理的数据
    async handlerPromise(refname, bool) {
      return await this.$refs[refname]._submitForm();
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
