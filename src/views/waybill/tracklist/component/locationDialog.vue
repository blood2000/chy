<template>
  <!-- 车辆定位对话框 -->
  <el-dialog :title="title" :visible="visible" width="1400px" append-to-body destroy-on-close @close="cancel">
    <div class="map-content">
      <div class="g-flex g-justifyend" style="width:100%; height: 0;border-radius: 6px">
        <div class="legend-frame">
          <el-checkbox v-model="lieyingChecked" style="margin-bottom:10px;">
            <div class="g-aligncenter">APP定位</div>
          </el-checkbox>
          <el-checkbox v-model="jimiChecked" style="margin-bottom:10px;">
            <div class="g-aligncenter">硬件定位</div>
          </el-checkbox>
          <el-checkbox v-model="zjxlChecked" style="margin-bottom:10px;">
            <div class="g-aligncenter">北斗定位</div>
          </el-checkbox>
        </div>
      </div>
      <el-amap ref="map" vid="amapDemo" :zoom="zoom" :center="center">
        <!-- <el-amap-marker v-for="(marker, index) in markers" :key="index" :events="marker.events" :position="marker.position" :icon="marker.icon" :label="marker.label" /> -->
        <el-amap-info-window :position="window.position" :visible="window.visible" :offset="window.offset" :auto-move="true">
          <div style="width: 300px;">
            <el-row type="flex" class="row-bg">
              <el-col :span="24">
                <div style="font-weight: bold; font-size: 16px">{{ windowContent.status }}</div>
              </el-col>
            </el-row>
            <el-row type="flex" class="row-bg" style="margin-top: 15px">
              <el-col :span="6">
                <div style="text-align: right;">司机名称：</div>
              </el-col>
              <el-col :span="18">
                <div>{{ windowContent.driverName || '-' }}</div>
              </el-col>
            </el-row>
            <el-row type="flex" class="row-bg" style="margin-top: 5px">
              <el-col :span="6">
                <div style="text-align: right;">车牌号：</div>
              </el-col>
              <el-col :span="18">
                <div>{{ windowContent.licenseNumber || '-' }}</div>
              </el-col>
            </el-row>
            <el-row v-if="windowContent.name === '硬件定位'" type="flex" class="row-bg" style="margin-top: 5px">
              <el-col :span="6">
                <div style="text-align: right;">设备号：</div>
              </el-col>
              <el-col :span="18">
                <div>{{ windowContent.imeis || '-' }}</div>
              </el-col>
            </el-row>
            <el-row v-if="windowContent.name === '北斗定位'" type="flex" class="row-bg" style="margin-top: 5px">
              <el-col :span="6">
                <div style="text-align: right;">定位地址：</div>
              </el-col>
              <el-col :span="18">
                <div>{{ windowContent.adr || '-' }}</div>
              </el-col>
            </el-row>
            <el-row type="flex" class="row-bg" style="margin-top: 5px">
              <el-col :span="6">
                <div style="text-align: right;">定位时间：</div>
              </el-col>
              <el-col :span="18">
                <div>{{ windowContent.gpsTime || '-' }}</div>
              </el-col>
            </el-row>
          </div>
        </el-amap-info-window>
      </el-amap>
    </div>
  </el-dialog>
</template>

<script>
import { jimiLocation, getWebDetail, zjxlLocation, getDevice } from '@/api/waybill/tracklist';
import axios from 'axios';
export default {
  name: 'LocationDialog',
  props: {
    title: {
      type: String,
      default: ''
    },
    open: Boolean
    // disable: Boolean
  },
  data() {
    return {
      // 缩放级别
      zoom: 16,
      // 中心点坐标
      center: [119.358267, 26.04577],
      // 标记点
      marker: {
        position: [],
        icon: 'https://css-backup-1579076150310.obs.cn-south-1.myhuaweicloud.com/image_directory/cart.png',
        autoFitView: true,
        autoRotation: true,
        clickable: true,
        label: {
          content: '',
          offset: new AMap.Pixel(-10, -34)
        }
      },
      // 信息窗体
      window: {
        position: [119.358267, 26.04577],
        events: {},
        visible: false,
        offset: [0, -70]
      },
      // 信息窗体内容
      windowContent: {
        name: '',
        status: '',
        driverName: '',
        licenseNumber: '',
        imeis: '',
        gpsTime: '',
        adr: ''
      },
      // 获取到的定位
      location: [],
      wayBillInfo: {},
      // 猎鹰相关参数
      lieyingChecked: false,
      lieyingMark: undefined,
      lyLocation: [],
      lieyingQueryParams: {
        key: undefined,
        sid: undefined, // sid为终端所属service唯一编号
        tid: undefined, // tid为终端唯一编号
        trid: undefined, // trid为轨迹唯一编号
        correction: 'n'
      },
      // 几米相关参数
      deviceInfo: {},
      jimiChecked: false,
      jimiMark: undefined,
      jmLocation: [],
      // 查询参数 map_type:GOOGOLE或BAIDU
      queryParams: {
        imeis: '', // 867567047562525
        map_type: 'GOOGLE'
      },
      // 中交兴路相关参数
      zjxlChecked: false,
      zjxlMark: undefined,
      zjLocation: [],
      zjxlQueryParams: {
        timeNearby: '24',
        vclN: '陕YH0008'
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
  watch: {
    lieyingChecked(val) {
      const that = this;
      if (val) {
        if (that.wayBillInfo.trackNumber) {
          that.lieyingLocation();
        } else {
          that.msgInfo('暂无APP定位！');
        }
      } else {
        that.$refs.map.$$getInstance().remove(that.lieyingMark); // 点移除
        // that.$refs.map.$$getInstance().setFitView([that.lieyingMark, that.jimiMark, that.zjxlMark]); // 执行定位
      }
    },
    jimiChecked(val) {
      const that = this;
      if (val) {
        if (that.queryParams.imeis) {
          that.jimiLocation();
        } else {
          that.msgInfo('暂无硬件定位！');
        }
      } else {
        that.$refs.map.$$getInstance().remove(that.jimiMark); // 点移除
        // that.$refs.map.$$getInstance().setFitView([that.lieyingMark, that.jimiMark, that.zjxlMark]); // 执行定位
      }
    },
    zjxlChecked(val) {
      const that = this;
      if (val) {
        that.zjxlLocation();
      } else {
        that.$refs.map.$$getInstance().remove(that.zjxlMark); // 点移除
        // that.$refs.map.$$getInstance().setFitView([that.lieyingMark, that.jimiMark, that.zjxlMark]); // 执行定位
      }
    }
  },
  created() {
  },
  methods: {
    // 获取车辆设备信息
    getDeviceInfo() {
      getDevice({ vehicleCode: this.wayBillInfo.vehicleCode, vendorCode: 'jimilot' }).then(response => {
        if (response.data.length > 0) {
          this.deviceInfo = response.data[0];
          this.queryParams.imeis = response.data[0].deviceImei;
        }
        // console.log(this.deviceInfo);
      });
    },
    /** 获取猎鹰定位 */
    lieyingLocation() {
      axios.get('https://tsapi.amap.com/v1/track/terminal/lastpoint', { params: this.lieyingQueryParams }).then(response => {
        console.log(response);
        if (response.data.data.location) {
          this.windowContent.gpsTime = this.parseTime(response.data.data.locatetime, '{y}-{m}-{d} {h}:{i}:{s}');
          this.lyLocation = response.data.data.location.split(',');
          this.lyMark();
        } else {
          this.msgInfo('暂无APP定位！');
        }
      });
    },
    // 猎鹰标记点
    lyMark() {
      const that = this;
      // 装货地marker
      that.lieyingMark = new AMap.Marker({
        position: that.lyLocation,
        ...this.marker
      });
      that.lieyingMark.setMap(that.$refs.map.$$getInstance()); // 点标记
      that.$refs.map.$$getInstance().setFitView([that.lieyingMark]); // 执行定位
      // 点标注的点击事件
      that.lieyingMark.on('click', function(e) {
        that.window.position = that.lyLocation;
        that.window.visible = !that.window.visible;
        that.windowContent.name = 'APP定位';
      });
    },
    /** 获取几米定位 */
    jimiLocation() {
      jimiLocation(this.queryParams).then(response => {
        // console.log(response);
        this.windowContent.gpsTime = response.data.result[0].gpsTime;
        this.windowContent.imeis = response.data.result[0].imei;
        this.location = response.data.result.map(function(response) {
          return [response.lng, response.lat];
        });
        console.log(this.location);
        this.jmLocation = this.location[0];
        // this.markers[0].position = this.location[0];
        if (this.jmLocation.length > 0) {
          this.jmMark();
        } else {
          this.msgInfo('暂无硬件定位！');
        }
      });
    },
    // 几米定位
    jmMark() {
      const that = this;
      that.jimiMark = new AMap.Marker({
        position: that.jmLocation,
        ...this.marker
      });
      that.jimiMark.setMap(that.$refs.map.$$getInstance()); // 点标记
      that.$refs.map.$$getInstance().setFitView([that.jimiMark]); // 执行定位
      // 点标注的点击事件
      that.jimiMark.on('click', function(e) {
        that.window.position = that.jmLocation;
        that.window.visible = !that.window.visible;
        that.windowContent.name = '硬件定位';
      });
    },
    /** 获取中交兴路定位 */
    zjxlLocation() {
      zjxlLocation(this.zjxlQueryParams).then(response => {
        var str = JSON.parse(response.msg);
        console.log(str);
        if (str.result) {
          this.windowContent.adr = str.result.adr;
          this.windowContent.gpsTime = this.parseTime(new Date(str.result.utc - 0), '{y}-{m}-{d} {h}:{i}:{s}');
          this.zjLocation = this.wgs84_to_gcj02(str.result.lon / 600000, str.result.lat / 600000);
          console.log(this.zjLocation);
          this.zjMark();
        } else {
          this.msgInfo('暂无北斗定位！');
        }
      });
    },
    // 中交兴路定位
    zjMark() {
      const that = this;
      that.zjxlMark = new AMap.Marker({
        position: that.zjLocation,
        ...this.marker
      });
      that.zjxlMark.setMap(that.$refs.map.$$getInstance()); // 点标记
      that.$refs.map.$$getInstance().setFitView([that.zjxlMark]); // 执行定位
      // 点标注的点击事件
      that.zjxlMark.on('click', function(e) {
        that.window.position = that.zjLocation;
        that.window.visible = !that.window.visible;
        that.windowContent.name = '北斗定位';
      });
    },
    /** 取消按钮 */
    cancel() {
      this.close();
    },
    // 关闭弹窗
    close() {
      this.$emit('update:open', false);
    },
    // 表单赋值
    setForm(data) {
      getWebDetail(data.code).then(response => {
        this.wayBillInfo = response.data;
        this.getDeviceInfo();
        this.marker = {
          icon: 'https://css-backup-1579076150310.obs.cn-south-1.myhuaweicloud.com/image_directory/cart.png',
          autoFitView: true,
          autoRotation: true,
          clickable: true,
          label: {
            content: this.wayBillInfo.licenseNumber,
            offset: new AMap.Pixel(-10, -34)
          }
        };
        // 中交车牌号参数赋值
        this.zjxlQueryParams.vclN = this.wayBillInfo.licenseNumber;
        // 猎鹰参数赋值
        if (this.wayBillInfo.trackNumber) {
          const trackNumber = this.wayBillInfo.trackNumber.split('|');
          console.log(trackNumber);
          this.lieyingQueryParams = {
            ...this.lieyingQueryParams,
            key: trackNumber[0],
            sid: trackNumber[1], // sid为终端所属service唯一编号
            tid: trackNumber[2], // tid为终端唯一编号
            trid: trackNumber[3] // trid为轨迹唯一编号
          };
          console.log(this.lieyingQueryParams);
        }
        this.lieyingChecked = true;
      });
      console.log(data);
      if (data.status === 2) {
        this.windowContent.status = '负载中';
      } else {
        this.windowContent.status = '空车';
      }
      this.windowContent.licenseNumber = data.licenseNumber;
      this.windowContent.driverName = data.driverName;
    }
  }
};
</script>

<style lang="scss" scoped>
.mr3 {
  margin-right: 3%;
}
.width90 {
  width: 90%;
}
.width28 {
  width: 28%;
}
.el-input-number ::v-deep.el-input__inner {
  text-align: left;
}
.el-rate{
  margin-top: 8px;
}
.map-content{
  height:600px;
  ::v-deep.amap-icon img{
  max-width: 55px !important;
  max-height: 28px !important;
}
}
.legend-frame{
  position: relative;
  right: 10px;
  top: 10px;
  z-index: 10;
  width: 165px;
  height: 130px;
  background: #FFFFFF;
  padding: 15px;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.15);
  border-radius: 2px;
}
.legend-color{
  margin-left: 10px;
  height: 15px;
  width: 50px;
  border-radius: 4px;
  opacity: 0.7;
}
</style>
