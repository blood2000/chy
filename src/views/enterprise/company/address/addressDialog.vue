<template>
  <el-dialog :title="title" :visible="visible" width="1000px" append-to-body @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="140px" class="address-dialog">
      <el-row>
        <el-col :span="12">
          <el-form-item label="地址名称" prop="addressName">
            <el-input v-model="form.addressName" placeholder="请输入地址名称" class="width100" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系人" prop="contactName">
            <el-input v-model="form.contactName" placeholder="请输入联系人" class="width100" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="地址别名" prop="addressOtherName">
            <el-input v-model="form.addressOtherName" placeholder="请输入地址别名" class="width100" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号码" prop="contactTelphone">
            <el-input v-model="form.contactTelphone" placeholder="请输入手机号码" class="width100" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="详细地址" prop="addressDetail">
        <el-input v-model="form.addressDetail" placeholder="地图选择点位时，自动填入" class="width100" clearable />
      </el-form-item>
      <el-form-item label="是否默认地址">
        <el-switch v-model="form.defaultPut" active-text="默认装货地址" class="mr5" />
        <el-switch v-model="form.defaultPush" active-text="默认卸货地址" />
      </el-form-item>
      <el-form-item label="地址状态" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="parseInt(dict.dictValue)"
          >{{ dict.dictLabel }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" class="width100" />
      </el-form-item>
      <el-form-item class="map-content">
        <el-amap-search-box
          ref="AMapSearch"
          class="map-search-box"
          :search-option="searchOption"
          :on-search-result="onSearchResult"
        />
        <el-amap
          vid="amapDemo"
          :zoom="zoom"
          :center="center"
          :events="events"
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
import { addAddress, updateAddress } from '@/api/enterprise/company/address';
const geocoder = new AMap.Geocoder({
  radius: 1000,
  extensions: 'all'
});

export default {
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
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        addressName: [
          { required: true, message: '地址名称不能为空', trigger: 'blur' }
        ],
        contactName: [
          { required: true, message: '联系人不能为空', trigger: 'blur' }
        ],
        addressDetail: [
          { required: true, message: '详细地址不能为空', trigger: ['blur', 'change'] }
        ],
        contactTelphone: [
          { required: true, message: '手机号码不能为空', trigger: 'blur' },
          { validator: this.formValidate.telphone, trigger: 'blur' }
        ]
      },
      // 地图初始点位
      initPoint: [116.478928, 39.997761],
      zoom: 16,
      center: [116.478928, 39.997761],
      events: {
        // 鼠标点击地图事件
        click: (e) => {
          this.mapClick(e);
        }
      },
      // 地图坐标点信息
      marker: {
        icon: 'https://ddcwl.com/static/img/admin/sys/cc.png',
        position: [116.478928, 39.997761]
      },
      // 地图搜索框信息
      searchOption: {
        city: '全国', // 设置你要搜索的城市, 默认全国
        citylimit: true // 是否限制城市内搜索
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
  create() {

  },
  methods: {
    // 状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.defaultPut) {
            this.form.defaultPut = 1;
          } else {
            this.form.defaultPut = 0;
          }
          if (this.form.defaultPush) {
            this.form.defaultPush = 1;
          } else {
            this.form.defaultPush = 0;
          }
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
        createCode: null,
        createTime: null,
        updateCode: null,
        updateTime: null,
        addressName: null,
        addressOtherName: null,
        latitude: null,
        longitude: null,
        addressDetail: null,
        contactName: null,
        contactTelphone: null,
        remark: null,
        defaultPut: null, // 是否默认装货地址
        defaultPush: null // 是否默认卸货地址
      };
      this.resetForm('form');
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
      if (this.form.defaultPut) {
        this.form.defaultPut = true;
      } else {
        this.form.defaultPut = false;
      }
      if (this.form.defaultPush) {
        this.form.defaultPush = true;
      } else {
        this.form.defaultPush = false;
      }
      if (this.form.longitude && this.form.latitude) {
        this.getMapData(this.form.longitude, this.form.latitude);
      }
    },
    // 点击地图，获取点位信息
    mapClick(e) {
      const _this = this;
      const { lng, lat } = e.lnglat;
      // 通过高德地图的sdk将坐标转为地址
      geocoder.getAddress([lng, lat], function(status, result) {
        if (status === 'complete' && result.info === 'OK') {
          if (result && result.regeocode) {
            // console.log(result.regeocode);
            const { name } = result.regeocode.pois[0];
            const { adcode } = result.regeocode.addressComponent;
            const formattedAddress = result.regeocode.formattedAddress;
            _this.getMapData(lng, lat);
            _this.getFormData(lng, lat, name, formattedAddress);
            _this.getAreaCode(adcode);
          }
        }
      });
    },
    // 搜索获取到的位置信息，只取了第一条数据，需要的话可以设置多个标记点
    onSearchResult(pois) {
      // console.log(pois[0]);
      if (pois.length > 0) {
        const { lng, lat } = pois[0];
        // 模拟点击事件
        this.mapClick({
          lnglat: {
            lng: lng,
            lat: lat
          }
        });
      }
    },
    // 同步地图数据
    getMapData(lng, lat) {
      this.marker.position = [lng, lat];
      this.center = [lng, lat];
    },
    // 同步表单数据
    getFormData(lng, lat, name, formattedAddress) {
      this.form.longitude = lng;
      this.form.latitude = lat;
      this.form.addressName = name;
      this.form.addressDetail = formattedAddress;
    },
    // 截取省市区code
    getAreaCode(code) {
      this.form.provinceCode = code.slice(0, 2);
      this.form.cityCode = code.slice(0, 4);
      this.form.countyCode = code.slice(0, 6);
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
