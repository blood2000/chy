<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="18">
        <div style="width:100%; height: 600px;border-radius: 6px">
          <el-amap ref="map" vid="DDCmap" :zoom="zoom" :center="center" />
        </div>
      </el-col>
      <el-col :span="6">
        <div class="g-flex g-justifyaround">
          <div class="g-flex g-aligncenter g-justifycenter" :class="trackChange === 0 ? 'track-onbtn' : 'track-btn'" @click="handleTrackChange(0)">
            <div :class="trackChange === 0 ? 'track-onicon' : 'track-icon'" />APP轨迹
          </div>
          <div class="g-flex g-aligncenter g-justifycenter" :class="trackChange === 1 ? 'track-onbtn' : 'track-btn'" @click="handleTrackChange(1)">
            <div :class="trackChange === 1 ? 'track-onicon' : 'track-icon'" />硬件轨迹
          </div>
        </div>
        <ul class="time-line-content">
          <li v-for="(item, index) in timeLineList" :key="index" :class="index===0?'light':''">
            <p class="g-strong g-text">{{ parseTime(item.createTime, '{y}-{m}-{d} {h}:{i}') }}</p>
            <p class="g-color-gray g-text">{{ item.content }}</p>
            <!-- <p class="g-color-warning g-text">状态</p> -->
          </li>
        </ul>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { jimiTrackLocation, getLieyingInfo, getVehicleInfo, getWebDetail, getWaybillTrace } from '@/api/waybill/tracklist';
// import UploadImage from '@/components/UploadImage/index';
import axios from 'axios';

export default {
  name: 'Track',
  components: {
    // UploadImage
  },
  props: {
    waybill: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      zoom: 16,
      center: [119.358267, 26.04577],
      graspRoad: '',
      polyline: {
        path: []
      },
      markers: [{
        icon: 'https://css-backup-1579076150310.obs.cn-south-1.myhuaweicloud.com/image_directory/load.png',
        position: [119.358267, 26.04577]
      }, {
        icon: 'https://css-backup-1579076150310.obs.cn-south-1.myhuaweicloud.com/image_directory/unload.png',
        position: [119.358267, 26.04577]
      }],
      // jimi查询参数 map_type:GOOGOLE或BAIDU
      jimiQueryParams: {
        begin_time: '2021-03-22 08:00:00',
        end_time: '2021-03-22 09:00:00',
        imeis: '867567047562525',
        map_type: 'GOOGLE'
      },
      // 猎鹰查询参数
      lieyingQueryParams: {
        key: 'fd9430939b98767748c4b5e00df949c0',
        sid: 275116, // sid为终端所属service唯一编号
        tid: 338258525, // tid为终端唯一编号
        trid: '360', // trid为轨迹唯一编号
        starttime: '', // 必须为Unix时间戳精确到毫秒
        endtime: '' // 必须为Unix时间戳精确到毫秒
      },
      // 定位轨迹列表
      tracklist: [],
      // 运单信息
      wayBillInfo: {},
      // 车辆信息
      vehicleInfo: {},
      // 日期
      time: '',
      // 装卸货地经纬度
      loadAddress: [],
      unloadAddress: [],
      // 轨迹切换 0：app轨迹、1：硬件轨迹
      trackChange: 0,
      timeLineList: []
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
    // console.log(this.waybill);
    this.setForm(this.waybill);
  },
  methods: {
    // 轨迹切换
    handleTrackChange(e) {
      this.trackChange = e;
      this.getTrackLocation();
    },
    /** 获取轨迹 */
    getTrackLocation() {
      if (this.trackChange === 0) {
        // 获取猎鹰信息
        getLieyingInfo(this.wayBillInfo.driverCode).then(response => {
          // console.log(response);
          this.lieyingQueryParams.sid = response.data.serviceId;
          this.lieyingQueryParams.tid = response.data.terminalId;
          // console.log(this.lieyingQueryParams);
        });
        // 获取APP轨迹
        axios.get('https://tsapi.amap.com/v1/track/terminal/trsearch', { params: this.lieyingQueryParams }).then(response => {
          // console.log(response);
          if (response.data.data) {
            this.tracklist = response.data.data.tracks[0].points.map(function(response) {
              // console.log(response.location.split(','));
              return response.location.split(',');
            });
            // console.log(this.tracklist);
            if (this.tracklist.length !== 0) {
              // 绘制轨迹
              this.drawPolyline(this.tracklist);
            } else {
              // 获取高德地图路线规划
              this.getRoutePlan();
            }
          } else {
            // 获取高德地图路线规划
            this.getRoutePlan();
          }
        });
      } else {
        // 获取硬件轨迹
        jimiTrackLocation(this.jimiQueryParams).then(response => {
          // console.log(response.data.result);
          if (response.data.result) {
            this.tracklist = response.data.result.map(function(response) {
              return [response.lng, response.lat];
            });
            if (this.tracklist.length !== 0) {
              // 绘制轨迹
              this.drawPolyline(this.tracklist);
            } else {
              // 获取高德地图路线规划
              this.getRoutePlan();
            }
          }
        });
      }
    },
    // 获取高德地图路线规划
    getRoutePlan() {
      const that = this;
      const driving = new AMap.Driving({
        policy: AMap.DrivingPolicy.LEAST_TIME
        // map 指定将路线规划方案绘制到对应的AMap.Map对象上
        // map: that.$refs.map.$$getInstance()
        // panel: 'DDCmap',
      });
      driving.search(that.loadAddress, that.unloadAddress, function(status, result) {
        if (status === 'complete') {
          const { routes = [] } = result;
          const { steps = [] } = routes[0];
          const pathArr = [];
          steps.map(i => {
            pathArr.push(i.path);
            return pathArr;
          });
          const path = [].concat.apply([], pathArr);
          // 绘制轨迹
          that.drawPolyline(path);
        } else {
          console.log('获取驾车数据失败');
        }
        // 未出错时，result即是对应的路线规划方案
      });
      // this.$nextTick(() => {

      // });
    },
    // 起点终点
    getMark() {
      const that = this;
      // 装货地marker
      const startPosition = that.loadAddress;
      const startMark = new AMap.Marker({
        position: startPosition,
        icon: 'https://css-backup-1579076150310.obs.cn-south-1.myhuaweicloud.com/image_directory/load.png',
        autoFitView: true,
        autoRotation: true
        // offset: new Pixel(-14, -20),
      });
      startMark.setMap(that.$refs.map.$$getInstance()); // 点标记
      // 卸货地marker
      const endPosition = that.unloadAddress;
      const endMark = new AMap.Marker({
        position: endPosition,
        icon: 'https://css-backup-1579076150310.obs.cn-south-1.myhuaweicloud.com/image_directory/unload.png',
        autoFitView: true,
        autoRotation: true
        // offset: new Pixel(-14, -20),
      });
      endMark.setMap(that.$refs.map.$$getInstance()); // 点标记
      that.$refs.map.$$getInstance().setFitView([startMark, endMark]); // 执行定位
    },
    // 绘制轨迹
    drawPolyline(path) {
      // console.log(path);
      const that = this;
      const polyline = new window.AMap.Polyline({
        map: that.$refs.map.$$getInstance(),
        path,
        showDir: true,
        strokeColor: '#0083F9', // 线颜色
        isOutline: true, // 是否描边
        outlineColor: '#fff', // 描边颜色
        strokeOpacity: 0.8, // 线透明度
        strokeWeight: 10, // 线宽
        strokeStyle: 'solid', // 线样式
        lineJoin: 'round', // 折线拐点的绘制样式
        zIndex: 999
      });
      polyline.setMap(that.$refs.map.$$getInstance());
    },
    // 获取车辆信息
    getvehicleInfo() {
      getVehicleInfo(this.waybill.vehicleCode).then(response => {
        this.vehicleInfo = response.data;
        // console.log(this.vehicleInfo);
      });
    },
    /** 取消按钮 */
    cancel() {
      this.close();
    },
    // 关闭弹窗
    close() {
      this.$emit('update:open', false);
      this.loadAddress = [];
      this.unloadAddress = [];
      this.tracklist = [];
    },
    // 表单赋值
    setForm(data) {
      // 获取运单信息，并标记装卸货地
      getWebDetail(data.code).then(response => {
        // console.log(response);
        this.wayBillInfo = response.data;
        // 获取装卸货地址经纬度
        if (this.wayBillInfo.waybillAddress.loadLocation) {
          this.loadAddress = this.wayBillInfo.waybillAddress.loadLocation.replace('(', '').replace(')', '').split(',');
          // console.log(this.loadAddress);
        } else {
          // this.loadAddress = [119.358267, 26.04577];
          this.loadAddress = [];
        }
        if (this.wayBillInfo.waybillAddress.unloadLocation) {
          this.unloadAddress = this.wayBillInfo.waybillAddress.unloadLocation.replace('(', '').replace(')', '').split(',');
          // console.log(this.unloadAddress);
        } else {
          // this.unloadAddress = [119.344435, 25.721053];
          this.unloadAddress = [];
        }
        // 获取查询轨迹时间
        this.time = this.parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}');
        this.jimiQueryParams.begin_time = this.parseTime(this.wayBillInfo.fillTime, '{y}-{m}-{d} {h}:{i}:{s}');
        this.lieyingQueryParams.starttime = new Date(this.wayBillInfo.fillTime).getTime();
        if (this.wayBillInfo.signTime) {
          this.jimiQueryParams.end_time = this.parseTime(this.wayBillInfo.signTime, '{y}-{m}-{d} {h}:{i}:{s}');
          this.lieyingQueryParams.endtime = new Date(this.wayBillInfo.signTime).getTime();
        } else {
          this.jimiQueryParams.end_time = this.time;
          this.lieyingQueryParams.endtime = new Date().getTime();
        }
        if (this.loadAddress && this.unloadAddress) {
          // 标记装卸货地址
          this.getMark();
          // 获取路线
          this.getTrackLocation();
        }
      });
      // 轨迹时间线
      getWaybillTrace(data.code).then(response => {
        response.data.forEach(el => {
          this.timeLineList.unshift(el);
        });
      });
    }
  }
};
</script>

<style scoped lang="scss">
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
.track-onbtn{
  cursor: pointer;
  width: 124px;
  height: 32px;
  background: #409EFF;
  border-radius: 18px;
  line-height: 22px;
  color: #FFFFFF;
  .track-onicon{
    margin-right: 10px;
    height: 10px;
    width: 10px;
    border-radius: 50%;
    background: #FFFFFF;
    border: 3px solid #1570CE;
  }
}
.track-btn{
  cursor: pointer;
  width: 124px;
  height: 32px;
  background: #F6F6F6;
  border-radius: 18px;
  line-height: 22px;
  color: #000000;
  .track-icon{
    margin-right: 10px;
    height: 10px;
    width: 10px;
    border-radius: 50%;
    background: #B2B4B9;
  }
}



/* 轨迹-时间线 */
.time-line-content{
  margin: 20px 0 0;
  padding: 20px;
  border: 1px solid rgba(0, 0, 0, 0);
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.09);
  max-height: 600px;
  overflow: scroll;
  >li{
    position: relative;
    padding: 0 0 20px 20px;
    border-left: 1px dashed #d2d4da;
    &::before{
      content: '';
      position: absolute;
      top: 5px;
      left: -6px;
      width: 11px;
      height: 11px;
      border-radius: 100%;
      background: #d2d4da;
    }
    &.light{
      &::before{
        content: '';
        background: #409EFF;
      }
    }
  }
}
</style>
