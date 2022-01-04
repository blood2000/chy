<template>
  <div
    class="layer-box"
    :style="isGeneral ? numberToPx(layerData.style) : Object.assign({}, removePosition(numberToPx(layerData.style)), {width:'100%', height:'100%'})"
    :class="layerData.type === 'img' ? 'fontSize0' : ''"
  >
    <!-- 模型图层 -->
    <div v-if="layerData.id" class="content-box ly-flex-v">
      <!-- 查询项 -->
      <QueryModel
        v-if="layerData.setting.showQuery"
        :show-search="showSearch"
        :data-model-dto="dataModelDto"
        @handleQuery="handleQuery"
        @resetQuery="resetQuery"
      />

      <!-- 图表 -->
      <template v-if="chartAlias && chartAlias !== 'table'">
        <div v-if="dataList.length > 0" ref="chartBoxRef" class="content-box-chart ly-flex-1" />
        <DataNull v-else />
      </template>

      <!-- 列表 -->
      <template v-else>
        <ToolbarModel
          v-if="layerData.setting.showToolbar"
          :export-loading="exportLoading"
          :show-search.sync="showSearch"
          @handleExport="handleExport"
          @getList="getList"
        />
        <TableModel
          :loading="loading"
          :data-list="dataList"
          :data-model-dto="dataModelDto"
          class="ly-flex-1"
          style="overflow-y:auto"
        />
        <PaginationModel
          v-if="layerData.setting.showPagination"
          :total="total"
          :data-model-dto="dataModelDto"
          @getList="getList"
        />
      </template>
    </div>

    <!-- 元素图层 -->
    <template v-else>
      <!-- 文本 -->
      <template v-if="layerData.type === 'text'">{{ layerData.value }}</template>
      <!-- 图片 -->
      <img v-else-if="layerData.type === 'img'" :src="layerData.value?`/pdf${(layerData.value.split('.com'))[1]}`:layerData.value" class="content-box" draggable="false">
    </template>
  </div>
</template>

<script>
import utils from '../../mixins/utils';
import chartViewMixins from '../../mixins/chartViewMixins';
import singleModelMixins from '../../mixins/singleModelMixins';
import DataNull from '@/components/DataNull/index';
import QueryModel from '../../components/queryModel.vue';
import ToolbarModel from '../../components/toolbarModel.vue';
import PaginationModel from '../../components/paginationModel.vue';
import TableModel from '../../components/tableModel.vue';
export default {
  components: {
    DataNull,
    QueryModel,
    ToolbarModel,
    PaginationModel,
    TableModel
  },
  mixins: [utils, chartViewMixins, singleModelMixins],
  props: {
    layerData: {
      type: Object,
      default: () => {
        return {};
      }
    },
    isGeneral: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    // chart 监听容器宽
    'layerData.style.width': {
      handler(val) {
        this.layerRefreshChart();
      },
      deep: true
    },
    // chart 监听容器高
    'layerData.style.height': {
      handler(val) {
        this.layerRefreshChart();
      },
      deep: true
    },
    // model 配置项
    'layerData.setting': {
      handler(val) {
        this.layerRefreshChart();
      },
      deep: true
    }
  },
  mounted() {
    if (this.layerData.id) {
      this.modelId = this.layerData.id;
      this.getDataModelData();
    }
  },
  methods: {
    // 刷新echart图表
    layerRefreshChart() {
      if (this.layerData.id && this.chartAlias && this.chartAlias !== 'table') {
        this.$nextTick(() => {
          this.handleGenerate();
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.layer-box{
  overflow: auto;
  &.fontSize0{
    font-size: 0;
  }
  .content-box{
    width: 100%;
    height: 100%;
    overflow-x: hidden;
  }
  .content-box-chart{
    width: 100%;
    overflow: hidden;
  }
}
</style>
