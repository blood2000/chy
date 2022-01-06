<template>
  <!-- 地图组件 -->
  <div class="c-map-box">
    <!-- 定位 -->
    <div v-if="currentMap === 'point' && addressMsg && addressMsg!==''" class="address ly-flex ly-flex-pack-center ly-flex-align-center">
      <img class="mr5" src="@/assets/images/device/position.png">
      {{ addressMsg }}
    </div>
    <!-- 轨迹 -->
    <template v-if="currentMap === 'track'">
      <div class="track-card-info">
        <h5>
          轨迹播放
          <span @click="closeTrackPlayback">
            <img src="@/assets/images/device/close.png">
            退出播放
          </span>
        </h5>
        <div class="content">
          <div class="info">
            <h5 class="title">{{ trackInfo.factoryOnlyCode }}</h5>
            <p v-for="item in trackInfo.labelArr" :key="item.factoryOnlyCode" class="label">
              <span>{{ item.field_cnname + ':' }}</span>
              {{ item.context }}
            </p>
            <template v-if="jmTracklist && jmTracklist.length > 0">
              <!-- 当前时间、速度、方向 -->
              <div v-if="jmTracklist && jmTracklist.length > 0" class="device-current-view ly-flex-pack-justify">
                <span>{{ currentTrackTime || '-' }}</span>
                <span v-if="currentTrackSpeed !== -1">{{ currentTrackSpeed || '-' }} km/h</span>
              </div>
              <!-- 进度条 -->
              <div class="device-slide-box">
                <el-slider v-model="slideValue" :show-tooltip="false" @input="handleSlideChange" />
              </div>
              <!-- 播放器 -->
              <div class="device-play-box ly-flex ly-flex-pack-justify ly-flex-align-center">
                <el-select
                  v-model="rateTime"
                  class="time-select"
                  style="width: 68px"
                  size="mini"
                  @change="changeTime"
                >
                  <el-option
                    v-for="dict in timeOptions"
                    :key="dict"
                    :label="dict + 'X'"
                    :value="dict"
                  />
                </el-select>
                <div v-if="isPlay === 0" title="播放" class="play-button" @click="startPathSimplifier" />
                <div v-if="isPlay === 2" title="继续" class="play-button" @click="resumePathSimplifier" />
                <div v-if="isPlay === 1" title="暂停" class="pause-button" @click="pausePathSimplifier" />
                <div class="replay-button" @click="startPathSimplifier">
                  <i class="el-icon-refresh-right" />
                  重播
                </div>
              </div>
            </template>
          </div>
          <div class="form">
            <div class="form-item ly-flex ly-flex-pack-justify ly-flex-align-center">
              开始时间：
              <el-date-picker
                v-model="jimiQueryParams.beginTime"
                clearable
                size="small"
                type="datetime"
                style="width: 228px"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="请选择开始时间"
              />
            </div>
            <div class="form-item ly-flex ly-flex-pack-justify ly-flex-align-center">
              结束时间：
              <el-date-picker
                v-model="jimiQueryParams.endTime"
                clearable
                size="small"
                type="datetime"
                style="width: 228px"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="请选择结束时间"
              />
            </div>
            <div class="form-item" style="text-align: right;">
              <!-- <el-button v-if="jmTracklist.length > 0" type="primary" size="mini" @click="startAnimation">{{ trackStart === 0 ? '播 放' : '重新播放' }}</el-button>
              <el-button v-if="jmTracklist.length > 0 && trackStatus === 1 && trackStart === 1" type="primary" size="mini" @click="resumeAnimation">继 续</el-button>
              <el-button v-if="jmTracklist.length > 0 && trackStatus === 0 && trackStart === 1" type="primary" size="mini" @click="pauseAnimation">暂 停</el-button> -->
              <el-button type="primary" size="mini" :loading="buttonLoading" @click="getJimi">查 询</el-button>
            </div>
          </div>
          <div class="button-box">
            <el-button class="mr10" type="text" style="mini" @click="changeTrackTable">轨迹明细</el-button>
          </div>
        </div>
      </div>
      <!-- <ul class="track-legend ly-flex ly-flex-pack-justify ly-flex-align-center">
        <li>WiFi<span class="color wifi" /></li>
        <li>卫星<span class="color wx" /></li>
        <li>基站<span class="color jz" /></li>
      </ul> -->
    </template>
    <div id="device-map-container" />

    <!-- 轨迹明细 -->
    <TrackDetail :open.sync="isOpenTrackTable" :track-list="jmTrackInfolist" />
  </div>
</template>

<script>
import TrackDetail from './trackDetail.vue';
import { jimiTrackLocation } from '@/api/waybill/tracklist';
const geocoder = new AMap.Geocoder({
  radius: 1000,
  extensions: 'all'
});

export default {
  components: {
    TrackDetail
  },
  props: {
    currentMap: {
      type: String,
      default: null
    },
    isShowDeviceName: Boolean
  },
  data() {
    return {
      map: null,
      // 标记点集合
      markerList: {},
      // 普通轨迹
      polyline: null,
      // 轨迹回放
      passedPolyline: null,
      moveMarker: null,
      startMarker: null,
      endMarker: null,
      // 窗体信息
      infoWindow: null,
      // 地址信息
      addressMsg: null,
      // jimi查询参数
      jimiQueryParams: {
        beginTime: '', // 2021-07-31 00:00:00
        endTime: '', // 2021-08-02 17:00:00
        imeis: '', // 868120274644936
        mapType: 'GOOGLE' // GOOGOLE或BAIDU
      },
      buttonLoading: false,
      jmTrackInfolist: [],
      jmTracklist: [],
      trackInfo: {},
      // 轨迹当前状态
      trackStart: 0, // 0未开始  1已开始 2已结束
      trackStatus: 1, // 0播放中  1暂停中
      // 播放进度条
      slideValue: 0,
      rateTime: 1,
      timeOptions: [1, 2, 3],
      isPlay: 0, // 0播放 1暂停 2继续
      // 巡航
      pathSimplifierIns: null,
      // 巡航线路
      navgtr: null,
      // 巡航速度
      navgtrSpeed: 3000,
      // 当前轨迹点时间
      currentTrackTime: null,
      // 当前轨迹点速度
      currentTrackSpeed: null,
      // 是否开启轨迹列表
      isOpenTrackTable: false
    };
  },
  mounted() {
    this.initMap();
  },
  methods: {
    /** 初始化地图 */
    initMap() {
      this.map = new AMap.Map('device-map-container', {
        resizeEnable: true,
        center: [119.358267, 26.04577],
        zoom: 11
      });
    },
    /** 绘制标记
     * @param {string} id 唯一值必传
     * @param {Array} position 经纬度必传
     * @param {Object} labelText 信息窗内容,没有就不传
     * @param {string} icon 图标
    */
    drawMarker(id, position, labelObj, icon) {
      const _this = this;
      const marker = new AMap.Marker({
        position: position,
        label: this.setLabelContent(id),
        content: '<div class="own-device-marker-car"></div>',
        autoFitView: true,
        autoRotation: true,
        offset: new AMap.Pixel(-19, -28),
        clickable: !!labelObj
      });
      marker.setMap(this.map);
      _this.markerInfoInit(marker, labelObj); // 默认打开信息窗
      if (labelObj) {
        AMap.event.addListener(marker, 'click', function() {
          _this.markerInfoInit(marker, labelObj);
        });
      }
      this.markerList[id] = marker;
      this.getAddressBylnglat(position);
      this.map.setFitView();
    },
    /** 设置点标记的文本标签 */
    drawDeviceName(factoryOnlyCode) {
      this.markerList[factoryOnlyCode].setLabel(this.setLabelContent(factoryOnlyCode));
    },
    setLabelContent(text) {
      const option = this.isShowDeviceName ? {
        offset: new AMap.Pixel(8, -5),
        content: '<div>' + text + '</div>',
        direction: 'top'
      } : {};
      return option;
    },
    /** 实例化窗体 */
    markerInfoInit(marker, labelObj) {
      const info = [];
      info.push("<div class='own-map-info-content'><h5>" + labelObj.factoryOnlyCode + "</h5><div class='top-content'>");
      // 动态内容start
      labelObj.labelArr.forEach(el => {
        info.push("<p class='input-item'><span>" + el.field_cnname + ':</span>' + el.context + '</p>');
      });
      // 动态内容end
      // info.push("</div><div class='bottom-content'>");
      // 动态按钮start
      // info.push('<a onclick="onTrackPlayback()">轨迹回放</a>');
      // info.push('<a>实时跟踪</a>');
      // info.push('<a>设备围栏</a>');
      // 动态按钮end
      info.push('</div></div>');
      this.infoWindow = new AMap.InfoWindow({
        isCustom: false, // 使用自定义窗体
        content: info.join('<br/>'),
        // offset: new AMap.Pixel(18, -22),
        offset: new AMap.Pixel(20, -16),
        anchor: 'middle-left'
      });
      this.infoWindow.open(this.map, marker.getPosition());
    },
    /** 关闭窗体 */
    closeInfoWindow() {
      this.map.clearInfoWindow();
    },
    /**
     * 通过经纬度获取详细点位信息
     * @param {Array} position 经纬度必传
     *  */
    getAddressBylnglat(position) {
      const _this = this;
      geocoder.getAddress(position, function(status, result) {
        if (status === 'complete' && result.info === 'OK') {
          if (result && result.regeocode) {
            const { formattedAddress } = result.regeocode;
            _this.addressMsg = formattedAddress;
          } else {
            _this.addressMsg = null;
          }
        }
      });
    },
    /** 绘制轨迹
     * @param {Array} 组成轨迹的点数组必传
    */
    drawLine(path) {
      this.polyline = new window.AMap.Polyline({
        map: this.map,
        path,
        strokeColor: '#1990FF',
        strokeWeight: 8,
        lineJoin: 'round',
        showDir: 'true' // 线内是否显示箭头
      });
      this.polyline.setMap(this.map);
      this.map.setFitView(this.polyline);
    },
    /** 轨迹回放 */
    onTrackPlayback(row) {
      this.clearMap();
      this.trackInfo = row;
      this.jimiQueryParams.beginTime = this.parseTime(new Date(), '{y}-{m}-{d}') + ' 00:00:00';
      this.jimiQueryParams.endTime = this.parseTime(new Date());
      this.getJimi();
    },
    /** 退出轨迹回放按钮 */
    closeTrackPlayback() {
      this.clearMap();
      this.$emit('onCloseTrack');
    },
    /** 绘制回放轨迹 */
    drawReplayLine() {
      const _this = this;
      // 绘制轨迹
      this.polyline = new AMap.Polyline({
        map: this.map,
        path: this.jmTracklist,
        showDir: true,
        strokeColor: '#28F',
        strokeWeight: 8
      });
      this.passedPolyline = new AMap.Polyline({
        map: this.map,
        strokeColor: '#AF5',
        showDir: true,
        strokeWeight: 8
      });
      // 绘制起点终点
      this.startMarker = new AMap.Marker({
        map: this.map,
        position: this.jmTracklist[0],
        content: '<div class="own-device-line-icon start">起</div>',
        offset: new AMap.Pixel(-20, -20),
        autoRotation: true,
        zIndex: 100
      });
      this.endMarker = new AMap.Marker({
        map: this.map,
        position: this.jmTracklist[this.jmTracklist.length - 1],
        content: '<div class="own-device-line-icon end">终</div>',
        offset: new AMap.Pixel(-20, -20),
        autoRotation: true,
        zIndex: 100
      });
      // 绘制车
      this.moveMarker = new AMap.Marker({
        map: this.map,
        position: this.jmTracklist[0],
        // icon: 'https://webapi.amap.com/images/car.png',
        content: '<div class="own-device-line-car"></div>',
        offset: new AMap.Pixel(-29, -10),
        autoRotation: true,
        angle: -90,
        zIndex: 101
      });
      // 绑定车辆移动事件
      this.moveMarker.on('moving', function(e) {
        _this.passedPolyline.setPath(e.passedPath);
        // 车超出视野范围后重新定位
        if (!_this.isPointInRing(e.target.getPosition())) {
          _this.map.setCenter(e.target.getPosition());
        }
        // 播放结束
        if (e.target.getPosition() === _this.jmTracklist[_this.jmTracklist.length - 1]) {
          _this.trackStart = 2;
        }
      });
      this.map.setFitView();
    },
    /** 轨迹回放 */
    startAnimation() {
      this.trackStart = 1;
      this.trackStatus = 0;
      this.map.setZoomAndCenter(13, this.jmTracklist[0]);
      this.moveMarker.moveAlong(this.jmTracklist, 3000); // speed 千米/小时
    },
    pauseAnimation() {
      this.trackStatus = 1;
      this.moveMarker.pauseMove();
    },
    resumeAnimation() {
      this.trackStatus = 0;
      this.moveMarker.resumeMove();
    },
    stopAnimation() {
      this.moveMarker.stopMove();
    },
    /** 清除指定标记 */
    removeMarker(id) {
      if (id && this.markerList[id]) {
        this.markerList[id].setMap(null);
        delete this.markerList[id];
      }
    },
    /** 清除所有标记 */
    removeAllMarker() {
      for (const key in this.markerList) {
        this.markerList[key].setMap(null);
        this.markerList[key] = null;
      }
      this.markerList = {};
      this.addressMsg = null;
      this.closeInfoWindow();
    },
    /** 清除轨迹 */
    removeLine() {
      if (this.polyline) {
        this.map.remove(this.polyline);
        this.polyline = null;
      }
    },
    /** 清除回放轨迹 */
    removeReplayLine() {
      this.polyline && this.map.remove(this.polyline);
      this.passedPolyline && this.map.remove(this.passedPolyline);
      this.moveMarker && this.moveMarker.setMap(null);
      this.startMarker && this.startMarker.setMap(null);
      this.endMarker && this.endMarker.setMap(null);
      this.polyline = null;
      this.passedPolyline = null;
      this.moveMarker = null;
      this.startMarker = null;
      this.endMarker = null;
    },
    /** 清除所有覆盖物 */
    clearMap() {
      this.map.clearMap();
      this.markerList = {};
      this.addressMsg = null;
      this.polyline = null;
      this.passedPolyline = null;
      this.moveMarker = null;
      this.startMarker = null;
      this.endMarker = null;
      this.infoWindow = null;
      this.jmTracklist = [];
      this.jmTrackInfolist = [];
      this.currentTrackTime = null;
      this.currentTrackSpeed = null;
      this.trackInfo = {};
      // 重置巡航轨迹
      this.clearPathSimplifierIns();
    },
    /** 重置巡航轨迹 */
    clearPathSimplifierIns() {
      this.startMarker && this.startMarker.setMap(null);
      this.endMarker && this.endMarker.setMap(null);
      this.slideValue = 0;
      this.isPlay = 0;
      if (this.pathSimplifierIns) {
        this.pathSimplifierIns.setData([]);
      }
    },
    /** 获取硬件轨迹 */
    getJimi() {
      const _this = this;
      this.buttonLoading = true;
      this.jimiQueryParams.imeis = this.trackInfo.factoryOnlyCode;
      jimiTrackLocation(this.jimiQueryParams).then(response => {
        if (response.data) {
          this.buttonLoading = false;
          this.trackStart = 0;
          this.trackStatus = 1;
          this.jmTracklist = [];
          this.jmTrackInfolist = response.data;
          for (var i = 0; i < response.data.length; i++) {
            var dataItem = response.data[i];
            var item = [];
            item.push(dataItem.lng);
            item.push(dataItem.lat);
            _this.jmTracklist[i] = item;
          }
          // this.removeReplayLine(); // 绘制前先清除
          this.clearPathSimplifierIns(); // 绘制前先清除
          if (this.jmTracklist.length > 0) {
            // 设置当前轨迹点时间、速度
            this.setCurrentTrackTimeAndSpeed(0);
            // this.drawReplayLine();
            this.initPathSimplifier();
          } else {
            this.msgInfo('暂无轨迹信息');
          }
        }
      }).catch(() => {
        this.buttonLoading = false;
      });
    },
    /** 判断当前位置是否在可视区域 */
    isPointInRing(position) {
      const bounds = this.map.getBounds();
      const NorthEast = bounds.getNorthEast();
      const SouthWest = bounds.getSouthWest();
      const SouthEast = [NorthEast.lng, SouthWest.lat];
      const NorthWest = [SouthWest.lng, NorthEast.lat];
      const path = [[NorthEast.lng, NorthEast.lat], SouthEast, [SouthWest.lng, SouthWest.lat], NorthWest]; // 将地图可视区域四个角位置按照顺序放入path，用于判断point是否在可视区域
      const isPointInRing = AMap.GeometryUtil.isPointInRing(position, path); // 判断point是否在可视区域
      return isPointInRing;
    },
    /** 进度条滑块触发 */
    handleSlideChange(value) {
      if (!this.navgtr) return;
      const newVal = typeof (value) === 'number' ? value : this.slideValue;
      const num = parseInt((newVal / 100) * this.jmTracklist.length);
      const decimal = String((newVal / 100) * this.jmTracklist.length).split('.')[1] || 0;
      this.navgtr.moveToPoint(num, Number('0.' + decimal));
      this.pathSimplifierIns.renderLater();
    },
    /** 切换倍速 */
    changeTime(val) {
      this.rateTime = val;
    },
    /** 绘制巡航轨迹 */
    initPathSimplifier() {
      const that = this;
      AMapUI.load(['ui/misc/PathSimplifier'], (PathSimplifier) => {
        if (!PathSimplifier.supportCanvas) {
          alert('当前环境不支持 Canvas！');
          return;
        }
        // 创建一个巡航轨迹路线
        that.pathSimplifierIns = new PathSimplifier({
          zIndex: 100, // 地图层级，
          map: this.map, // 所属的地图实例
          // 巡航路线轨迹列表
          getPath: (pathData, pathIndex) => {
            return pathData.path;
          },
          getHoverTitle: function(pathData, pathIndex, pointIndex) {
            return '';
          },
          // 自定义样式，可设置巡航器样式，巡航轨迹样式，巡航轨迹点击、hover等不同状态下的样式，不设置则用默认样式，详情请参考api文档 renderOptions:{}
          // 绘制路线节点
          renderOptions: {
            // 轨迹线的样式
            pathLineStyle: {
              strokeStyle: '#28F',
              lineWidth: 8,
              dirArrowStyle: true
            },
            pathLineHoverStyle: null,
            pathLineSelectedStyle: {
              strokeStyle: '#28F',
              lineWidth: 8,
              dirArrowStyle: true
            },
            renderAllPointsIfNumberBelow: -1 // 绘制路线节点，如不需要可设置为-1
          }
        });

        // 设置数据
        that.pathSimplifierIns.setData([{
          path: that.jmTracklist
        }]);

        // 对线路创建一个巡航器
        const contentImg = require('@/assets/images/device/track_car_c.png');
        that.navgtr = that.pathSimplifierIns.createPathNavigator(0, {
          loop: false, // 循环播放
          speed: that.navgtrSpeed, // 巡航速度，单位千米/小时
          pathNavigatorStyle: {
            width: 20,
            height: 59,
            // content: 'defaultPathNavigator',
            // 使用图片
            content: PathSimplifier.Render.Canvas.getImageContent(contentImg,
              function onload() {
                // 图片加载成功，重新绘制一次
                that.pathSimplifierIns.renderLater();
              },
              function onerror(e) {
                that.msgError('图片加载失败！');
              }
            ),
            strokeStyle: null,
            fillStyle: null,
            // 经过路径的样式
            pathLinePassedStyle: {
              lineWidth: 8,
              strokeStyle: '#AF5',
              dirArrowStyle: true
            }
          }
        });

        that.navgtr.on('move', function(data, position) {
          const path = position.dataItem.pathData.path;
          const idx = position.dataItem.pointIndex; // 走到了第几个点
          const tail = position.tail; // 至下一个节点的比例位置
          const totalIdx = idx + tail;
          const len = path.length;
          // 设置当前轨迹点时间、速度
          that.setCurrentTrackTimeAndSpeed(idx);
          // 计算下一个距离速度
          if (idx < len - 1) {
            that.navgtr.setSpeed(that.navgtrSpeed * that.rateTime);
          }
          // 进度条实时展示tail
          that.slideValue = (totalIdx / len) * 100;
          // 车超出视野范围后重新定位
          if (!that.isPointInRing(path[idx])) {
            that.map.setCenter(path[idx]);
          }
          // 如果到头了，回到初始状态
          if (that.navgtr.isCursorAtPathEnd()) {
            that.isPlay = 0;
          }
        });

        // 绘制起点终点
        this.startMarker = new AMap.Marker({
          map: this.map,
          position: this.jmTracklist[0],
          content: '<div class="own-device-line-icon start">起</div>',
          offset: new AMap.Pixel(-20, -20),
          autoRotation: true,
          zIndex: 100
        });
        this.endMarker = new AMap.Marker({
          map: this.map,
          position: this.jmTracklist[this.jmTracklist.length - 1],
          content: '<div class="own-device-line-icon end">终</div>',
          offset: new AMap.Pixel(-20, -20),
          autoRotation: true,
          zIndex: 100
        });
      });
    },
    /** 巡航轨迹事件 */
    startPathSimplifier() {
      this.isPlay = 1;
      this.map.setZoomAndCenter(12, this.jmTracklist[0]);
      this.navgtr.start();
    },
    pausePathSimplifier() {
      this.isPlay = 2;
      this.navgtr.pause();
    },
    resumePathSimplifier() {
      this.isPlay = 1;
      this.navgtr.resume();
    },
    stopPathSimplifiern() {
      this.isPlay = 0;
      this.navgtr.stop();
    },
    /** 设置当前轨迹点时间、速度 */
    setCurrentTrackTimeAndSpeed(index) {
      this.currentTrackTime = this.jmTrackInfolist[index].gpsTime;
      this.currentTrackSpeed = this.jmTrackInfolist[index].gpsSpeed;
    },
    /** 查看轨迹列表 */
    changeTrackTable() {
      this.isOpenTrackTable = true;
    }

    // ====================================== 电子围栏start ======================================


    // ======================================  电子围栏end  ======================================
  }
};
</script>

<style lang="scss" scoped>
.c-map-box{
  position: relative;
  // 定位地址展示样式
  >.address{
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    width: 936px;
    max-width: 70%;
    height: 50px;
    line-height: 50px;
    background: #FFFFFF;
    border: 1px solid #ECECF0;
    box-shadow: 1px 1px 12px rgba(0, 0, 0, 0.15);
    opacity: 0.9;
    border-radius: 30px;
    font-size: 18px;
    font-family: PingFang SC;
    font-weight: bold;
    line-height: 22px;
    color: #262626;
    z-index: 999;
  }

  >#device-map-container{
    height: 100%;
    // 地图信息窗体样式-覆盖
    ::v-deep.amap-info-content{
      padding: 0;
      .amap-info-close{
        top: 10px;
        right: 10px !important;
      }
    }
    ::v-deep.amap-info-outer, ::v-deep.amap-menu-outer{
      box-shadow: 1px 1px 12px rgba(0, 0, 0, 0.15);
      border-radius: 6px;
    }
    ::v-deep.middle-left .amap-info-sharp:after{
      filter: blur(8px);
    }
    // 地图标记label样式
    ::v-deep.amap-marker-label{
      border: none;
      border-radius: 4px;
      font-size: 12px;
      line-height: 14px;
      color: #262626;
      box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.1);
      padding: 3px 6px;
      &::after{
        content: '';
        position: absolute;
        bottom: -6px;
        left: 50%;
        transform: translateX(-50%);
        border-left: 6px solid transparent;
        border-top: 6px solid #fff;
        border-right: 6px solid transparent;
      }
    }
    // 地图信息窗体样式
    ::v-deep.own-map-info-content{
      >h5{
        font-size: 18px;
        font-family: PingFang SC;
        font-weight: bold;
        line-height: 22px;
        color: #262626;
        padding: 15px 15px 0;
      }
      br{
        display: none !important;
      }
      >.top-content{
        padding: 15px 20px 9px 15px;
        border-bottom: 1px solid rgba(159, 162, 181, 0.2);
        .input-item{
          font-size: 14px;
          font-family: PingFang SC;
          font-weight: bold;
          line-height: 20px;
          color: #20273A;
          margin-bottom: 6px;
          >span{
            font-size: 14px;
            font-family: PingFang SC;
            font-weight: 400;
            line-height: 20px;
            color: rgba(144, 147, 152, 0.9);
            margin-right: 12px;
          }
        }
      }
      >.bottom-content{
        padding: 14px 15px 10px;
        font-size: 0;
        >a{
          display: inline-block;
          font-size: 12px;
          font-family: PingFang SC;
          font-weight: 400;
          line-height: 22px;
          color: #409EFF;
          margin-bottom: 4px;
          margin-right: 20px;
        }
      }
    }
    // 轨迹起点终点样式
    ::v-deep.own-device-line-icon{
      width: 40px;
      height: 40px;
      border: 4px solid #FFFFFF;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
      border-radius: 50%;
      font-size: 18px;
      font-family: PingFang SC;
      font-weight: bold;
      line-height: 32px;
      text-align: center;
      color: #FFFFFF;
      &.start{
        background: #FB8720;
      }
      &.end{
        background: #1990FF;
      }
    }
    // 轨迹车样式
    ::v-deep.own-device-line-car{
      width: 58px;
      height: 20px;
      background: url('~@/assets/images/device/track_car.png') no-repeat;
      background-size: 100% 100%;
    }
    // 标记物车样式
    ::v-deep.own-device-marker-car{
      width: 40px;
      height: 58px;
      background: url('~@/assets/images/device/car.png') no-repeat;
      background-size: 100% 100%;
    }
  }

  // 轨迹回放卡片样式
  .track-card-info{
    position: absolute;
    top: 24px;
    left: 16px;
    z-index: 999;
    width: 334px;
    // height: 436px;
    border-radius: 6px 6px 4px 4px;
    overflow: hidden;
    background: linear-gradient(90deg, #0078F5 0%, #409EFF 100%);
    >h5{
      height: 52px;
      font-size: 18px;
      font-family: PingFang SC;
      font-weight: bold;
      line-height: 52px;
      color: #FFFFFF;
      padding: 0 10px 0 20px;
      >span{
        float: right;
        width: 88px;
        height: 28px;
        line-height: 26px;
        border: 1px solid #FFFFFF;
        border-radius: 14px;
        text-align: center;
        font-size: 14px;
        font-weight: 400;
        vertical-align: middle;
        margin-top: 12px;
        cursor: pointer;
        >img{
          vertical-align: middle;
          margin-top: -2px;
        }
      }
    }
    >.content{
      height: calc(100% - 52px);
      background: #fff;
      border-radius: 4px;
      border-radius: 4px;
      overflow: hidden;
      >.info{
        padding: 16px 0 10px;
        border-bottom: 1px solid rgba(159, 162, 181, 0.2);
        >.title{
          font-size: 18px;
          font-family: PingFang SC;
          font-weight: bold;
          line-height: 22px;
          color: #262626;
          padding: 0 10px 12px 15px;
        }
        >.label{
          padding: 0 15px;
          font-size: 14px;
          font-family: PingFang SC;
          font-weight: bold;
          line-height: 20px;
          color: #20273A;
          margin-bottom: 6px;
          >span{
            font-size: 14px;
            font-family: PingFang SC;
            font-weight: 400;
            line-height: 20px;
            color: rgba(144, 147, 152, 0.9);
            margin-right: 12px;
          }
        }
      }
      >.form{
        padding: 16px 16px 0;
        .form-item{
          margin-bottom: 15px;
        }
      }
      >.button-box{
        padding: 0 15px 10px;
        // border-top: 1px solid rgba(159, 162, 181, 0.2);
        >.el-button{
          color: rgba(64, 158, 255, 1);
        }
      }
    }
    // 进度条样式
    .device-slide-box{
      padding: 0 16px;
      ::v-deep.el-slider{
        ::v-deep.el-slider__button{
          width: 16px;
          height: 8px;
          border: none;
          box-shadow: 3px 3px 12px rgba(0, 0, 0, 0.19);
        }
      }
    }
    // 播放器样式
    .device-play-box{
      padding: 0 15px 8px;
      .time-select ::v-deep.el-input__inner{
        border-radius: 16px;
        color: #ADB5BD;
      }
      .play-button{
        width: 34px;
        height: 34px;
        background: url('~@/assets/images/device/icon_play.png') no-repeat;
        background-size: 100% 100%;
        cursor: pointer;
      }
      .pause-button{
        width: 34px;
        height: 34px;
        background: url('~@/assets/images/device/icon_pause.png') no-repeat;
        background-size: 100% 100%;
        cursor: pointer;
      }
      .replay-button{
        width: 68px;
        height: 28px;
        line-height: 26px;
        border: 1px solid #DCDFE6;
        opacity: 1;
        border-radius: 16px;
        font-size: 13px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #ADB5BD;
        text-align: center;
        cursor: pointer;
        >i{
          font-size: 14px;
        }
      }
    }
    // 当前时间、速度、方向
    .device-current-view{
      padding: 15px 18px 0px 15px;
      margin-bottom: -10px;
      color: #ADB5BD;
      font-size: 13px;
    }
  }

  // 轨迹图例样式
  .track-legend{
    position: absolute;
    left: 16px;
    bottom: 10px;
    width: 312px;
    height: 54px;
    background: #FFFFFF;
    border: 1px solid #ECECF0;
    z-index: 999;
    padding: 10px 25px 10px 15px;
    >li{
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: bold;
      line-height: 22px;
      color: #20273A;
      >span{
        display: inline-block;
        width: 28px;
        height: 6px;
        border-radius: 4px;
        vertical-align: middle;
        margin-left: 10px;
        margin-top: -2px;
        &.wifi{
          background: #1990FF;
        }
        &.wx{
          background: #67C23A;
        }
        &.jz{
          background: #FB8720;
        }
      }
    }
  }
}
</style>
