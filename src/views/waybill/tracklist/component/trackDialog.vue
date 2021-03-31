<template>
  <!-- 车辆跟踪对话框 -->
  <el-dialog :title="title" :visible="visible" width="800px" append-to-body @close="cancel">
    <div style="width:100%; height: 500px;">
      <el-amap v-if="visible" vid="amapDemo" :center="center" :zoom="zoom" />
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
      center: [121.59996, 31.197646],
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
