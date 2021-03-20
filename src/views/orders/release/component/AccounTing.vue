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

    <el-divider />

    <template v-if="formData.ruleItemId">

      <div class="header mb8">路耗:</div>
      <!-- 路耗列表 -->
      <RulesForm v-if="lossList.length" ref="lossList" :data-list="lossList" />

      <el-divider />
      <div class="header mb8">补贴项目:</div>

      <RulesForm v-if="shouruList.length" ref="shouruList" :data-list="shouruList" />

      <el-divider />
      <div class="header mb8">扣费项目:</div>
      <RulesForm v-if="zichuList.length" ref="zichuList" :data-list="zichuList" />

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
          { required: true, message: '请选择核算规则', trigger: 'change' }
        ]
      },

      // 字典
      ruleItemIdOption: [],

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

      this.lossList = [];
      this.zichuList = [];
      this.shouruList = [];
      const quer = {
        code: this.formData.ruleItemId
      };

      const { detailList, lossList } = (await getRuleItem(quer)).data; // 没错

      this.lossList = lossList;

      detailList.forEach(e => {
        if (e.type === '2') {
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
            const lossList = await this.$refs.lossList._submitForm();
            const shouruList = await this.$refs.shouruList._submitForm();
            const zichuList = await this.$refs.zichuList._submitForm();

            console.log(lossList, 88888888);
            console.log(shouruList, 111111111111);
            console.log(zichuList, 22222222222);
            resolve([...lossList, ...shouruList, ...zichuList]);
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
</style>
