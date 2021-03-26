<template>
  <div class="app-container">


    <el-steps v-if="false" :active="1" finish-status="success">
      <el-step title="已完成" />
      <el-step title="进行中" />
      <el-step title="步骤 3" />
    </el-steps>

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
            clearable
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="remoteMethod"
            :loading="loading"
            @change="handleTin1"
          >
            <el-option
              v-for="(item, index1) in shipmentList"
              :key="index1"
              :label="item.adminName"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
      </div>
      <el-divider />



      <template v-if="false || isTin1">
        <div class="content">
          <div class="header mb8">货物类型(第一步)</div>

          <el-form-item label="选择所属项目" prop="tin3">
            <el-select
              v-model="formData.tin3"
              placeholder="请选择项目"
              clearable
              filterable
              :style="{ width: '100%' }"
              @change="handleTin3"
            >
              <el-option
                v-for="dict in tin3Optin"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="选择货物类别" prop="tin2">
            <el-radio-group v-model="formData.tin2" size="medium" @change="handletin2()">
              <el-radio
                v-for="item in goodsBigTypeOptions"
                :key="item.value"
                :disabled="formData.tin3 !== '0'"
                :label="item.value"
              >{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>

          <!-- 先隐藏, 选择后显示 -->
          <template v-if="formData.tin2">
            <!-- isMultiGoods true->多商品 ; false->单商品 -->
            <el-form-item v-if="isMultiGoods" label="货物类型(小)" prop="tin2_1">
              <el-checkbox-group
                v-model="formData.tin2_1"
                size="medium"
                @change="handletin2_1"
              >
                <el-checkbox
                  v-for="dict in tin2_1Option"
                  :key="dict.dictValue"
                  :disabled="formData.tin3 !== '0'"
                  :label="dict.dictValue"
                >{{ dict.dictLabel }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item v-else label="货物类型(小)" prop="tin2_2">
              <el-radio-group v-model="formData.tin2_2" size="medium">
                <el-radio
                  v-for="dict in tin2_1Option"
                  :key="dict.dictValue"
                  :disabled="formData.tin3 !== '0'"
                  :label="dict.dictValue"
                >{{ dict.dictLabel }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </template>

          <el-form-item label="发布位置" prop="tin4">
            <el-radio-group v-model="formData.tin4" size="medium" @change="handleTin4">
              <el-radio
                v-for="dict in [
                  { dictValue: true, dictLabel: '公开货源(所有人可接)' },
                  { dictValue: false, dictLabel: '非公开货源(私密货源)' },
                ]"
                :key="dict.dictValue"
                :label="dict.dictValue"
              >{{ dict.dictLabel }}</el-radio>
            </el-radio-group>
          </el-form-item>

          <template v-if="!formData.tin4">
            <el-form-item label="指定接单人" prop="tin5">
              <el-radio-group v-model="formData.tin5" size="medium">
                <el-radio
                  v-for="dict in [
                    { dictValue: true, dictLabel: '是' },
                    { dictValue: false, dictLabel: '否' },
                  ]"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                >{{ dict.dictLabel }}</el-radio>
              </el-radio-group>
            </el-form-item>

            <template v-if="formData.tin5">
              <el-form-item prop="tin5_2" label="指定接单人">
                <div class="ly-flex">
                  <el-button type="primary" @click="open1">指定接单人</el-button>
                  <div class="ml0">调度者: {{ formData.tin5_1.length }} 人</div>
                  <div class="ml0">司机: {{ formData.tin5_2.length }} 人</div>
                </div>
              </el-form-item>
            </template>

            <el-form-item label="货集码" prop="tin6">
              <el-select
                v-model="formData.tin6"
                placeholder="选择货集码"
                clearable
                filterable
                :style="{ width: '100%' }"
              >
                <el-option
                  v-for="dict in tin6_Option"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
          </template>

          <el-form-item label="备注信息" prop="remark">
            <el-input
              v-model="formData.remark"
              type="textarea"
              placeholder="请输入任何您想说的话..."
              :autosize="{ minRows: 4, maxRows: 4 }"
              :style="{ width: '100%' }"
            />
          </el-form-item>
        </div>
        <el-divider />
      </template>

      <order-basic v-else :pubilsh-code="formData.tin1" />

      <template v-if="(isTin1) && isMultiGoods">
        <div class="content">
          <div class="header mb8">装卸货地址配置(第二步)</div>
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
              <el-form-item v-if="formData.tin7 === '2' || formData.tin7 === '4'" prop="tin8">
                <el-checkbox v-model="formData.tin8">允许自装</el-checkbox>
              </el-form-item>
              <el-form-item v-if="formData.tin7 === '3' || formData.tin7 === '4'" :label-width="formData.tin7 === '4'?'30px':null" prop="tin9">
                <el-checkbox v-model="formData.tin9">允许自卸</el-checkbox>
              </el-form-item>
            </div>
          </el-form-item>
        </div>

        <el-divider />
      </template>
    </el-form>

    <template v-if="isTin1">
      <div class="content">
        <div class="header mb8">货源地址</div>
        <add-address
          ref="address1"
          :address-type="1"
          :show-btn="formData.tin7 === '2' || formData.tin7 === '4'"
          :is-big-odd="isMultiGoods"
        />
      </div>

      <el-divider />

      <div class="content">
        <div class="header mb8">卸货地址</div>
        <add-address
          ref="address2"
          :address-type="2"
          :show-btn="formData.tin7 === '3' || formData.tin7 === '4'"
          :is-big-odd="isMultiGoods"
        />
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

        <!-- s封装成组件 -->

        <div class="content">
          <div class="header mb8">预估运费</div>

          <div class="footer-box">
            <div><span>预估运费(不含税):</span> <span>￥</span><span>8566.00</span></div>
            <div><span>(含税):</span> <span>￥</span><span>8566.00</span></div>
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
              <MultiData :ref="item.value" />
            </el-tab-pane>
          </el-tabs>
        </div>
      </template>

      <div>
        <el-button type="primary" @click="onSubmit('elForm')">立即发布</el-button>
        <el-button>取消</el-button>
      </div>
    </template>

    <!-- 调度者/司机 -->
    <el-dialog :title="title" :visible.sync="open" width="80%" append-to-body>
      <open-dialog v-if="open" @handleSelectionChange="handleSelectionChange" />
    </el-dialog>
  </div>
</template>

<script>
import OrderBasic from './component/OrderBasic';
// import OpenDialog from './OpenDialog';
import OpenDialog from '../manage/component/OpenDialog';

import AddAddress from './component/AddAddress';
import GoodsAccounting from './component/GoodsAccounting';
import AccounTing from './component/AccounTing';
import MultiData from './component/MultiData';

// 根据货主的code获取他下面的项目
import { listInfo } from '@/api/enterprise/project';
import { listShipment } from '@/api/assets/shipment.js';

// 获取货集码列表 ? 要在什么时机调用?
import { listStockcode } from '@/api/enterprise/stockcode';

import { listByDict } from '../../../api/system/dict/data';

import { orderPubilsh } from '@/api/order/release';

export default {
  components: {
    OpenDialog,
    AddAddress,
    GoodsAccounting,
    AccounTing,
    MultiData,

    //
    OrderBasic
  },
  data() {
    return {
      loading: false,
      // 多商品对应各自的规格
      tin2_1tabs: [],
      tin2_1tabs_activeName: '0',
      formData: {
        tin1: '', // 发布人Code
        tin2: undefined, // 选择货物类型大类(必填)
        tin2_1: [], // 多商品-小类(必填)
        tin2_2: undefined, // 单商品 - 小类(必填)
        tin3: '0', // 项目编码
        tin3Code: '',
        tin4: true, // 是否公开货源 0.非公开 1.公开 / false=>非公开
        tin5: false, // 是否指定接单人 0否 1是 / false=>否
        tin5_1: [], // 调度者 多个
        tin5_2: [], // 司机 多个
        tin6: undefined, // 货集码
        tin7: '1', // 装卸类型 1.一装一卸 2.多装一卸 3.一装多卸 4.多装多卸
        tin8: false, // 允许自装 true=>是; false=> 否
        tin9: false //  允许自卸 true=>是; false=> 否

      },
      rules: {
        tin1: [
          { required: true, message: '请选择货物类型', trigger: 'change' }
        ],
        tin2: [
          { required: true, message: '请选择货物类型', trigger: 'change' }
        ],
        tin2_1: [
          { required: true, message: '请选择货物类型(小)', trigger: 'change' }
        ],
        tin2_2: [
          { required: true, message: '请选择货物类型(小)', trigger: 'change' }
        ],
        tin4: [
          { required: true, message: '发布位置', trigger: 'change' }
        ]
      },

      // 货物类型字典型(大)
      goodsBigTypeOptions: [],

      // 所属项目的字典
      tin3Optin: [{ dictValue: '0', dictLabel: '无所属项目' }],

      // 小类多商品
      tin2_1Option: [],

      // 货源吗字典
      tin6_Option: [],

      shipmentList: [],



      // 选中的名
      activeName: 'first',

      // 是否显示弹出层
      open: false,
      // 弹框title
      title: ''
    };
  },

  computed: {
    // 判断子类为多选还是单选
    isMultiGoods() {
      let bool = false;
      this.goodsBigTypeOptions.forEach((e) => {
        if (e.value === this.formData.tin2) {
          bool = e.isdd;
        }
      });
      return bool;
    },
    isBigOdd() {
      return this.formData.goodsBigType === 1;
    },

    isTin1() {
      return !!this.formData.tin1;
    }
  },

  async created() {
    // 1. 货物类型字典型(大)


    const { data } = await listByDict({
      'dictPid': '0',
      'dictType': 'goodsType'
    });

    this.goodsBigTypeOptions = data.map(e => {
      return {
        label: e.dictLabel,
        isdd: e.isCheckbox === '1', // 只有等于1才有多商品
        value: e.dictValue,
        ...e
      };
    });
    console.log('货物类型字典型', this.goodsBigTypeOptions);
  },

  methods: {
    // 2. 根据货主的code获取他下面的项目
    async handleTin1() {
      this.tin3Optin = [{ dictValue: '0', dictLabel: '无所属项目' }];
      this.formData.tin2 = undefined; // 选择货物类型大类(必填)
      this.formData.tin2_1 = []; // 多商品-小类(必填)
      this.formData.tin2_2 = undefined; // 单商品 - 小类(必填)
      this.formData.tin3 = '0'; // 项目编码
      this.formData.tin3Code = '';
      this.formData.tin4 = true; // 是否公开货源 0.非公开 1.公开 / false=>非公开
      this.formData.tin5 = false; // 是否指定接单人 0否 1是 / false=>否
      this.formData.tin5_1 = []; // 调度者 多个
      this.formData.tin5_2 = []; // 司机 多个
      this.formData.tin6 = undefined; // 货集码
      this.formData.tin7 = '1'; // 装卸类型 1.一装一卸 2.多装一卸 3.一装多卸 4.多装多卸
      this.formData.tin8 = false; // 允许自装 true=>是; false=> 否
      this.formData.tin9 = false; //  允许自卸 true=>是; false=> 否
      if (!this.formData.tin1) return;
      const query = {
        shipmentCode: this.formData.tin1
      };

      const res = (await listInfo(query));

      this.tin3Optin = this.tin3Optin.concat(res.rows.map(e => {
        return { dictValue: e.id, dictLabel: e.projectName, ...e };
      }));
      console.log('所属项目', this.tin3Optin);
    },

    // 3. 根据所属项目的cod 获取对应项目
    handleTin3() {
      if (this.formData.tin3 === '0') {
        this.formData.tin2 = undefined;
        this.formData.tin2_2 = undefined;
        this.formData.tin2_1 = [];
        this.tin2_1Option = [];
        return;
      }
      // 根据选中的id进行回填
      const arr = this.tin3Optin.filter(e => {
        return e.id === this.formData.tin3;
      });
      this.formData.tin3Code = arr[0].code;
      this.formData.tin2 = arr[0].commodityCategoryCode;
      this.handletin2(arr);
    },

    // 是否公开货源切换
    handleTin4() {
      console.log('获取货集吗');

      if (this.formData.tin4 && this.tin6_Option.length) return;
      const query = {
        shipmentCode: this.formData.tin1
      };
      listStockcode(query).then(res => {
        this.tin6_Option = res.rows.map(e => {
          return { dictValue: e.cargoCodeQR, dictLabel: e.cargoCodeName };
        });
        console.log('获取货集吗', this.tin6_Option);
      });
    },

    async onSubmit(form) {
      this.$refs[form].validate(async(valid) => {
        if (valid) {
          const address1 =
            (this.$refs.address1 &&
              (await this.$refs.address1._submitForm())) ||
            [];
          const address2 =
            (this.$refs.address2 &&
              (await this.$refs.address2._submitForm())) ||
            [];

          let goodsAccounting;
          let accounTing;
          let arrs;

          let orderFreightBoList = []; // 运费规则Bo
          let orderGoodsList = []; // 货源商品信息_1
          let orderSpecifiedList = []; // 货源指定接单人表

          const driverInfoCode = this.formData.tin5_2.map((driverInfoCode) => {
            return {
              driverInfoCode: driverInfoCode.code,
              teamInfoCode: '',
              userType: 2
            };
          });

          const teamInfoCode = this.formData.tin5_1.map((teamInfoCode) => {
            return {
              driverInfoCode: '',
              teamInfoCode: teamInfoCode.code,
              userType: 1
            };
          });
          orderSpecifiedList = driverInfoCode.concat(teamInfoCode);

          // <!-- isMultiGoods true->多商品 ; false->单商品 -->
          if (this.isMultiGoods) {
            const promisArr = this.formData.tin2_1.map(async(e) => {
              return {
                ...((this.$refs[e][0] &&
                  (await this.$refs[e][0]._submitForm())) ||
                  {}),
                goodsTypeName: e
              };
            });
            arrs = await Promise.all(promisArr);



            // 多商品核算规则多个
            orderFreightBoList = arrs.map((accounTing) => {
              return {
                balanceRuleCode: accounTing.ruleItemId + '',
                'goodsBigType': '1', // ??
                'goodsType': '1', // ??
                'orderGoodsCode': '1',
                ruleItemValue: '', // ??
                type: 0 // ??
              };
            });


            orderGoodsList = arrs.map((e) => {
              return {
                addressList: [...address1, ...address2],
                'balanceRuleCode': '1', // ??
                goodsBigType: this.formData.tin2 + '',
                goodsType: this.formData.tin2_1 + '',
                goodsUnit: '1', // 多商品没有 计量单位
                isModifyFinish: true, // 平台是否完成调价?? 啥东西
                isOneselfLoad: this.formData.tin9 - 0, // 是否允许自装 0否 1是 (多装模式)?? 啥东西
                isOneselfUnload: this.formData.tin8 - 0,
                limitWastage: '1', // 限制损耗?? 啥东西
                perWeight: 0, // 最高配载 多商品无此选项??
                priceWastage: 0, // 路耗超出范围 赔偿单价 （元/吨）?? 啥东西
                shipmentPrice: e.shipmentPrice - 0,
                'totalType': '0',
                vehicleLength: e.vehicleLength + '',
                vehicleType: e.vehicleType + '',
                weight: 0, // 货物重量 多商品无此选项??
                goodsPrice: e.goodsPrice // ??
              };
            });
          } else {
            goodsAccounting =
              (this.$refs.goodsAccounting &&
                (await this.$refs.goodsAccounting._submitForm())) ||
              {};
            accounTing =
              (this.$refs.accounTing &&
                (await this.$refs.accounTing._submitForm())) ||
              {};

            // console.log(goodsAccounting, accounTing);


            // 单商品核算规格
            // console.log('组件放回的-------------', goodsAccounting);
            // console.log('组件放回的', accounTing);

            orderFreightBoList = [
              {
                balanceRuleCode: accounTing.ruleItemId + '',
                'goodsBigType': this.formData.tin2 + '', // ??
                'goodsType': this.formData.tin2_2 + '', // ??
                'orderGoodsCode': '1',
                ruleItemValue: '1', // ??
                type: 0 // ??
              }
            ];
            // 单商品信息
            orderGoodsList = [
              {
                addressList: [...address1, ...address2],
                'balanceRuleCode': accounTing.ruleItemId + '',
                goodsBigType: this.formData.tin2 + '',
                goodsType: this.formData.tin2_2 + '',
                goodsUnit: goodsAccounting.goodsUnit + '',
                // isModifyFinish: true, // 平台是否完成调价?? 啥东西
                // isOneselfLoad: false, // 是否允许自装 0否 1是 (多装模式)?? 啥东西
                // isOneselfUnload: false, // 是否允许自卸 0否 1是 (多卸模式)
                // 'limitWastage': '1', // 限制损耗?? 啥东西
                perWeight: goodsAccounting.perWeight - 0,
                priceWastage: 0, // 路耗超出范围 赔偿单价 （元/吨）?? 啥东西
                shipmentPrice: goodsAccounting.shipmentPrice - 0,
                vehicleLength: goodsAccounting.vehicleLength + '',
                vehicleType: goodsAccounting.vehicleType + '',
                weight: goodsAccounting.weight,
                totalType: goodsAccounting.weightType + '',
                goodsPrice: goodsAccounting.goodsPrice // ??
              }
            ];
          }



          const data = {
            classList: [
              {
                classCode: this.formData.tin6 ? this.formData.tin6 : ''// 未获取
              }
            ],
            isPublic: this.formData.tin4,
            isSpecified: this.formData.tin5,
            loadType: this.formData.tin7 - 0, // loadType	装卸类型 1.一装一卸 2.多装一卸 3.一装多卸 4.多装多卸

            orderFreightBoList,
            orderGoodsList,
            orderSpecifiedList,

            projectCode: this.formData.tin3Code + '', // 项目编码
            pubilshCode: this.formData.tin1,
            remark: this.formData.remark
          };



          console.log('运费规则Bo', orderFreightBoList);
          console.log('货源商品信息_1', orderGoodsList);
          console.log('货源指定接单人表', orderSpecifiedList);
          console.log('全部', data);



          orderPubilsh(data).then((response) => {
            console.log(response);
            this.msgSuccess('新增成功');
          });
        } else {
          return false;
        }
      });
    },

    // 监听小类多商品??
    handletin2_1() {
      this.tin2_1tabs = this.formData.tin2_1.map((e) => {
        let obj = null;

        this.tin2_1Option.forEach((obje) => {
          if (obje.dictValue === e) {
            obj = obje;
          }
        });
        return {
          label: obj.dictLabel,
          value: obj.dictValue,
          data: {}
        };
      });

      // 初始赋值
      this.tin2_1tabs_activeName = this.tin2_1tabs[0].value;
    },

    // 4. 获取小类
    handletin2(arr) {
      const item = this._zhaovalue(this.goodsBigTypeOptions, this.formData.tin2);

      listByDict({
        'dictPid': item.dictCode,
        'dictType': 'goodsType'
      }).then((response) => {
        this.tin2_1Option = response.data;

        // 回填时候
        if (!arr) return;
        if (this.isMultiGoods) {
          this.formData.tin2_1 = arr[0].commoditySubclassCodes.split(',');
          this.formData.tin2_2 = undefined;
          this.handletin2_1();
        } else {
          this.formData.tin2_1 = [];
          this.formData.tin2_2 = arr[0].commoditySubclassCodes;
        }
      });
    },

    // 1-1 打开调度者页面
    open1() {
      this.open = true;
      this.title = '指定接单人';
      // TODO回填
      console.log(this.formData.tin5_1);
      console.log(this.formData.tin5_2);
    },
    // 1-2 获取选中的数组
    handleSelectionChange(obj, bool) {
      if (bool) {
        this.formData.tin5_1 = obj['listInfo'] || [];
        this.formData.tin5_2 = obj['listDriver'] || [];

        if (this.formData.tin5_1.length > 1) {
          this.msgInfo('调度者只能选择一个');
          return;
        }
        this.open = false;
        this.title = '';
      } else {
        this.open = false;
        this.title = '';
      }
    },
    // 1. 远程搜索 ok
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        // 获取代理用户表
        listShipment({ adminName: query, pageNum: 1, pageSize: 10 }).then((res) => {
          this.shipmentList = res.rows;
          console.log('获取代理用户表', this.shipmentList);
          this.loading = false;
        });
      } else {
        this.shipmentList = [];
      }
    },

    // 工具
    // 根据value匹配数组中的一项
    _zhaovalue(arr, value) {
      return arr.filter((e) => {
        return e.dictValue === value;
      })[0];
    },

    // 包装成
    _baozhuan(arr, dictValue, dictLabel) {
      return arr.map((e) => {
        return {
          ...e,
          dictValue: e[dictValue],
          dictLabel: e[dictLabel]
        };
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

.footer-box{
  padding: 20px 0;
  line-height: 26px;
  color: #ccc;
  text-align: right;
}
</style>
