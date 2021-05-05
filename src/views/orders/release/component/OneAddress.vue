<template>
  <div>
    <el-form
      ref="elForm"
      :model="formData"
      :rules="rules"
      size="medium"
      label-width="100px"
      :label-position="'left'"
      :disabled="myisdisabled"
    >

      <el-row :gutter="30">
        <el-col :span="24">
          <ProvinceCityCounty
            ref="pccFef"
            :config="{
              size:'medium',
              labelWidth:'80px',
              labelPosition:'left',
              inputwidth:'200px'
            }"
            :cb-data="pccCode"
            :isrules="isrules"
            :disabled="myisdisabled"
            @getCity="getCity"
            @getProvince="getProvince"
          />
        </el-col>
      </el-row>

      <el-row :gutter="50">
        <el-col :span="10">
          <el-form-item
            label="详细地址"
            prop="addressName"
          >
            <el-select
              v-model="formData.addressName"
              clearable
              filterable
              remote
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="remoteMethod"
              :loading="loading"
              :style="{ width: '250px' }"
              @change="handlechengDetail"
            >
              <el-option
                v-for="dict in detailOptin"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              >
                <div class="option-item">
                  <div class="option-item_name">{{ dict.dictLabel }}</div>
                  <div class="option-item_address">{{ dict.address }}</div>
                </div>
              </el-option>
            </el-select>
            <el-amap-search-box
              v-show="false"
              :ref="`amap`"
              class="search-box"
              :search-option="searchOption"
              :on-search-result="onSearchResult"
            />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="地址别名">
            <el-input
              v-model="formData.addressAlias"
              clearable
              placeholder="优先展示, 最多输入10个字"
              maxlength="10"
              :style="{width: '250px'}"
            />
          </el-form-item>
        </el-col>
      </el-row>


      <el-row :gutter="50">
        <el-col :span="10">
          <el-form-item label="联系人" prop="contact">
            <el-input
              v-model="formData.contact"
              placeholder="请输入联系人"
              clearable
              :style="{width: '250px' }"
            />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="联系电话" prop="contactPhone">
            <el-input
              v-model="formData.contactPhone"
              placeholder="请输入联系电话"
              clearable
              maxlength="11"
              :style="{ width: '250px' }"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import ProvinceCityCounty from '@/components/Ddc/Tin/ProvinceCityCounty';
const geocoder = new AMap.Geocoder({
  radius: 1000,
  extensions: 'all'
});
export default {
  components: { ProvinceCityCounty },

  props: {
    type: {
      type: [String, Number],
      default: ''
    },
    isRules: {
      type: Boolean,
      default: false
    },
    cbData: {
      type: Object,
      default: null
    },
    myisdisabled: {
      type: Boolean,
      default: false
    }

  },
  data() {
    return {
      pccCode: null, // 主要搜集金纬度
      isrules: true,
      loading: false,
      searchOption: {
        city: '全国',
        citylimit: true
      },
      selected: null,
      formData: {
        addressName: '',
        detail: '',
        addressAlias: '',
        contact: '',
        contactPhone: ''
      },

      rules: {
        addressName: [{ required: true, message: '请输入详细地址', trigger: 'change' }],
        detail: [{ required: true, message: '选择所属项目', trigger: 'change' }],
        addressAlias: [{ required: true, message: '选择所属项目', trigger: 'blur' }],
        contact: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
        contactPhone: [
          { required: true, message: '请输入联系电话', trigger: 'blue' },
          { validator: this.formValidate.telphone, trigger: 'blur' }
        ]
      },

      // 字典集合
      detailOptin: []
    };
  },
  watch: {
    cbData: {
      handler(value) {
        if (!value) return;

        const {
          detail,
          addressName,
          addressAlias,
          contact,
          contactPhone,
          location
        } = value;

        this.formData.detail = detail;
        this.formData.addressAlias = addressAlias;
        this.formData.contact = contact;
        this.formData.contactPhone = contactPhone;
        this.$nextTick(_ => {
          this.formData.addressName = addressName;
        });
        this.selected = {
          name: addressName,
          lat: location ? location[1] - 0 : 0,
          lng: location ? location[0] - 0 : 0
        };

        this.pccCode = value;
      },
      immediate: true
    },

    isRules(value) {
      this.isrules = !value;

      this.rules = {
        addressName: [{ required: !value, message: '请输入详细地址', trigger: 'change' }],
        detail: [{ required: !value, message: '选择所属项目', trigger: 'change' }],
        addressAlias: [{ required: !value, message: '选择所属项目', trigger: 'blur' }],
        contact: [{ required: !value, message: '请输入联系人', trigger: 'blur' }],
        contactPhone: [
          { required: !value, message: '请输入联系电话', trigger: 'blue' }
        ]
      };
    },

    'searchOption.city'(val, oldval) {
      if (oldval !== '全国') {
        this.formData.addressName = '';
        this.detailOptin = [];
      }
    }
  },

  methods: {
    // 1. 监听输入框
    remoteMethod(que) {
      this.loading = true;
      const vdom = this.$refs.amap;
      vdom.keyword = que;
      vdom.search();
    },

    // 1. 搜索地址回调
    onSearchResult(res) {
      // console.log(res);

      this.detailOptin = [];
      this.detailOptin = this._baozhuan(res, 'id', 'name');
      this.loading = false;
    },

    // 2. 下拉选择地址
    handlechengDetail(value) {
      if (!value && this.isRules) {
        this.selected = '';
      }

      this.selected = this._zhaovalue(this.detailOptin, this.formData.addressName);


      var lnglat = [this.selected.lng, this.selected.lat];
      this.getaddress(lnglat);
    },

    // 逆解码函数
    getaddress: function(lnglat) {
      const self = this;

      geocoder.getAddress(lnglat, function(status, result) {
        if (status === 'complete' && result.info === 'OK') {
          const { adcode } = result.regeocode.addressComponent;
          // result为对应的地理位置详细信息
          self.getAreaCode(adcode);
        }
      });
    },

    // 截取省市区code
    getAreaCode(code) {
      const provinceCode = code.slice(0, 2);
      const cityCode = code.slice(0, 4);
      const districtCode = code.slice(0, 6);



      this.pccCode = { provinceCode, cityCode, districtCode };
    },


    // 3. 选择了什么城市
    getCity(city) {
      this.searchOption.city = city || '全国';
      if (!city) {
        this.formData.addressName = '';
        this.detailOptin = [];
      }
    },
    getProvince(province) {
      if (!province) {
        this.formData.addressName = '';
        this.detailOptin = [];
      }
    },

    async _submitForm() {
      // 获取省市区
      const { city = {}, county = {}, province = {}} = await this.$refs.pccFef._submitForm();
      // 获取当前
      const { detail, addressAlias, contact, contactPhone } = this.formData;
      // 获取详情及经纬度
      const { name = '', lat = '', lng = '' } = this.selected;

      return new Promise((resolve, reject) => {
        this.$refs['elForm'].validate((valid) => {
          if (valid) {
            resolve({
              districtCode: county.countyCode, // (区的code) 必填的
              district: county.countyName, // (区)
              addressAlias: addressAlias,
              addressType: this.type,
              city: city.cityName,
              cityCode: city.cityCode,
              contact: contact,
              contactPhone: contactPhone,
              detail: detail, // 手填的
              addressName: name, // 地址名称(高德手选)
              location: [lng, lat],
              province: province.provinceName,
              provinceCode: province.provinceCode
            });
          } else {
            return false;
          }
        });
      });
    },

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
<style lang="scss" scoped>
.option-item {
  display: flex;
  .option-item_name {
    margin-right: 10px;
  }
  .option-item_address {
    font-size: 12px;
    color: #ccc;
  }
}
.ly-flex {
  justify-content: space-between;
}
</style>
