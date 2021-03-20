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

      <!-- 文本框 -->
      <div v-for="(item,index) in resettingData" :key="index">
        <el-form-item v-if="item.showType === '1'" :prop="item.myName" :label="item.cnName">
          <el-input-number
            v-model="formData[item.myName]"
            :controls="false"
            :placeholder="`请输入${item.cnName}`"
            step-strictly
            controls-position="right"
            :style="{ width: '120px' }"
          />
        </el-form-item>
        <!-- 下拉框 -->
        <el-form-item v-if="item.showType === '3'" :prop="item.myName" :label="item.cnName">
          <el-select v-model="formData[item.myName]" clearable :placeholder="`请输入${item.cnName}`">
            <el-option
              v-for="dict in item.Option"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>

        <!-- 单选 -->
        <el-form-item v-if="item.showType === '4'" :prop="item.myName" :label="item.cnName">
          <el-radio-group v-model="formData[item.myName]" size="medium">
            <el-radio
              v-for="dict in item.Option"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{ dict.dictLabel }}</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 区间 -->
        <div v-if="item.showType === '2'" class="ly-flex ly-flex-pack-justify ly-flex-align-center">

          <el-form-item :prop="item.myName+'_0'" :label="item.cnName">
            <el-input-number
              v-model="formData[item.myName+'_0']"
              :controls="false"
              :placeholder="`请输入${item.cnName}`"
              step-strictly
              controls-position="right"
              :style="{ width: '100%' }"
            />
          </el-form-item>
          <div style="margin-bottom: 22px;">~</div>
          <el-form-item :prop="item.myName+'_1'" label-width="0">
            <el-input-number
              v-model="formData[item.myName+'_1']"
              :controls="false"
              :placeholder="`请输入${item.cnName}`"
              step-strictly
              controls-position="right"
              :style="{ width: '100%' }"
            />
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

  watch: {
    dataList: {
      handler(newName, oldName) {
        this.formData = {};
        this.resettingData = [];
        this.initData();
      },
      // 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法，如果设置了false，那么效果和上边例子一样
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
          this.formData[e.myName] = e.ruleValue;
        } else {
          this.formData[e.myName + '_0'] = (JSON.parse(e.ruleValue))[0];
          this.formData[e.myName + '_1'] = (JSON.parse(e.ruleValue))[1];
        }
      });

      this.resettingData = arr;
    },

    getOption(arr) {
      return arr.map(async e => {
        if (e.dictCode && (e.showType === '3' || e.showType === '4')) {
          // 新
          //   const { data } = await this.listByDict({
          //     dictPid: '0',
          //     dictType: e.dictCode
          //   });
          // 旧
          const { data } = await this.getDicts(e.dictCode);
          e.Option = data;
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
    }
  }

};
</script>

<style>

</style>
