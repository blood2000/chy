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
      <el-form-item label="货物计量单位" prop="goodsUnit">
        <el-select
          v-model="formData.goodsUnit"
          placeholder="请选择货物计量单位"
          clearable
          :style="{ width: '100%' }"
        >
          <el-option
            v-for="dict in formDataList.measurementType"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="配载(货物)总量" prop="weightType">
        <el-radio-group v-model="formData.weightType" size="medium">
          <el-radio label="1">不限(长期货源)</el-radio>

          <el-radio label="2">
            <el-form-item
              prop="weight"
              style="display: inline-block"
              :rules="[
                {
                  required: formData.weightType === '2',
                  message: '请输入货物重量(吨)',
                  trigger: 'blur',
                },
              ]"
            >
              <span class="pr-5">共</span>
              <el-input-number
                v-model="formData.weight"
                :disabled="formData.weightType === '1'"
                :controls="false"
                :placeholder="`请输入重量(${goodsUnitName})`"
                step-strictly
                controls-position="right"
                :style="{ width: '120px' }"
              />
              <span class="pl-5">{{ goodsUnitName }}</span>
            </el-form-item>
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="最高配载" prop="perWeight">
        <el-input-number
          v-model="formData.perWeight"
          :controls="false"
          placeholder="请输入最高配载"
          step-strictly
          controls-position="right"
          :style="{ width: '50%' }"
        />
        <span class="pl-5">{{ goodsUnitName }}</span>
      </el-form-item>

      <el-form-item label="运输单价" prop="shipmentPrice">
        <el-input-number
          v-model="formData.shipmentPrice"
          :controls="false"
          placeholder="运输单价"
          step-strictly
          controls-position="right"
          :style="{ width: '50%' }"
        />
        <span class="pl-5">元/{{ goodsUnitName }}(不含税)</span>
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
        <span class="pl-5">元/{{ goodsUnitName }}</span>
      </el-form-item>

      <el-form-item label="车型" prop="vehicleType">
        <el-select
          v-model="formData.vehicleType"
          placeholder="选择车型"
          multiple
          :multiple-limit="1"
          clearable
          :style="{ width: '100%' }"
        >
          <el-option
            v-for="(item, index1) in formDataList.vehicleClassification"
            :key="index1"
            :label="item.dictLabel"
            :value="item.dictValue"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="车长" prop="vehicleLength">
        <el-select
          v-model="formData.vehicleLength"
          placeholder="选择车长"
          :multiple-limit="3"
          multiple
          clearable
          :style="{ width: '100%' }"
        >
          <el-option
            v-for="(item, index1) in formDataList.vehicleLength"
            :key="index1"
            :label="item.dictLabel"
            :value="item.dictValue"
          />
        </el-select>
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
          labelWidth: '120px',
          labelPosition: 'left'
        };
      }
    }
  },

  data() {
    return {
      formData: {
        goodsUnit: '0', // 货物计量单位 0=>吨; 1=>立方米
        weightType: '1', // 货物总量类型 是不限
        weight: undefined, // 货物重量
        perWeight: undefined, // 最高配载
        shipmentPrice: undefined, // 运输单价
        goodsPrice: undefined, // 货物单价
        vehicleType: [], // 车型->查字典
        vehicleLength: [] // 车长->查字典
      },
      rules: {
        goodsUnit: [
          { required: true, message: '请选择货物计量单位', trigger: 'change' }
        ],
        shipmentPrice: [
          { required: true, message: '请输入运输单价', trigger: 'blur' }
        ],
        goodsPrice: [
          { required: true, message: '请输入货物单价', trigger: 'blur' }
        ],

        weightType: [
          { required: true, message: '请输入货物单价', trigger: 'blur' }
        ],
        perWeight: [
          { required: true, message: '请输入货物单价', trigger: 'blur' }
        ]

      },
      // 字典类放这里
      formDataList: {
        measurementType: [],
        vehicleClassification: [],
        vehicleLength: []
      }
    };
  },

  computed: {
    goodsUnitName() {
      let name = '';
      this.formDataList.measurementType.forEach(e => {
        if (e.dictValue === this.formData.goodsUnit) {
          name = e.dictLabel;
        }
      });
      console.log(name);

      return name;
    }
  },

  created() {
    // 获取字典型
    this.getDicts('measurementType').then((response) => {
      this.formDataList.measurementType = response.data;
    });
    this.getDicts('vehicleClassification').then((response) => {
      this.formDataList.vehicleClassification = response.data;
    });
    this.getDicts('vehicleLength').then((response) => {
      this.formDataList.vehicleLength = response.data;
    });
  },

  methods: {
    _submitForm() {
      return new Promise((resolve, reject) => {
        this.$refs['formData'].validate((valid) => {
          if (valid) {
            resolve({
              ...this.formData,
              vehicleType: this.formData.vehicleType.join(','),
              vehicleLength: this.formData.vehicleLength.join(',')
            });
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
