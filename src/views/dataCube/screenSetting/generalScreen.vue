<template>
  <div class="general-screen" :style="numberToPx(screenForm)">
    <img
      v-if="screenForm['background-image']"
      :src="screenForm['background-image']"
      style="width: 100%; height: 100%; position: absolute; left: 0; right: 0; top: 0; bottom: 0; z-index: 0; pointer-events: none;"
    >
    <template v-for="item in layerList">
      <Layer
        :key="item.layerId"
        :ref="'LayerRef'+item.layerId"
        :layer-data="item"
        :is-general="true"
      />
    </template>
  </div>
</template>

<script>
import utils from '../mixins/utils';
import Layer from './components/layer.vue';
import { getDataScreens } from '@/api/dataCenter/screenCenter.js';
import { ThrottleFun } from '@/utils/index.js';
export default {
  name: 'GeneralScreen',
  components: {
    Layer
  },
  mixins: [utils],
  data() {
    return {
      // 大屏背景样式
      screenForm: {},
      // 画布上所有图层
      layerList: [],
      screenId: null
    };
  },
  created() {
    if (this.$route.query.queryData) {
      // 由预览进入
      const queryData = JSON.parse(this.$route.query.queryData);
      this.screenForm = queryData.screenForm;
      this.layerList = queryData.layerList;
    } else {
      // 由菜单进入
      const path = this.$route.path;
      const pathArr = path.split('/');
      this.screenId = pathArr[pathArr.length - 1];
      this.getData();
    }
  },
  mounted() {
    window.addEventListener('resize', ThrottleFun(this.initChartSize, 300));
  },
  beforeDestroy() {
    window.removeEventListener('resize', ThrottleFun(this.initChartSize, 300));
  },
  methods: {
    initChartSize() {
      this.layerList.forEach(el => {
        if (el.id && el.chartAlias && el.chartAlias !== 'table') {
          this.$refs['LayerRef' + el.layerId][0].initChart();
        }
      });
    },
    getData() {
      getDataScreens(this.screenId).then(res => {
        // 获取大屏数据json...
        if (res.data.layerJson) {
          this.layerList = JSON.parse(res.data.layerJson);
        }
        if (res.data.backgroundJson) {
          this.screenForm = JSON.parse(res.data.backgroundJson);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.general-screen{
  //unSelect
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
