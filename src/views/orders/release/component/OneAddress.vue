<template>
  <div>
    <el-form
      ref="elForm"
      :model="formData"
      :rules="rules"
      size="medium"
      label-width="110px"
      :label-position="'left'"
    >
      <ProvinceCityCounty ref="pccFef" :cb-data="cbData" @getCity="getCity" />

      <div class="ly-flex">
        <el-form-item
          label="详细地址"
          style="margin-right: 10px; width: 50%"
          prop="tin1"
        >
          <el-select
            v-model="formData.tin1"
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="remoteMethod"
            :loading="loading"
            :style="{ width: '100%' }"
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

        <el-form-item label="门牌号" :style="{ width: '50%' }">
          <el-input
            v-model="formData.tin2"
            :disabled="true"
            clearable
            placeholder="请输入门牌号"
            :style="{ width: '100%' }"
          />
        </el-form-item>
      </div>

      <el-form-item label="地址别名">
        <el-input
          v-model="formData.tin3"
          clearable
          placeholder="优先展示, 最多输入10个字"
          :style="{ width: '100%' }"
        />
      </el-form-item>

      <el-row :gutter="15">
        <el-col :span="12">
          <el-form-item label="联系人" prop="contact">
            <el-input
              v-model="formData.contact"
              placeholder="请输入联系人"
              clearable
              :style="{ width: '100%' }"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系电话" prop="contactPhone">
            <el-input
              v-model="formData.contactPhone"
              placeholder="请输入联系电话"
              clearable
              :style="{ width: '100%' }"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import ProvinceCityCounty from '@/components/Ddc/Tin/ProvinceCityCounty';
export default {
  components: { ProvinceCityCounty },

  props: {
    type: {
      type: [String, Number],
      default: ''
    },
    cbData: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      loading: false,
      searchOption: {
        city: '全国',
        citylimit: true
      },
      selected: null,
      formData: {
        tin1: '',
        tin2: '',
        tin3: '',
        contact: '',
        contactPhone: ''
      },

      rules: {
        tin1: [{ required: true, message: '选择所属项目', trigger: 'change' }],
        tin2: [{ required: true, message: '选择所属项目', trigger: 'change' }],
        tin3: [{ required: true, message: '选择所属项目', trigger: 'blur' }],
        contact: [{ required: true, message: '选择所属项目', trigger: 'blur' }],
        contactPhone: [
          { required: true, message: '选择所属项目', trigger: 'blue' }
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
          street,
          addressAlias,
          contact,
          contactPhone,
          location
        } = value;

        this.formData.tin1 = detail;
        this.formData.tin2 = street;
        this.formData.tin3 = addressAlias;
        this.formData.contact = contact;
        this.formData.contactPhone = contactPhone;

        this.selected = {
          name: detail,
          lat: location[1],
          lng: location[0]
        };
      },
      immediate: true
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
      this.detailOptin = this._baozhuan(res, 'id', 'name');
      this.loading = false;
    },

    // 2. 下拉选择地址
    handlechengDetail() {
      this.selected = this._zhaovalue(this.detailOptin, this.formData.tin1);
    },

    // 3. 选择了什么城市
    getCity(city) {
      this.searchOption.city = city || '全国';
    },

    async _submitForm() {
      // 获取省市区
      const { city, county, province } = await this.$refs.pccFef._submitForm();
      // 获取当前
      const { tin2, tin3, contact, contactPhone } = this.formData;
      // 获取详情及经纬度
      const { name, lat, lng } = this.selected;

      return new Promise((resolve, reject) => {
        this.$refs['elForm'].validate((valid) => {
          if (valid) {
            resolve({
              adcode: county.countyCode, // (区的code)
              district: county.countyName, // (区)
              addressAlias: tin3,
              addressType: this.type,
              city: city.cityName,
              citycode: city.cityCode,
              contact: contact,
              contactPhone: contactPhone,
              // country: ee.country, // 这个不知道是什么值 国家
              detail: name, // 搜索返回的地址
              // level: ee.level, // 这个不知道是什么值
              location: [lng, lat],
              province: province.provinceName,
              provinceCode: province.provinceCode,
              street: tin2, // (暂时保存为具体门牌号)
              formattedAddress:
                province.provinceName +
                city.cityName +
                county.countyName +
                name +
                tin2
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
