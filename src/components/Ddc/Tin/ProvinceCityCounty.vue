<template>
  <el-form
    :ref="refName"
    :model="form"
    :rules="rules"
    :inline="true"
    :size="config.size"
    :label-width="config.labelWidth"
    :label-position="config.labelPosition"
  >
    <div class="pcc_form">
      <el-form-item prop="province" label="省:">
        <el-select
          v-model="form.province"
          placeholder="请选择省份"
          clearable
          filterable
          @change="changeProvince"
        >
          <el-option
            v-for="dict in provinceOption"
            :key="dict.dictValue"
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
          @change="changeCity"
        >
          <el-option
            v-for="dict in cityOption"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="county" label="县/区:">
        <el-select v-model="form.county" placeholder="请选择县/区" clearable filterable @change="changeCounty">
          <el-option
            v-for="dict in countyOption"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
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
    refName: {
      type: String,
      required: true
    },
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
      countyOption: [],

      cache: {}
    };
  },

  created() {
    this.init();
    if (!this.isrules) {
      this.rules = {};
    }

    // 回填
    if (this.cbData) {
      this.changeProvince(this.cbData.province);
      this.changeCity(this.cbData.city);
      this.form = this.cbData;
    }
  },
  mounted() {
    this.$emit('onsubmitForm', this._submitForm);
  },

  methods: {
    // 初始获取省
    init() {
      getProvinceList().then((res) => {
        this.provinceOption = res.rows.map((e) => {
          const dictValue = JSON.stringify({
            provinceCode: e.provinceCode,
            provinceName: e.provinceName
          });
          return { dictValue, dictLabel: e.provinceName };
        });
      });
    },
    // 省份切换
    changeProvince(data) {
      this.form.city = '';
      this.form.county = '';
      this.cityOption = [];
      this.countyOption = [];
      if (!data) return;

      this.$emit('getProvince', JSON.parse(data));
      // 根据省code获取 市列表
      const { provinceCode } = JSON.parse(data);

      getCityList({ provinceCode }).then((res) => {
        this.cityOption = res.rows.map((e) => {
          const dictValue = JSON.stringify({
            cityCode: e.cityCode,
            cityName: e.cityName
          });
          return { dictValue, dictLabel: e.cityName };
        });
      });
    },
    changeCity(data) {
      this.form.county = '';
      this.countyOption = [];
      if (!data) return;

      this.$emit('getCity', JSON.parse(data));
      // 根据市code获取 区/县列表
      const { cityCode } = JSON.parse(data);
      geCountyList({ cityCode }).then((res) => {
        this.countyOption = res.rows.map((e) => {
          const dictValue = JSON.stringify({
            countyCode: e.countyCode,
            countyName: e.countyName
          });
          return { dictValue, dictLabel: e.countyName };
        });
      });
    },
    changeCounty(data) {
      this.$emit('getCounty', JSON.parse(data));

      console.log('抛出的数据:', this.form);
    },

    _submitForm() {
      return new Promise((resolve, reject) => {
        this.$refs[this.refName].validate((valid) => {
          if (valid) {
            const { province, city, county } = this.form;
            resolve({
              province: JSON.parse(province),
              city: JSON.parse(city),
              county: JSON.parse(county)
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

<style scoped>
.pcc_form,
.pcc_form /deep/ .el-form-item {
  display: flex;
}
.pcc_form /deep/ .el-form-item__label {
  flex-shrink: 0;
}
</style>
