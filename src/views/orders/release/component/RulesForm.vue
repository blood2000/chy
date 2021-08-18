<template>
  <div>
    <el-form
      :ref="`formData`"
      :inline="false"
      :model="formData"
      :rules="rules"
      :size="formConfig.size"
      :label-width="formConfig.labelWidth"
      :label-position="formConfig.labelPosition"
      :disabled="myisdisabled"
    >

      <!-- 文本框 -->
      <template v-for="(item,index) in resettingData">
        <el-form-item
          v-if="item.showType === '1'"
          :key="index"
          :prop="item.myName"
          :label="item.cnName"
          :rules="[
            { required: true, message: `请输入${item.cnName}`, trigger: 'blur' },
          ]"
        >
          <el-input-number
            v-model="formData[item.myName]"
            :controls="false"
            :max="999999"
            :min="0"
            :precision="2"
            :step="0.01"
            :placeholder="`请输入${item.cnName}`"
            controls-position="right"
            :style="{ width: '200px' }"
            @change="change"
          />
        </el-form-item>
        <!-- 下拉框 -->
        <el-form-item
          v-if="item.showType === '3'"
          :key="index"
          :prop="item.myName"
          :label="item.cnName"
          :rules="[
            { required: true, message: `请输入${item.cnName}`, trigger: 'change' },
          ]"
        >
          <el-select v-model="formData[item.myName]" :placeholder="`请输入${item.cnName}`" :style="{ width: '200px' }" @change="$forceUpdate()">
            <el-option
              v-for="(dict,index1) in item.Option"
              :key="dict.dictValue + index1"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>

        <!-- 单选 -->
        <el-form-item v-if="item.showType === '4'" :key="index" :prop="item.myName" :label="item.cnName">
          <el-radio-group
            v-model="formData[item.myName]"
            size="medium"
            :rules="[
              { required: true, message: `请输入${item.cnName}`, trigger: 'change' },
            ]"
            @change="$forceUpdate()"
          >
            <el-radio
              v-for="(dict, index2) in item.Option"
              :key="dict.dictValue + index2"
              :label="dict.dictValue"
            >{{ dict.dictLabel }}</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 区间 -->
        <div v-if="item.showType === '2'" :key="index" class="ly-flex">

          <el-form-item
            :prop="item.myName+'_0'"
            :label="item.cnName"
            :rules="[
              { required: true, message: '请输入起始值', trigger: 'blur' },
            ]"
          >
            <span> - </span>
            <el-input-number
              v-model="formData[item.myName+'_0']"
              :controls="false"
              :placeholder="`请输入${item.cnName}`"
              step-strictly
              :min="item.unit==='%'?0: 0"
              :max="item.unit==='%'?100: 999999"
              :precision="precisionMethod(item.unit,unit )"
              :step="0.001"
              controls-position="right"
              :style="{ width: '150px' }"
              @change="change"
            />
            <span class="ml0 mr10">{{ unit }}</span>
          </el-form-item>
          <!-- <el-form-item label-width="50" label="至" /> -->
          <div style="line-height: 34px;margin:0 10px">至</div>
          <el-form-item
            :prop="item.myName+'_1'"
            label-width="0"
            :rules="[
              { required: true, message: '请输入结束值', trigger: 'blur' },
            ]"
          >
            <el-input-number
              v-model="formData[item.myName+'_1']"
              :controls="false"
              :placeholder="`请输入${item.cnName}`"
              step-strictly
              :min="item.unit==='%'?0: 0"
              :max="item.unit==='%'?100: 999999"
              :precision="precisionMethod(item.unit,unit )"
              :step="0.001"
              controls-position="right"
              :style="{ width: '150px' }"
              @change="change"
            />
            <span class="ml0 mr10">{{ unit }}</span>
          </el-form-item>
        </div>

      </template>
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
    },
    myisdisabled: {
      type: Boolean,
      default: false
    },

    dataList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      formData: {},
      rules: {},
      resettingData: []

    };
  },

  computed: {
    unit() {
      let name = 'kg';
      const srcode = this.$store.state.orders.lossPlans;
      const lossPlans = Object.keys(srcode);
      let lossPlan = null;

      // 处理返回规则有这个路耗规则值就取这里
      if (lossPlans.length) {
        const rcode = this.dataList[0].ruleCode;
        lossPlans.forEach(e => {
          if (e === rcode) {
            lossPlan = srcode[e].ruleValue;
          }
        });
      }
      // LOSS_TOLERANCE 自接判断这个单位
      if (!lossPlan) {
        const filterLoss = this.dataList.filter(e => e.enName === 'LOSS_TOLERANCE');
        if (filterLoss && filterLoss[0].unit === '%') {
          lossPlan = 'DL';
        }
      }


      if (lossPlan === 'DL') {
        name = '%';
      } else {
        switch (this.$store.state.orders.orderStowageStatus) {
          case '0':
            name = 'kg';
            break;
          case '1':
            name = 'm³';
            break;
          case '2':
            name = '';
            break;
        }
      }


      return name;
    }
  },

  watch: {
    dataList: {
      handler(val) {
        this.resettingData = [];
        this.formData = {};
        this.initData();
      },
      immediate: true,
      deep: true
    }
  },


  methods: {
    async initData() {
      const arr = await Promise.all(this.getOption(this.dataList));

      arr.forEach(async e => {
        e.showType = e.showType + '';
        e.myName = 't_' + e.enName;
        if (e.showType !== '2') {
          this.formData[e.myName] = this.formData[e.myName] || e.ruleValue;
        } else {
          const num = this.formData[e.myName + '_0'] || (JSON.parse(e.ruleValue))[0];
          this.formData[e.myName + '_0'] = num < 0 ? -num : num;
          this.formData[e.myName + '_1'] = this.formData[e.myName + '_1'] || (JSON.parse(e.ruleValue))[1];
        }
      });

      this.resettingData = arr;
    },

    getOption(arr) {
      const M0_option = this.$store.state.orders.M0_option;
      return arr.map(async e => {
        if (e.dictCode && (e.showType === '3' || e.showType === '4')) {
          if (e.dictCode === 'M0') {
            if (M0_option && M0_option.length) {
              e.Option = M0_option;
            } else {
              const { data } = await this.getDicts(e.dictCode);
              e.Option = data;
            }
          } else {
            const { data } = await this.getDicts(e.dictCode);
            e.Option = data;
          }
        }


        return e;
      });
    },

    // 返回数据

    _submitForm() {
      // 取
      // this.resettingData.filter(e => {
      //   e.ruleValue = this.formData[e.myName];
      // });

      // 判断如果有未填的值
      // for (const key in this.formData) {
      //   if (Object.hasOwnProperty.call(this.formData, key)) {
      //     const element = this.formData[key];

      //     // console.log(element);
      //     if (!element) {
      //       console.log(this.$refs.formData);
      //       console.log(key);
      //       // this.$refs.formData.validateField([key]);
      //       // this.$refs['formData'].validate();
      //       // this.msgError('规则值必填');
      //     }
      //   }
      // }

      const arr = this.resettingData.map(e => {
        if (e.showType !== '2') {
          e.ruleValue = this.formData[e.myName];
        } else {
          e.ruleValue = JSON.stringify([this.formData[e.myName + '_0'] > 0 ? -this.formData[e.myName + '_0'] : this.formData[e.myName + '_0'], this.formData[e.myName + '_1']]);
        }
        return e;
      });

      console.log(this.resettingData);


      return new Promise((resolve, reject) => {
        this.$refs['formData'].validate((valid) => {
          if (valid) {
            resolve(arr);
          } else {
            return false;
          }
        });
      });
    },

    //
    change(value) {
      this.$forceUpdate();
      this._submitForm();
    },

    precisionMethod(unit1, unit) {
      let num = 2;
      if (unit1 === '%') {
        num = 2;
      } else if (unit === 'm³') {
        num = 2;
      }

      return num;
    }
  }

};
</script>
