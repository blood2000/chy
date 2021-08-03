<template>
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
      :center="lnglat"
      :zoom="zoom"
      :plugin="plugin"
      :events="events"
      class="amap-demo"
    >
      <el-amap-marker
        vid="component-marker"
        :position="lnglat"
      />

      <el-amap-circle
        :center="lnglat"
        :radius="radius"
        :fill-opacity="0.3"
        :fill-color="'#ff4d4d'"
        :stroke-color="'#ff4d4d'"
        :events="{
          click: mcircleClick,
        }"
      />
    </el-amap>
  </div>
</template>

<script>
export default {
  props: {
    lnglat: {
      type: Array,
      default: () => []
    },
    value: {
      type: Number,
      default: 500
    }
  },
  data() {
    return {
    //   center: [121.59996, 31.197646],


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
      },

      visible: false
    };
  },

  computed: {
    radius: {
      get() {
        return this.value;
      },
      set(data) {
        this.$emit('input', data);
      }
    }
  },

  methods: {
    mcircleClick() {
      console.log('点击圆形了');
      this.visible = !this.visible;
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
