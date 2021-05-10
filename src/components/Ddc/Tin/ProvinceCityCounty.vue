<template>
  <el-form
    ref="provinceCityCounty"
    :model="form"
    :rules="rules"
    :inline="true"
    :size="config.size"
    :label-width="config.labelWidth"
    :label-position="config.labelPosition"
    :disabled="disabled"
  >
    <div class="pcc_form">
      <el-form-item prop="province" label="省:">
        <el-select
          v-model="form.province"
          placeholder="请选择省份"
          clearable
          filterable
          :style="{ width: config.inputwidth }"
          @change="changeProvince"
        >
          <el-option
            v-for="(dict,index) in provinceOption"
            :key="index + dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="city" label="市:">
        <el-select
          v-model="form.city"
          placeholder="请选择城市"
          clearable
          filterable
          :style="{ width: config.inputwidth }"
          @change="changeCity"
        >
          <el-option
            v-for="(dict,index) in cityOption"
            :key="index + dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="county" label="县/区:">
        <el-select v-model="form.county" placeholder="请选择县/区" clearable>
          <el-option
            v-for="(dict,index) in countyOption"
            :key="index + dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
            :style="{ width: config.inputwidth }"
          />
        </el-select>
      </el-form-item>
    </div>
  </el-form>
</template>

<script>

/*
使用示例:

引入
<ProvinceCityCounty :ref-name="同个页面多次调用这个refname设成唯一的" @onsubmitForm="(fn)=> onsubmitForm = fn" />

属性
cbData        回填数据

事件
onsubmitForm  返回函数   调用回调函数进行表单验证并返回promis对象
getProvince   省切换的时候获取选中值
getCity       市切换的时候获取选中值
getCounty     区切换的时候获取选中值

调用

this.onsubmitForm.then(res=>{   console.log(res)   })

*/
import { getProvinceList, getCityList, geCountyList } from '@/api/system/area';

export default {
  name: 'ProvinceCityCounty',

  props: {
    config: {
      type: Object,
      default: () => {
        return {};
      }
    },
    isrules: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    cbData: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      form: {
        province: '',
        city: '',
        county: ''
      },
      rules: {
        province: [
          { required: true, message: '请选择省份', trigger: 'change' }
        ],
        city: [{ required: true, message: '请选择城市', trigger: 'change' }],
        county: [{ required: true, message: '请选择县/区', trigger: 'change' }]
      },

      provinceOption: [],
      cityOption: [],
      countyOption: []
    };
  },
  watch: {
    cbData: {
      async handler(newName, oldName) {
        if (!this.cbData) {
          this.form = {
            ...this.form,
            city: '',
            county: ''
          };
          return;
        }
        const { provinceCode, cityCode, districtCode } = this.cbData;

        this.form.province = provinceCode;
        await this.changeProvince(provinceCode);
        this.form.city = cityCode;
        await this.changeCity(cityCode);
        this.form.county = districtCode;
      },
      // 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法
      immediate: true
    },
    isrules: {
      handler(value) {
        this.rules = {
          province: [
            { required: value, message: '请选择省份', trigger: 'change' }
          ],
          city: [{ required: value, message: '请选择城市', trigger: 'change' }],
          county: [{ required: value, message: '请选择县/区', trigger: 'change' }]
        };
      },
      immediate: true
    }
  },

  created() {
    this.init();
    if (!this.isrules) {
      this.rules = {};
    }
  },
  mounted() {
    this.$emit('onsubmitForm', this._submitForm);
  },

  methods: {
    // 初始获取省
    async init() {
      const provinceOption = this.$store.getters.provinceList;

      if (provinceOption && provinceOption.length) {
        this.provinceOption = this._baozhuan(
          provinceOption,
          'provinceCode',
          'provinceName'
        );
      } else {
        const { rows } = await getProvinceList();
        // 假数据
        this.provinceOption = this._baozhuan(
          rows,
          'provinceCode',
          'provinceName'
        );
        this.$store.dispatch('orders/store_getProvinceList', rows);
      }
    },
    // 省份切换
    async changeProvince(data) {
      const province = this._zhaovalue(this.provinceOption, this.form.province);
      this.$emit('getProvince', province ? province.provinceName : '');

      this.form.city = '';
      this.form.county = '';
      this.cityOption = [];
      this.countyOption = [];
      if (!data) return;

      // 根据省code获取 市列表

      const { rows } = await getCityList({ provinceCode: this.form.province });

      // 假数据
      // const { rows } = a2;
      this.cityOption = this._baozhuan(rows, 'cityCode', 'cityName');
    },
    // 市切换
    async changeCity(data) {
      const city = this._zhaovalue(this.cityOption, this.form.city);
      this.$emit('getCity', city ? city.cityName : '');

      this.form.county = '';
      this.countyOption = [];
      if (!data) return;

      // 根据市code获取 区/县列表
      const { rows } = await geCountyList({ cityCode: this.form.city });
      // 假数据
      // const { rows } = a2;
      this.countyOption = this._baozhuan(rows, 'countyCode', 'countyName'); // 这个要改一下
    },

    _submitForm() {
      return new Promise((resolve, reject) => {
        this.$refs['provinceCityCounty'].validate((valid) => {
          if (valid) {
            const { province, city, county } = this.form;
            resolve({
              province: this._zhaovalue(this.provinceOption, province),
              city: this._zhaovalue(this.cityOption, city),
              county: this._zhaovalue(this.countyOption, county)
            });
          } else {
            return false;
          }
        });
      });
    },

    // 工具
    // 根据value匹配数组中的一项
    _zhaovalue(arr, value) {
      return arr.filter((e) => {
        return e.dictValue === value;
      })[0];
    },

    // 包装成
    _baozhuan(arr, dictValue, dictLabel) {
      return arr.map((e) => {
        return {
          ...e,
          dictValue: e[dictValue],
          dictLabel: e[dictLabel]
        };
      });
    }
  }
};
</script>

<style scoped>
.pcc_form,
.pcc_form /deep/ .el-form-item {
  display: flex;
  margin-bottom: 10px;
}
.pcc_form /deep/ .el-form-item__label {
  flex-shrink: 0;
}
</style>
