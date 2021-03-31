<template>
  <!-- 车辆定位对话框 -->
  <el-dialog :title="title" :visible="visible" width="1400px" append-to-body @close="cancel">
    <div class="map-content">
      <el-amap vid="amapDemo" :zoom="zoom" :center="center">
        <el-amap-marker v-for="(marker, index) in markers" :key="index" :events="marker.events" :position="marker.position" :icon="marker.icon" :label="marker.label" />
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
                <div>{{ windowContent.driverName }}</div>
              </el-col>
            </el-row>
            <el-row type="flex" class="row-bg" style="margin-top: 5px">
              <el-col :span="6">
                <div style="text-align: right;">车牌号：</div>
              </el-col>
              <el-col :span="18">
                <div>{{ windowContent.licenseNumber }}</div>
              </el-col>
            </el-row>
            <el-row type="flex" class="row-bg" style="margin-top: 5px">
              <el-col :span="6">
                <div style="text-align: right;">设备号：</div>
              </el-col>
              <el-col :span="18">
                <div>{{ windowContent.imeis }}</div>
              </el-col>
            </el-row>
            <el-row type="flex" class="row-bg" style="margin-top: 5px">
              <el-col :span="6">
                <div style="text-align: right;">定位时间：</div>
              </el-col>
              <el-col :span="18">
                <div>{{ windowContent.gpsTime }}</div>
              </el-col>
            </el-row>
          </div>
        </el-amap-info-window>
      </el-amap>
    </div>
  </el-dialog>
</template>

<script>
import { location } from '@/api/waybill/tracklist';
// import UploadImage from '@/components/UploadImage/index';

export default {
  name: 'LocationDialog',
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
      // 缩放级别
      zoom: 16,
      // 中心点坐标
      center: [],
      // 标记点列表
      markers: [{
        icon: 'https://ddcwl.com/static/img/admin/sys/cc.png',
        position: [],
        label: {
          content: '辽NC2589',
          offset: [-10, -34]
        },
        events: {
          click: () => {
            this.window.visible = !this.window.visible;
            // this.window.position = this.markers[0].position;
            // alert('click marker');
          }
        }
      }],
      // 信息窗体
      window: {
        position: [],
        events: {},
        visible: false,
        offset: [0, -70]
      },
      // 信息窗体内容
      windowContent: {
        status: '',
        driverName: '',
        licenseNumber: '',
        imeis: '',
        gpsTime: ''
      },
      // 查询参数 map_type:GOOGOLE或BAIDU
      queryParams: {
        imeis: '867567047562525',
        map_type: 'GOOGLE'
      },
      // 表单校验
      rules: {
        driverApplyRemark: [
          { required: true, message: '取消理由不能为空', trigger: 'blur' }
        ]
      },
      // 获取到的定位
      location: [],
      wayBillInfo: []
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
        this.getLocation();
      }
    }
  },
  created() {
  },
  methods: {
    /** 提交按钮 */
    getLocation() {
      location(this.queryParams).then(response => {
        // console.log(response);
        this.windowContent.gpsTime = response.data.result[0].gpsTime;
        this.windowContent.imeis = response.data.result[0].imei;
        this.location = response.data.result.map(function(response) {
          return [response.lng, response.lat];
        });
        this.center = this.location[0];
        this.markers[0].position = this.location[0];
        this.window.position = this.location[0];
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
      if (data.status === 2) {
        this.windowContent.status = '负载中';
      } else {
        this.windowContent.status = '空车';
      }
      this.windowContent.licenseNumber = data.licenseNumber;
      this.windowContent.driverName = data.driverName;
      console.log(this.wayBillInfo);
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
  height:750px;
  ::v-deep.amap-icon img{
  max-width: 40px !important;
  max-height: 30px !important;
}
}

</style>
