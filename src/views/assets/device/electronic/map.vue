<template>
  <div class="c-map-box">
    <div id="electronic-map-container" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      map: null,
      circleList: {}
    };
  },
  mounted() {
    this.initMap();
  },
  methods: {
    /** 初始化地图 */
    initMap() {
      this.map = new AMap.Map('electronic-map-container', {
        resizeEnable: true,
        center: [119.358267, 26.04577],
        zoom: 11
      });
    },
    /** 绘制标记
     * @param {string} id 唯一值必传
     * @param {LngLat} position 经纬度必传
     * @param {Object} text 文本内容
    */
    drawMarker(id, position, text) {
      const _this = this;
      const marker = new AMap.Marker({
        map: this.map,
        position: position,
        label: {
          offset: new AMap.Pixel(0, -8),
          content: '<div>' + text + '</div>',
          direction: 'top'
        },
        icon: new AMap.Icon({
          image: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
          size: new AMap.Size(26, 34),
          imageSize: new AMap.Size(26, 34)
        }),
        autoFitView: true,
        autoRotation: true,
        offset: new AMap.Pixel(-13, -34)
      });
      // 双击定位
      marker.on('dblclick', function(e) {
        _this.map.setFitView(_this.circleList[id]);
      });
    },
    /**
     * 绘制圆覆盖物
     * @param {string} id 唯一值必传
     * @param {LngLat} center 中心点
     * @param {Number} radius 半径
     */
    drawCircle(id, center, radius) {
      const circle = new AMap.Circle({
        map: this.map,
        center: center,
        radius: radius,
        strokeColor: '#ff4d4d', // 边框线颜色
        strokeOpacity: 1, // 边框线透明度
        strokeWeight: 3, // 边框线宽
        fillColor: '#ff4d4d', // 填充色
        fillOpacity: 0.3// 填充透明度
      });
      this.circleList[id] = circle;
    },
    /** 绘制电子围栏 */
    drawFencePlat(data) {
      data.forEach(el => {
        if (el.lat && el.lng && el.lat !== '0' && el.lng !== '0') {
          const id = el.orderCode + el.addressCode;
          const addressType = el.addressType === '1' ? ' [装货]' : (el.addressType === '2' ? ' [卸货]' : '');
          const text = el.mainOrderNumber + addressType;
          this.drawCircle(id, [el.lng, el.lat], el.radius);
          this.drawMarker(id, [el.lng, el.lat], text);
        }
      });
      this.$nextTick(() => {
        this.map.setFitView();
      });
    },
    /** 清除所有覆盖物 */
    clearMap() {
      this.map.clearMap();
      this.circleList = {};
    }
  }
};
</script>

<style lang="scss" scoped>
.c-map-box{
  position: relative;
  >#electronic-map-container{
    height: 100%;
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
  }
}
</style>
