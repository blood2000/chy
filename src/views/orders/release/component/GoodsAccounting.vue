<template>
  <div>
    <el-form
      :ref="`formData`"
      :model="formData"
      :rules="rules"
      :size="formConfig.size"
      :label-width="formConfig.labelWidth"
      :label-position="formConfig.labelPosition"
      :disabled="myisdisabled"
    >

      <el-form-item label="业务类型" prop="businessType">
        <el-select
          v-model="formData.businessType"
          placeholder="请选择业务类型"
          clearable
          :style="{ width: '150px' }"
        >
          <el-option
            v-for="(dict,index) in formDataList.businessTypeOption"
            :key="index"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>

      <el-row :gutter="10">
        <el-col :span="10">
          <el-form-item label="配载方式" prop="stowageStatus" style="minWidth:500px;">
            <el-radio-group v-model="formData.stowageStatus" size="medium">
              <el-radio
                v-for="dict in [
                  { dictValue: '0', dictLabel: '吨数配载' },
                  { dictValue: '1', dictLabel: '方数配载' },
                  { dictValue: '2', dictLabel: '车数配载' }]"
                :key="dict.dictValue"
                :label="dict.dictValue"
              >{{ dict.dictLabel }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item v-if="formData.stowageStatus !== '2'" label="重量/体积" prop="totalType" style="minWidth:500px;">
            <el-radio-group v-model="formData.totalType" size="medium">
              <el-radio label="1">不限(长期货源)</el-radio>

              <el-radio label="2">
                <el-form-item
                  prop="weight"
                  style="display: inline-block"
                  :rules="[
                    {
                      required: formData.totalType === '2',
                      message: `请输入货物重量(${goodsUnitName})`,
                      trigger: 'blur',
                    },
                    { validator: _myValidator, required: formData.totalType === '2', trigger: 'blur' }
                  ]"
                >
                  <span class="pr-5">共</span>
                  <el-input-number
                    v-model="formData.weight"
                    :disabled="formData.totalType === '1'"
                    :controls="false"
                    :placeholder="`请输入重量(${goodsUnitName})`"
                    :max="999999"
                    :min="0"
                    controls-position="right"
                    :style="{ width: '150px' }"
                  />
                  <span class="pl-5">{{ goodsUnitName }}</span>
                </el-form-item>
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>

      </el-row>

      <el-row :gutter="10">
        <el-col :span="10">
          <el-form-item v-if="formData.stowageStatus !== '2'" label="最高配载" prop="vehicleMaxWeight">
            <el-input-number
              v-model="formData.vehicleMaxWeight"
              :controls="false"
              placeholder="请输入最高配载"
              :max="999999"
              :min="0"
              controls-position="right"
              :style="{ width: '150px' }"
            />
            <span class="pl-5">{{ goodsUnitName }}</span>
          </el-form-item>

          <el-form-item v-else label="承运次数" prop="number">
            <el-input-number
              v-model="formData.number"
              :controls="false"
              placeholder="请输入承运次数"
              step-strictly
              :max="999999"
              :min="1"
              controls-position="right"
              :style="{ width: '150px' }"
            />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="货物单价" prop="goodsPrice">
            <el-input-number
              v-model="formData.goodsPrice"
              :controls="false"
              placeholder="货物单价"
              :precision="2"
              :step="0.01"
              :max="999999"
              :min="0"
              controls-position="right"
              :style="{ width: '150px' }"
            />
            <span class="pl-5">元/{{ goodsUnitName }}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="50">
        <el-col :span="10">
          <el-form-item label="车型" prop="vehicleType">
            <el-select
              v-model="formData.vehicleType"
              placeholder="选择车型"
              multiple
              :multiple-limit="3"
              clearable
              filterable
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
        </el-col>
        <el-col :span="10">
          <el-form-item label="车长" prop="vehicleLength" label-width="40px">
            <el-select
              v-model="formData.vehicleLength"
              placeholder="选择车长"
              :multiple-limit="3"
              multiple
              clearable
              filterable
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
        </el-col>
      </el-row>

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
          labelWidth: '90px',
          labelPosition: 'right'
        };
      }
    },
    cbData: {
      type: Object,
      default: null
    },
    myisdisabled: {
      type: Boolean,
      default: false
    },
    nowGoods: {
      type: Object,
      default: null
    }
  },

  data() {
    var validatePass = (rule, value, callback) => {
      handlerValidate(value, '请输入货物单价', callback);
    };
    var validatePass2 = (rule, value, callback) => {
      handlerValidate(value, '请输入最高配载', callback);
    };

    var handlerValidate = (value, smg, callback) => {
      if (!value) {
        this.$emit('validatePass', this.nowGoods.activeName);
        callback(new Error(smg));
      } else {
        callback();
      }
    };


    return {
      formData: {
        businessType: '1002996', // 业务类型
        stowageStatus: '0', // 配载方式
        number: undefined, // 车数
        // goodsUnit: '0', // 货物计量单位 0=>吨; 1=>立方米
        totalType: '1', // 货物总量类型 1是不限 2是要填具体的值
        weight: undefined, // 货物重量 当totalType = 2 时 ==> 才有值存在
        vehicleMaxWeight: undefined, // 最高配载
        // shipmentPrice: undefined, // 运输单价
        goodsPrice: undefined, // 货物单价
        vehicleType: [], // 车型->查字典
        vehicleLength: [] // 车长->查字典
      },
      rules: {
        businessType: [
          { required: false, message: '', trigger: 'change' }
        ],
        stowageStatus: [
          { required: true, message: '', trigger: 'change' }
        ],
        totalType: [
          { required: true, message: '', trigger: 'change' }
        ],
        number: [
          { required: true, message: '请输入车数', trigger: 'blur' }
        ],
        goodsPrice: [
          { validator: validatePass, required: true, trigger: 'blur' }
        ],
        vehicleMaxWeight: [
          { validator: validatePass2, required: true, trigger: 'blur' }
        ]

      },
      // 字典类放这里
      formDataList: {
        businessTypeOption: [],
        vehicleClassification: [],
        vehicleLength: []
      }
    };
  },

  computed: {
    goodsUnitName() {
      let name = '吨';
      switch (this.formData.stowageStatus) {
        case '0':
          name = '吨';
          break;
        case '1':
          name = '立方';
          break;
        case '2':
          name = '车';
          break;
      }
      this.$emit('getGoodsUnitName', name);
      return name;
    }
  },

  watch: {
    cbData: {
      handler(value) {
        if (!value || JSON.stringify(value) === '{}') return;
        const {
          businessType,
          stowageStatus,
          // goodsUnit,
          totalType,
          weight,
          vehicleMaxWeight,
          shipmentPrice,
          goodsPrice,
          number,
          vehicleType,
          vehicleLength } = value;

        this.formData = {
          businessType,
          stowageStatus: stowageStatus || '0',
          // goodsUnit,
          number,
          totalType: totalType,
          weight,
          vehicleMaxWeight,
          shipmentPrice,
          goodsPrice,
          vehicleType: vehicleType ? vehicleType.split(',') : undefined, // 车型->查字典
          vehicleLength: vehicleLength ? vehicleLength.split(',') : undefined // 车长->查字典
        };
      },
      immediate: true
    },
    'formData.totalType': {
      handler(value) {
        if (value === '1') {
          this.formData.weight = undefined;
        }
        this.$emit('totalTypeValue', value);
      },
      immediate: true
    },
    'formData.stowageStatus'(val) {
      if (val + '' === '2') {
        this.formData.vehicleMaxWeight = '0';
      } else {
        this.formData.number = undefined;
      }
    }
  },

  created() {
    // 获取字典型
    this.getDicts('businessTypes').then((response) => {
      this.formDataList.businessTypeOption = response.data;
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
    },
    _myValidator(rule, value, callback) {
      if (value <= 0) {
        callback(new Error('请输入大于0的值'));
      } else {
        callback();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
