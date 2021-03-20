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
      <!-- <el-form-item prop="tin1" label="计算方式">
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
      rules: {}
    };
  },


  created() {
    console.log(this.dataList);
  }

};
</script>

<style>

</style>
