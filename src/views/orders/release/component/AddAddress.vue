<template>
  <div>
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
        <el-form-item :label="`${title}省 :`" prop="provinceCode">

          <div class="flex">
            <el-select
              v-model="address.provinceCode"
              placeholder="请选择省"
              clearable
              :style="{ width: '200px' }"
              @change="getcity(address)"
            >
              <el-option
                v-for="dict in getprovinceOption"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
            <el-form-item prop="city">
              <span class="pl-5 pr-5">市: </span>
              <el-select
                v-model="address.city"
                placeholder="请选择城市"
                clearable
                :style="{ width: '200px' }"
              >
                <el-option label="北京" value="北京" />
                <el-option label="上海" value="上海" />
              </el-select>
            </el-form-item>

            <el-form-item prop="street">
              <span class="pl-5 pr-5">县/区: </span>
              <el-select
                v-model="address.street"
                placeholder="请选择县/区"
                clearable
                :style="{ width: '200px' }"
              >
                <el-option label="北京" value="北京" />
                <el-option label="上海" value="上海" />
              </el-select>
            </el-form-item>

            <el-button
              class="fahuoBtn"
              type="primary"
              @click="_open(address)"
            >{{ `选择常用${title}地址` }}</el-button>
          </div>
        </el-form-item>


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
      class="fahuoBtn"
      style="margin-top: 10px"
      type="primary"
      size="mini"
      @click="_addAddress"
    >{{ `+ 追加${title}地址` }}</el-button>
  </div>
</template>

<script>
import { getProvinceList,
  getCityList,
  geCountyList } from '@/api/system/area';
export default {
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
        city: [
          { required: true, message: '请选择装货市', trigger: 'change' }
        ],
        street: [
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
          cityCode: '1', //	城市编码		false
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
          street: '' //	街道		false
        }
      ],

      // 省,市,区字典
      getprovinceOption: [],
      getcityOption: [],
      getstreetOption: []
    };
  },
  computed: {
    title() {
      return this.addressType === 1 ? '装货' : '卸货';
    }
  },

  created() {
    this.getprovince();
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
        street: '' //	街道		false
      });
    },
    // 删除一个地址
    _delAddress(address) {
      this.addressList_to = this.addressList_to.filter((e) => {
        return e.time !== address.time;
      });
    },
    _submitForm() {
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
                  citycode: ee.citycode,
                  contact: ee.contact,
                  contactPhone: ee.contactPhone,
                  country: ee.country,
                  detail: ee.detail,
                  district: ee.district,
                  level: ee.level,
                  location: ee.location,
                  province: ee.province,
                  street: ee.street
                };
              });
              resolve(arr);
            } else {
              return false;
            }
          });
        });
      });
    },

    // 获取省 市 区 code
    getprovince() {
      getProvinceList().then(res => {
        this.getprovinceOption = res.rows.map(e => {
          return { dictValue: e.provinceCode, dictLabel: e.provinceName, info: e };
        });
      });
    },
    getcity(address) {
      getCityList({ provinceCode: address.provinceCode }).then(res => {
        console.log(res);
      });
    },
    getstreet() {

    }

  }
};
</script>

<style lang="scss" scoped>
.flex {
  display: flex;
  justify-content: space-between;
  position: relative;
  .fahuoBtn {
    position: absolute;
    right: -15px;
    top: 0;
    transform: translateX(100%);
  }
}
</style>
