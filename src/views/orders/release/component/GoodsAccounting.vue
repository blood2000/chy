<template>
  <div>
    <el-form :ref="`formData`" :model="formData" :rules="rules" :size="formConfig.size" :label-width="formConfig.labelWidth" :label-position="formConfig.labelPosition">
      <el-form-item label="货物计量单位" prop="goodsUnit">
        <el-select v-model="formData.goodsUnit" placeholder="请选择货物计量单位" clearable :style="{width: '100%'}">
          <el-option label="吨" :value="1" />
          <el-option label="立方米" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="货物总量" prop="weight">
        <el-radio-group v-model="formData.weightType" size="medium">
          <el-radio :label="0">不限(长期货源)</el-radio>

          <el-radio :label="1">
            共 <el-input-number v-model="formData.weight" placeholder="请输入重量(吨)" step-strictly controls-position="right" :style="{width: '120px'}" />  吨
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="最高配载" prop="perWeight">
        <el-input-number v-model="formData.perWeight" placeholder="请输入最高配载(吨/方)" step-strictly controls-position="right" :style="{width: '50%'}" /> <span>吨/方</span>
      </el-form-item>

      <el-form-item label="运输单价" prop="shipmentPrice">
        <el-input-number v-model="formData.shipmentPrice" placeholder="运输单价" step-strictly controls-position="right" :style="{width: '50%'}" /> <span>元/吨(不含税)</span>
      </el-form-item>

      <el-form-item label="货物单价" prop="goodsPrice">
        <el-input-number v-model="formData.goodsPrice" placeholder="货物单价" step-strictly controls-position="right" :style="{width: '50%'}" /> <span>元/吨</span>
      </el-form-item>

      <el-form-item label="车型" prop="vehicleType">
        <el-select v-model="formData.vehicleType" placeholder="选择车型" clearable :style="{width: '100%'}">
          <el-option label="车型1" :value="1" />
          <el-option label="车型2" :value="2" />
        </el-select>
      </el-form-item>

      <el-form-item label="车长" prop="vehicleLength">
        <el-select v-model="formData.vehicleLength" placeholder="选择车长" clearable :style="{width: '100%'}">
          <el-option label="车长1" :value="1" />
          <el-option label="车长2" :value="2" />
        </el-select>
      </el-form-item>

      <!-- <el-form-item label="车型车长限制">
                    <el-button @click="onSubmit">选择车型</el-button>
                    <el-button @click="onSubmit">选择用车类型</el-button>
                    <el-button @click="onSubmit">选择车长</el-button>
                    <el-button type="primary" @click="onSubmit">清除已选</el-button>
                </el-form-item>

                <el-form-item label="已选车型" prop="field154">
                    <el-input v-model="formData.field154" type="textarea" placeholder="无则 不限车型, 不限车长"
                    :autosize="{minRows: 4, maxRows: 4}" :style="{width: '100%'}" disabled></el-input>
                </el-form-item> -->
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
          'size': 'medium',
          'labelWidth': '110px',
          'labelPosition': 'left'
        };
      }
    }
  },

  data() {
    return {
      formData: {
        goodsUnit: 1,
        weightType: 0,
        weight: undefined,
        perWeight: undefined,
        shipmentPrice: 0,
        goodsPrice: 0,
        vehicleType: 1,
        vehicleLength: 1
      },
      rules: {
        goodsUnit: [{ required: true, message: '请选择货物计量单位', trigger: 'change' }],
        shipmentPrice: [{ required: true, message: '请输入运输单价', trigger: 'blur' }],
        goodsPrice: [{ required: true, message: '请输入货物单价', trigger: 'blur' }]
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

</style>
