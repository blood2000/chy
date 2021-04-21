<template>
  <el-dialog :title="title" :class="[{'i-add':title==='添加地址'}]" :visible="visible" width="1000px" append-to-body @close="cancel">
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
        <el-col :span="12">
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
        <amap-search v-model="form.addressName" :search-option="searchOption" class="width100" @change="addressChange" />
      </el-form-item>
      <el-form-item label="地址详情" prop="detail">
        <el-input v-model="form.detail" placeholder="请输入地址详情" class="width100" clearable />
      </el-form-item>
      <el-form-item label="是否默认地址">
        <el-switch v-model="form.defaultPut" active-text="默认装货地址" class="mr5" />
        <el-switch v-model="form.defaultPush" active-text="默认卸货地址" />
      </el-form-item>
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
import { getProvinceList, getCityList, geCountyList } from '@/api/system/area';
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
    }
  },
  data() {
    return {
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
  created() {
    getProvinceList().then((response) => {
      this.provinceCodeOptions = response.rows;
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
        districtCode: null
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
    },
    // 表单赋值
    setForm(data) {
      this.form = data;
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
      const { lng, lat, dictLabel } = row;
      this.getMapData(lng, lat);
      this.getFormData(lng, lat, dictLabel);
      // 只填地址也可以回填省市区
      this.getAddressBylnglat(lng, lat);
    },
    // 选择完市以后,限定地址搜索只能在这个市里面选
    addressSearchLimit(code) {
      const { cityName } = this.cityCodeOptions.filter(el => {
        return el.cityCode === code;
      })[0];
      this.searchOption.city = cityName;
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
            const { adcode } = result.regeocode.addressComponent;
            _this.getAreaCode(adcode);
          }
        }
      });
    },
    // 截取省市区code
    getAreaCode(code) {
      this.form.provinceCode = code.slice(0, 2);
      this.form.cityCode = code.slice(0, 4);
      this.form.districtCode = code.slice(0, 6);
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
    getFormData(lng, lat, name) {
      this.form.longitude = lng;
      this.form.latitude = lat;
      this.form.addressName = name;
    },
    // 选中省
    changeProvince(code) {
      this.form.cityCode = null;
      this.form.districtCode = null;
      this.cityCodeOptions = [];
      this.countyCodeOptions = [];
      this.getCityListFun(code);
      if (code === null || code === undefined || code === '') {
        this.addressReset();
      }
    },
    // 选中市
    changeCity(code) {
      this.form.districtCode = null;
      this.countyCodeOptions = [];
      this.geCountyListFun(code);
      if (code !== null && code !== undefined && code !== '') {
        this.addressSearchLimit(code);
      } else {
        this.addressReset();
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
      geCountyList({ cityCode: code }).then((response) => {
        this.countyCodeOptions = response.rows;
      });
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
