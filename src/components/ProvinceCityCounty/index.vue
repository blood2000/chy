<template>
  <el-form ref="form" :model="form" :rules="required ? rules : {}" :label-width="labelWidth" :disabled="disabled">
    <el-row class="component-change-area">
      <el-col :span="10">
        <el-form-item label="所在区域" prop="provinceCode">
          <el-select
            v-model="form.provinceCode"
            clearable
            class="input-width"
            placeholder="省(支持自动识别)"
            @change="changeProvince"
          >
            <el-option
              v-for="dict in provinceCodeOptions"
              :key="dict.provinceCode"
              :label="dict.provinceName"
              :value="dict.provinceCode"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item class="no-label" prop="cityCode">
          <el-select
            v-model="form.cityCode"
            clearable
            class="input-width"
            placeholder="市(支持自动识别)"
            @change="changeCity"
          >
            <el-option
              v-for="dict in cityCodeOptions"
              :key="dict.cityCode"
              :label="dict.cityName"
              :value="dict.cityCode"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item class="no-label" prop="countyCode">
          <el-select
            v-model="form.countyCode"
            clearable
            class="input-width"
            placeholder="县/区(支持自动识别)"
            @change="changeCounty"
          >
            <el-option
              v-for="dict in countyCodeOptions"
              :key="dict.countyCode"
              :label="dict.countyName"
              :value="dict.countyCode"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
/*
  使用示例:
    <province-city-county
      ref="ChooseArea"
      :label-width="'140px'"
      :visible="visible"
      :required="true"
      :disabled="false"
      :prop-province-code="form.provinceCode"
      :prop-city-code="form.cityCode"
      :prop-county-code="form.countyCode"
      @refresh="(data) => {
        form.provinceCode = data.provinceCode;
        form.cityCode = data.cityCode;
        form.countyCode = data.countyCode;
      }"
    />

  表单验证：this.$refs.ChooseArea.submit();

*/
import { getProvinceList, getCityList, geCountyList } from '@/api/system/area';
export default {
  props: {
    labelWidth: {
      type: String,
      default: '140px'
    },
    visible: Boolean,
    required: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    propProvinceCode: {
      type: String,
      default: null
    },
    propCityCode: {
      type: String,
      default: null
    },
    propCountyCode: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      form: {
        provinceCode: this.propProvinceCode,
        cityCode: this.propCityCode,
        countyCode: this.propCountyCode
      },
      // 表单校验
      rules: {
        provinceCode: [
          { required: true, trigger: 'change', message: '请选择省' }
        ],
        cityCode: [
          { required: true, trigger: 'change', message: '请选择市' }
        ],
        countyCode: [
          { required: true, trigger: 'change', message: '请选择县/区' }
        ]
      },
      // 省编码字典
      provinceCodeOptions: [],
      // 市编码字典翻译
      cityCodeOptions: [],
      // 县/区编码字典翻译
      countyCodeOptions: []
    };
  },
  watch: {
    visible(val) {
      if (val) {
        this.reset();
        this.setForm();
      }
    }
  },
  created() {
    this.reset();
    this.setForm();
    getProvinceList().then((response) => {
      this.provinceCodeOptions = response.rows;
    });
  },
  methods: {
    // 选中省
    changeProvince(code) {
      this.form.cityCode = null;
      this.form.countyCode = null;
      this.cityCodeOptions = [];
      this.countyCodeOptions = [];
      this.getCityListFun(code);
      this.$emit('refresh', this.form);
    },
    // 选中市
    changeCity(code) {
      this.form.countyCode = null;
      this.countyCodeOptions = [];
      this.geCountyListFun(code);
      this.$emit('refresh', this.form);
    },
    // 选中区
    changeCounty() {
      this.$emit('refresh', this.form);
    },
    // 获取市
    getCityListFun(code) {
      if (code == null || code === '') {
        return;
      }
      getCityList({ provinceCode: code }).then((response) => {
        this.cityCodeOptions = response.rows;
      });
    },
    // 获取区
    geCountyListFun(code) {
      if (code == null || code === '') {
        return;
      }
      geCountyList({ cityCode: code }).then((response) => {
        this.countyCodeOptions = response.rows;
      });
    },
    // 重置表单
    reset() {
      this.form = {
        provinceCode: null,
        cityCode: null,
        countyCode: null
      };
      this.resetForm('form');
      this.cityCodeOptions = [];
      this.countyCodeOptions = [];
    },
    // 表单赋值
    setForm() {
      this.form = {
        provinceCode: this.propProvinceCode,
        cityCode: this.propCityCode,
        countyCode: this.propCountyCode
      };
      // 市
      this.getCityListFun(this.form.provinceCode);
      // 区
      this.geCountyListFun(this.form.cityCode);
    },
    submit() {
      let flag;
      this.$refs['form'].validate(valid => {
        flag = valid;
      });
      return flag;
    }
  }
};
</script>

<style lang="scss" scoped>
.component-change-area{
  margin-right: -8px;
}
.input-width{
  width: 97%;
}
.no-label{
  .el-form-item__label{
    width: 0;
  }
  ::v-deep.el-form-item__content{
    margin-left: 0 !important;
  }
}
</style>
