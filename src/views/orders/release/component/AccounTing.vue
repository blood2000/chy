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
    <el-row type="flex" justify="space-between" class="ly-flex-w">

      <el-col :span="10" class="ly-flex-pack-justify" style="flex:1; min-width:750px;">
        <el-form-item label="运输单价: " prop="freightPrice" label-width="100px">
          <div class="ly-flex ly-flex-w">
            <div class="mr20">
              <div class="m_zhuanxieadderss ly-flex-align-center ly-flex-w">
                <span class="m_text m_zhuanghuo">{{ addressName[0] }}</span>
                <span class="m_style" />
                <span class="m_text m_xie">{{ addressName[1] }}</span>
              </div>
            </div>
            <div class="ly-flex">
              <el-input-number
                v-model="formData.freightPrice"
                :controls="false"
                :precision="2"
                :step="0.01"
                :max="999999"
                :min="0"
                :placeholder="'请输入运输单价'"
                controls-position="right"
                :style="{ width: '140px' }"
                @change="handlerChange"
              />
              <span class="ml0 mr10"> 元 / {{ mygoodsUnitName }}</span>

              <div v-if="false && !showbudget" class="ml0 mr10 t_color_c t_m_pac">
                司机实收单价:
                <span class="m_pac">{{ _floor(totalTransportationCost) || 0 }}</span>
                元 / {{ mygoodsUnitName }}
              </div>
            </div>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="10" style="width:500px;">
        <el-form-item
          label="规则: "
          prop="ruleItemId"
          label-width="60px"
          style="width:440px;"
        >
          <el-select
            v-model="formData.ruleItemId"
            placeholder="请选择规则"
            clearable
            style="width:100%;"
            @change="handleRuleItemId"
          >
            <el-option
              v-for="(dict, index) in ruleItemIdOption"
              :key="index"
              :label="dict.ruleFormula"
              :value="dict.dictValue"
            >
              <div>
                <span style="color: #c0c4cc; font-size: 13px">{{ dict.dictLabel }}</span>
                <div class="b">{{ dict.ruleFormula }}</div>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>

    </el-row>


    <template v-if="formData.ruleItemId">

      <el-row :gutter="20" :loading="loading">
        <el-col :span="!showbudget? 14: 24">
          <div v-if="zichuList.length || shouruList.length" class="t_box_item">

            <div v-if="zichuList.length" class="header mb8">扣费项目:</div>
            <RulesForm v-if="zichuList.length" ref="zichuList" :data-list="zichuList" :myisdisabled="myisdisabled" />

            <div v-if="shouruList.length" class="header mb8">补贴项目:</div>
            <RulesForm v-if="shouruList.length" ref="shouruList" :data-list="shouruList" :myisdisabled="myisdisabled" />


          </div>
        </el-col>
        <el-col v-if="!showbudget && predictData" :span="10">
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
                  <div class="mb10">{{ _floor(predictData.totalEstimateMoney) || 0 }} 元</div>
                  <div class="mb10 t_color_c">{{ _floor(predictData.totalTransportationCost) || 0 }} 元</div>
                  <div class="mb10 t_color_c">{{ _floor(predictData.totalServiceFee) || 0 }} 元</div>
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
                <div class="mb10">{{ _floor(predictData.singleAllCost) || 0 }} 元</div>
                <div class="mb10 t_color_c">{{ _floor(predictData.singleDriverCashReceived) || 0 }} 元</div>
                <div class="mb10 t_color_c">{{ _floor(predictData.singleServiceFee) || 0 }} 元</div>
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

import eventBus from '@/layout/components/global';


export default {
  name: 'AccounTing',
  components: { RulesForm },

  props: {
    formConfig: {
      type: Object,
      default: () => {
        return {
          size: 'medium',
          labelWidth: '130px',
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
    var freightPrice_validator = (rule, value, callback) => {
      if (!value) {
        if (this.good) {
          this.msgError(this.good.dictLabel + '的运费单价是必填的');
          this.$emit('showisweitian', this.good.activeName);
        } else {
          this.msgError('运费单价是必填的');
        }
        callback(new Error('请输入运费单价'));
      } else {
        callback();
      }
    };
    var ruleItemId_validator = (rule, value, callback) => {
      if (!value) {
        if (this.good) {
          this.msgError(this.good.dictLabel + '的核算规则是必填的');
          this.$emit('showisweitian', this.good.activeName);
        } else {
          this.msgError('核算规则是必填的');
        }
        callback(new Error('请选择核算规则'));
      } else {
        callback();
      }
    };
    return {
      $_ruleOhData: [], // 其他规则
      loading: false,
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
      ], // 运费单价
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
          { validator: ruleItemId_validator, required: true, trigger: 'change' }

        ],
        freightPrice: [
          { validator: freightPrice_validator, required: true, trigger: 'blur' }
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
    addressName() {
      return this.redis ? this.redis.tin_name.split('--') : [];
    },
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

        if (this.formData.ruleItemId && this.formData.ruleItemId !== value.ruleCode) return;

        this.lossList = [];
        this.zichuList = [];
        this.shouruList = [];

        const { detailList, lossList } = value.orderFreightVo;

        // 发布货源的时候给一个默认的

        // 注意 this.initData() 会在这之后再执行的l
        this.formData.ruleItemId = value.ruleCode;

        const filterDetailList = detailList.filter(e => {
          if (e.enName === 'DRIVER_ACTUAL_PRICE') {
            !this.totalTransportationCost && (this.totalTransportationCost = e.ruleValue);
          }

          if (e.enName === 'FREIGHT_COST') {
            !this.formData.freightPrice && (this.formData.freightPrice = e.ruleValue);

            if (this.$route.query.t === '3') {
              this.handlerChange();
            }
          }

          if (e.enName === 'CALCULATION_FORMULA') {
            (JSON.stringify(this.jisuanRule) === '{}') && (this.jisuanRule = e);
          }

          // 取路耗 亏吨方案
          if (e.enName === 'LOSS_PLAN') {
            // this.lossPlan = e;
            // 有可能是多个规则-> 谁下面的规则
            this.$store.commit('orders/SET_LOSS_PLAN', e);
          }


          const bool = (e.enName === 'LOSS_PLAN' || e.enName === 'LOSS_RULE' || e.enName === 'CALCULATION_FORMULA' || e.enName === 'FREIGHT_COST' || e.enName === 'DRIVER_ACTUAL_PRICE');

          return !bool;
        });

        this.$_ruleOhData = detailList.filter(e => {
          const bool = (e.enName === 'LOSS_PLAN' || e.enName === 'LOSS_RULE');
          return bool;
        }).map(e => {
          return {
            'code': e.code,
            'ruleCode': e.ruleCode,
            'ruleDetailShipmentCode': e.code,
            'ruleItemCode': e.ruleItemCode,
            'ruleValue': e.ruleValue,
            'type': e.type,
            'unit': e.unit || undefined
          };
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
      if (!this.formData.freightPrice || this.formData.freightPrice === 0) return;

      try {
        const data = await getDriverPrice({
          shipperCode: this.pubilshCode,
          price: this.formData.freightPrice
        });
        this.totalTransportationCost = data.data;
      } catch (error) {
        this.$confirm('请求超时, 点击确定重新获取', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.handlerChange();
        });
      }
    },

    // 获取
    async initData() {
      if (!this.pubilshCode) return;

      try {
        const data = (await getListRules({ shipperCode: this.pubilshCode })).data;
        this.ruleItemIdOption = this._baozhuan(data, 'code', 'name');
        // 最早获取到规则表 this.formData.ruleItemId platformType	平台类型 1.DDC平台 2.货主 触发 handleRuleItemId isDefault

        const rulesItem = this.ruleItemIdOption.filter(e => {
          return e.platformType === 2 && e.isDefault === 'Y';
        });

        if (rulesItem[0] && !this.formData.ruleItemId) {
          this.formData.ruleItemId = rulesItem[0].code;
          this.handleRuleItemId();
        }
      } catch (error) {
        this.$confirm('司机实收单价计算超时, 点击确定重新计算', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.initData();
        });
      }
    },

    // 选择规格
    async handleRuleItemId() {
      if (!this.formData.ruleItemId) return;
      this.lossList = [];
      this.zichuList = [];
      this.shouruList = [];
      this.loading = true;



      const { detailList, lossList } = (await getRuleItem({
        code: this.formData.ruleItemId
      })).data;
      this.loading = false;




      const filterDetailList = detailList.filter(e => {
        if (e.enName === 'CALCULATION_FORMULA') {
          this.jisuanRule = e;
        }
        if (e.enName === 'LOSS_PLAN') {
          // this.lossPlan = e;
          // 有可能是多个规则-> 谁下面的规则
          this.$store.commit('orders/SET_LOSS_PLAN', e);
        }
        const bool = (e.enName === 'LOSS_PLAN' || e.enName === 'LOSS_RULE' || e.enName === 'CALCULATION_FORMULA');

        return !bool;
      });

      this.$_ruleOhData = detailList.filter(e => {
        const bool = (e.enName === 'LOSS_PLAN' || e.enName === 'LOSS_RULE');
        return bool;
      }).map(e => {
        return {
          'code': e.code,
          'ruleCode': e.ruleCode,
          'ruleDetailShipmentCode': e.code,
          'ruleItemCode': e.ruleItemCode,
          'ruleValue': e.ruleValue,
          'type': e.type,
          'unit': e.unit || undefined
        };
      });


      this.setData(filterDetailList, lossList);

      // 改变规则, 去重新获取预估值
      eventBus.$emit('handlerRuleChang');
    },

    // 赋值
    setData(detailList, lossList) {
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
            if (this.redis && this.redis.orderFreightVo) {
              this.redis.orderFreightVo.detailList.forEach(e => {
                if (e.enName === 'DRIVER_ACTUAL_PRICE') {
                  e.ruleValue = this.totalTransportationCost;
                }
                if (e.enName === 'FREIGHT_COST') {
                  e.ruleValue = this.formData.freightPrice;
                }

                if (e.enName === 'CALCULATION_FORMULA') {
                  e = this.jisuanRule || e;
                }
              });
            }

            (this.ruleFreightPrice[0].ruleValue = this.formData.freightPrice);
            (this.ruleFreightPrice[0].ruleCode = this.formData.ruleItemId);
            (this.claculationFormula[0].ruleValue = this.totalTransportationCost);
            (this.claculationFormula[0].ruleCode = this.formData.ruleItemId);

            const shouruList = this.$refs.shouruList ? (await this.$refs.shouruList._submitForm()) : [];
            const zichuList = this.$refs.zichuList ? (await this.$refs.zichuList._submitForm()) : [];

            const obj = {
              orderFreightBoList: await ([...this.ruleFreightPrice, ...shouruList, ...zichuList, ...this.claculationFormula, ...[this.jisuanRule]].map(e => {
                return {
                  'code': e.code,
                  'ruleCode': e.ruleCode,
                  'ruleDetailShipmentCode': e.code,
                  'ruleItemCode': e.ruleItemCode,
                  'ruleValue': e.ruleValue,
                  'type': e.type,
                  'unit': e.unit || undefined
                };
              })).concat(this.$_ruleOhData)
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

      if (!this.good) return;

      // 如果(返回2条数据)
      orderEstimateCostBoList.forEach(e => {
        if (e.goodsIdentification === this.good.goodsType) {
          e.orderAddressBoList.forEach(ee => {
            const addresCodes = ee.addressIdentification.split(':');
            const arr = this.good.newRedis || this.good.redis;

            arr.forEach(redi => {
              if (this.redis.tin_name === redi.tin_name) {
                if ((addresCodes[0] === redi.identification + '' || addresCodes[1] === redi.identification + '') || (addresCodes[0] === redi.code || addresCodes[1] === redi.code)) {
                  this.predictData = ee;
                }
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
    },
    _floor(number) {
      return Math.round((number - 0) * Math.pow(10, 2)) / Math.pow(10, 2);
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
  // min-width: 570px;
  padding: 15px 0 15px 15px;
  background-color: #f2f2f2;
}
.t_color_c{
  color:#aaaaaa;
}
.t_m_pac{
  padding: 0 15px;
  background-color: #f2f2f2;
  .m_pac{
    color: #000;
  }
}

.m_zhuanxieadderss{

  .m_style{
    width: 28px;
    height: 4px;
    margin: 0 10px;
    background: linear-gradient(270deg, #409EFF 0%, rgba(64, 158, 255, 0) 100%);
    opacity: 1;
    border-radius: 2px;
  }
  .m_zhuanghuo{
    font-weight: 700;
    padding-left: 30px;
    background: url('~@/assets/images/order_zhuan.png') no-repeat 0px 9px;
    background-size: 22px 19px;
  }
  .m_xie{
      font-weight: 700;
      padding-left: 30px;
      background: url('~@/assets/images/order_xie.png') no-repeat 0px 9px;
      background-size: 22px 19px;
  }
}

.el-select-dropdown__item{
  height: 68px;
  line-height: 30px;
}
</style>
