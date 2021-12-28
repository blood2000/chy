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
        ref="LayerRef"
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
      const queryData = JSON.parse(this.$route.query.queryData);
      this.screenForm = queryData.screenForm;
      this.layerList = queryData.layerList;
    } else if (this.$route.query.screenId) {
      this.screenId = this.$route.query.screenId;
      this.getData();
    }
  },
  methods: {
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
