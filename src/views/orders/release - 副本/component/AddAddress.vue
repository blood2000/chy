<template>
  <div class="psr">
    <el-button
      v-if="isBigOdd && showBtn"
      class="addfahuoBtn"
      style="margin-top: 10px"
      type="primary"
      size="mini"
      @click="_addAddress"
    >{{ `+ 追加${title}地址` }}</el-button>
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

        <ProvinceCityCounty :ref-name="`pcc_${addindex}_${addressType}`" :cb-data="address.cbData" @onsubmitForm="(fn)=> address.onsubmitForm = fn" @getCity="(data)=>getCity(data,address)" />

        <div class="ly-flex">

          <el-form-item
            label="详细地址"
            style="margin-right:10px;width:50%;"
            :rules="[
              {
                required: true,
                message: '详细地址',
                trigger: 'change',
              },
            ]"
          >
            <el-select
              v-model="address.my_detail"
              filterable
              remote
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="remoteMethod"
              :loading="loading"
              :style="{ width: '100%' }"
              @change="handlechengDetail(address)"
            >

              <el-option
                v-for="dict in detailOptin"
                :key="dict.id"
                :label="dict.dictLabel"
                :value="dict.dictLabel"
              >
                <div class="option-item">
                  <div class="option-item_name">{{ dict.name }}</div>
                  <div class="option-item_address">{{ dict.address }}</div>
                </div>
              </el-option>
            </el-select>
            <el-amap-search-box :ref="`amap_${addindex}_${addressType}`" class="search-box" :search-option="address.searchOption" :on-search-result="onSearchResult" />
          </el-form-item>

          <el-form-item label="门牌号" :style="{ width: '50%' }">
            <el-input
              v-model="address.detail"
              :disabled="true"
              clearable
              placeholder="请输入门牌号"
              :style="{ width: '100%' }"
            />
          </el-form-item>
        </div>

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
          labelWidth: '80px',
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
          detail: '', //	回填的时候 = detail
          district: '1', //
          level: '1', //	匹配级别		false
          location: [1, 2], //
          street: '', //	街道		false
          onsubmitForm: null,
          my_detail: '', // 回填的时候 = detail
          address: '',
          addressName: '',
          searchOption: { // 回填的时候 city = cbData.cityName
            city: '全国',
            citylimit: false
          },
          cbData: { // 回填的省市区
            city: '{"cityCode":"3501","cityName":"福州市"}',
            county: '{"countyCode":"350103","countyName":"台江区"}',
            province: '{"provinceCode":"35","provinceName":"福建省"}'
          }
        }
      ],

      onsubmitForm: null,

      loading: false,
      detailOptin: [], // 搜索返回的结果
      searchOption: {
        city: '全国',
        citylimit: true
      }


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
        country: '中国', //	国家		false
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

    // 最后提交的时候触发
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
                console.log(ee);

                return {
                  adcode: ee.countyCode, // (区的code)
                  addressAlias: ee.addressAlias,
                  addressType: ee.addressType,
                  city: ee.city,
                  citycode: ee.cityCode,
                  contact: ee.contact,
                  contactPhone: ee.contactPhone,
                  country: ee.country, // 这个不知道是什么值 国家
                  detail: ee.addressName, // 搜索返回的地址

                  district: ee.county, // (区)
                  level: ee.level, // 这个不知道是什么值
                  location: ee.location,
                  province: ee.province,
                  street: ee.detail, // 这个不知道是什么值(暂时保存为具体门牌号)
                  provinceCode: ee.provinceCode,
                  formattedAddress: ee.province + ee.city + ee.county + ee.addressName + ee.detail

                  // 自己新增的
                  // county: ee.county,
                  // countyCode: ee.countyCode
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

    // 获取省
    getCity(data, address) {
      address.searchOption = {
        city: data.cityName,
        citylimit: true
      };
    },

    //
    remoteMethod(que) {
      this.loading = true;
      this.addressList_to.forEach((e, index) => {
        const vdom = this.$refs[`amap_${index}_${this.addressType}`][0];
        vdom.keyword = que;
        vdom.search();
      });
    },

    // 搜索地址回调
    onSearchResult(res) {
      this.detailOptin = res.map((e) => {
        const dictValue = JSON.stringify({
          name: e.name,
          address: e.address,
          lat: e.lat,
          lng: e.lng
        });
        return { dictValue, dictLabel: e.name, ...e };
      });

      console.log(this.detailOptin);

      this.loading = false;
    },

    // 详情地址回调
    handlechengDetail(address) {
      const sarr = this.detailOptin.filter(e => {
        return e.name === address.my_detail;
      });

      address.location = [sarr[0].lng, sarr[0].lat];
      address.address = sarr[0].address;
      address.addressName = sarr[0].name;
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
  left: 90px;
  top: -50px;
}

.search-box{
  position: absolute;
  top:9999px;
  left: 99999px;
  display: none;
}

.option-item{
  display: flex;
  .option-item_name{
    margin-right: 10px;
  }
  .option-item_address{
    font-size: 12px;
    color: #ccc;
  }

}
.ly-flex{
  justify-content: space-between;
}
</style>
