<template>
  <div class="mapframe">
    <el-amap ref="map" class="amap" vid="amap" :zoom="zoom" :center="center" />
  </div>
</template>

<script>
import { getWebDetail } from '@/api/waybill/tracklist';
// import UploadImage from '@/components/UploadImage/index';
import { handleBatchDownload } from '@/libs/trackExport';


export default {
  name: 'Track',
  components: {
    // UploadImage
  },
  props: {
    waybill: {
      type: Array,
      default: function() {
        return [];
      }
    },
    open: Boolean
  },
  data() {
    return {
      zoom: 16,
      center: [119.358267, 26.04577],
      polyline: {
        path: []
      },
      graspRoad: '',
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
      timeLineList: [],
      // 轨迹查询参数结束时间
      queryEndtime: '',
      timePoor: undefined,
      isPlan: false,
      images: [],
      waybillIndex: 0
    };
  },
  watch: {
    waybill(val) {
      if (val) {
        this.$emit('update:open', true);
        this.images = [];
        this.waybillIndex = 0;
        this.setForm(val);
      }
    }
  },
  created() {
    // this.setForm(this.waybill);
  },
  methods: {
    screenshot() {
      const targetDom = document.querySelector('#amap'); // 获取要截图的元素
      // domtoimage 截图
      this.domtoimage.toPng(targetDom).then((dataUrl) => {
        this.images.push(dataUrl);
        if (this.images.length === this.waybill.length) {
          this.handleBatchDownload();
          this.$emit('update:open', false);
        } else {
          this.waybillIndex = this.waybillIndex + 1;
          console.log(this.waybillIndex);
          this.setForm(this.waybill);
        }
      }).catch(function(error) {
        console.error('失败===', error);
      });
    },
    /** 获取轨迹 */
    getTrackLocation() {
      // 获取高德地图路线规划
      this.getRoutePlan();
    },
    // 获取高德地图路线规划
    getRoutePlan() {
      const that = this;
      that.isPlan = true;
      const driving = new AMap.Driving({
        policy: AMap.DrivingPolicy.LEAST_TIME
        // map 指定将路线规划方案绘制到对应的AMap.Map对象上
        // map: that.$refs.map.$$getInstance()
        // panel: 'amap',
      });
      driving.search(that.loadAddress, that.unloadAddress, function(status, result) {
        if (status === 'complete') {
          const { routes = [] } = result;
          const { steps } = routes[0];
          const pathArr = steps.map(i => i.path);
          var path = [].concat.apply([], pathArr);
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
      that.$refs.map.$$getInstance().remove([startMark, endMark]);
      // 装货地marker
      const startPosition = that.loadAddress;
      const startMark = new AMap.Marker({
        position: startPosition,
        // icon: 'https://css-backup-1579076150310.obs.cn-south-1.myhuaweicloud.com/image_directory/icon_load1624672027526.png',
        autoFitView: true,
        autoRotation: true,
        offset: new AMap.Pixel(-17, -35)
      });
      startMark.setMap(that.$refs.map.$$getInstance()); // 点标记
      // 卸货地marker
      const endPosition = that.unloadAddress;
      const endMark = new AMap.Marker({
        position: endPosition,
        // icon: 'https://css-backup-1579076150310.obs.cn-south-1.myhuaweicloud.com/image_directory/icon_unload1624672033390.png',
        autoFitView: true,
        autoRotation: true,
        offset: new AMap.Pixel(-17, -35)
      });
      endMark.setMap(that.$refs.map.$$getInstance()); // 点标记
      that.$refs.map.$$getInstance().setFitView([startMark, endMark]); // 执行定位
    },
    // 绘制轨迹
    drawPolyline(path) {
      // console.log(path);
      const that = this;
      if (that.polyline) {
        that.$refs.map.$$getInstance().remove(that.polyline);
      }
      that.polyline = new window.AMap.Polyline({
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
      that.polyline.setMap(that.$refs.map.$$getInstance());
      that.$refs.map.$$getInstance().setFitView(that.polyline); // 执行定位
      setTimeout(() => {
        that.screenshot();
      }, 500);
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
      // this.images = [];
      // 获取运单信息，并标记装卸货地
      getWebDetail(data[this.waybillIndex].code).then(response => {
        this.wayBillInfo = response.data;
        // 获取装卸货地址经纬度
        if (this.wayBillInfo.waybillAddress.loadLocation) {
          this.loadAddress = this.wayBillInfo.waybillAddress.loadLocation.replace('(', '').replace(')', '').split(',');
        } else {
          this.loadAddress = [];
        }
        if (this.wayBillInfo.waybillAddress.unloadLocation) {
          this.unloadAddress = this.wayBillInfo.waybillAddress.unloadLocation.replace('(', '').replace(')', '').split(',');
        } else {
          this.unloadAddress = [];
        }
        if (this.loadAddress.length !== 0 && this.unloadAddress.length !== 0) {
          // 标记装卸货地址
          // this.getMark();
          // 获取路线
          this.getTrackLocation();
        }
      });
    },
    // 导出
    handleBatchDownload() {
      console.log(this.images);
      handleBatchDownload(this.images, null, () => {
        // console.log('下载完成');
      });
    }
  }
};
</script>

<style scoped lang="scss">
.mapframe{
  position: fixed;
  top: 0;
  right: 0;
  z-index: -1;
  width:800px;
  height: 600px;
  border-radius: 6px;
  // visibility: hidden;
}
</style>
