<template>
  <el-form
    :ref="`formData`"
    :model="formData"
    :rules="rules"
    :size="formConfig.size"
    :label-width="formConfig.labelWidth"
    :label-position="formConfig.labelPosition"
    :disabled="myisdisabled"
  >

    <div v-if="!showbudget" class="header mb8 mt8">费用信息</div>
    <el-form-item label="运费单价: " prop="freightPrice" label-width="90px">
      <el-row>
        <el-col :span="16" class="ly-flex">

          <el-input-number
            v-model="formData.freightPrice"
            :controls="false"
            :precision="2"
            :step="0.01"
            :placeholder="'请输入运费单价'"
            controls-position="right"
            :style="{ width: '200px' }"
            @change="handlerChange"
          />
          <span class="ml0 mr10"> 元 / {{ mygoodsUnitName }}</span>

          <div v-if="!showbudget" class="ml0 mr10 t_color_c t_m_pac">
            司机实收单价:  {{ totalTransportationCost || 0 }} 元
          </div>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="规则: "
            prop="ruleItemId"
            label-width="60px"
          >
            <el-select
              v-model="formData.ruleItemId"
              placeholder="请选择规则"
              clearable
              :style="{ width: '200px' }"
              @change="handleRuleItemId"
            >
              <el-option
                v-for="(dict, index) in ruleItemIdOption"
                :key="index"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item label="装--卸：" label-width="90px">
      <div>{{ redis.tin_name }}</div>
    </el-form-item>



    <template v-if="formData.ruleItemId">

      <el-row :gutter="20">
        <el-col :span="!showbudget? 14: 24">
          <div v-if="zichuList.length || shouruList.length" class="t_box_item">

            <!-- <el-form-item
              label="计算方式"
              prop="ruleDictValue"
              :rules="[
                { required: true, message: '选择计算方式', trigger: 'change' },
              ]"
            >
              <el-select
                v-model="formData.ruleDictValue"
                placeholder="选择抹计算方式"
                clearable
                :style="{ width: '200px' }"
              >
                <el-option
                  v-for="(dict, index1) in ruleFormulaOption"
                  :key="index1"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item> -->


            <!-- <div class="header mb8">路耗:</div>
            <RulesForm v-if="lossList.length" ref="lossList" :data-list="lossList" :myisdisabled="myisdisabled" /> -->

            <div v-if="zichuList.length" class="header mb8">扣费项目:</div>
            <RulesForm v-if="zichuList.length" ref="zichuList" :data-list="zichuList" :myisdisabled="myisdisabled" />

            <div v-if="shouruList.length" class="header mb8">补贴项目:</div>
            <RulesForm v-if="shouruList.length" ref="shouruList" :data-list="shouruList" :myisdisabled="myisdisabled" />


          </div>
        </el-col>
        <el-col v-if="myisdisabled && !showbudget && predictData" :span="10">
          <div class="t_box_item">
            <template v-if="predictData.totalEstimateMoney || predictData.totalTransportationCost || predictData.totalServiceFee">

              <div class="header mb8">总费用估</div>
              <el-row>
                <el-col :span="16">
                  <div class="mb10">货主实付金额 (总费用估): </div>
                  <div class="mb10 t_color_c">司机实收金额 (总费用估): </div>
                  <div class="mb10 t_color_c">平台服务费 (总费用估): </div>
                </el-col>
                <el-col :span="8">
                  <div class="mb10">{{ predictData.totalEstimateMoney || 0 }} 元</div>
                  <div class="mb10 t_color_c">{{ predictData.totalTransportationCost || 0 }} 元</div>
                  <div class="mb10 t_color_c">{{ predictData.totalServiceFee || 0 }} 元</div>
                </el-col>
              </el-row>
            </template>
            <div class="header mb8">单笔运费估</div>
            <el-row>
              <el-col :span="16">
                <div class="mb10">货主实付金额 (单笔运费估): </div>
                <div class="mb10 t_color_c">司机实收金额 (单笔运费估): </div>
                <div class="mb10 t_color_c">平台服务费 (单笔运费估): </div>
              </el-col>
              <el-col :span="8">
                <div class="mb10">{{ predictData.singleAllCost || 0 }} 元</div>
                <div class="mb10 t_color_c">{{ predictData.singleDriverCashReceived || 0 }} 元</div>
                <div class="mb10 t_color_c">{{ predictData.singleServiceFee || 0 }} 元</div>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>

    </template>

  </el-form>
</template>

<script>
import { getListRules, getRuleItem } from '@/api/enterprise/rules';
import { getDriverPrice } from '@/api/order/release.js';

import RulesForm from './RulesForm';

export default {
  name: 'AccounTing',
  components: { RulesForm },

  props: {
    formConfig: {
      type: Object,
      default: () => {
        return {
          size: 'medium',
          labelWidth: '120px',
          labelPosition: 'left'
        };
      }
    },
    redis: {
      type: Object,
      default: null
    },
    pubilshCode: {
      type: String,
      required: true
    },
    goodsUnitName: {
      type: String,
      required: true
    },
    totalTypeValue: {
      type: String,
      required: true
    },
    myisdisabled: {
      type: Boolean,
      default: false
    },
    goodsSubmitForm: {
      type: Function,
      default: () => {}
    },
    good: {
      type: Object,
      default: null
    },
    showbudget: {
      type: Boolean,
      default: false
    }

  },
  data() {
    return {
      jisuanRule: {}, // 计算的规则
      mygoodsUnitName: '', // 单位
      mytotalTypeValue: '', // 配载方式
      predictData: null, // 预估价格
      totalTransportationCost: '', // 司机实收单价
      ruleFreightPrice: [
        {
          'code': undefined,
          'ruleCode': undefined,
          'ruleDetailShipmentCode': undefined,
          'ruleItemCode': '17',
          'ruleValue': undefined,
          'type': null

        }
      ], // 运费单价(单独提取出来)
      claculationFormula: [
        {
          'code': undefined,
          'ruleCode': undefined,
          'ruleDetailShipmentCode': undefined,
          'ruleItemCode': '20',
          'ruleValue': undefined,
          'type': null

        }
      ], // 司机实收单价
      formData: {

        ruleItemId: '',

        freightPrice: undefined, // 运输单价
        ruleDictValue: '' // 计算公式

      },
      rules: {
        ruleItemId: [
          { required: true, message: '请选择核算规则', trigger: 'change' }
        ],
        freightPrice: [
          { required: true, message: '请输入运费单价', trigger: 'blur' }
        ]
      },

      // 字典
      ruleItemIdOption: [],
      M0Option: [],

      lossList: [],
      zichuList: [],
      shouruList: [],
      allRules: []
    };
  },

  computed: {
    isTotalTypeValue() {
      return this.mytotalTypeValue !== '1';
    }

  },

  watch: {
    goodsUnitName: {
      handler(value) {
        this.mygoodsUnitName = value;
      },
      immediate: true
    },
    totalTypeValue: {
      handler(value) {
        this.mytotalTypeValue = value;
      },
      immediate: true
    },

    '$store.state.orders.estimateCostData': {
      handler(value) {
        this.handlerEstimateCost(value);
      },
      deep: true
    },
    good: {
      handler(value) {
        if (!value || !value.goodsAccounting.totalType) return;
        this.mytotalTypeValue = value.goodsAccounting.totalType;
      },
      immediate: true
    },

    pubilshCode(value) {
      this.initData();
    },
    redis: {
      handler(value) {
        if (!value || !value.orderFreightVo) return;

        console.log(value);

        // 清空
        this.lossList = [];
        this.zichuList = [];
        this.shouruList = [];

        const { detailList, lossList } = value.orderFreightVo;

        this.formData.ruleItemId = value.ruleCode;

        const filterDetailList = detailList.filter(e => {
          if (e.enName === 'DRIVER_ACTUAL_PRICE') {
            this.totalTransportationCost = e.ruleValue;
          }

          if (e.enName === 'FREIGHT_COST') {
            this.formData.freightPrice = e.ruleValue;
          }

          if (e.enName === 'CALCULATION_FORMULA') {
            this.jisuanRule = e;
          }

          const bool = (e.enName === 'LOSS_PLAN' || e.enName === 'LOSS_RULE' || e.enName === 'CALCULATION_FORMULA' || e.enName === 'FREIGHT_COST' || e.enName === 'DRIVER_ACTUAL_PRICE');

          return !bool;
        });

        this.setData(filterDetailList, lossList);
      },
      immediate: true

    }

  },

  created() {
    this.initData();
    // 获取抹零规则的字典
    this.getDict();

    const estimateCostData = this.$store.state.orders.estimateCostData;
    estimateCostData && this.handlerEstimateCost(estimateCostData);
  },

  methods: {
    // 获取司机成交单价
    async handlerChange() {
      if (!(this.formData.freightPrice || this.formData.freightPrice === 0)) return;

      try {
        const data = await getDriverPrice({
          shipperCode: this.pubilshCode,
          price: this.formData.freightPrice
        });
        this.totalTransportationCost = data.data;
      } catch (error) {
        this.msgError('司机实收单价获取失败, 请重新输入运费单价');
      }
    },

    // 获取
    async initData() {
      if (!this.pubilshCode) return;

      try {
        const data = (await getListRules({ shipperCode: this.pubilshCode })).data;
        this.ruleItemIdOption = this._baozhuan(data, 'code', 'name');
      } catch (error) {
        // this.initData();
      }
    },

    // 交互
    // 选择规格
    async handleRuleItemId() {
      if (!this.formData.ruleItemId) return;
      this.lossList = [];
      this.zichuList = [];
      this.shouruList = [];

      const { detailList, lossList } = (await getRuleItem({
        code: this.formData.ruleItemId
      })).data;



      const filterDetailList = detailList.filter(e => {
        if (e.enName === 'CALCULATION_FORMULA') {
          this.jisuanRule = e;
        }
        const bool = (e.enName === 'LOSS_PLAN' || e.enName === 'LOSS_RULE' || e.enName === 'CALCULATION_FORMULA');

        return !bool;
      });

      // console.log(filterDetailList, '处理完的规则');


      this.setData(filterDetailList, lossList);
    },

    // 赋值
    setData(detailList, lossList) {
      // this.lossList = lossList;


      detailList.forEach(e => {
        if (e.type + '' === '1') {
          this.shouruList.push(e);
        } else {
          this.zichuList.push(e);
        }
      });
    },

    async _submitForm() {
      return new Promise((resolve, reject) => {
        this.$refs['formData'].validate(async(valid) => {
          if (valid) {
            // 报ruleValue undefined 说明 单价或计算公式未放到细则里面
            (this.ruleFreightPrice[0].ruleValue = this.formData.freightPrice);
            (this.ruleFreightPrice[0].ruleCode = this.formData.ruleItemId);
            (this.claculationFormula[0].ruleValue = this.totalTransportationCost);
            (this.claculationFormula[0].ruleCode = this.formData.ruleItemId);

            const shouruList = this.$refs.shouruList ? (await this.$refs.shouruList._submitForm()) : [];
            const zichuList = this.$refs.zichuList ? (await this.$refs.zichuList._submitForm()) : [];

            const obj = {
              orderFreightBoList: await [...this.ruleFreightPrice, ...shouruList, ...zichuList, ...this.claculationFormula, ...[this.jisuanRule]].map(e => {
                return {
                  'code': e.code,
                  'ruleCode': e.ruleCode,
                  'ruleDetailShipmentCode': e.code,
                  'ruleItemCode': e.ruleItemCode,
                  'ruleValue': e.ruleValue,
                  'type': e.type,
                  'unit': e.unit || undefined
                };
              })
            };

            resolve({ ...obj, ruleDictValue: this.formData.ruleDictValue });
          } else {
            return false;
          }
        });
      });
    },

    // 处理预估值
    async handlerEstimateCost(data) {
      const { orderEstimateCostBoList } = data;

      orderEstimateCostBoList.forEach(e => {
        if (e.goodsIdentification === this.good.goodsType) {
          e.orderAddressBoList.forEach(ee => {
            const addresCodes = ee.addressIdentification.split(':');
            const arr = this.good.newRedis || this.good.redis;

            arr.forEach(redi => {
              if (addresCodes[0] === redi.identification + '' || addresCodes[1] === redi.identification + '' || addresCodes[0] === redi.code || addresCodes[1] === redi.code) {
                this.predictData = ee;
              }
            });
          });
        }
      });
    },



    // 获取字典
    getDict() {
      this['M0Option'] = this.$store.state.orders.M0_option;
      return;
    },

    // 根据value匹配数组中的一项
    _zhaovalue(arr, value) {
      return (arr.filter(e => {
        return e.dictValue === value;
      }))[0];
    },

    // 包装成
    _baozhuan(arr, dictValue, dictLabel) {
      return arr.map(e => {
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
.ui-flex {
  display: flex;
  align-items: center;
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
    background-color: #000000;
  }
}
.t_box_item{
  padding: 15px 0 15px 15px;
  background-color: #f2f2f2;
}
.t_color_c{
  color:#aaaaaa;
}
.t_m_pac{
  padding: 0 15px;
  background-color: #f2f2f2;
}
</style>
