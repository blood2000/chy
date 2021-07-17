<template>
  <div>
    <el-form
      :ref="`formData`"
      :inline="true"
      :model="formData"
      :rules="rules"
      :size="formConfig.size"
      :label-width="formConfig.labelWidth"
      :label-position="formConfig.labelPosition"
      :disabled="myisdisabled"
    >

      <!-- 文本框 -->
      <div v-for="(item,index) in resettingData" :key="index" class="ly-flex">
        <el-form-item
          v-if="item.showType === '1'"
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
            :placeholder="`请输入${item.cnName}`"
            controls-position="right"
            :style="{ width: '200px' }"
          />
        </el-form-item>
        <!-- 下拉框 -->
        <el-form-item
          v-if="item.showType === '3'"
          :prop="item.myName"
          :label="item.cnName"
          :rules="[
            { required: true, message: `请输入${item.cnName}`, trigger: 'change' },
          ]"
        >
          <el-select v-model="formData[item.myName]" :placeholder="`请输入${item.cnName}`" :style="{ width: '200px' }" @change="change()">
            <el-option
              v-for="(dict,index1) in item.Option"
              :key="dict.dictValue + index1"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>

        <!-- 单选 -->
        <el-form-item v-if="item.showType === '4'" :prop="item.myName" :label="item.cnName">
          <el-radio-group
            v-model="formData[item.myName]"
            size="medium"
            :rules="[
              { required: true, message: `请输入${item.cnName}`, trigger: 'change' },
            ]"
            @change="change()"
          >
            <el-radio
              v-for="(dict, index2) in item.Option"
              :key="dict.dictValue + index2"
              :label="dict.dictValue"
            >{{ dict.dictLabel }}</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 区间 -->
        <div v-if="item.showType === '2'" class="ly-flex-align-center">

          <el-form-item
            :prop="item.myName+'_0'"
            :label="item.cnName"
            :rules="[
              { required: true, message: '请输入起始值', trigger: 'blur' },
            ]"
          >
            <!-- <span v-if="formData[item.myName+'_0'] !== 0"> - </span> -->
            <el-input-number
              v-model="formData[item.myName+'_0']"
              :controls="false"
              :placeholder="`请输入${item.cnName}`"
              step-strictly
              :max="item.unit==='%'?100: 0"
              :min="item.unit==='%'?0: -999999"
              :precision="0"
              controls-position="right"
              :style="{ width: '150px' }"
            />
            <span class="ml0 mr10">{{ unit }}</span>
          </el-form-item>
          <el-form-item>至</el-form-item>
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
              :max="item.unit==='%'?100: 999999"
              :min="item.unit==='%'?0: 0"
              :precision="0"
              controls-position="right"
              :style="{ width: '150px' }"
            />
            <span class="ml0 mr10">{{ unit }}</span>
          </el-form-item>
        </div>

      </div>
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
      console.log(this.$store.state.orders.orderStowageStatus, '调价的时候');
      let name = 'kg';
      const srcode = this.$store.state.orders.lossPlans;
      const lossPlans = Object.keys(srcode);
      let lossPlan = null;
      if (lossPlans.length) {
        const rcode = this.dataList[0].ruleCode;
        lossPlans.forEach(e => {
          if (e === rcode) {
            lossPlan = srcode[e].ruleValue;
          }
        });
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
      handler() {
        this.resettingData = [];
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
          this.formData[e.myName + '_0'] = this.formData[e.myName + '_0'] || (JSON.parse(e.ruleValue))[0];
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
      this.resettingData.filter(e => {
        e.ruleValue = this.formData[e.myName];
      });


      return new Promise((resolve, reject) => {
        this.$refs['formData'].validate((valid) => {
          if (valid) {
            const arr = this.resettingData.map(e => {
              if (e.showType !== '2') {
                e.ruleValue = this.formData[e.myName];
              } else {
                e.ruleValue = JSON.stringify([this.formData[e.myName + '_0'], this.formData[e.myName + '_1']]);
              }
              return e;
            });

            resolve(arr);
          } else {
            return false;
          }
        });
      });
    },

    //
    change() {
      this.$forceUpdate();
    }
  }

};
</script>
