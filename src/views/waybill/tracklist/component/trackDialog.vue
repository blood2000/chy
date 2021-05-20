<template>
  <!-- 车辆跟踪对话框 -->
  <el-dialog :title="title" :visible="visible" width="1400px" append-to-body destroy-on-close :close-on-click-modal="false" @close="cancel">
    <el-row :gutter="20">
      <el-col :span="18">
        <div style="width:100%; height: 650px;border-radius: 6px">
          <el-amap ref="map" vid="DDCmap" :zoom="zoom" :center="center">
            <!-- <el-amap-polyline :path="polyline.path" :stroke-weight="8" line-join="round" :stroke-opacity="0.8" :stroke-color="'#0091ea'" /> -->
            <!-- <el-amap-marker v-for="(marker, index) in markers" :key="index" :position="marker.position" :icon="marker.icon" /> -->
          </el-amap>
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
  </el-dialog>
</template>

<script>
import { jimiTrackLocation, getVehicleInfo, getInfoDetail, getWaybillTrace } from '@/api/waybill/tracklist';
// import UploadImage from '@/components/UploadImage/index';

export default {
  name: 'TrackDialog',
  components: {
    // UploadImage
  },
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
      // 查询参数 map_type:GOOGOLE或BAIDU
      queryParams: {
        begin_time: '2021-03-22 08:00:00',
        end_time: '2021-03-22 09:00:00',
        imeis: '867567047562525',
        map_type: 'GOOGLE'
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
    // this.getguiji();
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
        console.log(this.loadAddress, this.unloadAddress);
        // 获取高德地图路线规划
        this.getRoutePlan();
      } else {
        jimiTrackLocation(this.queryParams).then(response => {
          console.log(response.data.result);
          if (response.data.result) {
            this.tracklist = response.data.result.map(function(response) {
              return [response.lng, response.lat];
            });
          }
        });
        if (this.tracklist.length !== 0) {
          // 绘制轨迹
          this.drawPolyline(this.tracklist);
        } else {
          // 获取高德地图路线规划
          this.getRoutePlan();
        }
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
          console.log(path);
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
      getInfoDetail(data.code).then(response => {
        console.log(response);
        this.wayBillInfo = response.data;
        // 获取装卸货地址经纬度
        if (this.wayBillInfo.loadLocation) {
          // this.loadAddress = info.loadLocation.replace('(', '').replace(')', '').split(',');
          this.loadAddress[0] = this.wayBillInfo.loadLocation[1];
          this.loadAddress[1] = this.wayBillInfo.loadLocation[0];
        } else {
          this.loadAddress = [119.358267, 26.04577];
        }
        if (this.wayBillInfo.unloadLocation) {
          this.unloadAddress[0] = this.wayBillInfo.unloadLocation[1];
          this.unloadAddress[1] = this.wayBillInfo.unloadLocation[0];
        } else {
          this.unloadAddress = [119.344435, 25.721053];
        }
        // 获取查询轨迹时间
        this.time = this.parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}');
        this.queryParams.begin_time = this.wayBillInfo.loadTime;
        if (this.wayBillInfo.unloadTime) {
          this.queryParams.end_time = this.wayBillInfo.unloadTime;
        } else {
          this.queryParams.end_time = this.time;
        }
        // 标记装卸货地址
        this.getMark();
        // 获取路线
        this.getTrackLocation();
      });
      // 轨迹时间线
      getWaybillTrace(data.code).then(response => {
        response.data.forEach(el => {
          this.timeLineList.unshift(el);
        });
      });
      getVehicleInfo(data.vehicleCode).then(response => {
        this.vehicleInfo = response.data;
        console.log(this.vehicleInfo);
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
