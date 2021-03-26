<template>
  <div>
    <el-form
      :ref="`formData`"
      :model="formData"
      :rules="rules"
      :size="formConfig.size"
      :label-width="formConfig.labelWidth"
      :label-position="formConfig.labelPosition"
    >
      <el-form-item label="运输单价" prop="shipmentPrice">
        <el-input-number
          v-model="formData.shipmentPrice"
          :controls="false"
          placeholder="运输单价"
          step-strictly
          controls-position="right"
          :style="{ width: '50%' }"
        />
        <span class="pl-5">车/吨(不含税)</span>
      </el-form-item>

      <el-form-item label="货物单价" prop="goodsPrice">
        <el-input-number
          v-model="formData.goodsPrice"
          :controls="false"
          placeholder="货物单价"
          step-strictly
          controls-position="right"
          :style="{ width: '50%' }"
        />
        <span class="pl-5">元/吨</span>
      </el-form-item>

      <el-form-item label="车型" prop="vehicleType">
        <el-select
          v-model="formData.vehicleType"
          placeholder="选择车型"
          clearable
          filterable
          :style="{ width: '100%' }"
        >
          <el-option
            v-for="dict in [
              { dictValue: '0', dictLabel: '车型1' },
              { dictValue: '1', dictLabel: '车型2' },
            ]"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="车长" prop="vehicleLength">
        <el-select
          v-model="formData.vehicleLength"
          placeholder="选择车长"
          clearable
          filterable
          :style="{ width: '100%' }"
        >
          <el-option
            v-for="dict in [
              { dictValue: '0', dictLabel: '车长1' },
              { dictValue: '1', dictLabel: '车长2' },
            ]"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>

      <!-- 规则 -->
      <el-form-item label="核算规则" prop="ruleItemId">
        <el-select
          v-model="formData.ruleItemId"
          placeholder="煤炭专用规则"
          clearable
          filterable
          :style="{ width: '100%' }"
        >
          <el-option
            v-for="dict in [
              { dictValue: '0', dictLabel: '煤炭专用规则' },
              { dictValue: '1', dictLabel: '规则2' },
            ]"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        label="过路费补贴(ETC)"
        prop="roadSubsidies"
        label-width="130px"
      >
        <span class="pl-5 pr-5">+</span>
        <el-input-number
          v-model="formData.roadSubsidies"
          :controls="false"
          placeholder="请输入过路费补贴金额"
          step-strictly
          controls-position="right"
          :style="{ width: '120px' }"
        />
        <span class="pl-5 pr-5">元</span>
      </el-form-item>
      <el-form-item
        label="装车费补贴"
        prop="loadCartSubsidies"
        label-width="130px"
      >
        <span class="pl-5 pr-5">+</span>
        <el-input-number
          v-model="formData.loadCartSubsidies"
          :controls="false"
          placeholder="请输入装车费补贴金额"
          step-strictly
          controls-position="right"
          :style="{ width: '120px' }"
        />
        <span class="pl-5 pr-5">元</span>
      </el-form-item>
      <el-form-item
        label="卸车费补贴"
        prop="unloadCartSubsidies"
        label-width="130px"
      >
        <span class="pl-5 pr-5">+</span>
        <el-input-number
          v-model="formData.unloadCartSubsidies"
          :controls="false"
          placeholder="请输入卸车费补贴金额"
          step-strictly
          controls-position="right"
          :style="{ width: '120px' }"
        />
        <span class="pl-5 pr-5">元</span>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    formConfig: {
      type: Object,
      default: () => {
        return {
          size: 'medium',
          labelWidth: '110px',
          labelPosition: 'left'
        };
      }
    }
  },

  data() {
    return {
      formData: {
        shipmentPrice: undefined,
        goodsPrice: undefined,
        vehicleType: undefined,
        vehicleLength: undefined,
        ruleItemId: undefined,
        roadSubsidies: undefined,
        loadCartSubsidies: undefined,
        unloadCartSubsidies: undefined
      },
      rules: {
        // goodsUnit: [{ required: true,  message: '请选择货物计量单位',  trigger: 'change' }],
      }
    };
  },

  methods: {
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
    }
  }
};
</script>

