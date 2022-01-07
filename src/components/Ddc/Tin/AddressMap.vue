<template>

  <div>
    <div v-if="iscustomize" class="sfiwhfowij">
      <template v-if="!(drawPolygons.length>0 || drawRectangles.length>0 || drawCircles.length>0) ">
        <el-button class="btn" type="primary" size="mini" :plain="active!=='drawPolygon'" round @click="()=>{active='drawPolygon'; drawPolygon() }">绘制多边形</el-button>
        <el-button class="btn" type="primary" size="mini" :plain="active!=='drawRectangle'" round @click="()=>{active='drawRectangle'; drawRectangle() }">绘制矩形</el-button>
        <el-button class="btn" type="primary" size="mini" :plain="active!=='drawCircle'" round @click="()=>{active='drawCircle'; drawCircle() }">绘制圆形</el-button>
      </template>

      <!-- <el-button v-if="polyEditor" class="btn" type="primary" size="mini" plain round @click="closePolyEditor">多边形编辑保存</el-button>
      <el-button v-if="rectangleEditor" class="btn" type="primary" size="mini" plain round @click="closeRectangleEditor">矩形编辑保存</el-button>
      <el-button v-if="circleEditor" class="btn" type="primary" size="mini" plain round @click="closeCircleEditor">圆形编辑保存</el-button> -->

      <el-button v-if="polyEditor || rectangleEditor || circleEditor" class="btn" type="primary" size="mini" plain round @click="cancelBack">返回</el-button>
    </div>
    <div class="map-content" :style="{height:'58vh'}">
      <el-amap
        ref="amapref"
        :vid="vid"
        :resize-enable="true"
        :expand-zoom-range="true"
        :zoom="zoom"
        :center="center"
        :plugin="plugins"
        :events="events"
      >
        <el-amap-marker
          :position="marker.position"
          :icon="marker.icon"
        />
        <!-- 画电子围栏 -->
        <!-- <el-amap-circle
          v-if="showCircle"
          :center="circle.center"
          :radius="circle.radius"
          :fill-opacity="0.3"
          :fill-color="'#ff4d4d'"
          :stroke-color="'#ff4d4d'"
          :editable="true"
          :events="circle.events"
        /> -->
      </el-amap>

    </div>
  </div>
</template>

<script>
/**
 * 使用
 *  1: main.js 定义
 *    import VueAMap from 'vue-amap';
          Vue.use(VueAMap);
          VueAMap.initAMapApiLoader({
            key: '2066cb0dafaa492aee47fa1090227a38', // 高德企业key
            plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.Driving', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.RectangleEditor', 'AMap.PolygonEditor', 'AMap.CircleEditor', 'AMap.Geocoder', 'AMap.Marker', 'AMap.MouseTool'],
            v: '1.4.4',
            uiVersion: '1.1.1'
      });

    2: 基本使用
        <AddressMap
          iscustomize (控制)
          :value="[116.478928, 39.997761]" (中心点)
          :cb-data="mapData" (回填数据, 具体看下面)
          vid="electronic" (el-amap的唯一值(多地图使用))
          :option="{   (其他的配置,目前只有 zoom)
            zoom: 16
          }"
          show-circle (没用了好像, 可以不要)
        />

    3: 方法
    @getAddressInfo="getAddressInfo"  参数: { circleCenter, circleRadius, formattedAddress }
    @getMapData="getMapData"  (没用了好像, 可以不要)
 */

// import { DebounceFun } from '@/utils/index'; // 节流


const geocoder = new AMap.Geocoder({
  radius: 1,
  extensions: 'all'
});

// 1 圆形
const circleStyle = {
  strokeColor: '#FF33FF',
  strokeWeight: 6,
  strokeOpacity: 0.2,
  fillColor: '#1791fc',
  fillOpacity: 0.4,
  // 线样式还支持 'dashed'
  strokeStyle: 'solid'
  // strokeStyle是dashed时有效
  // strokeDasharray: [30,10],
  // 线样式还支持 'dashed'
  // strokeDasharray: [30,10],
};

// 2 矩形样式
const rectangleStyle = {
  strokeColor: '#FF33FF',
  strokeWeight: 6,
  strokeOpacity: 0.2,
  fillColor: '#1791fc',
  fillOpacity: 0.4,
  // 线样式还支持 'dashed'
  strokeStyle: 'solid'
  // strokeStyle是dashed时有效
  // strokeDasharray: [30,10],
};

// 3 多边行
const polygonStyle = {
  strokeColor: '#FF33FF',
  strokeWeight: 6,
  strokeOpacity: 0.2,
  fillColor: '#1791fc',
  fillOpacity: 0.4,
  // 线样式还支持 'dashed'
  strokeStyle: 'solid'
  // strokeStyle是dashed时有效
  // strokeDasharray: [30,10],
};



export default {

  props: {

    iscustomize: {
      type: Boolean,
      default: false
    },
    value: {
      type: Array,
      default: () => [116.478928, 39.997761]
    },
    vid: {
      type: String,
      default: 'amapDemo'
    },
    showCircle: {
      type: Boolean,
      default: false
    },
    option: {
      type: Object,
      default: () => { return {}; }
    },
    circleRadius: {
      type: Number,
      default: 200
    },
    circleCenter: {
      type: Array,
      default: () => []
    },
    cbData: {
      type: Array,
      default: () => []
    }
  },

  data() {
    const _this = this;
    return {
      typeClick: false,
      typeMove: false,
      // 地图初始点位
      initPoint: [116.478928, 39.997761],
      zoom: 14,
      //   center: [116.478928, 39.997761], // v-mode
      // 地图坐标点信息
      marker: {
        icon: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
        position: [116.478928, 39.997761]
      },
      // 插件
      plugins: ['ToolBar'],

      // 事件
      events: {
        init: (o) => {
          this.init();
          // this.$refs.map.$$getInstance();
          // o.getCity(result => { console.log(result, '点了'); });
        },
        click(e) {
          // console.log(_this.active);
          // console.log('您在 [ ' + e.lnglat.getLng() + ',' + e.lnglat.getLat() + ']的位置点击了');
          // if (_this.showCircle || _this.active) return;
          // const { lng, lat } = e.lnglat;
          // _this.center = [lng, lat];
          // _this.typeClick = true; // 点击才赋值
        },
        complete: () => {
          _this.setFitView();
        }
      },

      // s=电子围栏相关
      circle: {
        center: [116.478928, 39.997761],
        radius: 200,
        events: {
          move(e) {
            const { lng, lat } = e.lnglat;
            _this.typeMove = true;
            _this.addressInfo = {
              ..._this.addressInfo,
              circleCenter: [lng, lat]
            };
            _this.handlerGetAddress([lng, lat]);
            _this.typeMove = false;
            // _this.setFitView();
          },
          // mouseup: (e) => {
          //   // 移动结束
          //   console.log(e, '移动结束');
          //   _this.typeClick = false;
          // },
          adjust: (e) => {
            let radius = e.radius;
            if (e.radius < 50) {
              radius = 50;
            } else if (e.radius > 1000) {
              radius = 1000;
            }
            _this.addressInfo = {
              ..._this.addressInfo,
              circleRadius: radius
            };
            // _this.setFitView();
          }

        }
      },

      // s= 地址相关的数据()
      addressInfo: {},
      handlerGetAddress: null,
      setShapePolygon: null,
      setShapeRectangle: null,
      setShapeCircle: null,

      // 使用原生控件
      active: '',

      // 创建的实例集合(分开放)
      drawPolygons: [], // 多变形
      drawRectangles: [], // 矩形
      drawCircles: [], // 圆形
      markers: [],

      map: null,
      mouseTool: null,

      rectangle: null, // 当前选中的矩形


      polyEditor: null, // 触发编辑
      rectangleEditor: null, // 触发编辑
      circleEditor: null, // 触发编辑

      bianjiduixian: null,
      issffwbfs: false,
      isBianji: '',

      marker1: null, // 中心点实例
      marker2: null,
      marker3: null
    };
  },

  computed: {
    center: {
      get() {
        const center = this.value.length ? this.value : [116.478928, 39.997761];
        return center;
      },
      set(val) {
        this.$emit('input', val);
      }
    },

    mapData() {
      const polygons = this.drawPolygons.map(e => e.getExtData());
      const rectangles = this.drawRectangles.map(e => e.getExtData());
      const circles = this.drawCircles.map(e => e.getExtData());
      const arr = [...polygons, ...rectangles, ...circles];
      return arr;
    }
  },

  watch: {
    // 赋值
    center(val) {
      this.marker.position = val;
      this.showCircle && (this.circle.center = val);
      this._getAddress(val);
    },

    circleRadius(radius) {
      this.$set(this.circle, 'radius', radius);
    },

    circleCenter(arr) {
      if (this.typeMove) return;
      this.$set(this.circle, 'center', arr);
    },

    // 取值
    addressInfo: {
      handler(val) {
        this.$emit('getAddressInfo', val);
      },
      deep: true
    },

    // s= 暴露数据
    mapData: {
      handler(val, olval) {
        if (JSON.stringify(val) === JSON.stringify(olval)) return;
        if (val && Array.isArray(val) && val.length > 0) {
          this.$emit('getMapData', val);
        }
      },
      deep: true
    }

    // s= 数据回填
    // cbData: {
    //   handler(_data) {
    //     if (!(_data && Array.isArray(_data) && _data.length > 0)) return;
    //     console.log(_data);
    //     /*
    //     centerLat: 39.99691
    //     centerLng: 116.476925
    //     geomText: Array(6)
    //     geomType: 3
    //     */
    //     // 1类型(3中类型)
    //     _data.forEach(e => {
    //       if (e.geomType === 1) {
    //         this.created元();
    //       } else if (e.geomType === 2) {
    //         this.createdjuxing();
    //       } else if (e.geomType === 3) {
    //         this.createdduobuew(_data);
    //       }
    //     });
    //     // 2创建对应图形
    //   },
    //   immediate: true
    // }
  },

  created() {
    this.handlerGetAddress = this.newDebounceFun(this._getAddress, 1000);

    // this.handlerDrawPolygon = this.newDebounceFun(this.handlerDrawPolygon, 1000);
    this.setShapeRectangle = this.newDebounceFun(this.handlerDrawRectangle, 700);
    this.setShapeCircle = this.newDebounceFun(this.handlerDrawCircle, 700);
  },

  mounted() {
    this.zoom = this.option.zoom || 14;
    this.initPoint = this.value;
    this.marker.position = this.value;

    // this.marker.position = this.center;
    // this.circle.center = this.center;
    // this.handlerGetAddress(this.center);
    // console.log(this.circleRadius);

    // this.$set(this.circle, 'radius', this.circleRadius);
    // this.$set(this.circle, 'center', this.circleCenter);
  },

  methods: {

    init() {
      this.map = this.$refs.amapref.$$getInstance();

      // 数据回填(绘制图形)
      if (this.cbData && Array.isArray(this.cbData) && this.cbData.length > 0) {
        //
        this.cbData.forEach(e => {
          if (e.geomType === 1) {
            this.hsuewojfwodds(e);
          } else if (e.geomType === 2) {
            this.rectanglehsuehfue(e);
          } else if (e.geomType === 3) {
            this.createdduobuew(e);
          }
        });
        // return;
      }
      this.mouseTool = new AMap.MouseTool(this.map);

      this.mouseTool.on('draw', (event) => {
        this.$confirm('确定?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          closeOnClickModal: false,
          type: 'warning'
        }).then(() => {
          let __e__ = event.obj;

          if (this.active === 'drawPolygon') {
            //
            this.mouseTool.close();
            this.handlerDrawPolygon(__e__);
            this.drawPolygons.push(__e__);
            this.map.add(this.drawPolygons);
            this.openPolyEditor(__e__);
            //
          } else if (this.active === 'drawRectangle') {
            // 高德的bug, 画完后无法编辑
            __e__ = new AMap.Rectangle({
              bounds: __e__.getBounds(),
              strokeColor: '#FF33FF',
              strokeWeight: 6,
              strokeOpacity: 0.2,
              fillColor: '#1791fc',
              fillOpacity: 0.4,
              // 线样式还支持 'dashed'
              strokeStyle: 'solid'
              // strokeStyle是dashed时有效
              // strokeDasharray: [30,10],
            });

            this.mouseTool.close(true);
            this.handlerDrawRectangle(__e__);
            this.drawRectangles.push(__e__);
            this.map.add(this.drawRectangles);
            this.openRectangleEditor(__e__);
            //
          } else if (this.active === 'drawCircle') {
            //
            this.handlerDrawCircle(__e__);
            this.mouseTool.close();
            this.drawCircles.push(__e__);
            this.map.add(this.drawCircles);
            this.openCircleEditor(__e__);
            //
          }
          this.active = '';
        }).catch(() => {
          this.mouseTool.close(true);
          this.active = '';
        });
      });

      // this.map.setFitView();
    },

    // 处理多边形
    handlerDrawPolygon(__e__) {
      __e__.on('dblclick', (event) => {
        this.openPolyEditor(event.target); // 打开编辑
      });
      const pathArr = __e__.getPath().map(e => {
        return [e.toString()];
      });
      const centers = __e__.getBounds().getCenter();
      const obj = {
        geomName: '多边形', // 自定义中文名
        geomEn: 'drawPolygon', // 英文名
        id: this['drawPolygons'].length, // 数组的下标(当做id)
        geomType: 3, // 几何类型（1.圆形 2.矩形 3.多边形）
        centers: centers, // 中心点(数组)
        centerLat: centers.getLat(),
        centerLng: centers.getLng(),
        geomText: pathArr // 几何数据
      };
      __e__.setExtData(obj);

      // 添加锚点位置
      if (this.marker1) {
        this.marker1.setPosition([obj.centerLng, obj.centerLat]);
      } else {
        this.marker1 = this.createdMarker([obj.centerLng, obj.centerLat], 'marker1');
      }
      return obj;
    },

    // 处理矩形
    handlerDrawRectangle(__e__) {
      const bound = __e__.getBounds();
      __e__.on('dblclick', (event) => {
        this.openRectangleEditor(event.target); // 打开编辑
      });
      const southWest = bound.getSouthWest().toString(); // 西南角经纬度
      const northEast = bound.getNorthEast().toString(); // 东北角经纬度
      const northWest = bound.getNorthWest().toString(); // 西北角经纬度
      const southEast = bound.getSouthEast().toString(); // 东南角经纬度
      const centers = bound.getCenter(); // 东南角经纬度
      const obj = {
        geomName: '矩形', // 自定义中文名
        geomEn: 'drawRectangle', // 英文名
        id: this['drawRectangle' + 's'].length, // 数组的下标(当做id)
        geomType: 2, // 几何类型（1.圆形 2.矩形 3.多边形）
        centers: centers, // 中心点(数组)
        centerLat: centers.getLat(),
        centerLng: centers.getLng(),
        southWest,
        northEast,
        northWest,
        southEast,
        geomText: [southWest, northEast] // 几何数据
      };
      __e__.setExtData(obj);

      // 添加锚点位置
      if (this.marker2) {
        this.marker2.setPosition([obj.centerLng, obj.centerLat]);
      } else {
        this.marker2 = this.createdMarker([obj.centerLng, obj.centerLat], 'marker2');
      }
      return obj;
    },

    // 处理圆形
    handlerDrawCircle(__e__) {
      const centers = __e__.getCenter();
      __e__.on('dblclick', (event) => {
        this.openCircleEditor(event.target); // 打开编辑
      });
      const obj = {
        geomName: '圆形', // 自定义中文名
        geomEn: 'drawCircle', // 英文名
        id: this['drawCircle' + 's'].length, // 数组的下标(当做id)
        geomType: 1, // 几何类型（1.圆形 2.矩形 3.多边形）
        centers: centers, // 中心点(数组)
        centerLat: centers.getLat(),
        centerLng: centers.getLng(),
        radius: __e__.getRadius()
      };
      __e__.setExtData(obj);

      // 添加锚点位置
      if (this.marker3) {
        this.marker3.setPosition([obj.centerLng, obj.centerLat]);
      } else {
        this.marker3 = this.createdMarker([obj.centerLng, obj.centerLat], 'marker3');
      }

      return obj;
    },

    // s= 编辑
    // 多变形
    openPolyEditor(__e__) {
      this.closePolyEditor();
      this.polyEditor = new AMap.PolyEditor(this.map, __e__);
      this.polyEditor.open();
      this.polyEditor.on('end', ({ type, target }) => {
        // console.log(target, '编辑结束触发....');
        this.handlerDrawPolygon(target);
        this.polyEditor = null;
      });
      this.polyEditor.on('adjust', ({ type, target }) => {
        console.log('拖动多边形触发后直接处理数据, 包括中心点锚点....');
        this.handlerDrawPolygon(target);
        // const centers = target.getBounds().getCenter();
        // this.marker1.setPosition([centers.lng, centers.lat]);
      });
    },
    // 关闭多变形
    closePolyEditor() {
      this.polyEditor && this.polyEditor.close();
    },

    // 矩形
    openRectangleEditor(__e__) {
      this.closeRectangleEditor();
      this.rectangleEditor = new AMap.RectangleEditor(this.map, __e__);
      this.rectangleEditor.open();
      this.rectangleEditor.on('end', ({ type, target }) => {
        // console.log(target, '编辑结束触发....');
        this.handlerDrawRectangle(target);
        this.rectangleEditor = null;
      });
      this.rectangleEditor.on('adjust', ({ type, target }) => {
        console.log('拖动矩形触发后直接处理数据, 包括中心点锚点....');
        this.setShapeRectangle(target);
      });
    },
    // 关闭矩形
    closeRectangleEditor() {
      this.rectangleEditor && this.rectangleEditor.close();
    },

    // 圆形
    openCircleEditor(__e__) {
      this.closeCircleEditor();
      this.circleEditor = new AMap.CircleEditor(this.map, __e__);
      this.circleEditor.open();
      this.circleEditor.on('end', ({ type, target }) => {
        // console.log(target, '编辑结束触发....');
        this.handlerDrawCircle(target);
        this.circleEditor = null;
      });
      this.circleEditor.on('move', ({ type, target }) => {
        console.log('拖动圆形中心点触发后直接处理数据, 包括中心点锚点....');
        this.setShapeCircle(target);
      });
      this.circleEditor.on('adjust', ({ type, target }) => {
        console.log('拖圆形触发后直接处理数据, 包括中心点锚点....');
        this.setShapeCircle(target);
      });
    },
    // 关闭圆形
    closeCircleEditor() {
      this.circleEditor && this.circleEditor.close();
    },
    // e=


    // s= 按钮触发事件

    // 绘制线段
    // drawPolyline() {
    //   if (this.active !== 'drawPolyline') return;
    //   this.mouseTool.polyline({
    //     strokeColor: '#3366FF',
    //     strokeOpacity: 1,
    //     strokeWeight: 6,
    //     // 线样式还支持 'dashed'
    //     strokeStyle: 'solid'
    //     // strokeStyle是dashed时有效
    //     // strokeDasharray: [10, 5],
    //   });
    // },

    // 绘制多边形
    drawPolygon() {
      if (this.active !== 'drawPolygon') return;
      this.mouseTool.polygon({
        ...polygonStyle
      });
    },

    // 绘制矩形
    drawRectangle() {
      if (this.active !== 'drawRectangle') return;
      this.mouseTool.rectangle({
        ...rectangleStyle
      });
    },

    // 绘制圆形
    drawCircle() {
      if (this.active !== 'drawCircle') return;
      this.mouseTool.circle({
        ...circleStyle
      });
    },

    // 创建一个覆盖物
    createdMarker(position, id = 0) {
      var marker = new AMap.Marker({
        position: new AMap.LngLat(position[0], position[1]),
        icon: '//webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
        extData: {
          id
        },
        offset: new AMap.Pixel(-9, -30)
      });
      this.markers.push(marker);
      this.map.add(marker);
      return marker;
    },

    // e

    _getAddress([lng, lat]) {
      console.log(this.typeClick);
      geocoder.getAddress([lng, lat], (status, result) => {
        if (status === 'complete' && result.info === 'OK') {
          if (result && result.regeocode) {
            console.log(result.regeocode);
            const { adcode, province, city, district, township, street, streetNumber } = result.regeocode.addressComponent;


            let formattedAddress = result.regeocode.aois[0] ? result.regeocode.aois[0].name : result.regeocode.formattedAddress;

            if (!this.showCircle) {
              formattedAddress = this.typeClick ? formattedAddress : undefined;
            }
            this.typeClick = false;

            // 点击后获取的地址
            const addressInfo = {
              formattedAddress,
              detailed: district + township + street + streetNumber,
              province,
              city: city || province,
              district,
              provinceCode: adcode.slice(0, 2),
              cityCode: adcode.slice(0, 4),
              districtCode: adcode.slice(0, 6)
            };
            this.addressInfo = {
              ...this.addressInfo,
              ...addressInfo
            };
          }
        }
      });
    },

    // 更新地图
    setFitView() {
      if (!this.showCircle) return;
      const refData = this.$refs.amapref.$$getInstance();
      if (refData) {
        refData.setFitView();
      }
    },

    // s= 数据回填生成图形
    /**
     * 圆
     * {
     *  centerLng: 中心经度 (N)
     *  centerLat: 中心维度 (N)
     *  radius: 半径 (N)
     *  geomType: 1
     * }
     */
    hsuewojfwodds(_data) {
      var __e__ = new AMap.Circle({
        ...circleStyle,
        center: [_data.centerLng, _data.centerLat],
        radius: _data.radius // 半径
      });

      this.handlerDrawCircle(__e__);
      this.drawCircles.push(__e__);
      this.map.add(this.drawCircles);
      this.openCircleEditor(__e__);
    },
    /**
     * 矩形
     * _data{
     *  southWest:[ 经度(N), 维度(N) ]
     *  northEast:[ 经度(N), 维度(N) ]
     *  geomType: 2
     * }
     */
    rectanglehsuehfue(_data) {
      var southWest = new AMap.LngLat(_data.southWest[0], _data.southWest[1]);
      var northEast = new AMap.LngLat(_data.northEast[0], _data.northEast[1]);
      var bounds = new AMap.Bounds(southWest, northEast);

      var __e__ = new AMap.Rectangle({
        ...rectangleStyle,
        bounds: bounds
      });

      this.handlerDrawRectangle(__e__);
      this.drawRectangles.push(__e__);
      this.map.add(this.drawRectangles);
      this.openRectangleEditor(__e__);
    },
    /**
     * 多边形
     * _data{
     *  geomText:[[经度(N), 维度(N)],[经度(N), 维度(N)],[经度(N), 维度(N)]]
     *  geomType: 3
     * }
     */
    createdduobuew(_data) {
      var __e__ = new AMap.Polygon({
        ...polygonStyle,
        path: _data.geomText
      });

      //
      this.handlerDrawPolygon(__e__);
      this.drawPolygons.push(__e__);
      this.map.add(this.drawPolygons);
      this.openPolyEditor(__e__);
    },

    cancelBack() {
      // 移除编辑器
      this.circleEditor && this.circleEditor.close();
      this.circleEditor = null;
      this.polyEditor && this.polyEditor.close();
      this.polyEditor = null;
      this.rectangleEditor && this.rectangleEditor.close();
      this.rectangleEditor = null;
      this.mouseTool.close(true);
      this.active = '';
      // 移除中心点
      this.marker1 && this.marker1.setMap(null);
      this.marker1 = null;
      this.marker2 && this.marker2.setMap(null);
      this.marker2 = null;
      this.marker3 && this.marker3.setMap(null);
      this.marker3 = null;
      // 移除实例
      this.drawPolygons.forEach(el => {
        el.setMap(null);
      });
      this.drawPolygons = [];
      this.drawRectangles.forEach(el => {
        el.setMap(null);
      });
      this.drawRectangles = [];
      this.drawCircles.forEach(el => {
        el.setMap(null);
      });
      this.drawCircles = [];
    },

    // 防抖=需要带参数,避免和原方法冲突
    newDebounceFun(callback, time) {
      var timer;
      return function(...argument) {
        clearTimeout(timer);
        timer = setTimeout(function() {
          callback(...argument);
        }, time);
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.sfiwhfowij{
  margin-bottom: 10px;
}
.amap-icon img,
.amap-marker-content img{
    width: 25px;
    height: 34px;
}
.map-content{

    width: 100%;
    position: relative;
    ::v-deep .amap-marker .amap-icon img{
        max-width: 40px !important;
        max-height: 30px !important;
    }
}
</style>
