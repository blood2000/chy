<template>
  <!-- 车辆跟踪对话框 -->
  <el-dialog :title="title" :visible="visible" width="1400px" append-to-body @close="cancel">
    <div style="height:750px;">
      <el-amap vid="amapDemo1" :zoom="zoom" :center="center">
        <el-amap-polyline :path="polyline.path" :stroke-weight="8" :stroke-opacity="0.8" :stroke-color="'#0091ea'" />
        <el-amap-marker v-for="(marker, index) in markers" :key="index" :position="marker.position" :icon="marker.icon" />
      </el-amap>
    </div>
  </el-dialog>
</template>

<script>
import { trackLocation, getVehicleInfo } from '@/api/waybill/tracklist';
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
      zoom: 12,
      center: [],
      graspRoad: '',
      polyline: {
        path: [
          // [116.478928, 39.997761],
          // [116.478907, 39.998422],
          // [116.479384, 39.998546],
          // [116.481053, 39.998204],
          // [116.481793, 39.997868],
          // [116.482898, 39.998217],
          // [116.483789, 39.999063],
          // [116.484674, 39.999844]
        ]
      },
      markers: [{
        icon: 'https://webapi.amap.com/theme/v1.3/markers/n/start.png',
        position: []
      }, {
        icon: 'https://webapi.amap.com/theme/v1.3/markers/n/end.png',
        position: []
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
      // 日期格式
      Hours: '',
      Minutes: '',
      Seconds: '',
      time: ''
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
    this.getTrackLocation();
  },
  methods: {
    /** 获取轨迹 */
    getTrackLocation() {
      trackLocation(this.queryParams).then(response => {
        // console.log(response.data.result);
        this.tracklist = response.data.result.map(function(response) {
          return [response.lng, response.lat];
        });
        this.polyline.path = this.tracklist;
        // 地图中心点
        this.center = this.tracklist[0];
        // 起点地址
        this.markers[0].position = this.tracklist[0];
        // 终点地址
        this.markers[1].position = this.tracklist[this.tracklist.length - 1];
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

<style>
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
