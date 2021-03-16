<template>
  <div class="psr">
    <div
      v-for="(address, addindex) in addressList_to"
      :key="addindex"
      style="border: 1px solid #ccc; padding: 10px"
    >
      <el-form
        :ref="`elForm${address.time}`"
        :model="address"
        :rules="rules"
        :size="formConfig.size"
        :label-width="formConfig.labelWidth"
        :label-position="formConfig.labelPosition"
      >

        <el-button
          class="fahuoBtn"
          type="primary"
          @click="_open(address)"
        >{{ `选择常用${title}地址` }}</el-button>

        <ProvinceCityCounty :ref-name="`pcc_${addindex}_${addressType}`" @onsubmitForm="(fn)=> address.onsubmitForm = fn" />

        <el-form-item label="详细地址">
          <el-input
            v-model="address.detail"
            placeholder="请输入具体地址"
            clearable
            :style="{ width: '100%' }"
          />
        </el-form-item>

        <el-form-item label="地址别名">
          <el-input
            v-model="address.addressAlias"
            clearable
            placeholder="优先展示, 最多输入10个字"
            :style="{ width: '100%' }"
          />
        </el-form-item>

        <el-row :gutter="15">
          <el-col :span="12">
            <el-form-item label="联系人" prop="contact">
              <el-input
                v-model="address.contact"
                placeholder="请输入联系人"
                clearable
                :style="{ width: '100%' }"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="contactPhone">
              <el-input
                v-model="address.contactPhone"
                placeholder="请输入联系电话"
                clearable
                :style="{ width: '100%' }"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-button
          v-if="addressList_to.length > 1"
          type="primary"
          @click="_delAddress(address)"
        >删除地址</el-button>
      </el-form>
    </div>
    <el-button
      v-if="isBigOdd && showBtn"
      class="addfahuoBtn"
      style="margin-top: 10px"
      type="primary"
      size="mini"
      @click="_addAddress"
    >{{ `+ 追加${title}地址` }}</el-button>
  </div>
</template>

<script>

import ProvinceCityCounty from '@/components/Ddc/Tin/ProvinceCityCounty';

export default {
  components: { ProvinceCityCounty },
  props: {
    formConfig: {
      type: Object,
      default: () => {
        return {
          size: 'medium',
          labelWidth: '110px',
          labelPosition: 'left'
        };
      }
    },
    // <!-- address-type : 1=>货源地址; 2=>卸货地址 -->
    addressType: {
      type: Number,
      default: 1
    },
    // <!-- show-btn : true=>可多选; false=>隐藏按钮不能多选 -->
    showBtn: {
      type: Boolean,
      default: false
    },
    // <!-- isBigOdd true->多商品 ; false->单商品 -->
    isBigOdd: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      rules: {
        provinceCode: [
          { required: true, message: '请选择装货省', trigger: 'change' }
        ],
        cityCode: [
          { required: true, message: '请选择装货市', trigger: 'change' }
        ],
        countyCode: [
          { required: true, message: '请选择装货区', trigger: 'change' }
        ],
        contact: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
        contactPhone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' }
        ]
      },

      addressList_to: [
        {
          // 发货地址
          time: Date.now(),
          province: '', //	省份		false
          provinceCode: '', // 省code
          city: '', //	城市		false
          cityCode: '', //	城市编码		false
          county: '', // 县
          countyCode: '', // 县code

          country: '1', //	国家		false
          adcode: '1', //	区域编码		false
          addressAlias: '1', //	地址别名		false
          addressType: this.addressType, //	地址类型 1.装货地 2.卸货地		false
          contact: '', //	联系人		false
          contactPhone: '', //	联系电话		false
          detail: '', //	详细地址		false
          district: '1', //	地址所在的区		false
          level: '1', //	匹配级别		false
          location: [1, 2], //	坐标点		false
          street: '', //	街道		false
          onsubmitForm: null
        }
      ],

      onsubmitForm: null
    };
  },
  computed: {
    title() {
      console.log(this.showBtn, this.isBigOdd);

      return this.addressType === 1 ? '装货' : '卸货';
    }
  },



  methods: {
    // 打开弹框选择地址
    _open() {
      console.log('打开');
    },
    // 追加一个地址
    _addAddress() {
      this.addressList_to.push({
        // 发货地址
        time: Date.now(),
        adcode: '1', //	区域编码		false
        addressAlias: '1', //	地址别名		false
        addressType: this.addressType, //	地址类型 1.装货地 2.卸货地		false
        city: '', //	城市		false
        citycode: '1', //	城市编码		false
        contact: '', //	联系人		false
        contactPhone: '', //	联系电话		false
        country: '1', //	国家		false
        detail: '', //	详细地址		false
        district: '1', //	地址所在的区		false
        level: '1', //	匹配级别		false
        location: [1, 2], //	坐标点		false
        province: '', //	省份		false
        street: '', //	街道		false
        onsubmitForm: null
      });
    },
    // 删除一个地址
    _delAddress(address) {
      this.addressList_to = this.addressList_to.filter((e) => {
        return e.time !== address.time;
      });
    },
    async _submitForm() {
      const pccPromis = this.addressList_to.map(async pcc => {
        const res = await pcc.onsubmitForm();

        return {
          ...pcc,
          province: res.province.provinceName, //	省份		false
          provinceCode: res.province.provinceCode, // 省code
          city: res.city.cityName, //	城市		false
          cityCode: res.city.cityCode, //	城市编码		false
          county: res.county.countyName, // 县
          countyCode: res.county.countyCode // 县code
        };
      });

      this.addressList_to = await Promise.all(pccPromis);


      return new Promise((resolve, reject) => {
        this.addressList_to.forEach((e, index) => {
          const elF = `elForm${e.time}`;
          this.$refs[elF][0].validate((valid) => {
            if (valid) {
              const arr = this.addressList_to.map(ee => {
                return {
                  adcode: ee.adcode,
                  addressAlias: ee.addressAlias,
                  addressType: ee.addressType,
                  city: ee.city,
                  citycode: ee.cityCode,
                  contact: ee.contact,
                  contactPhone: ee.contactPhone,
                  country: ee.country,
                  detail: ee.detail,
                  district: ee.district,
                  level: ee.level,
                  location: ee.location,
                  province: ee.province,
                  street: ee.county
                };
              });
              resolve(arr);
            } else {
              return false;
            }
          });
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.psr,.el-form{
  position: relative;
}
.fahuoBtn {
  position: absolute;
  right: -15px;
  top: 0;
  transform: translateX(100%);
}
.addfahuoBtn{
  position: absolute;
  right: -15px;
  top: 60px;
  transform: translateX(100%);

}
</style>
