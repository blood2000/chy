<template>
  <el-form :ref="`formData`" :model="formData" :rules="rules" :size="formConfig.size" :label-width="formConfig.labelWidth" :label-position="formConfig.labelPosition">
    <el-form-item label="核算规则" prop="ruleItemId">
      <el-select v-model="formData.ruleItemId" placeholder="煤炭专用规则" clearable :style="{width: '100%'}">
        <el-option label="煤炭专用规则" :value="1" />
        <el-option label="规则2" :value="2" />
      </el-select>
    </el-form-item>


    <el-form-item label="免赔偿路耗规范">
      <div class="ui-flex">
        <el-form-item prop="startLimitWastage">
          <span class="pl-5 pr-5">-</span>
          <el-input-number v-model="formData.startLimitWastage" placeholder="" step-strictly controls-position="right" :style="{width: '120px'}" />
          <span class="pl-5 pr-5">吨</span>
        </el-form-item>
        <el-form-item prop="endLimitWastage">
          <span class="pl-5 pr-5">+</span>
          <el-input-number v-model="formData.endLimitWastage" placeholder="" step-strictly controls-position="right" :style="{width: '120px'}" />
          <span class="pl-5 pr-5">吨</span>
        </el-form-item>

        <span class="pl-5 pr-5">（定额 定律 也计算）</span>
      </div>
    </el-form-item>

    <el-form-item label="过路费补贴(ETC)" prop="roadSubsidies">
      <span class="pl-5 pr-5">+</span>
      <el-input-number v-model="formData.roadSubsidies" placeholder="请输入过路费补贴金额" step-strictly controls-position="right" :style="{width: '120px'}" />
      <span class="pl-5 pr-5">元</span>
    </el-form-item>
    <el-form-item label="装车费补贴" prop="loadCartSubsidies">
      <span class="pl-5 pr-5">+</span>
      <el-input-number v-model="formData.loadCartSubsidies" placeholder="请输入装车费补贴金额" step-strictly controls-position="right" :style="{width: '120px'}" />
      <span class="pl-5 pr-5">元</span>
    </el-form-item>
    <el-form-item label="卸车费补贴" prop="unloadCartSubsidies">
      <span class="pl-5 pr-5">+</span>
      <el-input-number v-model="formData.unloadCartSubsidies" placeholder="请输入卸车费补贴金额" step-strictly controls-position="right" :style="{width: '120px'}" />
      <span class="pl-5 pr-5">元</span>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    formConfig: {
      type: Object,
      default: () => {
        return {
          'size': 'medium',
          'labelWidth': '120px',
          'labelPosition': 'left'
        };
      }
    }
  },
  data() {
    return {
      formData: {
        ruleItemId: 1,
        startLimitWastage: 0,
        endLimitWastage: 0,
        roadSubsidies: 0,
        loadCartSubsidies: 0,
        unloadCartSubsidies: 0
      },
      rules: {
        ruleItemId: [{ required: true, message: '请选择货物计量单位', trigger: 'change' }]
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


<style lang="scss" scoped>

.ui-flex{
    display: flex;
    align-items: center;
}
</style>
