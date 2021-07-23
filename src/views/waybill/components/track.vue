<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="18">
        <div style="width:100%; height: 600px;border-radius: 6px">
          <div class="g-flex g-justifyend" style="width:100%; height: 0;border-radius: 6px">
            <div class="legend-frame">
              <el-checkbox v-model="checked" style="margin-bottom:10px;">显示规划轨迹</el-checkbox>
              <div class="g-aligncenter" style="margin-bottom:10px;"><div class="legend-color" style="background:#1990FF;" />APP轨迹</div>
              <div class="g-aligncenter" style="margin-bottom:10px;"><div class="legend-color" style="background:#08B8A7;" />硬件轨迹</div>
              <div class="g-aligncenter" style="margin-bottom:10px;"><div class="legend-color" style="background:#67C23A;" />北斗轨迹</div>
              <div class="g-aligncenter" style="margin-bottom:10px;"><div class="legend-color" style="background:#FB8720;" />规划轨迹</div>
            </div>
          </div>
          <el-amap ref="map" vid="DDCmap" :zoom="zoom" :center="center" />
          <div :class="isPlan? 'noliston-frame':'nolist-frame'">
            <div :class="isPlan? 'noliston':'nolist'" />
          </div>
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
          <div v-if="!isShipment" class="g-flex g-aligncenter g-justifycenter" :class="trackChange === 2 ? 'track-onbtn' : 'track-btn'" @click="handleTrackChange(2)">
            <div :class="trackChange === 2 ? 'track-onicon' : 'track-icon'" />北斗轨迹
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
import { jimiTrackLocation, zjxlTrackLocation, getVehicleInfo, getWebDetail, getWaybillTrace, addZjxl, queryZjxl } from '@/api/waybill/tracklist';
import axios from 'axios';
import { getUserInfo } from '@/utils/auth';

export default {
  name: 'Track',
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
      planline: {
        path: []
      },
      vehicleMark: undefined,
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
        key: undefined,
        sid: undefined, // sid为终端所属service唯一编号
        tid: undefined, // tid为终端唯一编号
        trid: undefined, // trid为轨迹唯一编号
        starttime: undefined, // 必须为Unix时间戳精确到毫秒
        endtime: undefined, // 必须为Unix时间戳精确到毫秒
        correction: 'denoise=1,mapmatch=1,attribute=0,threshold=0,mode=driving', // 对轨迹进行处理
        recoup: 1, // 对轨迹进行补点
        page: 1,
        pagesize: 999
      },
      // 中交兴路轨迹查询参数
      zjxlQueryParams: {
        qryBtm: undefined,
        qryEtm: undefined,
        vclN: '陕YH0008'
      },
      // 中交兴路轨迹存储参数
      zjxlAddParams: {
        licenseNumber: undefined,
        startTime: undefined,
        endTime: undefined,
        trackData: undefined,
        type: 'zjxl'
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
      // 轨迹切换 0：app轨迹、1：硬件轨迹、2：北斗轨迹
      trackChange: 0,
      timeLineList: [],
      // 轨迹查询参数结束时间
      queryEndtime: '',
      timePoor: undefined,
      isPlan: false,
      isShipment: false,
      // 轨迹颜色
      lineColor: undefined,
      // 是否显示规划轨迹
      checked: false
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
    checked(val) {
      if (val) {
        // 获取高德地图路线规划
        this.getRoutePlan();
      } else {
        const that = this;
        that.$refs.map.$$getInstance().remove(that.planline);
      }
    }
  },
  created() {
    const { isShipment = false } = getUserInfo() || {};
    this.isShipment = isShipment;
    // console.log(this.waybill);
    this.setForm(this.waybill);
  },
  methods: {
    // 轨迹切换
    handleTrackChange(e) {
      this.trackChange = e;
      this.getTrackLocation();
      const that = this;
      if (this.vehicleMark) {
        that.$refs.map.$$getInstance().remove(this.vehicleMark);
      }
    },
    /** 获取轨迹 */
    getTrackLocation() {
      this.isPlan = false;
      if (this.wayBillInfo.fillTime) {
        if (this.trackChange === 0) {
          // 获取APP轨迹
          this.getLieyingTime();
        } else if (this.trackChange === 1) {
          // 获取硬件轨迹
          jimiTrackLocation(this.jimiQueryParams).then(response => {
          // console.log(response.data.result);
            if (response.data.result) {
              this.tracklist = response.data.result.map(function(response) {
                return [response.lng, response.lat];
              });
              console.log(this.tracklist);
              if (this.tracklist.length !== 0) {
              // 绘制轨迹
                this.drawPolyline(this.tracklist);
                if (!this.wayBillInfo.signTime) {
                  this.getVehicleMark();
                }
              } else {
              // 获取高德地图路线规划
                // this.getRoutePlan();
              }
            } else {
              // 获取高德地图路线规划
              // this.getRoutePlan();
            }
          });
        } else if (this.trackChange === 2) {
          queryZjxl(this.zjxlAddParams).then(res => {
            console.log(res);
            if (res.data) {
              this.tracklist = res.data.trackDataList;
              if (!this.wayBillInfo.signTime || (this.wayBillInfo.signTime.getTime() > res.data.endTime.getTime())) {
                this.zjxlQueryParams.qryBtm = this.parseTime(res.data.endTime, '{y}-{m}-{d} {h}:{i}:{s}');
                // 获取中交兴路轨迹
                this.getZjxlTime();
              } else {
                // 绘制轨迹
                this.drawPolyline(this.tracklist);
              }
            } else {
              // 获取中交兴路轨迹
              this.getZjxlTime();
            }
          });
        }
      }
    },
    // 猎鹰循环判断开始时间与结束时间
    getLieyingTime() {
      this.timePoor = this.lieyingQueryParams.endtime - this.lieyingQueryParams.starttime;
      if (this.timePoor > 24 * 60 * 60 * 1000) {
        this.lieyingQueryParams.endtime = this.lieyingQueryParams.starttime + 24 * 60 * 60 * 1000;
        this.getLieying();
      } else if (this.timePoor === 0) {
        if (this.tracklist.length !== 0) {
          // 绘制轨迹
          this.drawPolyline(this.tracklist);
          if (!this.wayBillInfo.signTime) {
            this.getVehicleMark();
          }
        } else {
          // 获取高德地图路线规划
          // this.getRoutePlan();
        }
      } else if (this.timePoor !== 0 && this.timePoor < 24 * 60 * 60 * 1000) {
        this.getLieying();
      }
    },
    // 调用猎鹰获取轨迹
    getLieying() {
      axios.get('https://tsapi.amap.com/v1/track/terminal/trsearch', { params: this.lieyingQueryParams }).then(response => {
        if (response.data.data) {
          this.tracklist = [
            ...this.tracklist,
            ...response.data.data.tracks[0].points.map(function(response) {
              return response.location.split(',');
            })
          ];
        }
        this.lieyingQueryParams.starttime = this.lieyingQueryParams.endtime;
        this.lieyingQueryParams.endtime = this.queryEndtime.getTime();
        // console.log(this.lieyingQueryParams);
        this.getLieyingTime();
      });
    },
    // 中交兴路循环判断开始时间与结束时间
    getZjxlTime() {
      this.timePoor = new Date(this.zjxlQueryParams.qryEtm).getTime() - new Date(this.zjxlQueryParams.qryBtm).getTime();
      if (this.timePoor > 24 * 60 * 60 * 1000) {
        this.zjxlQueryParams.qryEtm = this.parseTime(new Date(this.zjxlQueryParams.qryBtm).getTime() + 24 * 60 * 60 * 1000, '{y}-{m}-{d} {h}:{i}:{s}');
        this.getZjxl();
      } else if (this.timePoor === 0) {
        // 绘制轨迹
        this.drawPolyline(this.tracklist);
        if (!this.wayBillInfo.signTime) {
          this.getVehicleMark();
        }
      } else if (this.timePoor !== 0 && this.timePoor < 24 * 60 * 60 * 1000) {
        this.getZjxl();
      }
    },
    // 调用中交兴路获取轨迹
    getZjxl() {
      zjxlTrackLocation(this.zjxlQueryParams).then(response => {
        var str = JSON.parse(response.msg);
        console.log(str);
        // 坐标系转换
        var list = str.result.map(res => {
          return this.wgs84_to_gcj02(res.lon / 600000, res.lat / 600000);
        });
        if (str.result.length !== 0) {
          addZjxl({ ...this.zjxlAddParams, trackDataList: list }).then(res => {
            console.log(res);
          });
          this.tracklist = [
            ...this.tracklist,
            ...list
          ];
        }
        this.zjxlQueryParams.qryBtm = this.zjxlQueryParams.qryEtm;
        this.zjxlQueryParams.qryEtm = this.parseTime(this.queryEndtime, '{y}-{m}-{d} {h}:{i}:{s}');
        // console.log(this.zjxlQueryParams);
        this.getZjxlTime();
      });
    },
    // 获取高德地图路线规划
    getRoutePlan() {
      const that = this;
      that.isPlan = true;
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
          that.planline = new window.AMap.Polyline({
            map: that.$refs.map.$$getInstance(),
            path,
            showDir: true,
            strokeColor: '#FB8720', // 线颜色
            isOutline: true, // 是否描边
            outlineColor: '#fff', // 描边颜色
            strokeOpacity: 0.7, // 线透明度
            strokeWeight: 10, // 线宽
            strokeStyle: 'solid', // 线样式
            lineJoin: 'round', // 折线拐点的绘制样式
            zIndex: 999
          });
          that.planline.setMap(that.$refs.map.$$getInstance());
          // that.$refs.map.$$getInstance().setFitView(that.planline); // 执行定位
        } else {
          console.log('获取驾车数据失败');
        }
        // 未出错时，result即是对应的路线规划方案
      });
      // this.$nextTick(() => {

      // });
    },
    getVehicleMark() {
      const that = this;
      that.vehicleMark = new AMap.Marker({
        position: that.tracklist[that.tracklist.length - 1],
        icon: 'https://css-backup-1579076150310.obs.cn-south-1.myhuaweicloud.com/image_directory/icon_car1624672021156.png',
        autoFitView: true,
        autoRotation: true,
        offset: new AMap.Pixel(-35, -17)
      });
      that.vehicleMark.setMap(that.$refs.map.$$getInstance()); // 点标记
    },
    // 起点终点
    getMark() {
      const that = this;
      // 装货地marker
      const startPosition = that.loadAddress;
      const startMark = new AMap.Marker({
        position: startPosition,
        icon: 'https://css-backup-1579076150310.obs.cn-south-1.myhuaweicloud.com/image_directory/icon_load1624672027526.png',
        autoFitView: true,
        autoRotation: true,
        offset: new AMap.Pixel(-17, -35)
      });
      startMark.setMap(that.$refs.map.$$getInstance()); // 点标记
      // 卸货地marker
      const endPosition = that.unloadAddress;
      const endMark = new AMap.Marker({
        position: endPosition,
        icon: 'https://css-backup-1579076150310.obs.cn-south-1.myhuaweicloud.com/image_directory/icon_unload1624672033390.png',
        autoFitView: true,
        autoRotation: true,
        offset: new AMap.Pixel(-17, -35)
      });
      endMark.setMap(that.$refs.map.$$getInstance()); // 点标记
      that.$refs.map.$$getInstance().setFitView([startMark, endMark]); // 执行定位
    },
    // 绘制轨迹
    drawPolyline(path) {
      console.log(path);
      if (this.trackChange === 1) {
        this.lineColor = '#08B8A7';
      } else if (this.trackChange === 2) {
        this.lineColor = '#67C23A';
      } else {
        this.lineColor = '#1990FF';
      }
      const that = this;
      if (that.polyline) {
        that.$refs.map.$$getInstance().remove(that.polyline);
      }
      that.polyline = new window.AMap.Polyline({
        map: that.$refs.map.$$getInstance(),
        path,
        showDir: true,
        strokeColor: this.lineColor, // 线颜色
        isOutline: true, // 是否描边
        outlineColor: '#fff', // 描边颜色
        strokeOpacity: 0.7, // 线透明度
        strokeWeight: 10, // 线宽
        strokeStyle: 'solid', // 线样式
        lineJoin: 'round', // 折线拐点的绘制样式
        zIndex: 999
      });
      that.polyline.setMap(that.$refs.map.$$getInstance());
      that.$refs.map.$$getInstance().setFitView(that.polyline); // 执行定位
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
      // console.log(data);
      // 获取运单信息，并标记装卸货地
      getWebDetail(data.code).then(response => {
        this.wayBillInfo = response.data;
        // 中交车牌号参数赋值
        this.zjxlQueryParams.vclN = this.wayBillInfo.licenseNumber;
        this.zjxlAddParams.licenseNumber = this.wayBillInfo.licenseNumber;
        // console.log(this.wayBillInfo);
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
        this.zjxlQueryParams.qryBtm = this.parseTime(this.wayBillInfo.fillTime, '{y}-{m}-{d} {h}:{i}:{s}');
        this.zjxlAddParams.startTime = this.parseTime(this.wayBillInfo.fillTime, '{y}-{m}-{d} {h}:{i}:{s}');
        this.lieyingQueryParams.starttime = new Date(this.wayBillInfo.fillTime).getTime();
        if (this.wayBillInfo.signTime) {
          this.jimiQueryParams.end_time = this.parseTime(this.wayBillInfo.signTime, '{y}-{m}-{d} {h}:{i}:{s}');
          this.zjxlQueryParams.qryEtm = this.parseTime(this.wayBillInfo.signTime, '{y}-{m}-{d} {h}:{i}:{s}');
          this.zjxlAddParams.endTime = this.parseTime(this.wayBillInfo.signTime, '{y}-{m}-{d} {h}:{i}:{s}');
          this.lieyingQueryParams.endtime = new Date(this.wayBillInfo.signTime).getTime();
          this.queryEndtime = new Date(this.wayBillInfo.signTime);
        } else {
          this.jimiQueryParams.end_time = this.time;
          this.zjxlQueryParams.qryEtm = this.time;
          this.zjxlAddParams.endTime = this.time;
          this.lieyingQueryParams.endtime = new Date().getTime();
          this.queryEndtime = new Date();
        }
        if (this.loadAddress.length !== 0 && this.unloadAddress.length !== 0) {
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
.shadow{
  box-shadow: 10px 10px 5px #888888;
}
.nolist-frame{
	position: relative;
  bottom: 70px;
	z-index: 999;
	height: 0;
	width: 100%;
	background: linear-gradient(#FFFFFF00 20%, #FFFFFF 80%);
}
.nolist{
	height: 70px;
	width: 100%;
	background: linear-gradient(#FFFFFF00 20%, #FFFFFF 80%);
}
.noliston-frame{
	position: relative;
  bottom: 55px;
	z-index: 999;
	height: 0;
	width: 100%;
	background: linear-gradient(#FFFFFF00 20%, #FFFFFF 80%);
}
.noliston{
	height: 55px;
	width: 100%;
	background: linear-gradient(#FFFFFF00 20%, #FFFFFF 80%);
}
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
  padding: 0 15px;
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
  // width: 124px;
  padding: 0 15px;
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

::v-deep .amap-icon img{
  height: 35px;
}

.legend-frame{
  position: relative;
  right: 10px;
  top: 10px;
  z-index: 10;
  width: 150px;
  height: 160px;
  background: #FFFFFF;
  padding: 15px;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.15);
  border-radius: 2px;
}
.legend-color{
  margin-right: 10px;
  height: 15px;
  width: 50px;
  border-radius: 4px;
  opacity: 0.7;
}
</style>
