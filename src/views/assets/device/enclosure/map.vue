<template>
  <!-- 地图组件 -->
  <div class="c-map-box">
    <!-- <el-button size="mini" class="mb10" @click="drawMarker(new Date().getTime(), [116.478935, 39.997761], '我是marker的title1')">绘制点标记</el-button>
    <el-button size="mini" class="mb10" @click="drawMarker(new Date().getTime(), [116.479935, 39.997761], '我是marker的title2')">绘制点标记2</el-button>
    <el-button size="mini" class="mb10" @click="drawMarker(new Date().getTime(), [116.480935, 39.997761], '我是marker的title3')">绘制点标记3</el-button>
    <el-button size="mini" @click="removeMarker">清除指定点标记</el-button>
    <el-button size="mini" @click="removeAllMarker">移除所有点标记</el-button> ////
    <el-button size="mini" @click="drawLine(lineArr)">绘制普通轨迹</el-button>
    <el-button size="mini" @click="removeLine()">移除普通轨迹</el-button> ////
    <el-button size="mini" @click="drawReplayLine()">绘制回放轨迹</el-button>
    <el-button size="mini" @click="startAnimation()">轨迹回放-开始</el-button>
    <el-button size="mini" @click="pauseAnimation()">轨迹回放-暂停</el-button>
    <el-button size="mini" @click="resumeAnimation()">轨迹回放-继续</el-button>
    <el-button size="mini" @click="stopAnimation()">轨迹回放-停止</el-button>
    <el-button size="mini" @click="removeReplayLine()">清除回放轨迹</el-button> ////
    <el-button size="mini" @click="clearMap()">清除所有覆盖物</el-button> -->
    <div v-if="addressMsg && addressMsg!==''" class="address ly-flex ly-flex-pack-center ly-flex-align-center">
      <img class="mr5" src="@/assets/images/device/position.png">
      {{ addressMsg }}
    </div>
    <div id="container" />
  </div>
</template>

<script>
const geocoder = new AMap.Geocoder({
  radius: 1000,
  extensions: 'all'
});

export default {
  props: {

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
      lineArr: [[116.478935, 39.997761], [116.478939, 39.997825], [116.478912, 39.998549], [116.478912, 39.998549], [116.478998, 39.998555], [116.478998, 39.998555], [116.479282, 39.99856], [116.479658, 39.998528], [116.480151, 39.998453], [116.480784, 39.998302], [116.480784, 39.998302], [116.481149, 39.998184], [116.481573, 39.997997], [116.481863, 39.997846], [116.482072, 39.997718], [116.482362, 39.997718], [116.483633, 39.998935], [116.48367, 39.998968], [116.484648, 39.999861]],
      moveMarker: null,
      // 窗体信息
      infoWindow: null,
      // 地址信息
      addressMsg: null
    };
  },
  mounted() {
    this.initMap();
  },
  methods: {
    /** 初始化地图 */
    initMap() {
      this.map = new AMap.Map('container', {
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
    drawMarker(id, position, labelText, icon) {
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
        clickable: !!labelText
      });
      marker.setMap(this.map);
      if (labelText) {
        AMap.event.addListener(marker, 'click', function() {
          _this.markerInfoInit(marker, labelText);
        });
      }
      this.markerList[id] = marker;
      this.getAddressBylnglat(position);
      this.map.setFitView();
    },
    /** 实例化窗体 */
    markerInfoInit(marker, text) {
      const content = [];
      content.push('内容：' + text);
      content.push("<a href='https://ditu.amap.com/detail/B000A8URXB?citycode=110105'>详细信息</a>");
      this.infoWindow = new AMap.InfoWindow({
        isCustom: false, // 使用自定义窗体
        content: content.join('<br/>'),
        offset: new AMap.Pixel(16, -45)
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
    /** 移除指定标记 */
    removeMarker(id) {
      if (id && this.markerList[id]) {
        this.markerList[id].setMap(null);
        delete this.markerList[id];
      }
    },
    /** 移除所有标记 */
    removeAllMarker() {
      for (const key in this.markerList) {
        this.markerList[key].setMap(null);
        this.markerList[key] = null;
      }
      this.markerList = {};
      this.addressMsg = null;
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
    /** 移除轨迹 */
    removeLine() {
      if (this.polyline) {
        this.map.remove(this.polyline);
        this.polyline = null;
      }
    },
    /** 绘制回放轨迹 */
    drawReplayLine() {
      this.removeReplayLine(); // 绘制前先清除
      const _this = this;
      this.moveMarker = new AMap.Marker({
        map: this.map,
        position: [116.478935, 39.997761],
        icon: 'https://webapi.amap.com/images/car.png',
        offset: new AMap.Pixel(-26, -13),
        autoRotation: true,
        angle: -90
      });
      // 绘制轨迹
      this.polyline = new AMap.Polyline({
        map: this.map,
        path: this.lineArr,
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
      this.moveMarker.moveAlong(this.lineArr, 400); // speed 千米/小时
    },
    pauseAnimation() {
      this.moveMarker.pauseMove();
    },
    resumeAnimation() {
      this.moveMarker.resumeMove();
    },
    stopAnimation() {
      this.moveMarker.stopMove();
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
    }



  }
};
</script>

<style lang="scss" scoped>
.c-map-box{
  position: relative;
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
    z-index: 99;
  }
  >#container{
    height: 100%;
  }
}
</style>
