<template>
  <!-- 车辆定位对话框 -->
  <el-dialog :title="title" :visible="visible" width="1400px" append-to-body destroy-on-close :close-on-click-modal="false" @close="cancel">
    <div class="amap-wrapper">

      <el-amap
        ref="map"
        vid="amapDemo"
        :center="lnglat"
        :zoom="zoom"
        :resize-enable="true"
        :expand-zoom-range="true"
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
        <!-- <el-amap-marker
          vid="component-marker2"
          :position="center"
          :draggable="true"
          :events="{
            dragging: handlerDragging,
          }"
        /> -->

        <el-amap-circle
          :center="center"
          :radius="radius"
          :fill-opacity="0.3"
          :fill-color="'#ff4d4d'"
          :stroke-color="'#ff4d4d'"
          :editable="true"
          :events="{
            move: handlerMove,
            adjust: handlerAdjust
          }"
        />
        <!-- click: mcircleClick, -->
      </el-amap>

      <div class="slider-box">
        <el-button
          v-if="!idCode"
          type="primary"
          size="mini"
          style="margin-top: 12px"
          @click="submit"
        >确定</el-button>
        <!-- <div>电子围栏(米): </div>
        <div class="slider-box-rigth">
          <el-slider v-model="radius" show-input :max="10000" :min="0" />
        </div> -->
      </div>
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
    idCode: Boolean,
    title: {
      type: String,
      default: ''
    },
    open: Boolean,
    value: {
      type: Number,
      default: 200
    }
  },
  data() {
    return {
      lnglat: [],
      // center: [121.59996, 31.197646],
      center: [],
      circleEditor: undefined,
      circle: {},
      // 地图基本信息
      zoom: 16,
      plugin: [],
      events: {
        init: (o) => {
          // this.$refs.map.$$getInstance();
          o.getCity(result => { });
        },
        'moveend': () => {
        },
        'zoomchange': () => {
        },
        'click': (e) => {},
        complete: () => {
          this.$refs.map.$$getInstance().setFitView();
        }
      },
      radius: 200
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
    }

  },

  watch: {
    value(val) {
      this.radius = val;
    }
  },
  // created() {
  //   this.center = this.lnglat;
  // },
  updated() {
    if (this.$refs.map.$$getInstance()) {
      this.$refs.map.$$getInstance().setFitView();
    }
  },

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
      this.radius = radius < 200 ? 200 : radius;
      this.$emit('input', this.radius);
    },

    circleEdit(lnglat, oldLnglat) {
      this.center = lnglat;
      this.lnglat = oldLnglat;
    },


    mcircleClick() {},
    submit() {
      this.$emit('refresh', { radius: this.radius, lnglat: this.center });
      this.cancel();
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
  height: 65vh;
  display: flex;
  flex-direction: column;
}
.amap-demo{
    flex: 1;
}

.slider-box{
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 10px;
    /* margin: 10px auto; */
}
.slider-box-rigth{
    width: 50%;
    margin-left: 30px;
}
</style>
