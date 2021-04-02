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

          <div style="marginRight:20px;">{{ redis.tin_name }}</div>

          <el-input-number
            v-model="formData.freightPrice"
            :controls="false"
            :placeholder="'请输入运费单价'"
            step-strictly
            controls-position="right"
            :style="{ width: '100px' }"
          />

          <span class="ml0 mr10"> 元 / {{ goodsUnitName }}</span>

          <div v-if="!showbudget" class="ml0 mr10 t_color_c t_m_pac">
            司机实收单价:  47.5 元
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
              placeholder="煤炭专用规则"
              clearable
              :style="{ width: '200px' }"
              @change="handleRuleItemId"
            >
              <el-option
                v-for="dict in ruleItemIdOption"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form-item>



    <template v-if="formData.ruleItemId">

      <el-row :gutter="20">
        <el-col :span="!showbudget? 14: 24">
          <div class="t_box_item">

            <el-form-item
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
            </el-form-item>


            <div class="header mb8">路耗:</div>
            <RulesForm v-if="lossList.length" ref="lossList" :data-list="lossList" :myisdisabled="myisdisabled" />

            <div class="header mb8">补贴项目:</div>
            <RulesForm v-if="shouruList.length" ref="shouruList" :data-list="shouruList" :myisdisabled="myisdisabled" />

            <div class="header mb8">扣费项目:</div>

            <!-- <el-form-item
              label="抹零"
              prop="m0DictValue"
              :rules="[
                { required: true, message: '选择抹零方式', trigger: 'change' },
              ]"
            >
              <el-select
                v-model="formData.m0DictValue"
                placeholder="选择抹零方式"
                clearable
                :style="{ width: '120px' }"
              >
                <el-option
                  v-for="(dict, index1) in M0Option"
                  :key="index1"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item> -->

            <RulesForm v-if="zichuList.length" ref="zichuList" :data-list="zichuList" :myisdisabled="myisdisabled" />

          </div>
        </el-col>
        <el-col v-if="!showbudget" :span="10">
          <div class="t_box_item">
            <template v-if="isTotalTypeValue">

              <div class="header mb8">总费用估</div>
              <el-row>
                <el-col :span="16">
                  <div class="mb10">货主实付金额 (总费用估): </div>
                  <div class="mb10 t_color_c">司机实收金额 (总费用估): </div>
                  <div class="mb10 t_color_c">平台服务费 (总费用估): </div>
                </el-col>
                <el-col :span="8">
                  <div class="mb10">230000 元</div>
                  <div class="mb10 t_color_c">23525 元</div>
                  <div class="mb10 t_color_c">1475 元</div>
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
                <div class="mb10">230000 元</div>
                <div class="mb10 t_color_c">23525 元</div>
                <div class="mb10 t_color_c">1475 元</div>
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
import { estimateCost } from '@/api/order/release.js';

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
      ruleFreightPrice: [], // 运费单价(单独提取出来)
      claculationFormula: [], // 计算规则(单独提取出来)
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
      ruleFormulaOption: [],

      // allRules
      lossList: [],
      zichuList: [],
      shouruList: [],
      allRules: []
    };
  },

  computed: {
    isTotalTypeValue() {
      console.log(this.totalTypeValue);

      return this.totalTypeValue !== '1';
    }
  },

  watch: {
    pubilshCode(value) {
      this.initData();
    },
    redis: {
      handler(value) {
        console.log(value);
        if (!value || !value.orderFreightVo) return;
        // 清空
        this.lossList = [];
        this.zichuList = [];
        this.shouruList = [];

        const { detailList, lossList } = value.orderFreightVo;
        console.log(value.ruleCode);

        this.formData.ruleItemId = value.ruleCode;


        // 运费单价
        const filterDetailList = [];

        detailList.forEach(e => {
          if (e.enName === 'FREIGHT_COST') {
            this.ruleFreightPrice = [e];
            this.formData.freightPrice = e.ruleValue;
            // this.formData.ruleItemId = e.
          } else if (e.enName === 'CALCULATION_FORMULA') {
            this.claculationFormula = [e];
            this.formData.ruleDictValue = e.ruleValue;
          } else {
            filterDetailList.push(e);
          }
        });

        // this.ruleFreightPrice = detailList.filter(e => {
        //   return e.enName === 'FREIGHT_COST';
        // });
        // console.log(this.ruleFreightPrice);


        // this.formData.freightPrice = this.ruleFreightPrice[0].ruleValue;
        this.setData(filterDetailList, lossList);
      },
      immediate: true

    }

  },

  created() {
    this.initData();
    // 获取抹零规则的字典

    this.getDict();
  },

  methods: {
    // 获取
    async initData() {
      if (!this.pubilshCode) return;

      const data = (await getListRules({ shipperCode: this.pubilshCode })).data;


      this.ruleItemIdOption = this._baozhuan(data, 'code', 'name');
    },

    // 交互
    // 选择规格
    async handleRuleItemId() {
      this.lossList = [];
      this.zichuList = [];
      this.shouruList = [];

      const { detailList, lossList, ruleInfo } = (await getRuleItem({
        code: this.formData.ruleItemId
      })).data;

      // 这里处理预估值
      // 计算公式的值 ruleInfo.ruleDictValue

      this.handlerEstimateCost({ detailList, lossList, ruleInfo });




      /* 假数据
      const detailList = [
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
      ];
      const lossList = [
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
      ];*/


      // this.formData.ruleDictValue = ruleInfo.ruleDictValue;

      // 运费单价

      // this.ruleFreightPrice = detailList.filter(e => {
      //   return e.enName === 'FREIGHT_COST';
      // });

      const filterDetailList = [];

      detailList.forEach(e => {
        if (e.enName === 'FREIGHT_COST') {
          this.ruleFreightPrice = [e];
          this.formData.freightPrice = e.ruleValue;
        } else if (e.enName === 'CALCULATION_FORMULA') {
          this.claculationFormula = [e];
          this.formData.ruleDictValue = e.ruleValue;
        } else {
          filterDetailList.push(e);
        }
      });

      this.setData(filterDetailList, lossList);
    },

    // 赋值
    setData(detailList, lossList) {
      this.lossList = lossList;


      detailList.forEach(e => {
        if (e.type + '' === '2') {
          this.zichuList.push(e);
        } else {
          this.shouruList.push(e);
        }
      });
    },

    async _submitForm() {
      return new Promise((resolve, reject) => {
        this.$refs['formData'].validate(async(valid) => {
          if (valid) {
            this.ruleFreightPrice[0].ruleValue = this.formData.freightPrice;
            this.claculationFormula[0].ruleValue = this.formData.ruleDictValue;
            const lossList = await this.$refs.lossList._submitForm();
            const shouruList = await this.$refs.shouruList._submitForm();
            const zichuList = await this.$refs.zichuList._submitForm();

            const obj = {
              orderFreightBoList: await [...this.ruleFreightPrice, ...lossList, ...shouruList, ...zichuList, ...this.claculationFormula].map(e => {
                return {
                  'code': e.code,
                  'ruleCode': e.ruleCode,
                  'ruleDetailShipmentCode': e.code,
                  'ruleItemCode': e.ruleItemCode,
                  'ruleValue': e.ruleValue,
                  'type': e.type

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
    async handlerEstimateCost({ detailList, lossList }) {
      return;
      const orderFreightBoList = [...detailList, ...lossList].map(e => {
        return {
          code: e.code,
          ruleCode: e.ruleCode,
          ruleItemCode: e.ruleItemCode,
          ruleValue: e.ruleValue,
          type: e.type
          // ruleDetailShipmentCode: ''
        };
      });

      const arrdata = await this.goodsSubmitForm();

      const goodsItem = arrdata.filter(e => {
        return e.dictCode === this.good.dictCode;
      });

      console.log(goodsItem[0]);


      const { orderGood } = goodsItem[0];
      console.log(this.good);

      /* TODO 商品的code 没有? 地址的code没有   ruleDetailShipmentCode 是什么??*/
      const qData = {
        orderFreightBoList,
        // 重商品Info中拿
        number: orderGood.number || undefined,
        // orderAddressCode: '',
        orderGoodsCode: this.goods ? this.goods.code : undefined,
        stowageStatus: orderGood.stowageStatus,
        userCode: this.pubilshCode,
        vehicleMaxWeight: orderGood.vehicleMaxWeight,
        weight: orderGood.weight
      };

      const data = await estimateCost(qData);

      console.log(data);
    },



    // 获取字典
    getDict() {
      const dictName = ['M0', 'ruleFormula'];

      dictName.forEach(e => {
        this.getDicts(e).then(res => {
          this[e + 'Option'] = res.data;
        });
      });
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
