<template>
  <div>
    <QueryModel
      class="app-container app-container--search"
      :show-search="showSearch"
      :data-model-dto="dataModelDto"
      @handleQuery="handleQuery"
      @resetQuery="resetQuery"
    />

    <div v-if="chartAlias && chartAlias !== 'table'" class="app-container">
      <div v-if="dataList.length > 0" ref="chartBoxRef" style="width: 600px; height: 360px" />
      <DataNull v-else style="margin: 50px 0" />
    </div>

    <div v-else class="app-container">
      <ToolbarModel
        :export-loading="exportLoading"
        :show-search.sync="showSearch"
        @handleExport="handleExport"
        @getList="getList"
      />
      <TableModel
        :loading="loading"
        :data-list="dataList"
        :data-model-dto="dataModelDto"
      />
      <PaginationModel
        :total="total"
        :data-model-dto="dataModelDto"
        @getList="getList"
      />
    </div>
  </div>
</template>

<script>
import DataNull from '@/components/DataNull/index';
import chartViewMixins from '../mixins/chartViewMixins';
import singleModelMixins from '../mixins/singleModelMixins';
import QueryModel from '../components/queryModel.vue';
import ToolbarModel from '../components/toolbarModel.vue';
import PaginationModel from '../components/paginationModel.vue';
import TableModel from '../components/tableModel.vue';
export default {
  name: '',
  components: {
    DataNull,
    QueryModel,
    ToolbarModel,
    PaginationModel,
    TableModel
  },
  mixins: [chartViewMixins, singleModelMixins],
  mounted() {
    const path = this.$route.path;
    const pathArr = path.split('/');
    this.modelId = pathArr[pathArr.length - 1];
    this.getDataModelData();
  }
};
</script>
