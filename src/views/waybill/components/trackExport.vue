<template>
  <div class="mapframe">
    <div id="mapClone" class="mapClone">
      <el-amap ref="map" class="amap" vid="amap" :zoom="zoom" :center="center" />
      <div v-if="wayBillInfo" class="waybill-detail-frame">
        <div class="waybill-detail-card">
          <div class="waybill-licenseNumber">{{ wayBillInfo.licenseNumber }}</div>
          <h5>
            {{ wayBillInfo.driverName }}
            <span>{{ wayBillInfo.driverPhone }}</span>
          </h5>
          <el-row>
            <el-col :span="8" class="text-label">
              运输单号：
            </el-col>
            <el-col :span="16" class="text-row">
              {{ wayBillInfo.waybillNo || '-' }}
            </el-col>
            <el-col :span="8" class="text-label">
              接单时间：
            </el-col>
            <el-col :span="16" class="text-row">
              {{ parseTime(wayBillInfo.receiveTime) || '-' }}
            </el-col>
            <el-col :span="8" class="text-label">
              装货时间：
            </el-col>
            <el-col :span="16" class="text-row">
              {{ parseTime(wayBillInfo.fillTime) || '-' }}
            </el-col>
            <el-col :span="8" class="text-label">
              卸货时间：
            </el-col>
            <el-col :span="16" class="text-row">
              {{ parseTime(wayBillInfo.signTime) || '-' }}
            </el-col>
            <el-col :span="8" class="text-label">
              装货地：
            </el-col>
            <el-col :span="16" class="text-row">
              {{ wayBillInfo.waybillAddress?wayBillInfo.waybillAddress.loadFormattedAddress:'-' }}
            </el-col>
            <el-col :span="8" class="text-label">
              卸货地：
            </el-col>
            <el-col :span="16" class="text-row">
              {{ wayBillInfo.waybillAddress?wayBillInfo.waybillAddress.unloadFormattedAddress:'-' }}
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { jimiTrackLocation, getWebDetail, getDevice } from '@/api/waybill/tracklist';
import axios from 'axios';
// import UploadImage from '@/components/UploadImage/index';
import { handleBatchDownload } from '@/libs/trackExport';


export default {
  name: 'Track',
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
      waybillIndex: 0,
      // jimi查询参数 mapType:GOOGOLE或BAIDU
      jimiQueryParams: {
        beginTime: '', // 2021-03-22 08:00:00
        endTime: '', // 2021-03-22 09:00:00
        imeis: '', // 867567047562525
        mapType: 'GOOGLE'
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
      }
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
      const targetDom = document.querySelector('#mapClone'); // 获取要截图的元素
      // domtoimage 截图
      this.domtoimage.toPng(targetDom).then((dataUrl) => {
        this.images.push(dataUrl);
        if (this.images.length === this.waybill.length) {
          this.handleBatchDownload();
          this.$emit('update:open', false);
        } else {
          this.waybillIndex = this.waybillIndex + 1;
          // console.log(this.waybillIndex);
          this.setForm(this.waybill);
        }
      }).catch(error => {
        this.$emit('update:open', false);
        this.msgError('导出失败，请重试，或联系客服寻求帮助！');
        console.error('失败===', error);
      });
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
        } else {
          if (this.jimiQueryParams.imeis) {
            // 若无APP轨迹则调用设备轨迹
            this.getJimiTime();
          } else {
            // 获取高德地图路线规划
            this.getRoutePlan();
          }
        }
      } else if (this.timePoor !== 0 && this.timePoor < 24 * 60 * 60 * 1000) {
        this.getLieying();
      }
    },
    // 猎鹰加载更多
    lyLoadmore() {
      this.lieyingQueryParams.page++;
      this.getLieying();
    },
    // 调用猎鹰获取轨迹
    getLieying() {
      axios.get('https://tsapi.amap.com/v1/track/terminal/trsearch', { params: this.lieyingQueryParams }).then(response => {
        if (response.data.data) {
          if (response.data.data.tracks[0].points.length > 0) {
            this.tracklist = [
              ...this.tracklist,
              ...response.data.data.tracks[0].points.map(function(response) {
                return response.location.split(',');
              })
            ];
            this.lyLoadmore();
          } else {
            this.lieyingQueryParams.starttime = this.lieyingQueryParams.endtime;
            this.lieyingQueryParams.endtime = new Date(this.queryEndtime).getTime();
            this.lieyingQueryParams.page = 1;
            this.getLieyingTime();
          }
        } else {
          if (this.jimiQueryParams.imeis) {
            // 若无APP轨迹则调用设备轨迹
            this.getJimiTime();
          } else {
            // 获取高德地图路线规划
            this.getRoutePlan();
          }
        }
      });
    },
    // 几米循环判断开始时间与结束时间
    getJimiTime() {
      this.timePoor = new Date(this.jimiQueryParams.endTime).getTime() - new Date(this.jimiQueryParams.beginTime).getTime();
      if (this.timePoor > 24 * 60 * 60 * 1000 * 2) {
        this.jimiQueryParams.endTime = this.parseTime(new Date(this.jimiQueryParams.beginTime).getTime() + 24 * 60 * 60 * 1000 * 2, '{y}-{m}-{d} {h}:{i}:{s}');
        this.getJimi();
      } else if (this.timePoor === 0) {
        if (this.tracklist.length !== 0) {
          // 绘制轨迹
          this.drawPolyline(this.tracklist);
        } else {
          // 获取高德地图路线规划
          this.getRoutePlan();
        }
      } else if (this.timePoor !== 0 && this.timePoor < 24 * 60 * 60 * 1000 * 2) {
        this.getJimi();
      }
    },
    // 获取硬件轨迹
    getJimi() {
      jimiTrackLocation(this.jimiQueryParams).then(response => {
        // console.log(response.data);
        if (response.data) {
          this.tracklist = [
            ...this.tracklist,
            ...response.data.map(function(response) {
              return [response.lng, response.lat];
            })
          ];
        }
        this.jimiQueryParams.beginTime = this.jimiQueryParams.endTime;
        this.jimiQueryParams.endTime = this.parseTime(this.queryEndtime, '{y}-{m}-{d} {h}:{i}:{s}');
        this.getJimiTime();
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
    // 获取车辆设备信息
    getDeviceInfo() {
      getDevice({ vehicleCode: this.wayBillInfo.vehicleCode, vendorCode: 'jimilot' }).then(response => {
        if (response.data.length > 0) {
          this.deviceInfo = response.data[0];
          this.jimiQueryParams.imeis = response.data[0].factoryOnlyCode;
        }
        // console.log(this.deviceInfo);
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
      // this.images = [];
      // 获取运单信息，并标记装卸货地
      getWebDetail(data[this.waybillIndex].code).then(response => {
        this.wayBillInfo = response.data;
        this.getDeviceInfo();
        // 获取查询轨迹时间
        this.jimiQueryParams.beginTime = this.parseTime(this.wayBillInfo.fillTime, '{y}-{m}-{d} {h}:{i}:{s}');
        this.lieyingQueryParams.starttime = new Date(this.wayBillInfo.fillTime).getTime();
        this.jimiQueryParams.endTime = this.parseTime(this.wayBillInfo.signTime, '{y}-{m}-{d} {h}:{i}:{s}');
        this.lieyingQueryParams.endtime = new Date(this.wayBillInfo.signTime).getTime();
        this.queryEndtime = new Date(this.wayBillInfo.signTime);
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
          // 猎鹰参数赋值
          if (this.wayBillInfo.trackNumber) {
            const trackNumber = this.wayBillInfo.trackNumber.split('|');
            // console.log(trackNumber);
            this.lieyingQueryParams = {
              ...this.lieyingQueryParams,
              key: trackNumber[0],
              sid: trackNumber[1], // sid为终端所属service唯一编号
              tid: trackNumber[2], // tid为终端唯一编号
              trid: trackNumber[3] // trid为轨迹唯一编号
            };
            // 获取猎鹰轨迹
            this.getLieyingTime();
          } else {
            if (this.jimiQueryParams.imeis) {
              // 获取几米设备轨迹
              this.getJimiTime();
            } else {
              // 获取高德地图路线规划
              this.getRoutePlan();
            }
          }
        }
      });
    },
    // 导出
    handleBatchDownload() {
      // console.log(this.images);
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
  right: -960px;
  z-index: -1;
  width:960px;
  height: 560px;
  border-radius: 6px;
  // visibility: hidden;
}
.mapClone{
  width:960px;
  height: 560px;
}
// 轨迹-运单详情卡片
.waybill-detail-frame{
  position: relative;
  top: -550px;
  left: 10px;
  height: 0;
}
.waybill-detail-card{
  width: 250px;
  background: #fff;
  padding: 15px;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.15);
  border-radius: 2px;
  .waybill-licenseNumber{
    background: url('~@/assets/images/location/bg_lic.png') no-repeat;
    background-size: 100% 100%;
    height: 24px;
    width: 90px;
    font-weight: bold;
    line-height: 24px;
    text-align: center;
    color: #050407;
  }
  >h5{
    line-height: 30px;
    border-bottom: 1px solid #d2d4da;
    margin-bottom: 8px;
    font-size: 14px;
    color: #262626;
    font-weight: bold;
    >span{
      font-size: 14px;
      &.license{
        background: #ffba00;
        padding: 3px 4px 1px;
        margin-left: 6px;
        border-radius: 4px;
        border: 1px solid gray;
      }
    }
  }
  .text-label{
    margin-bottom: 6px;
  }
  .text-row{
    font-weight: bold;
    line-height: 22px;
    color: #20273A;
    margin-bottom: 12px;
    margin-bottom: 6px;
  }
}
</style>
