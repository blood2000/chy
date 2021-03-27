<template>
  <el-form
    :ref="`formData`"
    :model="formData"
    :rules="rules"
    :size="formConfig.size"
    :label-width="formConfig.labelWidth"
    :label-position="formConfig.labelPosition"
  >

    <div class="header mb8 mt8">费用信息</div>
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
            :style="{ width: '50%' }"
          />

          <span class="ml0"> 元 / {{ goodsUnitName }}</span>
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
        <RulesForm v-if="lossList.length" ref="lossList" :data-list="lossList" />

        <div class="header mb8">补贴项目:</div>
        <RulesForm v-if="shouruList.length" ref="shouruList" :data-list="shouruList" />

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

        <RulesForm v-if="zichuList.length" ref="zichuList" :data-list="zichuList" />

      </div>
    </template>

  </el-form>
</template>

<script>
import { getListRules, getRuleItem } from '@/api/enterprise/rules';

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
    }

  },
  data() {
    return {
      ruleFreightPrice: [], // 运费单价(单独提取出来)
      formData: {

        ruleItemId: '',

        freightPrice: undefined, // 运输单价
        m0DictValue: '', // 摸零
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

  watch: {
    pubilshCode(value) {
      this.initData();
    },
    redis: {
      handler(value) {
        console.log(value);

        if (!value || !value.orderFreightVo) return;

        this.lossList = [];
        this.zichuList = [];
        this.shouruList = [];

        const { detailList, lossList } = value.orderFreightVo;
        this.formData.ruleDictValue = value.ruleDictValue || 0;
        this.formData.ruleItemId = value.ruleInfoShipmentCode || 11;

        // 运费单价

        this.ruleFreightPrice = detailList.filter(e => {
          return e.enName === 'FREIGHT_COST';
        });

        this.formData.freightPrice = this.ruleFreightPrice[0].ruleValue;
        this.setData(detailList, lossList);
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

      // const dd = [{
      //   'code': '8c844a2e7ac340359c2bb41e7bd645b1',
      //   'createCode': '',
      //   'createTime': '',
      //   'deduction': '',
      //   'id': 0,
      //   'isDel': true,
      //   'name': '平台通用规则',
      //   'platformType': 0,
      //   'ruleDictValue': '',
      //   'shipperCode': '',
      //   'subsidies': '',
      //   'updateCode': '',
      //   'updateTime': ''
      // }];

      const data = (await getListRules({ shipperCode: this.pubilshCode })).data;


      this.ruleItemIdOption = this._baozhuan(data, 'code', 'name');

      // 回填有值情况

      // this.formData.ruleItemId = this.redis ? this.redis.ruleInfoShipmentCode : '';
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


      this.formData.ruleDictValue = ruleInfo.ruleDictValue;

      // 运费单价

      this.ruleFreightPrice = detailList.filter(e => {
        return e.enName === 'FREIGHT_COST';
      });

      this.formData.freightPrice = this.ruleFreightPrice[0].ruleValue;
      this.setData(detailList, lossList);
    },

    // 赋值
    setData(detailList, lossList) {
      this.lossList = lossList;

      detailList = detailList.filter(e => {
        return e.enName !== 'FREIGHT_COST';
      });

      detailList.forEach(e => {
        if (e.type + '' === '2') {
          this.zichuList.push(e);
        } else {
          this.shouruList.push(e);
        }
      });
    },

    async _submitForm() {
      this.ruleFreightPrice[0].ruleValue = this.formData.freightPrice;

      return new Promise((resolve, reject) => {
        this.$refs['formData'].validate(async(valid) => {
          if (valid) {
            const lossList = await this.$refs.lossList._submitForm();
            const shouruList = await this.$refs.shouruList._submitForm();
            const zichuList = await this.$refs.zichuList._submitForm();

            const obj = {
              orderFreightBoList: await [...this.ruleFreightPrice, ...lossList, ...shouruList, ...zichuList].map(e => {
                return {
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
</style>
