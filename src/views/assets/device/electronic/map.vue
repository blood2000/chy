<template>
  <div class="c-map-box">
    <div id="electronic-map-container" />
  </div>
</template>

<script>
import fence from '../mixins/fence';
export default {
  mixins: [fence],
  data() {
    return {
      map: null
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
    /** 绘制电子围栏 */
    drawFencePlat(data) {
      // 绘制前先清除
      this.clearMap();
      this.drawFencePlatByOrderList(data);
    },
    /** 清除地图所有覆盖物 */
    clearMap() {
      this.map.clearMap();
      this.clearAllFence();
    }
    // drawTestMarker(lng, lat) {
    //   const _this = this;
    //   const marker = new AMap.Marker({
    //     map: this.map,
    //     position: [lng, lat],
    //     label: {
    //       offset: new AMap.Pixel(0, -8),
    //       content: '<div>' + lng + ',' + lat + '</div>',
    //       direction: 'top'
    //     },
    //     icon: new AMap.Icon({
    //       image: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
    //       size: new AMap.Size(26, 34),
    //       imageSize: new AMap.Size(26, 34)
    //     }),
    //     autoFitView: true,
    //     autoRotation: true,
    //     offset: new AMap.Pixel(-13, -30)
    //   });
    // }
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
