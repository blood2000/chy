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
      <div v-if="true">
        <div>计算路耗</div>
        <el-divider />
        <el-form-item prop="tin1" label="计算方式">
          <el-radio-group v-model="formData.tin1">
            <el-radio
              v-for="dict in [
                {dictValue:'0', dictLabel:'定额(kg/车)'},
                {dictValue:'1', dictLabel:'定率(%o/车)'},
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
              v-for="dict in [
                {dictValue: 0,dictLabel: 1}
              ]"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>

      </div>

      <el-divider />

      <div v-if="arr1.length">关于增项(费用支出)</div>

      <div v-for="(item, index) in arr1" :key="index">
        <el-form-item v-if="item.showType == '1'" :prop="item.enName" :label="item.cnName">
          <el-input-number
            v-model="formData[item.enName]"
            :controls="false"
            :placeholder="`请输入${item.cnName}`"
            step-strictly
            controls-position="right"
            :style="{ width: '120px' }"
          />
        </el-form-item>

        <el-form-item v-if="item.showType == '3'" :prop="item.enName" :label="item.cnName">
          <el-select v-model="formData[item.enName]" clearable :placeholder="`请输入${item.cnName}`">
            <el-option
              v-for="dict in item.arrOptin"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>

        <div v-if="item.showType == '2'" class="ly-flex">

          <el-form-item :prop="item.enName+'__1'" :label="item.cnName">
            <el-input-number
              v-model="formData[item.enName+'__1']"
              :controls="false"
              :placeholder="`请输入${item.cnName}`"
              step-strictly
              controls-position="right"
              :style="{ width: '120px' }"
            />
          </el-form-item>

          <el-form-item :prop="item.enName+'__2'">
            <el-input-number
              v-model="formData[item.enName+'__2']"
              :controls="false"
              :placeholder="`请输入${item.cnName}`"
              step-strictly
              controls-position="right"
              :style="{ width: '120px' }"
            />
          </el-form-item>
        </div>

        <el-form-item v-if="item.showType == '4'" :label="item.cnName" :prop="item.enName">
          <el-radio-group v-model="formData[item.enName]" size="medium">
            <el-radio
              v-for="dict in item.arrOptin"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{ dict.dictLabel }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>

      <div v-if="arr2.length">关于增项(费用收入)</div>

      <div v-for="(item, index) in arr2" :key="index">
        <el-form-item v-if="item.showType == '1'" :prop="item.enName" :label="item.cnName">
          <el-input-number
            v-model="formData[item.enName]"
            :controls="false"
            :placeholder="`请输入${item.cnName}`"
            step-strictly
            controls-position="right"
            :style="{ width: '120px' }"
          />
        </el-form-item>

        <el-form-item v-if="item.showType == '3'" :prop="item.enName" :label="item.cnName">
          <el-select v-model="formData[item.enName]" clearable :placeholder="`请输入${item.cnName}`">
            <el-option
              v-for="dict in item.arrOptin"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>

        <div v-if="item.showType == '2'" class="ly-flex">

          <el-form-item :prop="item.enName+'__1'" :label="item.cnName">
            <el-input-number
              v-model="formData[item.enName+'__1']"
              :controls="false"
              :placeholder="`请输入${item.cnName}`"
              step-strictly
              controls-position="right"
              :style="{ width: '120px' }"
            />
          </el-form-item>

          <el-form-item :prop="item.enName+'__2'">
            <el-input-number
              v-model="formData[item.enName+'__2']"
              :controls="false"
              :placeholder="`请输入${item.cnName}`"
              step-strictly
              controls-position="right"
              :style="{ width: '120px' }"
            />
          </el-form-item>
        </div>

        <el-form-item v-if="item.showType == '4'" :label="item.cnName" :prop="item.enName">
          <el-radio-group v-model="formData[item.enName]" size="medium">
            <el-radio
              v-for="dict in item.arrOptin"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{ dict.dictLabel }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>

      <el-divider />

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
import { getListRules, getRuleItem } from '@/api/enterprise/rules';

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
      allRules: [],
      arr1: [],
      arr2: []
    };
  },
  watch: {
    pubilshCode: {
      handler(newName, oldName) {
        newName && this.initData();
      },
      // 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法
      immediate: true
    }
  },

  methods: {
    // 获取
    async initData() {
      const query = {
        shipmentCode: this.pubilshCode
      };

      const data = (await getListRules(query)).data.list;

      this.ruleItemIdOption = this._baozhuan(data, 'code', 'name');
    },

    // 交互
    // 选择规格
    async handleRuleItemId() {
      // console.log(this.formData.ruleItemId); // ==> 通过这个code去请求列表
      // console.log(123);

      // if (!this.formData.ruleItemId) return;
      const query = {
        ruleCode: this.formData.ruleItemId
      };

      const data = (await getRuleItem(query)).data.list;


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
    },

    _submitForm() {
      return new Promise((resolve, reject) => {
        this.$refs['formData'].validate((valid) => {
          if (valid) {
            resolve(
              {
                ...this.formData


              });
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
