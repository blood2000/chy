<template>
  <!-- 进行改造 -->
  <div v-loading="loading" class="m_app-container">

    <div v-if="isZtShipment || isDregs">

      <!-- <div class="ly-flex-pack-justify pr my_huozhu app-container" style="width: 80px;">
        <div v-if="shipmentInfo" class="ly-flex-1 ly-flex-align-center">
          <i class="el-icon-office-building my-iocn" />
          <div class="left-right-box m20">
            <div class="dai-sytle mb10">代发货主信息:</div>
            <div class="ly-flex-align-center">
              <span class="huoz-style mr20">{{ shipmentInfo? shipmentInfo.companyName : '' }}</span>
              <div class="ly-flex-align-center colorccc">
                <i class="el-icon-s-custom" />
                <span class="name-style">{{ shipmentInfo? shipmentInfo.adminName : '' }}</span>
              </div>
              <div class="ly-flex-align-center colorccc">
                <i class="el-icon-phone" />
                <span class="name-style">{{ shipmentInfo?shipmentInfo.telphone : '' }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="right-box ly-flex-align-center ">
          <div class="mr20 btn">
            <el-form-item label="代发货主" prop="tin1">
              <el-select
                v-model="formData.tin1"
                v-el-select-loadmore="loadmore"
                filterable
                clearable
                remote
                reserve-keyword
                placeholder="请输入关键词"
                :remote-method="remoteMethod"
                :loading="loading1"
                @change="handlerchange"
              >
                <el-option
                  v-for="(item, index1) in shipmentList"
                  :key="index1 + item.code"
                  :value="item.code"
                  :label="item.adminName"
                >
                  <div class="ly-flex-pack-justify"><span>{{ item.adminName }}</span><span>{{ item.telphone }}</span></div>
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>

      </div> -->

      <ztRelease :cb-data="ztCbData" :ztshipmentinfo="shipmentInfo" :is-t="isT" />
    </div>

    <template v-else>
      <div v-if="!authStatus" class="mb20">
        <el-alert
          title="审核通过才能发布货源, 请联系客服确认当前审核进度~!"
          type="info"
          effect="dark"
          show-icon
        />
      </div>

      <div class="ly-flex-pack-center app-container">
        <el-steps v-if="true" :active="active" finish-status="success" style="width: 50%">
          <el-step title="基本信息" />
          <el-step title="装卸货地址" />
          <el-step title="货源信息" />
          <el-step title="预览" />
        </el-steps>
      </div>

      <!-- 转货信息 -->
      <div v-if="authStatus">

        <div v-if="isT" class="mb20 app-container">
          <el-radio-group v-model="orderInfo" size="small">
            <el-radio-button label="0">货源信息</el-radio-button>
            <el-radio-button label="1">运单信息</el-radio-button>
          </el-radio-group>
        </div>

        <!-- 查看详情-运单信息 -->
        <div v-show="orderInfo==='1'">
          <WaybillInfo v-if="isT && waybillData" :waybill-data="waybillData" />
        </div>

        <!-- 正常 -->
        <div v-show="orderInfo==='0'">
          <el-form
            ref="elForm"
            :model="formData"
            :rules="rules"
            size="medium"
            label-width="110px"
            :label-position="'left'"
            :disabled="myisdisabled"
          >
            <!-- 第一步 基本信息 -->
            <div v-show="active ==1 || myisdisabled">

              <div v-if="!isClone && (!isShipment && isCreated)" class="ly-flex-pack-justify pr my_huozhu app-container">

                <div v-if="shipmentInfo" class="ly-flex-1 ly-flex-align-center">
                  <i class="el-icon-office-building my-iocn" />
                  <div class="left-right-box m20">
                    <div class="dai-sytle mb10">代发货主信息:</div>
                    <div class="ly-flex-align-center">
                      <span class="huoz-style mr20">{{ shipmentInfo? shipmentInfo.companyName : '' }}</span>
                      <div class="ly-flex-align-center colorccc">
                        <i class="el-icon-s-custom" />
                        <span class="name-style">{{ shipmentInfo? shipmentInfo.adminName : '' }}</span>
                      </div>
                      <div class="ly-flex-align-center colorccc">
                        <i class="el-icon-phone" />
                        <span class="name-style">{{ shipmentInfo?shipmentInfo.telphone : '' }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="right-box ly-flex-align-center ">
                  <div class="mr20 btn">
                    <el-form-item v-if="!isClone && (!isShipment && isCreated)" label="代发货主" prop="tin1">
                      <el-select
                        v-model="formData.tin1"
                        v-el-select-loadmore="loadmore"
                        filterable
                        clearable
                        remote
                        reserve-keyword
                        placeholder="请输入关键词"
                        :remote-method="remoteMethod"
                        :loading="loading1"
                        @change="handlerchange"
                      >
                        <el-option
                          v-for="(item, index1) in shipmentList"
                          :key="index1 + item.code"
                          :value="item.code"
                          :label="item.adminName"
                        >
                          <!-- :label="item.adminName" -->
                          <div class="ly-flex-pack-justify"><span>{{ item.adminName }}</span><span>{{ item.telphone }}</span></div>
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </div>

              </div>


              <OrderBasic
                v-if="formData.tin1"
                ref="OrderBasic"
                v-model="isMultiGoods"
                :pubilsh-code="formData.tin1"
                :cb-data="cbOrderBasic"
                :myisdisabled="myisdisabled"
                :shipment-info="shipmentInfo"
                :goods-big-types="goodsBigTypes"
                :is-t="isT"
                @goods="handlerGoos"
              >

                <div class="ly-t-center">
                  <el-button v-if="!myisdisabled && (formData.tin1 && active < 2)" type="primary" plain @click="nextTo(2)">下一步</el-button>
                </div>
              </OrderBasic>


            </div>

            <!-- 第二步 地址的填写 -->
            <div v-show="(formData.tin1 && active === 2) || myisdisabled" class="app-container">
              <div class="header mb8">地址信息</div>
              <el-form-item label="装卸类型" prop="tin7">
                <el-radio-group v-model="formData.tin7" size="medium" @change="zhuangOrxiechange">
                  <el-radio
                    v-for="(dict,index) in loadType_computed"
                    :key="dict.dictValue + '' + index"
                    :label="dict.dictValue"
                    :disabled="dict.disabled"
                  >{{ dict.dictLabel }}</el-radio>
                </el-radio-group>
              </el-form-item>



              <el-divider />


              <div class="mb8 m-flex" style="width:66%;">
                <div class="m_zhuanghuo">
                  装货信息
                  <el-checkbox v-if=" formData.tin7 !== '1' && (formData.tin7 === '2' || formData.tin7 === '4')" v-model="formData.tin8" :disabled="myisdisabled" style="marginLeft:30px;" @change="handlerCheck('add')">允许自装</el-checkbox>
                </div>

                <el-button
                  v-if="!myisdisabled && (formData.tin7 === '2' || formData.tin7 === '4')"
                  type="primary"
                  size="mini"
                  plain
                  @click="_addAddress('address_add')"
                >添加地址</el-button>

              </div>



              <div
                v-for="(address,index) in address_add"
                :key="address.refName + index"
              >
                <div v-if="address.addressType !=='3'" class="oneAddress_item pr">
                  <div class="pa triangleR " />
                  <div class="pa m_pa">{{ index + 1 }}</div>

                  <OneAddress v-if="isShowAddress" :ref="address.refName" type="1" :cb-data="address.cbData" :myisdisabled="myisdisabled" />
                  <div class="ly-t-right">
                    <div style="display: inline-block;">
                      <label style="margin-left: 50px;">  <!-- v-if="isOpenTheElectronicFence" -->
                        设置电子围栏
                        <el-switch
                          v-model="address.switchRadius"
                          active-color="#13ce66"
                          inactive-color="#ff4949"
                          class="ml10 mr10"
                        />
                      </label>
                      <el-input-number v-if="address.switchRadius" v-model="address.radius" size="mini" :min="200" :max="999900" label="请输入围栏半径" @change="$store.commit('orders/SET_RADIUS1', address.radius)" />
                    </div>
                    <el-button
                      v-if="address.switchRadius"
                      type="primary"
                      size="mini"
                      class="ml10"
                      plain
                      @click="handleElect(address)"
                    >围栏编辑</el-button>
                    <el-button
                      v-if="!myisdisabled && (address_add.length >= 2 || formData.tin8)"
                      type="danger"
                      size="mini"
                      @click="_delAddress('address_add', address.refName)"
                    >删除地址</el-button>

                    <el-button
                      v-if="!myisdisabled"
                      type="primary"
                      size="mini"
                      style="margin-top: -12px"
                      @click="selectAddress('address_add', address.refName)"
                    >常用地址</el-button>
                  </div>
                </div>
              </div>

              <el-divider />

              <div class="mb8 m-flex" style="width:66%">
                <div class="m_xie">
                  卸货信息
                  <el-checkbox v-if=" formData.tin7 !== '1' && (formData.tin7 === '3' || formData.tin7 === '4')" v-model="formData.tin9" :disabled="myisdisabled" style="marginLeft:30px;" @change="handlerXie('xie')">允许自卸</el-checkbox>
                </div>
                <el-button
                  v-if="!myisdisabled && (formData.tin7 === '3' || formData.tin7 === '4')"
                  type="primary"
                  size="mini"
                  plain
                  style="margin-top: -12px"
                  @click="_addAddress('address_xie')"
                >添加地址</el-button>
              </div>

              <div
                v-for="(address, index) in address_xie"
                :key="address.refName + index"
              >
                <div v-if="address.addressType !=='4'" class="oneAddress_item pr">
                  <div class="pa triangleR " />
                  <div class="pa m_pa">{{ index + 1 }}</div>

                  <OneAddress v-if="isShowAddress" :ref="address.refName" type="2" :cb-data="address.cbData" :myisdisabled="myisdisabled" />

                  <div class="ly-t-right">
                    <div style="display: inline-block;">
                      <label v-if="isOpenTheElectronicFence" style="margin-left: 50px;">
                        设置电子围栏
                        <el-switch
                          v-model="address.switchRadius"
                          active-color="#13ce66"
                          inactive-color="#ff4949"
                          class="ml10 mr10"
                        />
                      </label>
                      <el-input-number v-if="address.switchRadius" v-model="address.radius" size="mini" :min="200" :max="999900" label="请输入围栏半径" @change="$store.commit('orders/SET_RADIUS2', address.radius)" />
                    </div>
                    <el-button
                      v-if="address.switchRadius"
                      type="primary"
                      size="mini"
                      class="ml10"
                      plain
                      @click="handleElect(address)"
                    >围栏编辑</el-button>
                    <el-button
                      v-if="!myisdisabled && (address_xie.length >= 2 || formData.tin9)"
                      type="danger"
                      size="mini"
                      @click="_delAddress('address_xie', address.refName)"
                    >删除地址</el-button>
                    <el-button
                      v-if="!myisdisabled"
                      type="primary"
                      size="mini"
                      style="margin-top: -12px"
                      @click="selectAddress('address_xie', address.refName)"
                    >常用地址</el-button>
                  </div>
                </div>
              </div>

              <el-divider />
              <template v-if="!myisdisabled">
                <div class="ly-t-center">
                  <el-button v-if="active < 3" type="primary" plain @click="nextSe(1)">上一步</el-button>
                  <el-button v-if="active < 3" type="primary" plain @click="nextSe(3)">下一步</el-button>
                </div>
              </template>

            </div>

            <!-- 第三步 货源信息 -->
            <div v-show="(formData.tin1 && active === 3) || myisdisabled" class="app-container">
              <div class="header mb8">货源信息</div>
              <goods-info
                ref="goodsInfo"
                :goods="goods"
                :goods-big-type="goodsBigType"
                :addr-add="addr_add"
                :addr-xie="addr_xie"
                :pubilsh-code="formData.tin1"
                :cb-goods-accounting="cbGoodsAccounting"
                :cb-order-freight="cbOrderFreight"
                :myisdisabled="myisdisabled"
              />
              <el-divider />

              <template v-if="!loading && !myisdisabled">
                <div v-if="!loading && active === 3" class="ly-t-center">
                  <el-button type="primary" plain @click="nextFe(2)">上一步</el-button>
                  <el-button v-hasPermi="['transportation:order:pubilsh']" type="primary" @click="onSubmit('elForm',3)">{{ isCreated?'立即发布':'保存' }}</el-button>
                  <el-button @click="nextFe(4)">预览(查看预估价格)</el-button>
                </div>
              </template>

            </div>

          </el-form>

          <div v-if="active >= 4 && !isT" class="app-container ">

            <el-row>
              <el-col :span="10">
                <div class="release_warning">
                  <el-alert
                    title="司机在接单的时候会相应的扣除余额中的运输费用，请及时充值，以免造成司机接单不成功的情况。"
                    type="info"
                    effect="dark"
                    :closable="false"
                    show-icon
                  />
                </div>
              </el-col>
              <el-col :span="4" class="m_btn">
                <div>
                  <el-button type="primary" plain @click="nextFe(3)">上一步</el-button>
                  <el-button v-hasPermi="['transportation:order:pubilsh']" type="primary" @click="onPubilsh">{{ isCreated?'立即发布':'保存' }}</el-button>
                </div>
              </el-col>
              <el-col :span="10" />
            </el-row>



          </div>
          <div v-if="isT" class="ly-t-center">
            <el-button @click="backPge">返 回</el-button>
          </div>
        </div>

      </div>
      <!-- 设置电子围栏弹窗 -->
      <circle-dialog ref="CircleDialog" :open.sync="circledialog" :value="radius" :title="title" :lnglat="lnglat" @refresh="changeElect" />
      <!-- 打开弹框 -->
      <el-dialog
        :close-on-click-modal="false"
        title="常用地址"
        :visible.sync="openSelectaddress"
        width="80%"
      >
        <div v-if="openSelectaddress">
          <OpenDialog :shipment-code="formData.tin1" @radioSelection="radioSelection" />
        </div>
      </el-dialog>
    </template>

  </div>
</template>

<script>
import OrderBasic from './OrderBasic';
import OneAddress from './component/OneAddress';
import GoodsInfo from './GoodsInfo';
import OpenDialog from './OpenDialog';
import CircleDialog from './component/circleDialog';
import WaybillInfo from './WaybillInfo';

import { getUserInfo } from '@/utils/auth';
import { listShipment, getShipmentByCode } from '@/api/assets/shipment.js';
import { orderPubilsh, getOrderByCode, update, estimateCost, fencePlatCreate } from '@/api/order/release';
import { getProvinceList } from '@/api/system/area';

import ztRelease from '../components/ztRelease';


export default {
  // name: 'Release',
  components: {
    OrderBasic,
    OneAddress,
    GoodsInfo,
    OpenDialog,
    WaybillInfo,
    ztRelease, // 渣土货主发布货源界面
    CircleDialog
  },
  data() {
    return {
      circledialog: false,
      title: '',
      lnglat: [],
      radius: 200,
      addressChange: undefined,
      switchRadius1: false,
      switchRadius2: false,
      radius1: 200, // 电子围栏 8/3 新加的
      radius2: 200, // 电子围栏 8/3 新加的

      isZtShipment: false, // 渣土货主
      ztCbData: null, // 渣土详情

      goodsBigTypes: undefined,
      shipmentInfo: null, // 选中的货主信息
      orderInfo: '0', // 详情的时候切换查看
      waybillData: null, // 货源-运单详情
      authStatus: true, // 默认ok展示
      isClone: false,
      queryParams: {
        pageNum: 1,
        keywords: '',
        authStatus: 3, // 审核状态（0.未审核.1审核中2审核未通过3审核通过）
        pageSize: 10
      },
      dataOver: false, // 是否请求完了
      isT: false, // false 是编辑 true 是详情
      orgCode: '', // 接口需要
      isAdmin: false, // 默认是平台
      isShipment: false,
      lastData: null, // 最终结构
      isQianValue: true, // 开关
      qianValue: '', // 保存上一个值
      isRadioSelection: null, // 选中的常用地址的唯一name
      cbOrderFreight: null, // 规则回填数据
      openSelectaddress: false, // 打开选择常用地址
      basicInfor: null, // 货源的基本信息-创建的时候搜集
      goodsBigType: '', // 获取出大类-其他组件要使用


      active: 1, // 步骤
      goods: [], // 商品-记入单商品还是多商品
      // 地址数组形式
      address_add: [{ refName: 'address_add' + Date.now(), addressType: '1', radius: 200, switchRadius: false }], // 装-地址组件使用
      address_xie: [{ refName: 'address_xie' + Date.now(), addressType: '2', radius: 200, switchRadius: false }], // 卸-地址组件使用
      addr_add: [], // 装-传递数据使用
      addr_xie: [], // 卸-传递数据使用

      cbOrderBasic: null, // 传给OrderBasic组件的数据-回填
      cbGoodsAccounting: null, // 传给组件的数据-回填

      loading: false,
      loading1: false,

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

      shipmentList: [], // 发布人下拉列表
      isMultiGoods: false // 用来判断多商品还是单商品
    };
  },

  computed: {

    myisdisabled() {
      return this.active === 4;
    },

    isCreated() {
      return this.isClone || !this.$route.query.id;
    },

    idCode() {
      return this.$route.query.id;
    },

    isShowAddress() {
      return !!this.$store.getters.provinceList;
    },

    isDregs() {
      let bool = false;
      if (this.ztCbData) {
        // 判断是否渣土货源
        bool = this.ztCbData.redisOrderInfoVo.isDregs === 1;
      }
      return bool;
    },

    // 装卸类型 7/22 添加 --chj
    loadType_computed() {
      // 修改司机实收金额 0:允许 1:不允许： editDriverActualAmount
      // 单货源多商品 0：允许 1:不允许  singleSourceMultiCommodity

      // 单货源多装货地 0:允许 1:不允许  singleSourceMultiLoadingLocations
      // 单货源多卸货地 0:允许 1:不允许  singleSourceMultiUnloadingLocations
      // 是否需要申请打款环节 0：需要 1:不需要  isNeedApplicationForPayment
      let arr = [
        { dictValue: '1', dictLabel: '一装一卸', disabled: false },
        { dictValue: '2', dictLabel: '多装一卸', disabled: false },
        { dictValue: '3', dictLabel: '一装多卸', disabled: false }
      ];

      // console.log(this.shipmentInfo);
      if (this.shipmentInfo) {
        const singleSourceMultiLoadingLocations = this.shipmentInfo.singleSourceMultiLoadingLocations === 0;
        const singleSourceMultiUnloadingLocations = this.shipmentInfo.singleSourceMultiUnloadingLocations === 0;

        // console.log(this.shipmentInfo);



        // 允许
        if (!singleSourceMultiLoadingLocations && !singleSourceMultiUnloadingLocations) {
          arr = [
            { dictValue: '1', dictLabel: '一装一卸', disabled: false },
            { dictValue: '2', dictLabel: '多装一卸', disabled: true },
            { dictValue: '3', dictLabel: '一装多卸', disabled: true }
            // { dictValue: '4', dictLabel: '多装多卸' },
          ];
        } else if (singleSourceMultiLoadingLocations && !singleSourceMultiUnloadingLocations) {
          arr = [
            { dictValue: '1', dictLabel: '一装一卸', disabled: false },
            { dictValue: '2', dictLabel: '多装一卸', disabled: false },
            { dictValue: '3', dictLabel: '一装多卸', disabled: true }
          ];
        } else if (!singleSourceMultiLoadingLocations && singleSourceMultiUnloadingLocations) {
          arr = [
            { dictValue: '1', dictLabel: '一装一卸', disabled: false },
            { dictValue: '2', dictLabel: '多装一卸', disabled: true },
            { dictValue: '3', dictLabel: '一装多卸', disabled: false }
          ];
        }
      }


      return arr;
    },

    // 是否可以设置电子围栏
    isOpenTheElectronicFence() {
      // 是否开启电子围栏(0开启 1不开启), 默认不开启
      let bool = false;

      if (this.shipmentInfo && this.shipmentInfo.openTheElectronicFence === 0 && !this.idCode && this.$store.state.orders.tiemList.length > 0) {
        bool = true;
      }
      return bool;
    }
  },
  watch: {
    isMultiGoods() {
      if (this.isMultiGoods) return;
      this.formData.tin7 = '1';
      this.formData.tin8 = false;
      this.formData.tin9 = false;
    },
    '$route.query.t': {
      handler(value, odvalue) {
        console.log('返原初始');
        this.$store.commit('orders/SET_ORDERSTOWAGESTATUS', '0');

        if ((odvalue === '0' || odvalue === '1' || odvalue === '3') && !value) {
          if (this.$route.path === '/orders/release') {
            this.$router.replace({
              path: '/refresh'
            });
          }
        }
        if (value === '0') {
          this.isT = true;
        } else if (value === '3') {
          this.isClone = true;
        }
      },
      immediate: true
    }

  },

  async created() {
    const { isShipment = false, isZtShipment = false, shipment = {}, user = {}} = getUserInfo() || {};
    this.isShipment = isShipment;
    this.isZtShipment = isShipment && isZtShipment;
    console.log('第一传要最后确认');
    if (isShipment) {
      if (isShipment && shipment.info && shipment.info.authStatus !== 3) {
        this.authStatus = false;
        this.msgWarning('审核通过才能发布货源~!');

        return;
      }

      // 只有普通货主才走这里去请求
      if (!isZtShipment && isShipment && shipment.info) {
        // console.log(shipment.info, '货主身份---');
        // 通过id 获取 7/23 --chj
        this.getShipmentInfo(shipment.info.code);
        this.formData.tin1 = shipment.info.code;
      }
      if (user.orgCode) {
        this.orgCode = user.orgCode;
      }
    }

    if (this.idCode) {
      this.getCbdata(this.idCode);
    }

    this.getDicts('M0').then(res => {
      this.$store.dispatch('orders/store_getM0_option', res.data);
    });

    const provinceOption = this.$store.getters.provinceList;
    if (provinceOption) return;
    const { rows } = await getProvinceList();
    this.$store.dispatch('orders/store_getProvinceList', rows);
  },

  methods: {
    handleElect(addr) {
      console.log(addr);
      if (addr.cbData) {
        this.addressChange = addr;
        // if(addr.cbData.location)
        this.title = '设置电子围栏';
        this.circledialog = true;
        this.radius = addr.radius;
        this.$refs.CircleDialog.circleEdit(addr.cbData.location);
      } else {
        this.msgInfo('请先完善地址信息！');
      }
    },
    changeElect(val) {
      console.log(this.addressChange);
      console.log(val);
    },
    // 通过货主的id获取详情 7/23 --chj
    getShipmentInfo(code) {
      return getShipmentByCode({ code }).then(res => {
        this.shipmentInfo = res.data;
        console.log(this.shipmentInfo);
        // this.isZtShipment = res.data.shipmentRoleCodes.indexOf('6809f8526e764abea23e6f302b9cf44d') !== -1;
        console.log(this.isZtShipment, '要最后确认111');
      });
    },


    // 触发远程搜索
    remoteMethod(query) {
      if (query !== '') {
        this.loading1 = true;
        this.queryParams.pageNum = 1;
        this.dataOver = false;
        this.queryParams.keywords = query;
        this.shipmentList = [];
        this.getTeamList();
      } else {
        this.shipmentList = [];
      }
    },
    // 远程搜索列表触底事件
    loadmore() {
      if (this.dataOver) return;
      this.queryParams.pageNum++;
      this.getTeamList();
    },
    getTeamList() {
      // 获取代理用户表
      listShipment(this.queryParams).then(
        (res) => {
          this.dataOver = !res.rows.length;
          this.shipmentList = this.shipmentList.concat(res.rows);
          this.loading1 = false;
        }
      ).catch(() => {
        this.loading1 = false;
      });
    },


    // 获取orgCode
    handlerchange(value) {
      this.shipmentList.forEach(e => {
        if (e.code === value) {
          this.orgCode = e.orgCode || '';
          this.isZtShipment = e.shipmentRoleCodes.indexOf('6809f8526e764abea23e6f302b9cf44d') !== -1;
          // 如果是大宗货主这需要请求详情
          if (!this.isZtShipment && !this.shipmentInfo) {
            this.getShipmentInfo(e.code);
          } else {
            // 如果是渣土货主则需要这个
            this.shipmentInfo = e;
          }
        }
      });
    },

    async nextTo(active, cb) {
      if (!cb) {
        this.basicInfor = await this.handlerPromise('OrderBasic', false);
        this.basicInfor.loadType = this.formData.tin7;
        this.goodsBigType = this.basicInfor.orderGoodsList[0].goodsBigType;
      }
      this.active = active;
    },

    async nextSe(active, cb) {
      if (active === 1) {
        this.active = 1;
        return;
      }
      if (!this.formData.tin7) {
        this.msgError('请选择类型');
        return;
      }

      if (!this.formData.tin8 && this.formData.tin7 - 0 === 2 && this.address_add.length < 2) {
        this.msgError('多装一卸, 必须多地址');
        return;
      } else if (!this.formData.tin9 && this.formData.tin7 - 0 === 3 && this.address_xie.length < 2) {
        this.msgError('一装多卸, 必须多地址');
        return;
      }

      // s= 回填的时候, 这个自装和自卸 是已经存在的了, 所以不走下面
      const newAddress_add = this.address_add.filter(e => {
        return e.addressType === '3';
      });
      const newAddress_xie = this.address_xie.filter(e => {
        return e.addressType === '4';
      });

      if (newAddress_add.length || newAddress_xie.length) {
        this.active = active;
        return;
      }
      // e

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


      if (this.formData.tin8) {
        this.addr_add.push(
          {
            cbData: {
              addressType: '3',
              addressName: ''
            },
            addressType: '3',
            addressName: '自装',
            type: 'tin8',
            refName: 'address_add' + Date.now()
          }
        );
      } else {
        this.addr_add = this.addr_add.filter(e => {
          return (!e.type || e.type !== 'tin8');
        });
      }

      if (this.formData.tin9) {
        this.addr_xie.push(
          {
            cbData: {
              addressType: '4',
              addressName: ''
            },
            addressType: '4',
            addressName: '自卸',
            type: 'tin9',
            refName: 'address_xie' + Date.now()
          }
        );
      } else {
        this.addr_xie = this.addr_xie.filter(e => {
          return (!e.type || e.type !== 'tin9');
        });
      }

      this.active = active; // 3
    },

    // 下一步 active =4
    nextFe(active) {
      if (active === 4) {
        this.onSubmit('elForm');
      } else if (active === 2) {
        this.active = 2;
      } else if (active === 3) {
        this.active = 3;
      }
    },

    // 处理预估
    async handlerEstimateCost(lastData) {
      const { orderFreightInfoBoList, orderGoodsList, orderFreightInfoUpdateBoList, orderGoodsUpdateBoList } = JSON.parse(JSON.stringify(lastData));

      const orderEstimateCostBoList = (orderFreightInfoBoList || orderFreightInfoUpdateBoList).map(e => {
        (orderGoodsList || orderGoodsUpdateBoList).forEach(goods => {
          if (goods.identification === e.goodsIdentification) {
            e.number = goods.number;
            e.stowageStatus = goods.stowageStatus;
            e.totalType = goods.totalType;
            e.vehicleMaxWeight = goods.vehicleMaxWeight;
            e.weight = goods.weight;
          }
        });
        if (!e.orderAddressBoList) {
          e.orderAddressBoList = e.orderAddressUpdateBoList.map(ee => {
            ee.orderFreightBoList = ee.orderFreightUpdateBoList;
            ee.orderFreightUpdateBoList = undefined;

            return ee;
          });

          e.orderAddressUpdateBoList = undefined;
        }
        return e;
      });


      const qData = {
        orderEstimateCostBoList,
        'userCode': this.formData.tin1
      };
      const res = await estimateCost(qData);

      if (res.code === 501) {
        this.msgError(res.msg);
        return;
      }


      this.$store.dispatch('orders/store_getEst', res.data);
      this.active = 4;
    },

    // 发布按钮触发(1.发布接口2.成功1秒后跳转)
    onPubilsh() {
      if (this.lastData) {
        this.loading = true;

        if (!this.isCreated) {
          update(this.lastData).then(res => {
            this.msgSuccess('修改成功');
            var time1 = setTimeout(() => {
              clearTimeout(time1);
              time1 = null;
              this.loading = false;
              this.$router.push({ name: 'Manage', query: { p: Date.now() }});
            }, 700);
          }).catch(() => {
            this.loading = false;
          });
        } else {
          orderPubilsh(this.lastData).then(async(response) => {
            if (this.isOpenTheElectronicFence && (this.switchRadius1 || this.switchRadius2)) {
              const { orderAddressPublishBoList, orderSpecifiedList } = this.lastData;
              const addressInfo = orderAddressPublishBoList.map(e => {
                let obj = null;
                if (e.addressType === '1' && this.switchRadius1) {
                  obj = {
                    addressType: e.addressType,
                    lng: e.longitude,
                    lat: e.latitude,
                    radius: this.$store.state.orders.radius1 + ''
                  };
                } else if (e.addressType === '2' && this.switchRadius2) {
                  obj = {
                    addressType: e.addressType,
                    lng: e.longitude,
                    lat: e.latitude,
                    radius: this.$store.state.orders.radius2 + ''
                  };
                }

                return obj;
              }).filter(e => e);

              const dispatcherCodeList = orderSpecifiedList.map(e => e.teamInfoCode);

              const que = {
                addressInfo,
                dispatcherCodeList,
                orderCode: response.data
              };

              try {
                await fencePlatCreate(que);
              } catch (error) {
                console.log(error);
              }
            }


            this.msgSuccess('新增成功');
            setTimeout(() => {
              this.loading = false;
              this.$router.push({ name: 'Manage', query: { p: Date.now() }});
            }, 700);
          }).catch(() => {
            this.loading = false;
          });
        }
      }
    },

    onSubmit(form, active) {
      this.$refs[form].validate(async(valid) => {
        if (valid) {
          this.lastData = await this.submAllData();

          if (active && active === 3) {
            this.onPubilsh();
          } else {
            this.handlerEstimateCost(this.lastData);
          }
        } else {
          return false;
        }
      });
    },

    // 整理出符合发布的数据格式
    async submAllData() {
      if (!this.basicInfor) {
        this.basicInfor = await this.handlerPromise('OrderBasic', false);
      }
      this.goodsBigType = this.basicInfor.orderGoodsList[0].goodsBigType;
      this.goodsBigTypeName = this.basicInfor.orderGoodsList[0].goodsBigTypeName;


      // console.log(this.basicInfor, '-----------------------');


      const {
        classList,
        isPublic,
        isSpecified,
        orderSpecifiedList,
        projectCode,
        pubilshCode,
        remark,
        InfoCode,
        publishMode
      } = this.basicInfor; // 货源基本结构和信息

      // 处理商品信息和地址相关的规则
      const { orderGoodsList, orderAddressPublishBoList, orderFreightInfoBoList } = await this.handlerAddress();

      const orderInfoBo = {
        code: InfoCode || undefined,
        publishMode,
        isPublic: isPublic,
        isSpecified: isSpecified ? 1 : 0,
        loadType: this.formData.tin7 - 0,
        projectCode,
        orgCode: this.orgCode,
        pubilshCode,
        uploadLoadVoucher: this.basicInfor.uploadLoadVoucher ? 1 : 0,
        uploadUnloadVoucher: this.basicInfor.uploadUnloadVoucher ? 1 : 0,
        remark
      };


      const orderBasic = {};

      // 商品处理对象-按多个商品处理
      const orderGoodsListArr = orderGoodsList.map(e => {
        this.basicInfor.orderGoodsList.forEach(itemGoods => {
          if (itemGoods.goodsType === e.goodsType) {
            e.goodsTypeName = itemGoods.goodsTypeName;
          }
        });

        return {
          // code: e.code || undefined,
          goodsBigType: this.goodsBigType, // 大类code
          goodsBigTypeName: this.goodsBigTypeName, // 大类code
          goodsType: e.goodsType, // 小类code
          goodsTypeName: e.goodsTypeName, // 小类名称
          identification: e.goodsType, // 约定好的
          businessType: e.businessType, // 业务类型
          'goodsPrice': e.goodsPrice, // 货物单价
          number: e.number ? e.number - 0 : 0, // 车
          'vehicleMaxWeight': e.vehicleMaxWeight, // 最高配载
          'stowageStatus': e.stowageStatus, // 配载方式
          'isOneselfLoad': this.formData.tin8 ? 1 : 0,
          'isOneselfUnload': this.formData.tin9 ? 1 : 0,
          'totalType': e.totalType, // 配载总量类型 1.不限（长期货源）2.定量货源
          'vehicleLength': e.vehicleLength,
          'vehicleType': e.vehicleType,
          'weight': e.weight ? e.weight : '' // 货品吨数
        };
      });
      if (this.isCreated) {
        orderBasic.classList = classList;
        orderBasic.orderSpecifiedList = orderSpecifiedList;
        orderBasic.orderInfoBo = orderInfoBo;
        orderBasic.orderGoodsList = orderGoodsListArr;
        orderBasic.orderAddressPublishBoList = orderAddressPublishBoList;
        orderBasic.orderFreightInfoBoList = orderFreightInfoBoList;
      } else {
        orderBasic.classUpdateBoList = classList;
        orderBasic.orderInfoUpdateBo = orderInfoBo;
        orderBasic.orderSpecifiedUpdateBoList = orderSpecifiedList;
        orderBasic.orderGoodsUpdateBoList = orderGoodsListArr;
        orderBasic.orderAddressInfoUpdateBoList = orderAddressPublishBoList;
        orderBasic.orderFreightInfoUpdateBoList = orderFreightInfoBoList;
      }

      return orderBasic;
    },

    // 处理地址 和 商品
    async handlerAddress() {
      const goodsInfo = await this.$refs.goodsInfo._submitForm();

      const orderGoodsList = goodsInfo.map(e => {
        return {
          code: e.code || undefined,
          ...e.orderGood,
          goodsType: e.goodsType,
          identification: e.goodsType
        };
      });

      const orderFreightInfoBoList = goodsInfo.map(e => {
        const orderAddressBoList = e.newRedis.map((ee, index) => {
          ee.identification = index + 1;

          return {
            addressIdentification: (ee.addressType - 0) === 1 ? (index + 1) + ':0' : '0:' + (index + 1),
            ruleDictValue: ee.ruleDictValue,
            ruleInfoShipmentCode: ee.ruleInfoShipmentCode,
            orderFreightBoList: this.isCreated ? ee.orderFreightBoList : undefined,
            orderFreightUpdateBoList: !this.isCreated ? ee.orderFreightBoList : undefined
          };
        });
        return {
          orderAddressBoList: this.isCreated ? orderAddressBoList : undefined, // 发布
          orderAddressUpdateBoList: !this.isCreated ? orderAddressBoList : undefined, // 编辑
          goodsIdentification: e.goodsType
        };
      });


      let arr = [];
      for (const e of goodsInfo) {
        arr = [...arr, ...e.newRedis];
      }
      arr = this.distinct1(arr, 'identification');

      if (this.formData.tin7 === '3') {
        this.addr_xie = arr;
      } else {
        this.addr_add = arr;
      }

      let addr_add = JSON.parse(JSON.stringify(this.addr_add));
      let addr_xie = JSON.parse(JSON.stringify(this.addr_xie));

      addr_add = addr_add.map(e => {
        e.identification = e.identification || 0;
        // 自装地址处理
        if (e.type && e.type === 'tin8') {
          e = this.addressItem(e, '3');
        }

        return e;
      });

      addr_xie = addr_xie.map(e => {
        e.identification = e.identification || 0;
        if (e.type && e.type === 'tin9') {
          e = this.addressItem(e, '4');
        }
        return e;
      });

      return { orderGoodsList, orderFreightInfoBoList, orderAddressPublishBoList: [...addr_add, ...addr_xie] };
    },

    addressItem(e, type) {
      return {
        districtCode: '', // (区的code) 必填的
        district: '', // (区)
        addressAlias: '',
        addressType: type,
        city: '',
        cityCode: '',
        contact: '',
        contactPhone: '',
        detail: '', // 手填的
        addressName: '', // 地址名称(高德手选)
        location: [],
        province: '',
        provinceCode: '',
        goodsBigType: e.goodsBigType || '',
        goodsType: e.goodsType || '',
        identification: e.identification || '',
        level: e.level || null,
        orderFreightBoList: e.orderFreightBoList || '',
        ruleDictValue: e.ruleDictValue || '',
        ruleInfoShipmentCode: e.ruleInfoShipmentCode || ''
      };
    },



    /* 回填------------------------------------------------------------------------------------------------------------------------ */

    // 编辑和详情-回填获取数据
    async getCbdata(id) {
      this.loading = true;
      try {
        const { data } = await getOrderByCode(id);

        this.ztCbData = data;

        // console.log(data, '99999');

        const { redisOrderInfoVo, redisOrderClassGoodsVoList, redisOrderSpecifiedVoList, redisOrderFreightInfoVoList, redisOrderGoodsVoList, redisAddressList } = data;

        try {
          !this.shipmentInfo && (await this.getShipmentInfo(redisOrderInfoVo.pubilshCode));
        } catch (error) { console.log(error); }

        // 5/18s=特殊处理
        const redisOrderGoodsVoListRest = redisOrderGoodsVoList.map(e => {
          const goodsBigTypes = e.goodsBigType.split(',');

          if (goodsBigTypes.length > 1) {
            this.goodsBigTypes = goodsBigTypes;
            e.goodsBigType = goodsBigTypes[goodsBigTypes.length - 1];

            // 处理小类
            const goodsTypes = e.goodsType.split(',');

            e.goodsType = goodsTypes[goodsTypes.length - 1];
          }

          return e;
        });

        // 5/18e=特殊处理

        this.handlerOrderBasic({ ...redisOrderInfoVo, redisOrderClassGoodsVoList, redisOrderSpecifiedVoList, redisOrderGoodsVoListRest });

        this.handlercbAddress(redisAddressList);

        this.handerRedisOrder(redisAddressList);

        // 4. 处理商品
        this.cbGoodsAccounting = redisOrderGoodsVoListRest;

        // 5. 处理规则

        this.cbOrderFreight = redisOrderFreightInfoVoList;


        this.active = this.isT ? 4 : 3; // 自接全展示

        this.isT && this.isTEstimateCost(data);

        this.$nextTick(() => {
          let tiem = setTimeout(() => {
            this.loading = false;
            clearTimeout(tiem);
            tiem = undefined;
          }, 700);
        });
      } catch (error) {
        // this.loading = false;
      }
    },

    // 查看详情处理预估
    async isTEstimateCost(lastData) {
      const { redisOrderGoodsVoList, redisOrderFreightInfoVoList } = lastData;

      const orderEstimateCostBoList = redisOrderFreightInfoVoList.map(e => {
        let number = '';
        let stowageStatus = '';
        let totalType = '';
        let vehicleMaxWeight = '';
        let weight = '';
        let orderAddressBoList = [];
        let goodsIdentification = '';


        redisOrderGoodsVoList.forEach(goods => {
          if (goods.code === e.goodsCode) {
            goodsIdentification = goods.goodsType;
            number = goods.number;
            stowageStatus = goods.stowageStatus;
            totalType = goods.totalType;
            vehicleMaxWeight = goods.vehicleMaxWeight;
            weight = goods.weight;
          }
        });


        if (!e.orderAddressBoList) {
          orderAddressBoList = e.redisOrderAddressInfoVoList.map(ee => {
            return {
              addressIdentification: ee.addressCode,
              orderFreightBoList: ee.redisOrderFreightVoList
            };
          });
        }
        return {
          goodsIdentification,
          number,
          stowageStatus,
          totalType,
          vehicleMaxWeight,
          weight,
          orderAddressBoList: e.orderAddressBoList ? e.orderAddressBoList : orderAddressBoList
        };
      });


      const qData = {
        orderEstimateCostBoList,
        'userCode': this.formData.tin1
      };

      const res = await estimateCost(qData);
      if (res.code === 501) {
        this.msgError(res.msg);
        return;
      }

      this.$nextTick(() => {
        this.$store.dispatch('orders/store_getEst', res.data);
      });
    },

    // 1.处理 cbOrderBasic 要的数据
    handlerOrderBasic(data) {
      const { code, isPublic, publishMode, isSpecified, loadType, projectCode, pubilshCode, remark, redisOrderClassGoodsVoList, redisOrderGoodsVoListRest: redisOrderGoodsVoList, redisOrderSpecifiedVoList } = data;

      this.formData.tin1 = pubilshCode;
      this.formData.tin7 = loadType ? loadType + '' : '1';

      this.cbOrderBasic = {
        code,
        projectCode,
        isPublic,
        publishMode,
        goodsBigType: redisOrderGoodsVoList[0].goodsBigType,
        goodsType: redisOrderGoodsVoList.map(e => {
          return e.goodsType;
        }),
        isSpecified,
        remark,

        uploadLoadVoucher: data.uploadLoadVoucher,
        uploadUnloadVoucher: data.uploadUnloadVoucher,

        orderSpecifiedList: redisOrderSpecifiedVoList,
        classList: redisOrderClassGoodsVoList.map(e => {
          return {
            classCode: e ? e.classCode : ''
          };
        })
      };

      this.waybillData = {
        code,
        classList: redisOrderClassGoodsVoList
      };
    },

    // 2. 处理 OneAddress 地址要的数据
    handlercbAddress(addressList) {
      this.address_add = [];
      this.address_xie = [];

      addressList.forEach((e, index) => {
        if ((e.addressType - 0) === 3) {
          this.formData.tin8 = true;
        } else if ((e.addressType - 0) === 4) {
          this.formData.tin9 = true;
        }

        if ((e.addressType - 0) === 1) {
          // 装
          this.address_add.push({
            refName: 'address_add' + Date.now() + index,
            cbData: e // 主要是这个
          });
        } else if ((e.addressType - 0) === 2) {
          // 卸
          this.address_xie.push({
            refName: 'address_xie' + Date.now() + index,
            cbData: e
          });
        } else if ((e.addressType - 0) === 3) {
          e.addressName = '自装';
          this.address_add.push({
            refName: 'address_add' + Date.now() + index,
            addressType: e.addressType,
            cbData: e // 主要是这个
          });
        } else if ((e.addressType - 0) === 4) {
          e.addressName = '自卸';
          this.address_xie.push({
            refName: 'address_xie' + Date.now() + index,
            addressType: e.addressType,
            cbData: e
          });
        }
      });
    },

    // 3. 处理回填的数据(1.是要获取地址中的规则 2.要获取装地址到卸地址)
    handerRedisOrder(addressList) {
      addressList.forEach(e => {
        if ((e.addressType - 0) === 1 || (e.addressType - 0) === 3) {
          this.addr_add.push(e);
        } else {
          this.addr_xie.push(e);
        }
      });
    },

    zhuangOrxiechange(value) {
      if (this.formData.tin7 === '1' && (this.address_add.length >= 2 || this.address_add.length <= 0)) {
        this.msgError('选择一装多卸,装货地址必须为一个, 且不能选择允许自装');
        this.formData.tin7 = '2';
        return;
      }
      if (this.formData.tin7 === '1' && (this.address_xie.length >= 2 || this.address_xie.length <= 0)) {
        this.msgError('选择一装多卸,卸货地址必须为一个, 且不能选择允许自卸');
        this.formData.tin7 = '3';
        return;
      }
      if (this.formData.tin7 === '2' && (this.address_xie.length >= 2 || this.address_xie.length <= 0)) {
        this.msgError('选择多装一卸,则卸货地址必须填一个且不能选择允许自卸');
        this.formData.tin7 = '3';
        return;
      }
      if (this.formData.tin7 === '3' && (this.address_add.length >= 2 || this.address_add.length <= 0)) {
        this.msgError('选择一装多卸,则装货地址必须填一个且不能选择允许自装');
        this.formData.tin7 = '2';
        return;
      }

      if (this.formData.tin7 !== '1') {
        this.formData.tin8 = false;
        this.formData.tin9 = false;
        return;
      }
      if (this.formData.tin7 !== '2') {
        this.formData.tin8 = false;
        return;
      }
      if (this.formData.tin7 !== '3') {
        this.formData.tin9 = false;
        return;
      }
    },

    handlerCheck(type) {
      if (!this.formData.tin8) {
        this.address_add = this.address_add.filter(e => e.addressType !== '3');
      }

      if (type === 'add' && !this.formData.tin8 && this.address_add.length <= 0) {
        this._addAddress('address_add');
      }
    },
    handlerXie() {
      if (!this.formData.tin9) {
        this.address_xie = this.address_xie.filter(e => e.addressType !== '4');
      }

      if (!this.formData.tin9 && this.address_xie.length <= 0) {
        this._addAddress('address_xie');
      }
    },

    // 处理选中的小类
    handlerGoos(data) {
      this.goods = data;
    },

    // 返回
    backPge() {
      this.$router.back();
    },

    _addAddress(name) {
      if (this.active >= 3) {
        this.active = 2;
      }

      this[name].push({
        refName: name + Date.now()
      });
    },
    _delAddress(name, refName) {
      this[name] = this[name].filter((e) => {
        return e.refName !== refName;
      });
    },

    // 打开多选地址的弹框
    selectAddress(name, type) {
      this.isRadioSelection = { name, type };
      this.openSelectaddress = true;
    },

    async handlerPromise(refname, bool) {
      return await this.$refs[refname]._submitForm();
    },

    radioSelection(data) {
      if (JSON.stringify(data) === '{}') return;

      if (this.isRadioSelection) {
        const { name, type } = this.isRadioSelection;
        this[name].forEach(e => {
          if (e.refName === type) {
            e.cbData = {
              ...data,
              location: [data.longitude, data.latitude]
            };
          }
        });
      }

      this.isRadioSelection = null;
      this.openSelectaddress = false;
    },

    // 去重
    distinct1(arr, key) {
      var newobj = {}; var newArr = [];
      for (var i = 0; i < arr.length; i++) {
        var item = arr[i];
    	if (!newobj[item[key]]) {
          newobj[item[key]] = newArr.push(item);
    	}
      }
      return newArr;
    }

  }
};
</script>
<style lang="scss" scoped>

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
  max-width: 1000px;
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
  border: 1px solid rgba(242, 245, 248, 1);
  width: 66%;
  min-width: 850px;
  border-radius: 3px;
  overflow: hidden;
}
.m-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.release_warning{
  padding-right: 50px;
  text-align: left;
}

.my_huozhu{
  background: #fff url('~@/assets/images/order-jiaoliu.png') no-repeat;
  background-position: 99% 6px;
}

.m_zhuanghuo{
    font-weight: 700;
    padding-left: 30px;
    line-height: 30px;
    background: url('~@/assets/images/order_zhuan.png') no-repeat 0px 6px;
    background-size: 22px 19px;
}
.m_xie{
    font-weight: 700;
    padding-left: 30px;
    line-height: 30px;
    background: url('~@/assets/images/order_xie.png') no-repeat 0px 6px;
    background-size: 22px 19px;
}

.my-iocn{
  font-size: 30px;
  color: #C18633;
}
.btn{
  padding-right: 70px;
  .el-form-item{
    margin-bottom:0px;
  }
}
.dai-sytle{
    color: #ccc;
  }
  .huoz-style{
    font-weight: 700;
  }
  .colorccc{
    color: #ccc;
    margin-right: 10px;
    .name-style{
      margin-right: 5px;
      color:#000;
    }
  }

.btn{
  padding-right: 70px;
}

.m_pa{
  //  width: 40px;
  //  height: 40px;
  top: 0px;
  left: 4px;
  color: #fff;
}
.m_btn{
  width: 200px;
}
.triangleR{
    width: 40px;
    height: 20px;
    transform: rotate(45deg);
    top: -28px;
    left: -24px;


}
.triangleT,.triangleL,.triangleB,.triangleR{position:relative;}
.triangleT::after,
.triangleL::after,
.triangleB::after,
.triangleR::after
{content:"";position:absolute;width:0;height:0;top:0;left:0;border-color:transparent;border-style:solid;}
.triangleB::after{border-bottom-color: red;border-width:20px;}
.triangleR::after{border-right-color: #409EFF;border-width:20px;}
.triangleT::after{border-top-color: green;border-width:20px;}
.triangleL::after{border-left-color: yellow;border-width:20px;}


</style>
