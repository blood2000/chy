<template>
  <el-dialog :title="title" :class="[{'i-add':title==='添加地址'}]" :visible="visible" width="1000px" :close-on-click-modal="false" append-to-body @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="140px" class="address-dialog">
      <el-row>
        <el-col :span="12">
          <el-form-item label="地址别名" prop="addressAlias">
            <el-input v-model="form.addressAlias" placeholder="请输入地址别名" class="width100" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系人" prop="contact">
            <el-input v-model="form.contact" placeholder="请输入联系人" class="width100" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号码" prop="contactPhone">
            <el-input v-model="form.contactPhone" placeholder="请输入手机号码" class="width100" clearable />
          </el-form-item>
        </el-col>
        <el-col v-if="form.code" :span="12">
          <el-form-item label="地址状态" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio
                v-for="dict in statusOptions"
                :key="dict.dictValue"
                :label="parseInt(dict.dictValue)"
              >{{ dict.dictLabel }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="货物大类" prop="commodityCategoryCode">
            <el-select v-model="form.commodityCategoryCode" placeholder="请选择货物大类" style="width: 100%" @change="handlecommodityCategoryChange">
              <el-option
                v-for="item in commodityCategoryCodeOptions"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-if="isMore == 0 || !isMore" label="货物小类" prop="commoditySubclassCodes">
            <el-select v-model="form.commoditySubclassCodes" placeholder="请选择货物小类" style="width: 100%" @change="handlecommodityCategoryChange">
              <el-option
                v-for="item in commoditySubclassCodesOptions"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="isMore == 1" label="货物小类" prop="commoditySubclassCodes">
            <el-select v-model="form.commoditySubclassCodes" placeholder="请选择货物小类" style="width: 100%" @change="handleCheckedChange">
              <el-option
                v-for="item in commoditySubclassCodesOptions"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col :span="10">
          <el-form-item label="所在地区" prop="provinceCode">
            <el-select
              v-model="form.provinceCode"
              clearable
              filterable
              class="width100"
              placeholder="请选择省"
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
        <el-col :span="7">
          <el-form-item class="no-label" prop="cityCode">
            <el-select
              v-model="form.cityCode"
              clearable
              filterable
              class="width100"
              placeholder="请选择市"
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
        <el-col :span="7">
          <el-form-item class="no-label" prop="districtCode">
            <el-select
              v-model="form.districtCode"
              clearable
              filterable
              class="width100"
              placeholder="请选择县/区"
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
      <el-form-item label="地址" prop="addressName">
        <amap-search ref="AmapSearchRef" v-model="form.addressName" :search-option="searchOption" class="width100" @change="addressChange" />
      </el-form-item>
      <el-form-item label="地址详情" prop="detail">
        <el-input v-model="form.detail" placeholder="请输入地址详情" class="width100" clearable />
      </el-form-item>
      <el-row :gutter="20">
        <!-- <el-col :span="12">
          <el-form-item label="是否默认地址">
            <el-switch v-model="form.defaultPut" active-text="默认装货地址" class="mr5" />
            <el-switch v-model="form.defaultPush" active-text="默认卸货地址" />
          </el-form-item>
        </el-col>-->
        <el-col :span="12">
          <el-form-item label="碰撞半径" prop="collisionRadius">
            <el-input-number v-model="form.collisionRadius" :min="1" :max="100000" />&nbsp;米
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" class="width100" />
      </el-form-item>
      <el-form-item class="map-content">
        <el-amap
          vid="amapDemo"
          :zoom="zoom"
          :center="center"
        >
          <el-amap-marker
            :position="marker.position"
            :icon="marker.icon"
          />
        </el-amap>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getProvinceList, getCityList, geCountyList, addCounty } from '@/api/system/area';
import { addAddress, updateAddress } from '@/api/enterprise/company/address';
import AmapSearch from '@/components/Ddc/Tin/AmapSearch';
import { praseBooleanToNum, praseNumToBoolean } from '@/utils/ddc';

const geocoder = new AMap.Geocoder({
  radius: 1000,
  extensions: 'all'
});

export default {
  components: {
    AmapSearch
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    open: Boolean,
    shipmentCode: {
      type: String,
      default: null
    },
    orgCode: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      pcdInfo: null, // 高德组件返回的省市区临时记录一份
      // 状态字典
      statusOptions: [
        { 'dictLabel': '启用', 'dictValue': 1 },
        { 'dictLabel': '禁用', 'dictValue': 2 }
      ],
      // 省编码字典
      provinceCodeOptions: [],
      // 市编码字典翻译
      cityCodeOptions: [],
      // 县/区编码字典翻译
      countyCodeOptions: [],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        contact: [
          { required: true, message: '联系人不能为空', trigger: 'blur' }
        ],
        addressName: [
          { required: true, message: '地址不能为空', trigger: 'blur' }
        ],
        contactPhone: [
          { required: true, message: '手机号码不能为空', trigger: 'blur' },
          { validator: this.formValidate.telphone, trigger: 'blur' }
        ],
        provinceCode: [
          { required: true, message: '请选择省', trigger: 'change' }
        ],
        cityCode: [
          { required: true, message: '请选择市', trigger: 'change' }
        ],
        districtCode: [
          { required: true, message: '请选择县/区', trigger: 'change' }
        ],
        addressAlias: [
          { required: true, message: '地址别名不能为空', trigger: 'change' }
        ]
      },
      // 地图初始点位
      initPoint: [116.478928, 39.997761],
      zoom: 14,
      center: [116.478928, 39.997761],
      // 地图坐标点信息
      marker: {
        icon: 'https://ddcwl.com/static/img/admin/sys/cc.png',
        position: [116.478928, 39.997761]
      },
      searchOption: {
        city: '全国',
        citylimit: true
      },
      // 商品类别编码字典
      commodityCategoryCodeOptions: [],
      // 商品小类字典
      commoditySubclassCodesOptions: [],
      // 是否多选
      isMore: '2',
      // 大类字典类型
      commodityCategory: {
        'status': '0',
        'dictPid': '0',
        'dictType': 'goodsType'
      },
      // 小类字典类型
      commoditySubclass: {
        'status': '0',
        'dictPid': '',
        'dictType': 'goodsType'
      }
    };
  },
  computed: {
    visible: {
      get() {
        return this.open;
      },
      set(v) {
        this.$emit('update:open', v);
      }
    }
  },
  // 调试搜索地址限制时打开
  // watch: {
  //   searchOption: {
  //     handler(val) {
  //       console.log('当前搜索的范围: ', val.city);
  //     },
  //     deep: true
  //   }
  // },
  created() {
    getProvinceList().then((response) => {
      this.provinceCodeOptions = response.rows;
    });
    this.listByDict(this.commodityCategory).then(response => {
      this.commodityCategoryCodeOptions = response.data;
    });
    this.listByDict({ dictPid: '0', dictType: 'transportation_scenario' }).then(response => {
      this.projectTypeOptions = response.data;
      // console.log(this.projectTypeOptions);
    });
  },
  methods: {
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.form.defaultPut = praseBooleanToNum(this.form.defaultPut);
          this.form.defaultPush = praseBooleanToNum(this.form.defaultPush);
          if (this.shipmentCode) {
            this.form.shipmentCode = this.shipmentCode;
          }
          if (this.orgCode) {
            this.form.orgCode = this.orgCode;
          }
          if (this.form.code != null) {
            updateAddress(this.form).then(response => {
              this.msgSuccess('修改成功');
              this.close();
              this.$emit('refresh');
            });
          } else {
            addAddress(this.form).then(response => {
              this.msgSuccess('新增成功');
              this.close();
              this.$emit('refresh');
            });
          }
        }
      });
    },
    // 取消按钮
    cancel() {
      this.close();
      this.reset();
    },
    // 关闭弹窗
    close() {
      this.$emit('update:open', false);
    },
    // 表单重置
    reset() {
      this.form = {
        code: null,
        shipmentCode: null,
        status: 1,
        addressAlias: null,
        latitude: null,
        longitude: null,
        addressName: null,
        detail: null,
        contact: null,
        contactPhone: null,
        remark: null,
        defaultPut: null, // 是否默认装货地址
        defaultPush: null, // 是否默认卸货地址
        provinceCode: null,
        cityCode: null,
        districtCode: null,
        collisionRadius: 1000,
        commodityCategoryCode: null,
        commoditySubclassCodes: null
      };
      this.resetForm('form');
      this.cityCodeOptions = [];
      this.countyCodeOptions = [];
      // 地图重置
      this.marker.position = this.initPoint;
      this.center = this.initPoint;
      if (this.$refs.AMapSearch) {
        this.$refs.AMapSearch.keyword = '';
      }
      // 地址框重置
      this.clearAddressOption();
    },
    // 表单赋值
    setForm(data) {
      this.form = data;
      this.pcdInfo = null;
      this.form.defaultPut = praseNumToBoolean(this.form.defaultPut);
      this.form.defaultPush = praseNumToBoolean(this.form.defaultPush);
      if (this.form.longitude && this.form.latitude) {
        this.getMapData(this.form.longitude, this.form.latitude);
      }
      // 市
      if (this.form.provinceCode) {
        this.getCityListFun(this.form.provinceCode);
      }
      // 区
      if (this.form.cityCode) {
        this.geCountyListFun(this.form.cityCode);
      }
    },
    // 搜索地址
    addressChange(row) {
      const { lng, lat, dictLabel, address } = row;
      this.getMapData(lng, lat);
      this.getFormData(lng, lat, dictLabel, address);
      // 只填地址也可以回填省市区
      this.getAddressBylnglat(lng, lat);
    },
    // 选择完省/市/区以后,限定地址搜索只能在这个范围里面选
    addressSearchLimitByCode(code) {
      this.searchOption.city = code;
    },
    // 重置搜索地址
    addressReset() {
      this.searchOption.city = '全国';
      this.form.addressName = '';
    },
    // 通过经纬度获取详细点位信息
    getAddressBylnglat(lng, lat) {
      const _this = this;
      // 通过高德地图的sdk将坐标转为地址
      geocoder.getAddress([lng, lat], function(status, result) {
        if (status === 'complete' && result.info === 'OK') {
          if (result && result.regeocode) {
            const { adcode, province, city, district, township, street, streetNumber } = result.regeocode.addressComponent;

            _this.form.detail = province + city + district + township + street + streetNumber;

            _this.getAreaCode(adcode, province, city, district);
          }
        }
      });
    },
    // 截取省市区code
    getAreaCode(code, province, city, district) {
      this.form.provinceCode = code.slice(0, 2);
      this.form.cityCode = code.slice(0, 4);
      this.form.districtCode = code.slice(0, 6);

      // 记录高德返回的省市区的code及名称
      this.pcdInfo = {
        p: {
          code: this.form.provinceCode,
          name: province
        },
        c: {
          code: this.form.cityCode,
          name: city
        },
        d: {
          code: this.form.districtCode,
          name: district
        }
      };


      // 市
      if (this.form.provinceCode) {
        this.getCityListFun(this.form.provinceCode);
      }
      // 区
      if (this.form.cityCode) {
        this.geCountyListFun(this.form.cityCode);
      }
    },
    // 同步地图数据
    getMapData(lng, lat) {
      this.marker.position = [lng, lat];
      this.center = [lng, lat];
    },
    // 同步表单数据
    getFormData(lng, lat, name, detail) {
      this.form.longitude = lng;
      this.form.latitude = lat;
      this.form.addressName = name;
      this.form.detail = detail;
    },
    // 选中省
    changeProvince(code) {
      this.clearAddressOption();
      this.form.cityCode = null;
      this.form.districtCode = null;
      this.cityCodeOptions = [];
      this.countyCodeOptions = [];
      this.getCityListFun(code);
      if (code !== null && code !== undefined && code !== '') {
        this.addressSearchLimitByCode(code);
      } else {
        this.addressReset();
      }
    },
    // 选中市
    changeCity(code) {
      this.clearAddressOption();
      this.form.districtCode = null;
      this.countyCodeOptions = [];
      this.geCountyListFun(code);
      if (code !== null && code !== undefined && code !== '') {
        this.addressSearchLimitByCode(code);
      } else {
        this.addressSearchLimitByCode(this.form.provinceCode);
      }
    },
    // 选中县/区
    changeCounty(code) {
      this.clearAddressOption();
      if (code !== null && code !== undefined && code !== '') {
        this.addressSearchLimitByCode(code);
      } else {
        this.addressSearchLimitByCode(this.form.cityCode);
      }
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
      geCountyList({ cityCode: code }).then(async(response) => {
        this.countyCodeOptions = response.rows;

        // 搜索触发
        if (this.pcdInfo) {
          const county = response.rows.find(e => {
            return e.countyCode === this.pcdInfo.d.code;
          });
          // 判断库中是否不存在这个code ture 说明不存在
          if (!county) {
            await addCounty({
              countyCode: this.pcdInfo.d.code,
              countyName: this.pcdInfo.d.name,
              cityCode: this.pcdInfo.c.code
            });
            const { rows } = await geCountyList({ cityCode: code });

            this.countyCodeOptions = rows;
          }
        }
      });
    },
    // 清空地址
    clearAddressOption() {
      this.form.addressName = '';
      this.form.detail = '';
      if (this.$refs.AmapSearchRef) this.$refs.AmapSearchRef.clearOption();
    },
    // 单选商品大类
    handlecommodityCategoryChange(selection) {
      this.handleChange(selection);
      this.form.commoditySubclassCodes = null;
      this.commoditySubclassCodes = [];
    },
    // 单选商品大类后联动数据事件
    handleChange(value) {
      const commodity = this.commodityCategoryCodeOptions.filter(item => {
        return item.dictValue === value;
      });
      this.commoditySubclass.dictPid = commodity[0].dictCode;
      this.listByDict(this.commoditySubclass).then(response => {
        this.commoditySubclassCodesOptions = response.data;
      });
      this.isMore = commodity[0].isCheckbox;
    },
    // 多选小类
    handleCheckedChange(selection) {
      this.form.commoditySubclassCodes = selection.join(',');
      // this.commoditySubclassCodes = selection.map((item) => item.commoditySubclassCodesOptions);
    }
  }
};
</script>

<style lang="scss" scoped>
.address-dialog{
  margin: 0 5% 0 0;
}
.width100{
  width: 100%;
}
.mr5{
  margin-right: 5%;
}
// 省市区输入框样式
.no-label{
  .el-form-item__label{
    width: 0;
  }
  ::v-deep.el-form-item__content{
    margin-left: 0 !important;
  }
}
// 地图搜索框样式
.map-content{
  position: relative;
  height: 400px;
  ::v-deep.el-form-item__content{
    height: 100%;
  }
  .map-search-box{
    position: absolute;
    top: 6px;
    left: 6px;
    height: 38px;
  }
  ::v-deep.amap-icon img{
    max-width: 40px !important;
    max-height: 30px !important;
  }
}
</style>
