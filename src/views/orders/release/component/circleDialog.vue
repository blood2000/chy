<template>
  <!-- 车辆定位对话框 -->
  <el-dialog :title="title" :visible="visible" width="1400px" append-to-body destroy-on-close @close="cancel">
    <div class="amap-wrapper">
      <div class="slider-box">
        <div>电子围栏(米): </div>
        <div class="slider-box-rigth">
          <el-slider v-model="radius" show-input :max="10000" :min="0" />
        </div>
      </div>
      <el-amap
        ref="map"
        vid="amapDemo"
        :center="center"
        :zoom="zoom"
        :plugin="plugin"
        :events="events"
        class="amap-demo"
      >
        <el-amap-marker
          vid="component-marker"
          :position="lnglat"
        />
        <!-- :events="{
            dragging: handlerDragging,
          }" -->
        <el-amap-marker
          vid="component-marker2"
          :position="center"
          :draggable="true"
          :events="{
            dragging: handlerDragging,
          }"
        />

        <el-amap-circle
          :center="center"
          :radius="radius"
          :fill-opacity="0.3"
          :fill-color="'#ff4d4d'"
          :stroke-color="'#ff4d4d'"
          :editable="true"
          :events="{
            click: mcircleClick,
            move: handlerMove,
            adjust: handlerAdjust
          }"
        />
      </el-amap>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    // lnglat: {
    //   type: Array,
    //   default: () => []
    // },
    title: {
      type: String,
      default: ''
    },
    open: Boolean
    // value: {
    //   type: Number,
    //   default: 500
    // }
  },
  data() {
    return {
      lnglat: [],
      // center: [121.59996, 31.197646],
      center: [],
      value: 200,
      circleEditor: undefined,
      circle: {},
      // 地图基本信息
      zoom: 16,
      plugin: [],
      events: {
        init: (o) => {
          console.log(o.getCenter());
          console.log(this.$refs.map.$$getInstance());
          o.getCity(result => {});
        },
        'moveend': () => {
        },
        'zoomchange': () => {
        },
        'click': (e) => {}
      }

      // visible: false
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
    },

    radius: {
      get() {
        return this.value;
      },
      set(data) {
        this.$emit('input', data);
      }
    }
  },


  // created() {
  //   this.center = this.lnglat;
  // },

  methods: {
    // 移动动mak点
    handlerDragging(e) {
      this.center = [e.lnglat.lng, e.lnglat.lat];
    },

    // 移动圆的中心点
    handlerMove(e) {
      this.center = [e.lnglat.lng, e.lnglat.lat];
    },
    // 修改半径
    handlerAdjust({ type, target, radius }) {
      // console.log(radius);
      // this.radius = radius;
    },

    circleEdit(lnglat) {
      this.center = lnglat;
      this.lnglat = lnglat;
    },


    mcircleClick() {
      // console.log('点击圆形了');
      this.visible = !this.visible;
    },
    /** 取消按钮 */
    cancel() {
      this.close();
    },
    // 关闭弹窗
    close() {
      this.$emit('update:open', false);
    }
  }

};
</script>

<style scoped>
.amap-wrapper {
  position: relative;
  width: 100%;
  height: 500px;
  display: flex;
  flex-direction: column;
}
.amap-demo{
    flex: 1;
}

.slider-box{
    width: 80%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
    /* margin: 10px auto; */
}
.slider-box-rigth{
    width: 50%;
    margin-left: 30px;
}
</style>
