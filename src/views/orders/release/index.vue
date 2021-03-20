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
        <div class="header mb8">代发货主信息</div>

        <el-form-item label="代发货主" prop="tin1">
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
          ref="OrderBasic"
          v-model="isMultiGoods"
          :pubilsh-code="formData.tin1"
        />
      </div>
      <el-divider />

      <div class="content">
        <div class="header mb8">装卸货地址配置(第二步)</div>
        <template v-if="isMultiGoods">
          <el-form-item label="装货类型" prop="tin7">
            <el-radio-group v-model="formData.tin7" size="medium">
              <el-radio
                v-for="dict in [
                  { dictValue: '1', dictLabel: '一装一卸' },
                  { dictValue: '2', dictLabel: '多装一卸' },
                  { dictValue: '3', dictLabel: '一装多卸' },
                  { dictValue: '4', dictLabel: '多装多卸' },
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
          <OneAddress :ref="address.refName" type="1" />
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
          <OneAddress :ref="address.refName" type="2" />
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

            <GoodsAccounting ref="goodsAccounting" />
          </div>

          <div class="content">
            <div class="header mb8">其他规则</div>

            <AccounTing ref="accounTing" :pubilsh-code="formData.tin1" />
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

// import { orderPubilsh } from '@/api/order/release';

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

  async created() {},

  methods: {
    async onSubmit(form) {
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

      const accounTing = await this.$refs.accounTing._submitForm();
      console.log(accounTing, 'accounTing------------');

      console.log(OrderBasic, '拼接前');

      // 下面开始拼接
      const { orderGoodsList } = OrderBasic;

      OrderBasic.loadType = this.formData.tin7;
      OrderBasic.orderGoodsList = orderGoodsList.map(e => {
        return {
          ...e,
          addressList: [...addr_xie, ...addr_add],

          // 'balanceRuleCode': '', // 货主核算规则表CODE
          'goodsUnit': goodsAccounting.goodsUnit,
          // 'isModifyFinish': true, // 平台是否完成调价??
          'isOneselfLoad': this.formData.tin8,
          'isOneselfUnload': this.formData.tin9,
          // 'limitWastage': '', // 货物损耗 格式： 0/1(0-定额kg/车，1-定率千分之几/车)-1
          'perWeight': goodsAccounting.perWeight,
          // 'priceWastage': 0, // 路耗超出范围 赔偿单价 （元/吨）
          'shipmentPrice': goodsAccounting.shipmentPrice,
          'totalType': goodsAccounting.weightType,
          'vehicleLength': goodsAccounting.vehicleLength,
          'vehicleType': goodsAccounting.vehicleType,
          'weight': goodsAccounting.weight ? goodsAccounting.weight : ''
        };
      });

      console.log(OrderBasic, '拼接后-----');

      // const data = {

      //   classList: [
      //     {
      //       classCode: '' // 货集码
      //     }
      //   ],
      //   isPublic: '', // 是否公开货源 0.非公开 1.公开
      //   isSpecified: '', // 是否指定接单人 0否 1是
      //   loadType: '', // loadType	装卸类型 1.一装一卸 2.多装一卸 3.一装多卸 4.多装多卸

      //   // orderFreightBoList,
      //   // orderGoodsList,
      //   // orderSpecifiedList,

      //   projectCode: '', // 项目编码
      //   pubilshCode: this.formData.tin1,
      //   remark:
      // }

      // console.log(data);




      return;

      // this.$refs[form].validate(async(valid) => {
      //   if (valid) {
      //     const address1 =
      //       (this.$refs.address1 &&
      //         (await this.$refs.address1._submitForm())) ||
      //       [];
      //     const address2 =
      //       (this.$refs.address2 &&
      //         (await this.$refs.address2._submitForm())) ||
      //       [];

      //     let goodsAccounting;
      //     let accounTing;
      //     let arrs;

      //     let orderFreightBoList = []; // 运费规则Bo
      //     let orderGoodsList = []; // 货源商品信息_1
      //     let orderSpecifiedList = []; // 货源指定接单人表

      //     const driverInfoCode = this.formData.tin5_2.map((driverInfoCode) => {
      //       return {
      //         driverInfoCode,
      //         teamInfoCode: '',
      //         userType: 2
      //       };
      //     });
      //     const teamInfoCode = this.formData.tin5_1.map((teamInfoCode) => {
      //       return {
      //         driverInfoCode: '',
      //         teamInfoCode,
      //         userType: 1
      //       };
      //     });
      //     orderSpecifiedList = driverInfoCode.concat(teamInfoCode);

      //     // <!-- isMultiGoods true->多商品 ; false->单商品 -->
      //     if (this.isMultiGoods) {
      //       const promisArr = this.formData.tin2_1.map(async(e) => {
      //         return {
      //           ...((this.$refs[e][0] &&
      //             (await this.$refs[e][0]._submitForm())) ||
      //             {}),
      //           goodsTypeName: e
      //         };
      //       });
      //       arrs = await Promise.all(promisArr);

      //       // 多商品核算规则多个
      //       orderFreightBoList = arrs.map((accounTing) => {
      //         return {
      //           balanceRuleCode: accounTing.ruleItemId,
      //           ruleItemValue: '', // ??
      //           type: '' // ??
      //         };
      //       });

      //       orderGoodsList = arrs.map((e) => {
      //         return {
      //           addressList: [...address1, ...address2],
      //           endLimitWastage: 0, // 免赔偿路耗规范结束 多商品无此选项??
      //           goodsBigType: this.formData.tin2,
      //           goodsType: this.formData.tin2_1,
      //           goodsUnit: '1', // 多商品没有 计量单位
      //           isModifyFinish: true, // 平台是否完成调价?? 啥东西
      //           isOneselfLoad: this.formData.tin9, // 是否允许自装 0否 1是 (多装模式)?? 啥东西
      //           isOneselfUnload: this.formData.tin8,
      //           limitWastage: '1', // 限制损耗?? 啥东西
      //           perWeight: 0, // 最高配载 多商品无此选项??
      //           priceWastage: 0, // 路耗超出范围 赔偿单价 （元/吨）?? 啥东西
      //           shipmentPrice: e.shipmentPrice,
      //           startLimitWastage: 0, // 免赔偿路耗规范开始 多商品无此选项??
      //           vehicleLength: e.vehicleLength,
      //           vehicleType: e.vehicleType,
      //           weight: 0 // 货物重量 多商品无此选项??
      //         };
      //       });
      //     } else {
      //       goodsAccounting =
      //         (this.$refs.goodsAccounting &&
      //           (await this.$refs.goodsAccounting._submitForm())) ||
      //         {};
      //       accounTing =
      //         (this.$refs.accounTing &&
      //           (await this.$refs.accounTing._submitForm())) ||
      //         {};

      //       // 单商品核算规格
      //       orderFreightBoList = [
      //         {
      //           balanceRuleCode: accounTing.ruleItemId,
      //           ruleItemValue: '', // ??
      //           type: '' // ??
      //         }
      //       ];
      //       // 单商品信息
      //       orderGoodsList = [
      //         {
      //           addressList: [...address1, ...address2],
      //           // endLimitWastage: accounTing.endLimitWastage,
      //           goodsBigType: this.formData.tin2,
      //           goodsType: this.formData.tin2_2,
      //           goodsUnit: goodsAccounting.goodsUnit,
      //           isModifyFinish: true, // 平台是否完成调价?? 啥东西
      //           isOneselfLoad: false, // 是否允许自装 0否 1是 (多装模式)?? 啥东西
      //           isOneselfUnload: false, // 是否允许自卸 0否 1是 (多卸模式)
      //           limitWastage: '1', // 限制损耗?? 啥东西
      //           perWeight: goodsAccounting.perWeight,
      //           priceWastage: 0, // 路耗超出范围 赔偿单价 （元/吨）?? 啥东西
      //           shipmentPrice: goodsAccounting.shipmentPrice,
      //           // startLimitWastage: accounTing.startLimitWastage,
      //           vehicleLength: goodsAccounting.vehicleLength,
      //           vehicleType: goodsAccounting.vehicleType,
      //           weight: goodsAccounting.weight
      //         }
      //       ];
      //     }

      //     const data = {
      //       classList: [
      //         {
      //           classCode: '1'
      //         }
      //       ],
      //       isClass: true,
      //       // 上面2个暂时没有
      //       isPublic: this.formData.tin4,
      //       isSpecified: this.formData.tin5,
      //       loadType: this.formData.tin7, // loadType	装卸类型 1.一装一卸 2.多装一卸 3.一装多卸 4.多装多卸
      //       orderFreightBoList,
      //       orderGoodsList,
      //       orderSpecifiedList,
      //       projectCode: this.formData.tin3Code, // 项目编码
      //       pubilshCode: this.formData.tin1,
      //       remark: this.formData.remark
      //     };

      //     console.log('运费规则Bo', orderFreightBoList);
      //     console.log('货源商品信息_1', orderGoodsList);
      //     console.log('货源指定接单人表', orderSpecifiedList);
      //     console.log('全部', data);

      //     orderPubilsh(data).then((response) => {
      //       console.log(response);
      //       this.msgSuccess('新增成功');
      //     });
      //   } else {
      //     return false;
      //   }
      // });
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
