<template>
  <div>
    <div style="width:100%; height: 750px;border-radius: 6px; padding: 0 30px">
      <div class="g-flex g-justifyend" style="width:100%; height: 0;border-radius: 6px">
        <div class="legend-frame">
          <div class="g-aligncenter" style="margin-bottom: 10px">公路轨迹<div class="legend-color" style="background:#67C23A;" /></div>
          <div class="g-aligncenter" style="margin-bottom: 10px">水运轨迹<div class="legend-color" style="background:#1990FF;" /></div>
          <div class="g-aligncenter" style="margin-bottom: 10px">空运轨迹<div class="legend-color" style="background:#FB8720;" /></div>
          <div class="g-aligncenter" style="margin-bottom: 10px">铁路轨迹<div class="legend-color" style="background:#B3B3B3;" /></div>
        </div>
      </div>
      <el-amap ref="amap" v-loading="loading" vid="DDCmap" :zoom="zoom" :center="center" :events="events" />
      <div :class="isPlan? 'noliston-frame':'nolist-frame'">
        <div :class="isPlan? 'noliston':'nolist'" />
      </div>
    </div>
  </div>
</template>

<script>
// import { getWebDetail } from '@/api/waybill/tracklist';
// import axios from 'axios';
import { getUserInfo } from '@/utils/auth';
// import { nextTick } from 'vue/types/umd';

export default {
  name: 'Track',
  props: {
    waybill: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      zoom: 16,
      center: [119.358267, 26.04577],
      loading: false,
      graspRoad: '',
      // 运单信息
      wayBillInfo: {},
      // 装卸货地经纬度
      loadAddress: [],
      unloadAddress: [],
      isPlan: true,
      isShipment: false,
      // 轨迹参数
      lineParams: {
        showDir: true,
        isOutline: true, // 是否描边
        outlineColor: '#fff', // 描边颜色
        strokeOpacity: 0.7, // 线透明度
        strokeWeight: 10, // 线宽
        strokeStyle: 'solid', // 线样式
        lineJoin: 'round', // 折线拐点的绘制样式
        zIndex: 999
      },
      // 是否显示规划轨迹
      planline: {
        path: []
      },
      truckList: {},
      waterList: {},
      flyList: {},
      trainList: {},
      trackMap: undefined,
      events: {
        init: (o) => {
          this.setForm(this.waybill);
        }
      }
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
  },
  created() {
    const { isShipment = false } = getUserInfo() || {};
    this.isShipment = isShipment;
  },
  methods: {
    // 获取高德地图路线规划
    getRoutePlan(load, unload) {
      const that = this;
      const driving = new window.AMap.Driving({
        policy: AMap.DrivingPolicy.LEAST_TIME
        // map 指定将路线规划方案绘制到对应的AMap.Map对象上
        // map: that.$refs.map.$$getInstance()
        // panel: 'DDCmap',
      });
      driving.search(load, unload, function(status, result) {
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
          const planline = new window.AMap.Polyline({
            map: that.$refs.amap.$$getInstance(),
            path,
            strokeColor: '#67C23A', // 线颜色
            ...that.lineParams
          });
          planline.setMap(that.$refs.amap.$$getInstance());
          that.$refs.amap.$$getInstance().setFitView(); // 执行定位
        } else {
          this.msgInfo('规划轨迹失败！');
        }
        // 未出错时，result即是对应的路线规划方案
      });
    },
    getLine(load, unload, type) {
      const that = this;
      const path = [load, unload];
      // 绘制轨迹
      const planline = new window.AMap.Polyline({
        ...that.lineParams,
        map: that.$refs.amap.$$getInstance(),
        path,
        strokeColor: type === '300' ? '#1990FF' : type === '500' ? '#B3B3B3' : '#FB8720' // 线颜色
      });
      planline.setMap(that.$refs.amap.$$getInstance());
    },
    // 起点终点
    getMark(load, unload, label) {
      const that = this;
      // 装货地marker
      const startMark = new AMap.Marker({
        position: load,
        icon: 'https://css-backup-1579076150310.obs.cn-south-1.myhuaweicloud.com/image_directory/162985467678130930d.png',
        autoFitView: true,
        autoRotation: true,
        offset: new AMap.Pixel(-10, -10),
        label: label ? {
          content: '起点',
          offset: new AMap.Pixel(0, -25)
        } : null
      });
      startMark.setMap(that.$refs.amap.$$getInstance()); // 点标记
      // 卸货地marker
      const endMark = new AMap.Marker({
        position: unload,
        icon: 'https://css-backup-1579076150310.obs.cn-south-1.myhuaweicloud.com/image_directory/162985464352494a118.png',
        autoFitView: true,
        autoRotation: true,
        offset: new AMap.Pixel(-10, -10),
        label: label ? {
          content: '终点',
          offset: new AMap.Pixel(0, -25)
        } : null
      });
      endMark.setMap(that.$refs.amap.$$getInstance()); // 点标记
      // that.$refs.map.$$getInstance().setFitView([startMark, endMark]); // 执行定位
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
    },
    // 表单赋值
    setForm(data) {
      // console.log(data);
      // 起点终点
      if (data) {
        const loadLocation = data[0].waybillAddressList[0].loadLocations;
        const unloadLocation = data[data.length - 1].waybillAddressList[0].unloadLocations;
        this.getMark(loadLocation, unloadLocation, 'label');
      }
      this.truckList = data.filter(item => item.mtransMode === '200');
      // console.log(this.truckList);
      if (this.truckList.length > 0) {
        for (let i = 0; i < this.truckList.length; i++) {
          const loadLocation = this.truckList[i].waybillAddressList[0].loadLocations;
          const unloadLocation = this.truckList[i].waybillAddressList[0].unloadLocations;
          if (loadLocation && unloadLocation) {
            this.getMark(loadLocation, unloadLocation);
            this.getRoutePlan(loadLocation, unloadLocation);
          }
        }
      }

      this.waterList = data.filter(item => item.mtransMode === '300');
      // console.log(this.waterList);
      if (this.waterList) {
        for (let i = 0; i < this.waterList.length; i++) {
          const loadLocation = this.waterList[i].waybillAddressList[0].loadLocations;
          const unloadLocation = this.waterList[i].waybillAddressList[0].unloadLocations;
          if (loadLocation && unloadLocation) {
            this.getMark(loadLocation, unloadLocation);
            this.getLine(loadLocation, unloadLocation, '300');
          }
        }
      }

      this.flyList = data.filter(item => item.mtransMode === '400');
      // console.log(this.flyList);
      if (this.flyList) {
        for (let i = 0; i < this.flyList.length; i++) {
          const loadLocation = this.flyList[i].waybillAddressList[0].loadLocations;
          const unloadLocation = this.flyList[i].waybillAddressList[0].unloadLocations;
          if (loadLocation && unloadLocation) {
            this.getMark(loadLocation, unloadLocation);
            this.getLine(loadLocation, unloadLocation, '400');
          }
        }
      }

      this.trainList = data.filter(item => item.mtransMode === '500');
      // console.log(this.trainList);
      if (this.trainList) {
        for (let i = 0; i < this.trainList.length; i++) {
          const loadLocation = this.trainList[i].waybillAddressList[0].loadLocations;
          const unloadLocation = this.trainList[i].waybillAddressList[0].unloadLocations;
          if (loadLocation && unloadLocation) {
            this.getMark(loadLocation, unloadLocation);
            this.getLine(loadLocation, unloadLocation, '500');
          }
        }
      }

      const that = this;
      that.$refs.amap.$$getInstance().setFitView(); // 执行定位
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
  height: 20px;
}

.legend-frame{
  position: relative;
  right: 10px;
  top: 10px;
  z-index: 10;
  width: 165px;
  height: 140px;
  background: #FFFFFF;
  padding: 15px;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.15);
  border-radius: 2px;
}
.legend-color{
  margin-left: 10px;
  height: 15px;
  width: 50px;
  border-radius: 4px;
  opacity: 0.7;
}
::v-deep .amap-marker-label{
  border: 0;
  background-color: #FFFFFF;
  border-radius: 2px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1)
}
</style>
