import { OneChangeMultiArray } from '@/utils/ddc.js';
export default {
  data() {
    return {
      // 围栏合集
      fenceList: {},
      // 围栏中心集合
      fenceCenterMarkerList: {}
    };
  },
  methods: {
    /**
     * 绘制圆覆盖物
     * @param {string} id 唯一值必传
     * @param {Array} bound 圆形范围 [x, y, r]
     */
    drawCircle(id, bound) {
      const _this = this;
      const center = [bound[0], bound[1]];
      const radius = bound[2];
      const circle = new AMap.Circle({
        map: _this.$refs.map.$$getInstance(),
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
      const _this = this;
      const southWest = new AMap.LngLat(bound[0], bound[1]);
      const northEast = new AMap.LngLat(bound[2], bound[3]);
      const bounds = new AMap.Bounds(southWest, northEast);
      const rectangle = new AMap.Rectangle({
        map: _this.$refs.map.$$getInstance(),
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
      const _this = this;
      const path = OneChangeMultiArray(bound, 2);
      const polygon = new AMap.Polygon({
        map: _this.$refs.map.$$getInstance(),
        path,
        strokeColor: '#ff4d4d', // 边框线颜色
        strokeOpacity: 1, // 边框线透明度
        strokeWeight: 3, // 边框线宽
        fillColor: '#ff4d4d', // 填充色
        fillOpacity: 0.3// 填充透明度
      });
      this.fenceList[id] = polygon;
    },
    /** 绘制围栏中心标记
     * @param {string} id 唯一值必传
     * @param {LngLat} position 经纬度必传
     * @param {Object} text 文本内容
    */
    drawFenceCenterMarker(id, position, text) {
      const _this = this;
      const marker = new AMap.Marker({
        map: _this.$refs.map.$$getInstance(),
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
      this.fenceCenterMarkerList[id] = marker;
      // 双击定位
      marker.on('dblclick', function(e) {
        _this.$refs.map.$$getInstance().setFitView(_this.fenceList[id]);
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
    /** 清除所有围栏 */
    clearAllFence() {
      for (const key in this.fenceList) {
        this.fenceList[key].setMap(null);
        this.fenceList[key] = null;
      }
      for (const key in this.fenceCenterMarkerList) {
        this.fenceCenterMarkerList[key].setMap(null);
        this.fenceCenterMarkerList[key] = null;
      }
      this.fenceList = {};
      this.fenceCenterMarkerList = {};
    },
    /** 绘制电子围栏 */
    drawFencePlatByOrderList(data) {
      data.forEach(el => {
        if (el.centerLat && el.centerLng && el.centerLat !== '0' && el.centerLng !== '0') {
          // 围栏唯一标识
          const id = el.platFenceCode;
          // 围栏气泡窗文字
          const addressType = el.addressType === '1' ? ' [装货]' : (el.addressType === '2' ? ' [卸货]' : '');
          const text = el.mainOrderNumber + addressType;
          // 绘制围栏
          const geomArray = el.geomText.split(',');
          if (el.geomType === 1) {
            this.drawCircle(id, geomArray);
          } else if (el.geomType === 2) {
            this.drawRectangle(id, geomArray);
          } else if (el.geomType === 3) {
            this.drawPolygon(id, geomArray);
          }
          // 绘制围栏中心
          this.drawFenceCenterMarker(id, [el.centerLng, el.centerLat], text);
        }
      });
      this.$nextTick(() => {
        const _this = this;
        _this.$refs.map.$$getInstance().setFitView();
      });
    }
  }
};
