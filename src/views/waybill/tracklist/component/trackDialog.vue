<template>
  <!-- 车辆跟踪对话框 -->
  <el-dialog :title="title" :visible="visible" width="1400px" append-to-body @close="cancel">
    <div style="width:100%; height: 750px;">
      <el-amap ref="map" vid="DDCamap" :zoom="zoom" :center="center">
        <el-amap-polyline :path="polyline.path" :stroke-weight="8" line-join="round" :stroke-opacity="0.8" :stroke-color="'#0091ea'" />
        <!-- <el-amap-polyline :path="polyline1.path" :stroke-weight="8" :stroke-opacity="0.8" :stroke-color="'#0091ea'" /> -->
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
      zoom: 16,
      center: [119.358267, 26.04577],
      graspRoad: '',
      polyline: {
        path: [[116.362209, 39.887487],
          [116.422897, 39.878002],
          [116.372105, 39.90651],
          [116.428945, 39.89663]]
      },
      polyline1: {
        path: []
      },
      // 表单参数
      form: {
        wayBillInCode: null,
        driverApplyRemark: null
      },
      // 表单校验
      rules: {
        driverApplyRemark: [
          { required: true, message: '取消理由不能为空', trigger: 'blur' }
        ]
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
  watch: {
    open(val) {
      if (val) {
        this.getTrackLocation();
      }
    }
  },
  created() {
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
        console.log(this.polyline);
        // 地图中心点
        this.center = this.tracklist[0];
        // 起点地址
        this.markers[0].position = this.tracklist[0];
        // 终点地址
        this.markers[1].position = this.tracklist[this.tracklist.length - 1];
        console.log(this.markers);
      });
      this.getguiji();
    },
    getguiji() {
      this.$nextTick(() => {
        const that = this;
        const driving = new AMap.TruckDriving({
        // 驾车路线规划策略，(1:尽量躲避拥堵而规划路径, 2:不走高速, 3:尽可能规划收费较低甚至免费的路径, 4:尽量躲避拥堵，并且不走高速 5:尽量不走高速，并且尽量规划收费较低甚至免费的路径结果
        // 6:尽量的躲避拥堵，并且规划收费较低甚至免费的路径结果, 7:尽量躲避拥堵，规划收费较低甚至免费的路径结果，并且尽量不走高速路, 8:会优先选择高速路, 9:会优先考虑高速路，并且会考虑路况躲避拥堵
        // 10:不考虑路况，返回速度优先的路线，此路线不一定距离最短, 11:躲避拥堵，速度优先以及费用优先；500Km规划以内会返回多条结果，500Km以外会返回单条结果)
          policy: 9,
          // map 指定将路线规划方案绘制到对应的AMap.Map对象上
          map: that.$refs.map.$$getInstance()
          // panel: 'DDCmap'
        });
        console.log(driving);
        driving.search([119.358267, 26.04577], [119.3444347318802, 25.72105270393117], function(status, result) {
          console.log(result);
          console.log(status);
          if (status === 'complete') {
            this.$success('绘制驾车路线完成');
          } else {
            this.$error('获取驾车数据失败：' + result);
          }
        // 未出错时，result即是对应的路线规划方案
        });
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
