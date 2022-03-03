<template>
  <!-- 设备管理-电子围栏 -->
  <div class="device-info ly-flex">
    <div class="device-info-left">
      <OrderList style="height: 100%" @clearMap="clearMap" @drawFencePlat="drawFencePlat" />
    </div>
    <div class="device-info-right">
      <!-- 地图 -->
      <MapBox ref="mapRef" class="device-info-map-box" />
      <!-- 测试点 -->
      <!-- <div style="position: absolute; top: 0; right: 0">
        <el-input v-model="testlng" placeholder="lng" style="width: 200px" />
        <el-input v-model="testlat" placeholder="lat" style="width: 200px" />
        <el-button type="primary" @click="handleTest">生成</el-button>
      </div> -->
    </div>
  </div>
</template>

<script>
import OrderList from '../components/orderList.vue';
import MapBox from './map.vue';
export default {
  name: 'ElectronicFence',
  components: {
    MapBox,
    OrderList
  },
  data() {
    return {
      // testlng: null,
      // testlat: null
    };
  },
  methods: {
    clearMap() {
      this.$refs.mapRef.clearMap();
    },
    drawFencePlat(data) {
      this.$refs.mapRef.drawFencePlat(data);
    }
    // handleTest() {
    //   this.$refs.mapRef.drawTestMarker(this.testlng, this.testlat);
    // }
  }
};
</script>

<style lang="scss" scoped>
.device-info{
  margin: 0 15px 0;
  box-shadow: 0px 2px 3px 0px rgba(51, 153, 255, 0.1);
  height: calc(100vh - 146px);
  min-width: 1320px;
  overflow-x: auto;

  // 左
  .device-info-left{
    width: 364px;
    height: 100%;
    padding: 0;
    background-color: #F8F8F8;
    border-radius: 4px;
    overflow: hidden;
  }

  // 右
  .device-info-right{
    width: calc(100% - 364px);
    height: 100%;
    padding: 16px 12px 12px;
    background: #fff;
    border-radius: 3px;
  }

  // 地图
  .device-info-map-box{
    height: 100%;
  }
}
</style>
