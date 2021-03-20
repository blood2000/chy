<template>
  <el-form
    :ref="`formData`"
    :model="formData"
    :rules="rules"
    :size="formConfig.size"
    :label-width="formConfig.labelWidth"
    :label-position="formConfig.labelPosition"
  >
    <el-form-item label="核算规则" prop="ruleItemId">
      <el-select
        v-model="formData.ruleItemId"
        placeholder="煤炭专用规则"
        clearable
        :style="{ width: '100%' }"
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


    <template v-if="formData.ruleItemId">

      <RulesForm :data-list="lossList" />
      <!-- 路耗列表 -->
      <!-- <div>
        <div>计算路耗</div>
        <el-divider />



        <el-form-item prop="tin1" label="计算方式">
          <el-radio-group v-model="formData.tin1">
            <el-radio
              v-for="dict in [
                {dictValue:'0', dictLabel:'定额(kg/车)'},
                {dictValue:'0', dictLabel:'定率(%o/车)'},
              ]"
              :key="dict.dictValue"
              :label="parseInt(dict.dictValue)"
            >{{ dict.dictLabel }}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item prop="tin2" label="容忍值">
          <el-input-number
            v-model="formData.tin2"
            :controls="false"
            placeholder="-"
            step-strictly
            controls-position="right"
            :style="{ width: '120px' }"
          />
        </el-form-item>
        <el-form-item prop="tin3" label="规则">
          <el-select v-model="formData.tin3" clearable>
            <el-option
              v-for="dict in []"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>


      </div> -->

      <!-- 细项列表 -->
      <div v-for="item in allRules" :key="item.code">
        <div>
          <div>{{ item.add === '1'?`关于增项(费用支出)`:`关于增项(费用收入出)` }}</div>
          <el-divider />
          <!-- 文本框 -->
          <el-form-item v-if="item.showType === '1'" prop="tin4" :label="item.cnName">
            <el-input-number
              v-model="formData[item.enName]"
              :controls="false"
              :placeholder="`请输入${item.cnName}`"
              step-strictly
              controls-position="right"
              :style="{ width: '120px' }"
            />
          </el-form-item>
          <!-- 下拉框 -->
          <el-form-item v-if="item.showType === '3'" prop="tin3" :label="item.cnName">
            <el-select v-model="formData[item.enName]" clearable :placeholder="`请输入${item.cnName}`">
              <el-option
                v-for="dict in []"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
          <!-- 文本域 -->
          <el-form-item v-if="item.showType === '2'" prop="tin3" :label="item.cnName">
            <el-input
              v-model="formData[item.enName]"
              :placeholder="`请输入${item.cnName}`"
              type="textarea"
              :rows="2"
            />
          </el-form-item>
        </div>
      </div>
    </template>

  </el-form>
</template>

<script>
import { getListRules, getRuleItem } from '@/api/enterprise/rules';

import RulesForm from './RulesForm';

export default {
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
    pubilshCode: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      formData: {

        ruleItemId: '',

        startLimitWastage: undefined,
        endLimitWastage: undefined,
        roadSubsidies: undefined,
        loadCartSubsidies: undefined,
        unloadCartSubsidies: undefined
      },
      rules: {
        ruleItemId: [
          { required: false, message: '请选择货物计量单位', trigger: 'change' }
        ]
      },

      // 字典
      ruleItemIdOption: [],

      // allRules
      lossList: [],
      allRules: []
    };
  },

  watch: {
    pubilshCode(value) {
      this.initData();
    }
  },

  created() {
    this.initData();
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
      // console.log(this.formData.ruleItemId); // ==> 通过这个code去请求列表
      const quer = {
        code: this.formData.ruleItemId
      };

      const { detailList, lossList, ruleInfo } = (await getRuleItem(quer)).data; // 没错

      console.log(lossList);

      this.lossList = lossList;

      // console.log(data);
      return;

      data.forEach(e => {
        if (e.showType === 2) {
          this.formData['tin_' + e.enName + '__1'] = (JSON.parse(e.ruleValue))[0];
          this.formData['tin_' + e.enName + '__2'] = (JSON.parse(e.ruleValue))[1];
        } else {
          this.formData['tin_' + e.enName] = e.ruleValue;
        }
        e.enName = 'tin_' + e.enName;
        if (e.showType === 3 || e.showType === 4) {
          // 先获取字典

          this.getDicts(e.dictCode).then(res => {
            e.arrOptin = res;
          });
        }
      });


      this.arr1 = data.filter(e => {
        return e.type === '1';
      });


      this.arr2 = data.filter(e => {
        return e.type === '2';
      });

      console.log(this.arr1, this.arr2);

      // data.forEach(e => {
      //   this.formData[e.enName] = e.value;
      // });

      // this.allRules = data;

      // this.ruleItemIdOption = this._baozhuan(data, 'code', 'ruleValue');
    },

    _submitForm() {
      return new Promise((resolve, reject) => {
        this.$refs['formData'].validate((valid) => {
          if (valid) {
            resolve(this.formData);
          } else {
            return false;
          }
        });
      });
    },
    // 工具

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
</style>
