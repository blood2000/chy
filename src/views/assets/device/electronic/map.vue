<template>
  <div class="c-map-box">
    <div id="electronic-map-container" />
  </div>
</template>

<script>
import { OneChangeMultiArray } from '@/utils/ddc.js';
export default {
  data() {
    return {
      map: null,
      // 围栏合集
      fenceList: {}
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
        offset: new AMap.Pixel(-13, -30)
      });
      // 双击定位
      marker.on('dblclick', function(e) {
        _this.map.setFitView(_this.fenceList[id]);
      });
      // 单击
      marker.on('click', function(e) {
        if (JSON.stringify(marker.getLabel()) === '{}') {
          marker.setLabel({
            offset: new AMap.Pixel(0, -8),
            content: '<div>' + text + '</div>',
            direction: 'top'
          });
        } else {
          marker.setLabel({});
        }
      });
    },
    /**
     * 绘制圆覆盖物
     * @param {string} id 唯一值必传
     * @param {Array} bound 圆形范围 [x, y, r]
     */
    drawCircle(id, bound) {
      const center = [bound[0], bound[1]];
      const radius = bound[2];
      const circle = new AMap.Circle({
        map: this.map,
        center,
        radius,
        strokeColor: '#ff4d4d', // 边框线颜色
        strokeOpacity: 1, // 边框线透明度
        strokeWeight: 3, // 边框线宽
        fillColor: '#ff4d4d', // 填充色
        fillOpacity: 0.3// 填充透明度
      });
      this.fenceList[id] = circle;
    },
    /**
     * 绘制矩形覆盖物
     * @param {string} id 唯一值必传
     * @param {Array} bound 矩形范围，[x, y, x, y]
     */
    drawRectangle(id, bound) {
      const southWest = new AMap.LngLat(bound[0], bound[1]);
      const northEast = new AMap.LngLat(bound[2], bound[3]);
      const bounds = new AMap.Bounds(southWest, northEast);
      const rectangle = new AMap.Rectangle({
        map: this.map,
        bounds,
        strokeColor: '#ff4d4d', // 边框线颜色
        strokeOpacity: 1, // 边框线透明度
        strokeWeight: 3, // 边框线宽
        fillColor: '#ff4d4d', // 填充色
        fillOpacity: 0.3// 填充透明度
      });
      this.fenceList[id] = rectangle;
    },
    /**
     * 绘制多边形覆盖物
     * @param {string} id 唯一值必传
     * @param {Array} bound 多边形范围，[x, y, x, y, ...]
     */
    drawPolygon(id, bound) {
      const path = OneChangeMultiArray(bound, 2);
      const polygon = new AMap.Polygon({
        map: this.map,
        path,
        strokeColor: '#ff4d4d', // 边框线颜色
        strokeOpacity: 1, // 边框线透明度
        strokeWeight: 3, // 边框线宽
        fillColor: '#ff4d4d', // 填充色
        fillOpacity: 0.3// 填充透明度
      });
      this.fenceList[id] = polygon;
    },
    /** 绘制电子围栏 */
    drawFencePlat(data) {
      data.forEach(el => {
        if (el.centerLat && el.centerLng && el.centerLat !== '0' && el.centerLng !== '0') {
          const id = el.platFenceCode;
          const addressType = el.addressType === '1' ? ' [装货]' : (el.addressType === '2' ? ' [卸货]' : '');
          const text = el.mainOrderNumber + addressType;
          const geomArray = el.geomText.split(',');
          if (el.geomType === 1) {
            this.drawCircle(id, geomArray);
          } else if (el.geomType === 2) {
            this.drawRectangle(id, geomArray);
          } else if (el.geomType === 3) {
            this.drawPolygon(id, geomArray);
          }
          this.drawMarker(id, [el.centerLng, el.centerLat], text);
        }
      });
      this.$nextTick(() => {
        this.map.setFitView();
      });
    },
    /** 清除所有覆盖物 */
    clearMap() {
      this.map.clearMap();
      this.fenceList = {};
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
