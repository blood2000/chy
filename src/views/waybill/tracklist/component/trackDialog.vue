<template>
  <!-- 车辆跟踪对话框 -->
  <el-dialog :title="title" :visible="visible" width="1200px" append-to-body @close="cancel">
    <div style="height:600px;">
      <el-amap vid="amapDemo1" :zoom="zoom" :center="center">
        <el-amap-polyline :path="polyline.path" :stroke-weight="8" :stroke-opacity="0.8" :stroke-color="'#0091ea'" />
        <el-amap-marker v-for="(marker, index) in markers" :key="index" :position="marker.position" :icon="marker.icon" />
      </el-amap>
    </div>
  </el-dialog>
</template>

<script>
import { trackLocation } from '@/api/waybill/tracklist';
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
      center: [116.478928, 39.997761],
      graspRoad: '',
      polyline: {
        path: [
          [116.478928, 39.997761],
          [116.478907, 39.998422],
          [116.479384, 39.998546],
          [116.481053, 39.998204],
          [116.481793, 39.997868],
          [116.482898, 39.998217],
          [116.483789, 39.999063],
          [116.484674, 39.999844]
        ]
      },
      markers: [{
        icon: 'https://webapi.amap.com/theme/v1.3/markers/n/start.png',
        position: [116.478928, 39.997761]
      }, {
        icon: 'https://webapi.amap.com/theme/v1.3/markers/n/end.png',
        position: [116.484674, 39.999844]
      }],
      // 查询参数 map_type:GOOGOLE或BAIDU
      queryParams: {
        begin_time: '2021-03-22 08:00:00',
        end_time: '2021-03-22 09:00:00',
        imeis: '867567047562525',
        map_type: 'GOOGLE'
      },
      tracklist: []
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
        console.log(response);
        this.tracklist = response.data.result;
      });
    },
    /** 取消按钮 */
    cancel() {
      this.close();
      this.reset();
    },
    // 关闭弹窗
    close() {
      this.$emit('update:open', false);
    },
    // 表单赋值
    setForm(data) {
      this.form.wayBillInCode = data.code;
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
