<template>
  <!-- 地图组件 -->
  <div class="c-map-box">
    <!-- <el-button size="mini" class="mb10" @click="drawMarker(new Date().getTime(), [116.478935, 39.997761], '我是marker的title1')">绘制点标记</el-button>
    <el-button size="mini" class="mb10" @click="drawMarker(new Date().getTime(), [116.479935, 39.997761], '我是marker的title2')">绘制点标记2</el-button>
    <el-button size="mini" class="mb10" @click="drawMarker(new Date().getTime(), [116.480935, 39.997761], '我是marker的title3')">绘制点标记3</el-button>
    <el-button size="mini" @click="removeMarker">清除指定点标记</el-button>
    <el-button size="mini" @click="removeAllMarker">移除所有点标记</el-button> ////
    <el-button size="mini" @click="drawLine(jmTracklist)">绘制普通轨迹</el-button>
    <el-button size="mini" @click="removeLine()">移除普通轨迹</el-button> ////
    <el-button size="mini" @click="drawReplayLine()">绘制回放轨迹</el-button>
    <el-button size="mini" @click="startAnimation()">轨迹回放-开始</el-button>
    <el-button size="mini" @click="pauseAnimation()">轨迹回放-暂停</el-button>
    <el-button size="mini" @click="resumeAnimation()">轨迹回放-继续</el-button>
    <el-button size="mini" @click="stopAnimation()">轨迹回放-停止</el-button>
    <el-button size="mini" @click="removeReplayLine()">清除回放轨迹</el-button> ////
    <el-button size="mini" @click="clearMap()">清除所有覆盖物</el-button> -->
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
          </div>
          <div class="form">
            <div class="form-item">
              开始时间：
              <el-date-picker
                v-model="jimiQueryParams.beginTime"
                clearable
                size="small"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="请选择开始时间"
              />
            </div>
            <div class="form-item">
              结束时间：
              <el-date-picker
                v-model="jimiQueryParams.endTime"
                clearable
                size="small"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="请选择结束时间"
              />
            </div>
            <div class="form-item">
              <el-button v-if="jmTracklist.length > 0" type="primary" size="mini" @click="startAnimation">播 放</el-button>
              <el-button v-if="jmTracklist.length > 0 && trackStatus === 1 && trackStart === 1" type="primary" size="mini" @click="resumeAnimation">继 续</el-button>
              <el-button v-if="jmTracklist.length > 0 && trackStatus === 0 && trackStart === 1" type="primary" size="mini" @click="pauseAnimation">暂 停</el-button>
              <el-button type="primary" size="mini" :loading="buttonLoading" @click="getJimi">查 询</el-button>
            </div>
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
  </div>
</template>

<script>
import { jimiTrackLocation } from '@/api/waybill/tracklist';
const geocoder = new AMap.Geocoder({
  radius: 1000,
  extensions: 'all'
});

export default {
  props: {
    currentMap: {
      type: String,
      default: null
    }
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
      jmTracklist: [],
      trackInfo: {},
      //  轨迹当前状态
      trackStart: 0, // 0未开始  1已开始
      trackStatus: 1 // 0播放中  1暂停中
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
     * @param {Object} labelText 气泡提示窗,没有就不传
     * @param {string} icon 图标
    */
    drawMarker(id, position, labelObj, icon) {
      const _this = this;
      const marker = new AMap.Marker({
        position: position,
        icon: new AMap.Icon({
          image: icon || '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
          size: new AMap.Size(26, 34),
          imageSize: new AMap.Size(26, 34)
        }),
        autoFitView: true,
        autoRotation: true,
        offset: new AMap.Pixel(-13, -34),
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
        offset: new AMap.Pixel(18, -22),
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
      this.moveMarker = new AMap.Marker({
        map: this.map,
        position: this.jmTracklist[0],
        icon: 'https://webapi.amap.com/images/car.png',
        offset: new AMap.Pixel(-26, -13),
        autoRotation: true,
        angle: -90
      });
      // 绘制轨迹
      this.polyline = new AMap.Polyline({
        map: this.map,
        path: this.jmTracklist,
        showDir: true,
        strokeColor: '#28F',
        strokeWeight: 6
      });
      this.passedPolyline = new AMap.Polyline({
        map: this.map,
        strokeColor: '#AF5',
        strokeWeight: 6
      });
      this.moveMarker.on('moving', function(e) {
        _this.passedPolyline.setPath(e.passedPath);
      });
      this.map.setFitView();
    },
    /** 轨迹回放 */
    startAnimation() {
      this.trackStart = 1;
      this.trackStatus = 0;
      this.map.setCenter(this.jmTracklist[0]);
      this.map.setZoom(13);
      this.moveMarker.moveAlong(this.jmTracklist, 4000); // speed 千米/小时
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
      this.polyline = null;
      this.passedPolyline = null;
      this.moveMarker = null;
    },
    /** 清除所有覆盖物 */
    clearMap() {
      this.map.clearMap();
      this.markerList = {};
      this.addressMsg = null;
      this.polyline = null;
      this.passedPolyline = null;
      this.moveMarker = null;
      this.infoWindow = null;
      this.jmTracklist = [];
      this.trackInfo = {};
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
          for (var i = 0; i < response.data.length; i++) {
            var dataItem = response.data[i];
            var item = [];
            item.push(dataItem.lng);
            item.push(dataItem.lat);
            _this.jmTracklist[i] = item;
          }
          this.removeReplayLine(); // 绘制前先清除
          if (this.jmTracklist.length > 0) {
            this.drawReplayLine();
          } else {
            this.msgInfo('暂无轨迹信息');
          }
        }
      }).catch(() => {
        this.buttonLoading = false;
      });
    }


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
    box-shadow: 3px 3px 12px rgba(0, 0, 0, 0.19);
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
            color: #909398;
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
  }

  // 轨迹回放卡片样式
  .track-card-info{
    position: absolute;
    top: 24px;
    left: 16px;
    z-index: 999;
    width: 334px;
    height: 436px;
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
      }
    }
    >.content{
      height: calc(100% - 52px);
      background: #fff;
      border-radius: 4px;
      border-radius: 4px;
      overflow: hidden;
      >.info{
        padding: 16px 0 8px;
        border-bottom: 1px solid rgba(159, 162, 181, 0.2);
        >.title{
          font-size: 18px;
          font-family: PingFang SC;
          font-weight: bold;
          line-height: 22px;
          color: #262626;
          padding: 0 15px 12px;
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
            color: #909398;
            margin-right: 12px;
          }
        }
      }
      >.form{
        padding: 16px;
        .form-item{
          margin-bottom: 15px;
        }
      }
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
