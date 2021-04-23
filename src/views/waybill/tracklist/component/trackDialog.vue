<template>
  <!-- 车辆跟踪对话框 -->
  <el-dialog :title="title" :visible="visible" width="1400px" append-to-body destroy-on-close @close="cancel">
    <div style="width:100%; height: 750px;">
      <el-amap ref="map" vid="DDCmap" :zoom="zoom" :center="center">
        <!-- <el-amap-polyline :path="polyline.path" :stroke-weight="8" line-join="round" :stroke-opacity="0.8" :stroke-color="'#0091ea'" /> -->
        <!-- <el-amap-marker v-for="(marker, index) in markers" :key="index" :position="marker.position" :icon="marker.icon" /> -->
      </el-amap>
    </div>
  </el-dialog>
</template>

<script>
import { trackLocation, getVehicleInfo, getInfoDetail } from '@/api/waybill/tracklist';
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
      unloadAddress: []
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
    open(val) {
      if (val) {
        this.getDetail();
      }
    }
  },
  created() {
    // this.getguiji();
  },
  methods: {
    // 获取装货详情
    getDetail() {
      getInfoDetail(this.wayBillInfo.waybillNo, 1).then(response => {
        console.log(response);
        const info = response.data[0];
        if (info.waybillAddres.loadLocation) {
          this.loadAddress = info.waybillAddres.loadLocation.replace('(', '').replace(')', '').split(',');
        }
        if (info.waybillAddres.unloadLocation) {
          this.unloadAddress = info.waybillAddres.unloadLocation.replace('(', '').replace(')', '').split(',');
        }
        if (this.loadAddress.length === 0) {
          this.loadAddress = [119.358267, 26.04577];
        }
        if (this.unloadAddress.length === 0) {
          this.unloadAddress = [119.344435, 25.721053];
        }
        this.getTrackLocation();
        this.getMark();
      });
    },
    /** 获取轨迹 */
    getTrackLocation() {
      trackLocation(this.queryParams).then(response => {
        // console.log(response.data.result);
        this.tracklist = response.data.result.map(function(response) {
          return [response.lng, response.lat];
        });
        // 绘制轨迹
        // this.drawPolyline(this.tracklist);
        // this.getMark(this.tracklist);
      });
      this.getRoutePlan();
    },
    // 获取高德地图路线规划
    getRoutePlan() {
      this.$nextTick(() => {
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
      });
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
      startMark.setMap(that.$refs.map.$$getInstance());
      // 卸货地marker
      const endPosition = that.unloadAddress;
      const endMark = new AMap.Marker({
        position: endPosition,
        icon: 'https://css-backup-1579076150310.obs.cn-south-1.myhuaweicloud.com/image_directory/unload.png',
        autoFitView: true,
        autoRotation: true
        // offset: new Pixel(-14, -20),
      });
      endMark.setMap(that.$refs.map.$$getInstance());
      that.$refs.map.$$getInstance().setFitView([startMark, endMark]);
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
      this.wayBillInfo = data;
      this.time = this.parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}');
      // this.queryParams.begin_time = data.fillTime;
      // if (data.signTime) {
      //   this.queryParams.end_time = data.signTime;
      // } else {
      //   this.queryParams.end_time = this.time;
      // }
      getVehicleInfo(data.vehicleCode).then(response => {
        this.vehicleInfo = response.data;
        console.log(this.vehicleInfo);
      });
      console.log(this.wayBillInfo);
    }
  }
};
</script>

<style scoped>
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
</style>
