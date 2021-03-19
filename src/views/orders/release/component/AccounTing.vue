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
      <div>
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


      </div>

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


    <!-- <template v-if="formData.ruleItemId !== '0'">
      <el-form-item label="免赔偿路耗规范">
        <div class="ui-flex">
          <el-form-item prop="startLimitWastage">
            <span class="pl-5 pr-5">-</span>
            <el-input-number
              v-model="formData.startLimitWastage"
              :controls="false"
              placeholder="-"
              step-strictly
              controls-position="right"
              :style="{ width: '120px' }"
            />
            <span class="pl-5 pr-5">吨</span>
          </el-form-item>

          <span class="m20 mr20">~</span>

          <el-form-item prop="endLimitWastage">
            <span class="pl-5 pr-5">+</span>
            <el-input-number
              v-model="formData.endLimitWastage"
              :controls="false"
              placeholder="-"
              step-strictly
              controls-position="right"
              :style="{ width: '120px' }"
            />
            <span class="pl-5 pr-5">吨</span>
          </el-form-item>

          <span class="pl-5 pr-5">（定额 定律 也计算）</span>
        </div>
      </el-form-item>

      <el-form-item label="过路费补贴(ETC)" prop="roadSubsidies">
        <span class="pl-5 pr-5">+</span>
        <el-input-number
          v-model="formData.roadSubsidies"
          :controls="false"
          placeholder="请输入过路费补贴金额"
          step-strictly
          controls-position="right"
          :style="{ width: '200px' }"
        />
        <span class="pl-5 pr-5">元</span>
      </el-form-item>
      <el-form-item label="装车费补贴" prop="loadCartSubsidies">
        <span class="pl-5 pr-5">+</span>
        <el-input-number
          v-model="formData.loadCartSubsidies"
          :controls="false"
          placeholder="请输入装车费补贴"
          step-strictly
          controls-position="right"
          :style="{ width: '200px' }"
        />
        <span class="pl-5 pr-5">元</span>
      </el-form-item>
      <el-form-item label="卸车费补贴" prop="unloadCartSubsidies">
        <span class="pl-5 pr-5">+</span>
        <el-input-number
          v-model="formData.unloadCartSubsidies"
          :controls="false"
          placeholder="请输入卸车费补贴"
          step-strictly
          controls-position="right"
          :style="{ width: '200px' }"
        />
        <span class="pl-5 pr-5">元</span>
      </el-form-item>
    </template>
    <template v-else>
      <el-form-item label="免赔偿路耗规范">
        <div class="ui-flex">
          <el-form-item prop="startLimitWastage">
            <span class="pl-5 pr-5">-</span>
            <el-input-number
              v-model="formData.startLimitWastage"
              :controls="false"
              placeholder="-"
              step-strictly
              controls-position="right"
              :style="{ width: '120px' }"
            />
            <span class="pl-5 pr-5">吨</span>
          </el-form-item>

          <span class="m20 mr20">~</span>

          <el-form-item prop="endLimitWastage">
            <span class="pl-5 pr-5">+</span>
            <el-input-number
              v-model="formData.endLimitWastage"
              :controls="false"
              placeholder="-"
              step-strictly
              controls-position="right"
              :style="{ width: '120px' }"
            />
            <span class="pl-5 pr-5">吨</span>
          </el-form-item>

          <span class="pl-5 pr-5">（定额 定律 也计算）</span>
        </div>
      </el-form-item>
    </template> -->

  </el-form>
</template>

<script>
import { listRules, getRules } from '@/api/enterprise/rules';

export default {
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
      allRules: []
    };
  },

  created() {
    this.initData();
  },

  methods: {
    // 获取
    async initData() {
      // const data = (await listRules()).data; // 没错

      // console.log(data);

      const data = [{
        'checkRuleItemCode': '1213', // 核算规则项表CODE
        'code': '12112356', // 货主编码
        'id': 0, // ??
        'isDel': true, // ??
        'ruleType': '', // 规则项类型 1.收入 2.支出
        'ruleValue': '煤炭专用规则1', // 规则项值 名称???
        'status': 0, // 状态 0.正常 1.关闭
        'updateCode': '',
        'updateTime': ''
      },
      {
        'checkRuleItemCode': '1213', // 核算规则项表CODE
        'code': '1511521356', // 货主编码
        'id': 2, // ??
        'isDel': true, // ??
        'ruleType': '', // 规则项类型 1.收入 2.支出
        'ruleValue': '煤炭专用规则2', // 规则项值 名称???
        'status': 0, // 状态 0.正常 1.关闭
        'updateCode': '',
        'updateTime': ''
      }];

      this.ruleItemIdOption = this._baozhuan(data, 'code', 'ruleValue');
    },

    // 交互
    // 选择规格
    async handleRuleItemId() {
      console.log(this.formData.ruleItemId); // ==> 通过这个code去请求列表

      // const data = (await listRules(this.formData.ruleItemId)).data; // 没错

      const data = [{
        add: '1', // 1 支出
        'cnName': '装车费',
        'code': '123465',
        'dictCode': 'abc', // 字典 这个有用 用来获取下拉值
        'id': 0,
        'isDel': true, // 是否删除??
        'showType': '1', // 规则项表现形式 1.文本框 2.区域 3.下拉框
        enName: 'tin1',
        value: '120'
      }, {
        add: '2', // 收入
        'cnName': '卸车费',
        'code': '12346515',
        'dictCode': 'abc88', // 字典 这个有用 用来获取下拉值
        'id': 0,
        'isDel': true, // 是否删除??
        'showType': '1', // 规则项表现形式 1.文本框 2.区域 3.下拉框
        enName: 'tin2',
        value: '150'
      }];

      data.forEach(e => {
        this.formData[e.enName] = e.value;
      });

      this.allRules = data;

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
